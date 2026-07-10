# AEO/GEO-подготовка сайта chemmetalleng.com

## Контекст

Сайт ХИММЕТАЛЛИН (React/Vite SPA, `C:\Users\mccaq\himmetallin-site`) уже прошёл базовую техническую SEO-настройку (robots.txt, sitemap.xml, canonical/OG-теги, JSON-LD Organization, фавикон). Следующий шаг — подготовка к AEO (Answer Engine Optimization) и GEO (Generative Engine Optimization): чтобы ИИ-ответники (ChatGPT, Perplexity, Google AI Overviews, YandexGPT и т.п.) могли находить, читать и цитировать сайт при ответах на отраслевые вопросы.

Контент сайта (`src/data.ts`) уже насыщен фактурой, ценной для ИИ-ответников: 6 категорий оборудования с точными характеристиками (ГОСТ, давление, температура, материалы), 6 направлений деятельности, 6 отраслей применения, сертификация по ТР ТС. Задача — не писать новый контент, а сделать существующие факты извлекаемыми машиной через структурированные данные.

Решено ограничиться технической частью (без нового видимого контента вроде блока FAQ на этой итерации), разрешить всем ИИ-краулерам доступ, добавить `llms.txt`, и делать разметку оборудования/направлений с конкретными характеристиками (не только общими описаниями).

## Архитектура

Текущая проблема: `src/data.ts` содержит нужные данные (`directions`, `equipment`, `applications`, `CONTACTS`, `REQUISITES`) вперемешку с импортами фото (`import heroRefinery from './assets/photos/hero_refinery.webp'` и т.д.). Чтобы сгенерировать JSON-LD/`llms.txt` во время сборки в Node, нужен доступ к данным без разрешения импортов картинок.

Решение — разделить данные на источник истины и UI-слой:

- **`src/content/services.ts`** (новый файл) — чистые данные без единого импорта: `directions`, `equipment` (без поля `img`, только контентные поля: `id`, `h`, `p`, `items`, `specs`, `sub`), `applications`, `CONTACTS`, `REQUISITES`.
- **`src/data.ts`** — реэкспортирует `directions`, `applications`, `CONTACTS`, `REQUISITES` из `services.ts` без изменений; для `equipment` мёрджит фото-импорты (`img`) поверх контента из `services.ts`, сохраняя точно тот же тип `EquipmentItem[]` и форму данных, которую уже потребляют компоненты. Существующие импорты в компонентах (`import { CONTACTS, equipment, ... } from '../data'`) не меняются.
- **`vite-plugins/seo-geo.ts`** (новый файл) — Vite-плагин:
  - импортирует `directions`, `equipment`, `applications`, `CONTACTS`, `REQUISITES` напрямую из `src/content/services.ts` (файл без картиночных импортов — грузится тем же TS-загрузчиком, что и `vite.config.ts`, без дополнительных инструментов типа esbuild.transformSync/vm);
  - на хуке `transformIndexHtml` генерирует JSON-LD `@graph` (см. ниже) и вставляет `<script type="application/ld+json">` в `<head>`, **заменяя** нынешний статически прописанный блок Organization в `index.html`;
  - на хуке `generateBundle` вызывает `this.emitFile({ type: 'asset', fileName: 'llms.txt', source })`, генерируя `dist/llms.txt` из тех же данных.
- **`vite.config.ts`** — подключает новый плагин в массив `plugins`.
- **`index.html`** — статический блок `<script type="application/ld+json">…Organization…</script>` удаляется (переезжает в генерируемый плагином `@graph`), остальные теги (canonical, OG, Twitter, иконки) не трогаем.

Компоненты (`src/App.tsx`, `src/ui.tsx`, секции) не меняются вообще — видимый контент и вёрстка страницы остаются как есть.

## Содержимое JSON-LD

Единый `@graph` в `<script type="application/ld+json">`:

1. **Organization** (`@id: https://chemmetalleng.com/#organization`) — как в текущем статическом блоке (name, legalName, url, logo, email, telephone, address из `CONTACTS`/`REQUISITES`), плюс новое поле `knowsAbout`: массив строк — названия отраслей из `applications[].h` (6 штук).
2. **Service** × 6 — по одному на каждый элемент `directions`: `@id` на основе `href` (например `.../#service-eq-pump`), `name` = `h`, `description` = `p`, `provider: {"@id": ".../#organization"}`, `areaServed: "RU"`.
3. **Product** × 6 — по одному на каждый элемент `equipment`: `@id` на основе `id` (например `.../#product-eq-pump`), `name` = `h`, `description` = `p`, `additionalProperty` — массив `PropertyValue` (`name`/`value`), по одной записи на каждый элемент `specs[]` этой категории, `brand: {"@id": ".../#organization"}`. Поле `image` не заполняем (см. решение по архитектуре — не тянем фото-импорты в плагин).

Service и Product — независимые параллельные списки (6 направлений и 6 категорий оборудования не бьются 1:1 по смыслу — например направление «Системы охлаждения» соответствует сразу двум категориям оборудования, АВО и градирням), явную перекрёстную связь между конкретными Service и Product не строим, только общая связь через Organization.

## Содержимое llms.txt

Markdown, генерируется тем же плагином из тех же данных, секции:

- Заголовок — `# ООО «ХИММЕТАЛЛИН»` + однострочная выжимка (аналог meta description).
- Реквизиты и контакты (`CONTACTS`, `REQUISITES`).
- Список направлений деятельности со ссылками на якоря страницы (`[Название](https://chemmetalleng.com/#design): описание`), из `directions`.
- Краткая сводка по оборудованию — по одной строке на категорию с ключевыми характеристиками (не все `specs`, а сжатая выжимка), из `equipment`.
- Список отраслей применения, из `applications[].h`.
- Раздел о сертификации — текст `equipmentCert` (ТР ТС 010/2011, 032/2013, 012/2011).

## robots.txt

Без изменений. `User-agent: *` / `Allow: /` без единого `Disallow` уже разрешает всех ботов, включая GPTBot, PerplexityBot, ClaudeBot, Google-Extended и любых будущих ИИ-краулеров — добавлять именованные блоки не требуется, они не изменят уже полностью открытую политику.

## Проверка

1. `npm run build` — плагин должен отработать без ошибок; в `dist/index.html` — валидный (парсящийся `JSON.parse`) `@graph`; в `dist/llms.txt` — сгенерированный markdown.
2. Ручная проверка вёрстки в браузере (`npm run preview` или dev-сервер) — визуальных изменений на странице быть не должно.
3. Деплой как обычно (push в `main` → FTP на nic.ru через существующий `deploy-nicru.yml`).
4. На проде: `curl https://chemmetalleng.com/llms.txt` → 200, читаемый markdown; `curl https://chemmetalleng.com/` → JSON-LD на месте, старый статический Organization-блок отсутствует (заменён сгенерированным).
5. Прогнать страницу через Google Rich Results Test (внешний инструмент, вручную) — убедиться, что Google не выдаёт ошибок по Service/Product разметке.

## Вне рамок этой итерации

- Видимый блок «Частые вопросы» (FAQPage) на странице — отложено, пользователь выбрал только техническую часть.
- Именованные записи под конкретных ИИ-ботов в robots.txt — не нужны при уже открытой политике.
