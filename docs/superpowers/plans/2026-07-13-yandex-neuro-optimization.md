# Оптимизация сайта под Нейро/YandexGPT — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать реальный текстовый контент страницы видимым краулерам без выполнения JS (через статический пререндер) и ускорить попадание обновлений в индекс Яндекса (через автопинг IndexNow при деплое), чтобы Нейро/YandexGPT могли читать и цитировать сайт.

**Architecture:** После обычной сборки (`vite build`, включающей уже существующий `seo-geo` Vite-плагин, генерирующий JSON-LD и `llms.txt`) новый Node-скрипт поднимает локальный статик-сервер над `dist/`, открывает страницу headless Chromium через уже установленный `playwright`, дожидается `networkidle` и перезаписывает `dist/index.html` реальным отрендеренным HTML. Отдельно — новый статический ключевой файл в `public/` и шаг в GitHub Actions пингуют `yandex.com/indexnow` после каждого успешного FTP-деплоя.

**Tech Stack:** Node.js (ESM, `.mjs`), Playwright (`chromium`, уже в `devDependencies`), GitHub Actions (`deploy-nicru.yml`), bash/curl.

## Global Constraints

- Новых npm-зависимостей не добавлять — `playwright` уже есть в `devDependencies` (спека, раздел «Данные и зависимости»).
- Визуальное поведение страницы для пользователя не должно измениться (спека, раздел 1).
- Провал пререндера должен валить сборку (`process.exit(1)`), а не тихо оставлять пустой `dist/index.html` (спека, раздел «Обработка ошибок»).
- Провал пинга IndexNow не должен валить деплой (`|| true`) (спека, раздел 2).
- Пинг IndexNow бьёт напрямую в `https://yandex.com/indexnow`, не в общий `api.indexnow.org` (спека, раздел 2).
- `vite-plugins/seo-geo.ts`, `src/main.tsx` и компоненты (`src/components/*`, `src/ui.tsx`) не меняются (спека, раздел 1).

---

### Task 1: Статический пререндер (Playwright-снапшот)

**Files:**
- Modify: `scripts/verify-seo-geo.mjs`
- Create: `scripts/prerender.mjs`
- Modify: `package.json:8` (скрипт `build`)
- Modify: `.github/workflows/deploy-nicru.yml` (шаг установки браузера)

**Interfaces:**
- Consumes: ничего из других задач этого плана (независимая задача).
- Produces: команда `npm run build` теперь оставляет в `dist/index.html` полностью отрендеренный HTML (не пустой `<div id="root">`); `node scripts/verify-seo-geo.mjs` дополнительно проверяет это и падает, если пререндер не отработал. Task 2 (IndexNow) полагается только на то, что `npm run build` кладёт файлы в `dist/` — с этой задачей не пересекается по коду.

- [ ] **Step 1: Добавить проверку видимого контента в `scripts/verify-seo-geo.mjs` (красный тест)**

Открой `scripts/verify-seo-geo.mjs`. Файл уже читает `dist/index.html` в переменную `html` в самом начале (`const html = readFileSync('dist/index.html', 'utf-8')`). Сразу после блока `const failures = checks.filter(...)` / `if (failures.length) { ... }` (перед строкой, где читается `llmsTxt`), добавь:

```js
if (!html.includes('Полную совместимость поставляемых узлов.')) {
  console.error('FAIL: dist/index.html has no prerendered visible page content (still an empty <div id="root">?)')
  process.exit(1)
}
```

Строка `'Полную совместимость поставляемых узлов.'` — текст из `benefits` в `src/data.ts:69`, который **не** используется генератором JSON-LD (`vite-plugins/seo-geo.ts` берёт данные только из `src/content/services.ts`), поэтому его наличие в `dist/index.html` однозначно доказывает, что это реальный отрендеренный текст страницы, а не совпадение с JSON-LD.

- [ ] **Step 2: Убедиться, что проверка падает (пререндера ещё нет)**

Run: `npm run build && node scripts/verify-seo-geo.mjs`
Expected: сборка проходит, но скрипт завершается с
`FAIL: dist/index.html has no prerendered visible page content (still an empty <div id="root">?)`
и ненулевым кодом выхода.

- [ ] **Step 3: Установить браузер Playwright локально**

Run: `npx playwright install chromium`
Expected: скачивается и устанавливается локальный Chromium (нужен, чтобы следующий шаг мог его запустить).

- [ ] **Step 4: Создать `scripts/prerender.mjs`**

```js
// scripts/prerender.mjs
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { chromium } from 'playwright'

const DIST_DIR = new URL('../dist/', import.meta.url)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0]
    try {
      const filePath = new URL('.' + urlPath, DIST_DIR)
      const data = await readFile(filePath)
      const ext = extname(urlPath)
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function main() {
  const server = await startStaticServer()
  const port = server.address().port
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle', timeout: 30_000 })
    const html = await page.content()
    await writeFile(new URL('index.html', DIST_DIR), html, 'utf-8')
    console.log('OK: dist/index.html prerendered')
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('FAIL: prerender failed:', err)
  process.exit(1)
})
```

- [ ] **Step 5: Подключить пререндер в сборку**

Открой `package.json`. Строка 8 сейчас:
```json
    "build": "tsc --noEmit && vite build",
```
Замени на:
```json
    "build": "tsc --noEmit && vite build && node scripts/prerender.mjs",
```

