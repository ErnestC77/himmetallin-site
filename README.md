# ХИММЕТАЛЛИН — сайт

Корпоративный лендинг ООО «ХИММЕТАЛЛИН» — инжиниринг и комплексное оснащение объектов
нефтепереработки и металлургии.

Стек: **Vite 6 + React 19 + TypeScript**. Один экран (single-page), контент — RU.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # прод-сборка в dist/ (tsc --noEmit + vite build)
npm run preview    # предпросмотр собранного dist
npm run typecheck  # проверка типов
```

## Структура

- `src/App.tsx` — сборка секций.
- `src/components/` — секции: `Header`, `Hero`, `Ticker`, `About`, `Directions`,
  `Equipment`, `Benefits`, `Standards`, `Contacts`, `Footer` (по файлу на секцию).
- `src/data.ts` — весь контент (тексты, тех. характеристики, привязка фото).
- `src/ui.tsx` — `Logo` (реальный вектор), `Ic` (иконки), `Reveal` (появление при скролле).
- `src/styles.css` — дизайн-токены и стили (монохром, тёмно-светлый ритм).
- `src/assets/photos/*.webp` — оптимизированные фото; оригиналы — в `assets/photos/*.JPG`.
- `public/favicon.svg` — фавикон из знака логотипа.

## Что доработать перед продом

- **Контакты/реквизиты** — сейчас заглушки (`+7 (000)…`, `info@himmetallin.ru`, ИНН/КПП/ОГРН
  «уточняется»). Заменить в `src/data.ts` (`CONTACTS`) и `Contacts.tsx` (реквизиты).
- **Форма заявки** — отправка сейчас заглушка (`console.log` + успех). Подключить бэкенд/почту
  в `src/components/Contacts.tsx` (`onSubmit`).
- **Фото** — используются реальные снимки компании; при необходимости заменить в
  `src/assets/photos/` и обновить импорты в `src/data.ts`.