- [ ] **Step 6: Убедиться, что проверка теперь проходит (зелёный тест)**

Run: `npm run build && node scripts/verify-seo-geo.mjs`
Expected: обе команды завершаются успешно; в выводе — `OK: dist/index.html prerendered`, затем строка вида
`OK: 1 Organization, 1 WebSite, 6 Service (5 with additionalProperty), 0 Product, llms.txt valid`
(без сообщения `FAIL: dist/index.html has no prerendered visible page content`).

- [ ] **Step 7: Ручная проверка в браузере — визуальных изменений и hydration-ошибок быть не должно**

Run: `npm run preview`, открыть `http://localhost:4173/` в браузере.
Expected: страница выглядит и ведёт себя как раньше (тикер бежит, скролл-анимации `Reveal` срабатывают при прокрутке, форма в разделе «Контакты» кликабельна); в консоли браузера (DevTools) нет предупреждений/ошибок вида `Hydration failed` или `Text content does not match`.

- [ ] **Step 8: Добавить установку браузера Playwright в CI**

Открой `.github/workflows/deploy-nicru.yml`. Между шагами `Install deps` и `Build` добавь:

```yaml
      - name: Install Playwright browser
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build
```

(то есть новый шаг `Install Playwright browser` вставляется прямо перед существующим шагом `Build`).

- [ ] **Step 9: Commit**

```bash
git add scripts/verify-seo-geo.mjs scripts/prerender.mjs package.json .github/workflows/deploy-nicru.yml
git commit -m "feat(seo): статический пререндер dist/index.html для Нейро/YandexGPT"
```

---

### Task 2: Yandex IndexNow — автопинг при деплое

**Files:**
- Create: `public/c54301433a2949cc8d83367919650d7f.txt`
- Modify: `.github/workflows/deploy-nicru.yml` (шаг пинга после FTP-деплоя)

**Interfaces:**
- Consumes: ничего из Task 1 (независимая задача, может выполняться до или после Task 1).
- Produces: ничего, что использовалось бы другими задачами — терминальная задача этого плана.

- [ ] **Step 1: Создать ключевой файл IndexNow**

Создай файл `public/c54301433a2949cc8d83367919650d7f.txt` с единственным содержимым — самим ключом, без завершающего перевода строки:

```
c54301433a2949cc8d83367919650d7f
```

- [ ] **Step 2: Убедиться, что ключ попадает в сборку**

Run: `npm run build && cat dist/c54301433a2949cc8d83367919650d7f.txt`
Expected: файл существует в `dist/` (Vite копирует всё из `public/` как есть) и его содержимое —
`c54301433a2949cc8d83367919650d7f`.

- [ ] **Step 3: Добавить пинг Яндекса в workflow после FTP-деплоя**

Открой `.github/workflows/deploy-nicru.yml`. После существующего шага `FTP deploy to nic.ru` (последний шаг файла) добавь:

```yaml

      - name: Ping Yandex IndexNow
        if: env.HAS_FTP == 'true'
        run: |
          curl -sf "https://yandex.com/indexnow?url=https://chemmetalleng.com/&key=c54301433a2949cc8d83367919650d7f&keyLocation=https://chemmetalleng.com/c54301433a2949cc8d83367919650d7f.txt" || true
```

- [ ] **Step 4: Commit**

```bash
git add public/c54301433a2949cc8d83367919650d7f.txt .github/workflows/deploy-nicru.yml
git commit -m "feat(seo): автопинг Yandex IndexNow при деплое"
```

- [ ] **Step 5: Проверка после следующего реального деплоя (вручную, не автоматизируется)**

После пуша в `main` и прохождения workflow:
Run: `curl -i https://chemmetalleng.com/c54301433a2949cc8d83367919650d7f.txt`
Expected: `HTTP/1.1 200`, тело ответа — `c54301433a2949cc8d83367919650d7f`.
В логе шага `Ping Yandex IndexNow` в GitHub Actions — ответ `200` или `202` от `yandex.com`.

---

## Self-Review

**Spec coverage:**
- Раздел 1 спеки (Playwright-снапшот, порядок ожидания, отсутствие hydration-рассинхрона, откат при ошибке) → Task 1, Steps 4, 6, 7.
- Раздел 2 CI (установка браузера) → Task 1, Step 8.
- Раздел 3 спеки (IndexNow: ключ, прямой пинг `yandex.com`, `|| true`, гейт по `HAS_FTP`, один URL) → Task 2, Steps 1, 3.
- Раздел 4 спеки (расширение `verify-seo-geo.mjs`) → Task 1, Steps 1–2, 6.
- «Обработка ошибок» (провал пререндера валит сборку; провал пинга игнорируется) → Task 1 Step 4 (`main().catch(...) → process.exit(1)`); Task 2 Step 3 (`|| true`).
- «Вне рамок этой итерации» (FAQ, общее SEO, чат-бот, SSR) — сознательно не покрыты задачами, как и предписано спекой.

**Placeholder scan:** ключ IndexNow — конкретное сгенерированное значение (`c54301433a2949cc8d83367919650d7f`), не заглушка. Других TBD/TODO нет.

**Type consistency:** `scripts/prerender.mjs` не экспортирует ничего, что использовалось бы в других файлах плана — интерфейсов между Task 1 и Task 2 нет, конфликтов имён нет.
