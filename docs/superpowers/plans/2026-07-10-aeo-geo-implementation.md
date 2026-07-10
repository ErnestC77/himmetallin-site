# AEO/GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сгенерировать JSON-LD (`Organization` + `Service` × 6 + `Product` × 6 с характеристиками) и `llms.txt` из единого источника данных на этапе сборки Vite, без изменений видимого контента/вёрстки страницы.

**Architecture:** Данные разделяются на content-слой без импортов картинок (`src/content/services.ts`) и UI-слой (`src/data.ts`, реэкспортирует + добавляет фото). Новый Vite-плагин (`vite-plugins/seo-geo.ts`) читает content-слой напрямую и на хуках `transformIndexHtml`/`generateBundle` инжектит JSON-LD в `<head>` и создаёт `dist/llms.txt`.

**Tech Stack:** Vite 6, TypeScript (strict), React 19 — без новых зависимостей.

## Global Constraints

- Никаких изменений видимого контента/вёрстки страницы (спека: только техническая часть).
- Существующие импорты `from '../data'` во всех компонентах (`About`, `Applications`, `Benefits`, `Directions`, `Contacts`, `Ticker`, `Design`, `Hero`, `Equipment`, `Footer`, `Header`) не меняются.
- `robots.txt` не трогаем — уже разрешает всех ботов (`User-agent: * / Allow: /`).
- Деплой — как обычно: push в `main` → GitHub Actions `deploy-nicru.yml` → FTP на nic.ru.
- В проекте нет тестового фреймворка (нет vitest/jest) — новых зависимостей для тестов не добавляем; проверка идёт через `npm run build` + `scripts/verify-seo-geo.mjs` (обычный Node-скрипт без транспиляции) + ручной визуальный чек.

---

### Task 1: Вынести чистые данные в `src/content/services.ts`

**Files:**
- Create: `src/content/services.ts`

**Interfaces:**
- Produces: `CONTACTS`, `REQUISITES`, `directions`, `applications`, `equipmentCert`, `equipment: EquipmentContent[]`, `type EquipmentContent` — потребляются в Task 2 (`src/data.ts`) и Task 4 (`vite-plugins/seo-geo.ts`).

- [ ] **Step 1: Создать файл с контентом (без единого импорта картинок)**

```ts
// src/content/services.ts
export const CONTACTS = {
  companyFull: 'Общество с ограниченной ответственностью «Химметалл Инжиниринг»',
  company: 'ООО «ХИММЕТАЛЛИН»',
  phone: '+7 (993) 350-55-35',
  email: 'info@chemmetalleng.com',
  address: '117105, РФ, г. Москва, Варшавское шоссе, д. 33, этаж 12, помещение 1а/1',
  hours: 'Пн–Пт · 09:00–18:00',
}

export const REQUISITES = [
  { k: 'ИНН', v: '9726012933' },
  { k: 'КПП', v: '772601001' },
  { k: 'ОГРН', v: '1227700272480' },
]

export const directions = [
  { n: '№1', href: '#design', icon: 'building', h: 'Проектирование технологических установок', p: 'Разработка современных и безопасных проектных решений для технологических процессов НПЗ в строгом соответствии с требованиями Ростехнадзора.' },
  { n: '№2', href: '#eq-pump', icon: 'pump', h: 'Гидравлические системы и перекачка сред', p: 'Подбор и поставка промышленных насосов различных типов и конфигураций, адаптированных для работы с агрессивными, вязкими и высокотемпературными нефтепродуктами.' },
  { n: '№3', href: '#eq-cooling', icon: 'snow', h: 'Системы промышленного охлаждения', p: 'Поставка аппаратов воздушного охлаждения (АВО) и испарительных градирен, обеспечивающих стабильный температурный режим процессов.' },
  { n: '№4', href: '#eq-hx', icon: 'hx', h: 'Теплообменное оборудование', p: 'Расчёт и дистрибуция высокоэффективных теплообменников — кожухотрубных, спиральных, а также пластинчатых, как разборных, так и сварных, для оптимальной рекуперации тепла.' },
  { n: '№5', href: '#eq-vessel', icon: 'vessel', h: 'Ёмкостное и сепарационное оборудование', p: 'Поставка технологических ёмкостей, резервуаров и сепарационного оборудования для разделения, подготовки и хранения многофазных сред.' },
  { n: '№6', href: '#eq-boiler', icon: 'bolt', h: 'Модульные тепловые инженерные системы', p: 'Проектирование и поставка БТП и автоматизированных блочно-модульных котельных высокой заводской готовности для надёжного теплоснабжения объектов инфраструктуры.' },
]

export type EquipmentContent = {
  id: string; h: string; p: string
  items: string[]
  specs: { k: string; v: string }[]
  sub?: { title: string; items: string[] }
}

export const equipment: EquipmentContent[] = [
  {
    id: 'eq-pump', h: 'Насосное оборудование',
    p: 'Технические характеристики оборудования — по ГОСТ 32601-2022 / ISO 13709:2009.',
    items: [
      'Герметичные насосы с магнитной муфтой — исключают утечки опасных, токсичных и легковоспламеняющихся жидкостей;',
      'Центробежные химические — для перекачивания кислот, щелочей, растворителей и реагентов;',
      'Бочковые и контейнерные — мобильные решения для безопасного опорожнения еврокубов и бочек с химикатами;',
      'Полупогружные химические — откачка агрессивных сред из технологических ёмкостей и зумпфов;',
      'Консольно-моноблочные — рабочее колесо на удлинённом валу электродвигателя, оптимальны для водоснабжения и отопления;',
      'Мембранные (диафрагменные) пневматические — универсальные агрегаты для вязких сред, паст и жидкостей с твёрдыми включениями;',
      'Дозировочные — плунжерные и перистальтические системы точной подачи компонентов;',
      'Винтовые (шнековые) — бережное перекачивание густых, чувствительных к сдвигу продуктов.',
    ],
    specs: [
      { k: 'Типы агрегатов', v: 'консольные (ОН2);\nдвухопорные межподшипниковые (ВВ1, ВВ2, ВВ3, ВВ5);\nвертикальные полупогружные (VS1, VS6);\nцентробежные;\nхимические с магнитной муфтой.' },
      { k: 'Подача', v: 'от 5 до 3500 м³/ч.' },
      { k: 'Напор', v: 'до 2500 м (многоступенчатые секционные насосы высокого давления).' },
      { k: 'Давление', v: 'до 25 МПа (250 кгс/см²).' },
      { k: 'Температура среды', v: 'от −80 °C (сжиженные углеводородные газы) до +450 °C (крекинг-остатки, гудроны, мазуты).' },
      { k: 'Материалы', v: 'углеродистые стали;\nкремнемарганцовистые стали;\nхромомолибденовые стали;\nкоррозионностойкие высоколегированные стали (12Х18Н10Т, 10Х17Н13М2Т).' },
      { k: 'Герметизация', v: 'двойные и одинарные торцевые уплотнения по ГОСТ 32600;\nобвязка по российским аналогам планов API.' },
    ],
  },
  {
    id: 'eq-cooling', h: 'Аппараты воздушного охлаждения',
    p: 'Технические характеристики систем охлаждения — по ГОСТ Р 51364-99.',
    items: [
      'АВО горизонтальные (АВГ);',
      'АВО зигзагообразные (АВЗ);',
      'АВО малопоточные (АВМ);',
      'АВО блочные (АВБ);',
      'Аппараты для вязких продуктов (АВГ-В).',
    ],
    specs: [
      { k: 'Условное давление (Ру)', v: 'от 0,6 до 16,0 МПа;\nв специальном исполнении для газов высокого давления — до 32,0 МПа.' },
      { k: 'Вакуумные режимы', v: 'с остаточным давлением не ниже 665 Па (5 мм рт. ст.).' },
      { k: 'Теплообменные трубы', v: 'биметаллические накатные с алюминиевым оребрением (коэффициенты 7,0; 9,0; 14,6; 20,0);\nдлина трубного пучка — 1,5–12 м.' },
      { k: 'Вентиляторы', v: 'колёса Ø 0,8–7,0 м;\nэлектродвигатели привода 3–75 кВт (до 160 кВт для тяжёлых блоков).' },
      { k: 'Климатическое исполнение', v: 'У1 и УХЛ1 по ГОСТ 15150 (работа до −60 °С);\nавтоматические жалюзи и рециркуляция воздуха во избежание застывания продуктов.' },
    ],
  },
  {
    id: 'eq-tower', h: 'Испарительные градирни',
    p: 'Капельный унос ≤ 0,01 % от расхода воды; испарение ≈ 1 % на каждые 5 °C перепада температуры.',
    items: [
      'Мини-градирни;',
      'Открытые градирни;',
      'Закрытые градирни;',
      'Строительные градирни;',
      'Сухие градирни;',
      'Перекрестноточные варианты;',
      'Противоточные варианты.',
    ],
    sub: {
      title: 'Опции',
      items: [
        'Датчики вибрации и температуры на электродвигателе;',
        'Обогрев для холодного пуска;',
        'Модульное исполнение для транспортировки;',
        'Композитные и металлические металлоконструкции;',
        'Интенсивные варианты каплеуловителей.',
      ],
    },
    specs: [
      { k: 'Расход воды', v: '8–400 м³/ч (модели СВГ-К-8 … СВГ-К-400).' },
      { k: 'Тепловая нагрузка', v: '46–2325 кВт в зависимости от модели.' },
      { k: 'Площадь оросителя', v: '65–2571 м² (зависит от модели).' },
      { k: 'Форсунки', v: '2–72 шт. — равномерное распределение воды.' },
      { k: 'Вентилятор', v: 'от 0,37 до 22,0 кВт (частота вращения 750–1500 об/мин).' },
      { k: 'Габариты и масса', v: 'высота 1,97–4,46 м;\nмасса 125–3240 кг.' },
      { k: 'Материалы', v: 'легированная сталь (стойкость до −50 °C);\nкомпозитные элементы вентилятора.' },
    ],
  },
  {
    id: 'eq-hx', h: 'Теплообменное оборудование',
    p: 'Технические характеристики по типам аппаратов — по ГОСТ 34347-2017 и ГОСТ Р 55598.',
    items: [
      'Кожухотрубные — с неподвижными трубными решётками (Н), температурным компенсатором на кожухе (К), плавающей головкой (Г) и U-образными трубами (У);',
      'Пластинчатые — разборные, сварные и полусварные;',
      'Спиральные — для тяжёлых, склонных к коксованию и загрязнению сред НПЗ (гудрон, кубовые остатки).',
    ],
    specs: [
      { k: 'Кожухотрубные', v: 'диаметры кожуха 159–2500 мм;\nплощадь поверхности теплообмена — до 4000 м² в одном корпусе.' },
      { k: 'Пластинчатые', v: 'рабочее давление до 4,0 МПа — разборные;\nдо 10,0 МПа — цельносварные блочные типа «пластина в кожухе»;\nрабочие температуры от −100 до +400 °C.' },
      { k: 'Спиральные', v: 'ширина каналов от 5 до 30 мм.' },
      { k: 'Материалы', v: 'сталь 20;\n09Г2С;\n12Х18Н10Т;\n10Х17Н13М2Т;\nсплавы титана.' },
    ],
  },
  {
    id: 'eq-vessel', h: 'Ёмкостное и сепарационное оборудование',
    p: 'Технические параметры сосудов и аппаратов под давлением — по ГОСТ 34347-2017.',
    items: [
      'Технологические ёмкости и резервуары;',
      'Сосуды и аппараты, работающие под давлением;',
      'Сепараторы с сетчатыми и жалюзийными отбойниками;',
      'Коалесцирующие насадки по отраслевым стандартам (ОСТ) — остаточное содержание капельной жидкости в газе не более 0,05 г/м³.',
    ],
    specs: [
      { k: 'Геометрический объём', v: 'от 1 до 200 м³ (стандартный ряд горизонтальных и вертикальных аппаратов).' },
      { k: 'Рабочее давление', v: 'до 16,0 МПа (160 кгс/см²).' },
      { k: 'Толщина стенки', v: 'до 100 мм (в зависимости от группы сосуда согласно ГОСТ 34347).' },
      { k: 'Материалы', v: 'конструкционные стали (09Г2С, сталь 20);\nхромомолибденовые стали для высоких температур (12ХМ, 15Х5М);\nдвухслойные плакированные стали с коррозионностойким слоем (08Х13, 08Х18Н10Т).' },
    ],
  },
  {
    id: 'eq-boiler', h: 'БТП и блочно-модульные котельные',
    p: 'БМК — по СП 89.13330, БТП — по СП 124.13330.',
    items: [
      'Водогрейные котельные;',
      'Паровые котельные;',
      'Термомасляные котельные;',
      'Твердотопливные котельные;',
      'Жидкотопливные котельные;',
      'Газовые котельные;',
      'Блочные тепловые пункты (БТП);',
      'Шкафы управления на российских контроллерах.',
    ],
    specs: [
      { k: 'Тепловая мощность БМК', v: 'от 0,5 до 50 МВт;\nпаровые котельные — давление пара до 2,5 МПа, температура до 250 °C;\nводогрейные системы — температурные графики 95/70, 115/70, 150/70 °C.' },
      { k: 'Тепловая нагрузка БТП', v: 'от 0,1 до 15 Гкал/ч.' },
      { k: 'Топливо', v: 'природный газ;\nпопутный нефтяной газ (ПНГ);\nдизельное топливо;\nмазут.' },
      { k: 'КПД установок', v: 'не менее 92–95 %.' },
      { k: 'Взрывозащита', v: 'электрооборудование, датчики КИП и исполнительные механизмы сертифицированы по ТР ТС 012/2011;\nисполнение Exd («взрывонепроницаемая оболочка») или Exi («искробезопасная цепь»).' },
      { k: 'Интеграция', v: 'передача данных в общезаводскую АСУ ТП (DCS) по открытым протоколам Modbus / Profibus.' },
    ],
  },
]

export const applications = [
  { icon: 'drop', h: 'Водоснабжение, ЖКХ и теплоэнергетика', p: 'Городские водоканалы, тепловые сети, ТЭЦ, станции повышения давления в жилых комплексах, системы подачи конденсата и питания паровых котлов.' },
  { icon: 'layers3', h: 'Очистные сооружения и водоотведение', p: 'Канализационные насосные станции (КНС), очистка промышленных и муниципальных стоков, откачка активного ила, шламов, осушение строительных котлованов и шахтных приямков.' },
  { icon: 'pump', h: 'Нефтегазовая отрасль и нефтепереработка', p: 'Транспортировка сырой нефти по магистральным трубопроводам, обеспечение работы нефтебаз, наливных эстакад и портовых терминалов, перекачка мазута и нефтепродуктов на НПЗ.' },
  { icon: 'vessel', h: 'Химические терминалы и склады ЛВЖ', p: 'Перевалка спиртов, легколетучих растворителей, эфиров и топлива на автозаправочных комплексах и распределительных базах.' },
  { icon: 'bolt', h: 'Металлургия и тяжёлое машиностроение', p: 'Системы оборотного водоснабжения предприятий, контуры охлаждения плавильных печей и промышленного оборудования, подача смазочно-охлаждающих жидкостей.' },
  { icon: 'file', h: 'Целлюлозно-бумажное производство', p: 'Транспортировка древесной массы, клеевых составов, подача технологической воды для промывки и фильтрации сырья.' },
]

export const equipmentCert = 'Вся поставляемая номенклатура имеет сертификаты и декларации соответствия ТР ТС 010/2011 «О безопасности машин и оборудования», ТР ТС 032/2013 «О безопасности оборудования, работающего под избыточным давлением» и ТР ТС 012/2011 «О безопасности оборудования для работы во взрывоопасных средах» — это исключает юридические и технические проблемы при вводе объектов в эксплуатацию и проверках Ростехнадзора.'
```

- [ ] **Step 2: Проверить, что файл валиден по типам**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: без ошибок (файл ещё никем не импортируется, но должен компилироваться сам по себе — `include` в tsconfig уже покрывает всю папку `src`).

- [ ] **Step 3: Commit**

```bash
git add src/content/services.ts
git commit -m "feat(content): вынести чистые данные оборудования/направлений в services.ts"
```

---

### Task 2: Переключить `src/data.ts` на `services.ts`

**Files:**
- Modify: `src/data.ts`

**Interfaces:**
- Consumes: `CONTACTS`, `REQUISITES`, `directions`, `applications`, `equipmentCert`, `equipment: EquipmentContent[]`, `type EquipmentContent` из `./content/services` (Task 1).
- Produces: те же экспорты, что и раньше (`photos`, `heroChips`, `tickerItems`, `designPhoto`, `designItems`, `CONTACTS`, `REQUISITES`, `directions`, `applications`, `equipmentCert`, `equipment: EquipmentItem[]` — теперь с полем `img`, `equipmentNotes`, `benefits`, `navLinks`) — потребляются всеми компонентами в `src/components/*.tsx` (не меняются).

- [ ] **Step 1: Переписать `src/data.ts` целиком**

```ts
// src/data.ts
import heroRefinery from './assets/photos/hero_refinery.webp'
import imgTeam from './assets/photos/team.webp'
import imgPump from './assets/photos/img_3024.webp'
import imgCool from './assets/photos/cool_avo.webp'
import imgTower from './assets/photos/cooltower.webp'
import imgHx from './assets/photos/hx_shell.webp'
import imgVessel from './assets/photos/img_3034.webp'
import imgBoiler from './assets/photos/img_3047.webp'
import imgAcs from './assets/photos/img_3022.webp'

import type { EquipmentContent } from './content/services'
import {
  CONTACTS,
  REQUISITES,
  directions,
  equipment as equipmentContent,
  applications,
  equipmentCert,
} from './content/services'

export { CONTACTS, REQUISITES, directions, applications, equipmentCert }

export const photos = { heroBg: heroRefinery, about: imgTeam }

export const heroChips = [
  { icon: 'grid', text: 'Проектирование технологических установок' },
  { icon: 'layers', text: 'Подбор, производство и прямая поставка' },
  { icon: 'wrench', text: 'Сервисное обслуживание оборудования' },
]

export const tickerItems = [
  'Проектирование технологических установок', 'Насосное оборудование', 'Промышленное охлаждение',
  'Испарительные градирни', 'Теплообмен', 'Ёмкостное и сепарационное оборудование',
  'Модульные тепловые инженерные системы', 'АСУ ТП · ПАЗ / Exi', 'Сервисное обслуживание',
]

export const designPhoto = imgAcs

export const designItems = [
  { k: 'Соблюдение нормативов', p: 'ФНП «Общие правила взрывобезопасности для взрывопожароопасных химических, нефтехимических и нефтеперерабатывающих производств», ГОСТ Р 21.101 (СПДС), Постановление Правительства РФ № 87.' },
  { k: 'Стадии разработки', p: 'Технико-экономическое обоснование (ТЭО), проектная документация — стадия «П» для прохождения Главгосэкспертизы России, рабочая документация — стадия «Р».' },
  { k: 'Применяемое российское ПО', p: 'Моделирование технологических процессов в «Компас-3D» и «Model Studio CS», расчёты трубопроводов на прочность и жёсткость в «СТАРТ-Проф», гидродинамические расчёты в ПО «Гидросистема».' },
  { k: 'Категорийность объектов', p: 'Проектирование жёстких систем противоаварийной автоматической защиты (ПАЗ) и АСУ ТП для производств I и II классов опасности с обеспечением требуемого уровня полноты безопасности.' },
]

export type EquipmentItem = EquipmentContent & { img: string }

const equipmentImages: Record<string, string> = {
  'eq-pump': imgPump,
  'eq-cooling': imgCool,
  'eq-tower': imgTower,
  'eq-hx': imgHx,
  'eq-vessel': imgVessel,
  'eq-boiler': imgBoiler,
}

export const equipment: EquipmentItem[] = equipmentContent.map((item) => ({
  ...item,
  img: equipmentImages[item.id],
}))

export const equipmentNotes = [
  { icon: 'check', h: 'Индивидуальный подбор', p: 'Учитываем химический состав, температуру и вязкость вашей среды.' },
  { icon: 'layers', h: 'Материальное исполнение', p: 'Насосы из фторопластов (PVDF, PTFE), полипропилена, титана и нержавеющей стали.' },
  { icon: 'award', h: 'Официальная гарантия', p: 'Только сертифицированное оборудование и полная техническая документация.' },
]

export const benefits = [
  { icon: 'check', p: 'Полную совместимость поставляемых узлов.' },
  { icon: 'layers3', p: 'Точную интеграцию оборудования в существующие технологические цепочки НПЗ.' },
  { icon: 'clock', p: 'Сокращение сроков строительно-монтажных работ.' },
  { icon: 'bolt', p: 'Максимальную энергоэффективность внедряемых решений.' },
]

export const navLinks = [
  { href: '#about', label: 'О компании' },
  { href: '#design', label: 'Проектирование' },
  { href: '#dir', label: 'Направления' },
  { href: '#eq', label: 'Оборудование' },
  { href: '#contacts', label: 'Контакты' },
]
```

Важно: строка `tickerItems` про АСУ ТП должна остаться **точно** такой, какая была в исходном файле (`'АСУ ТП · ПАЗ · Exd / Exi'`) — при переносе не меняйте текст, приведённый выше `'АСУ ТП · ПАЗ / Exi'` — опечатка примера; скопируйте оригинальную строку из текущего `src/data.ts` перед перезаписью файла.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Визуально сверить, что страница не изменилась**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected: страница выглядит идентично тому, что было до рефакторинга (все секции, фото, характеристики оборудования на месте). Остановить dev-сервер (Ctrl+C) после проверки.

- [ ] **Step 4: Commit**

```bash
git add src/data.ts
git commit -m "refactor(data): data.ts переиспользует content/services.ts, добавляет фото поверх"
```

---

### Task 3: Vite-плагин генерации JSON-LD и llms.txt

**Files:**
- Create: `vite-plugins/seo-geo.ts`
- Modify: `tsconfig.json` (добавить `vite-plugins` в `include`)

**Interfaces:**
- Consumes: `CONTACTS`, `REQUISITES`, `directions`, `applications`, `equipmentCert`, `equipment: EquipmentContent[]` из `../src/content/services` (Task 1).
- Produces: `buildJsonLd(): { '@context': string; '@graph': object[] }`, `buildLlmsTxt(): string`, `seoGeoPlugin(): import('vite').Plugin` — потребляются в Task 4 (`vite.config.ts`) и Task 5 (`scripts/verify-seo-geo.mjs` — косвенно, через собранный `dist/`).

- [ ] **Step 1: Добавить `vite-plugins` в `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite.config.ts", "vite-plugins"]
}
```

- [ ] **Step 2: Создать `vite-plugins/seo-geo.ts`**

```ts
// vite-plugins/seo-geo.ts
import type { Plugin } from 'vite'
import {
  CONTACTS,
  REQUISITES,
  directions,
  equipment,
  applications,
  equipmentCert,
} from '../src/content/services'

const SITE_URL = 'https://chemmetalleng.com'

export function buildJsonLd(): { '@context': string; '@graph': object[] } {
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: CONTACTS.company,
    legalName: CONTACTS.companyFull,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.svg`,
    email: CONTACTS.email,
    telephone: CONTACTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Варшавское шоссе, д. 33, этаж 12, помещение 1а/1',
      addressLocality: 'Москва',
      postalCode: '117105',
      addressCountry: 'RU',
    },
    knowsAbout: applications.map((a) => a.h),
  }

  const services = directions.map((d) => ({
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-${d.href.slice(1)}`,
    name: d.h,
    description: d.p,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'RU',
  }))

  const products = equipment.map((e) => ({
    '@type': 'Product',
    '@id': `${SITE_URL}/#product-${e.id}`,
    name: e.h,
    description: e.p,
    brand: { '@id': `${SITE_URL}/#organization` },
    additionalProperty: e.specs.map((s) => ({
      '@type': 'PropertyValue',
      name: s.k,
      value: s.v,
    })),
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, ...services, ...products],
  }
}

export function buildLlmsTxt(): string {
  const lines: string[] = []
  lines.push(`# ${CONTACTS.company}`)
  lines.push('')
  lines.push('> Инжиниринг и комплексное оснащение объектов нефтепереработки и металлургии: проектирование технологических установок, поставка насосного, теплообменного, ёмкостного оборудования, АВО, градирен и блочно-модульных котельных.')
  lines.push('')
  lines.push('## Компания')
  lines.push(`- Юридическое название: ${CONTACTS.companyFull}`)
  lines.push(`- ${REQUISITES.map((r) => `${r.k} ${r.v}`).join(', ')}`)
  lines.push(`- Контакты: ${CONTACTS.email}, ${CONTACTS.phone}`)
  lines.push(`- Адрес: ${CONTACTS.address}`)
  lines.push('')
  lines.push('## Направления деятельности')
  for (const d of directions) {
    lines.push(`- [${d.h}](${SITE_URL}/${d.href}): ${d.p}`)
  }
  lines.push('')
  lines.push('## Оборудование')
  for (const e of equipment) {
    const specLine = e.specs.slice(0, 3).map((s) => `${s.k}: ${s.v.split('\n')[0]}`).join('; ')
    lines.push(`- ${e.h} — ${specLine}`)
  }
  lines.push('')
  lines.push('## Отрасли применения')
  for (const a of applications) {
    lines.push(`- ${a.h}`)
  }
  lines.push('')
  lines.push('## Сертификация')
  lines.push(equipmentCert)
  lines.push('')
  return lines.join('\n')
}

export function seoGeoPlugin(): Plugin {
  return {
    name: 'seo-geo',
    transformIndexHtml(html) {
      const jsonLd = JSON.stringify(buildJsonLd(), null, 2)
      const script = `    <script type="application/ld+json">\n${jsonLd}\n    </script>\n  `
      return html.replace('</head>', `${script}</head>`)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'llms.txt',
        source: buildLlmsTxt(),
      })
    },
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: без ошибок (плагин пока не подключён к `vite.config.ts`, но должен компилироваться сам по себе).

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json vite-plugins/seo-geo.ts
git commit -m "feat(seo): Vite-плагин генерации JSON-LD и llms.txt"
```

---

### Task 4: Подключить плагин, убрать статический JSON-LD из `index.html`

**Files:**
- Modify: `vite.config.ts`
- Modify: `index.html:26-44` (удалить статический блок `<script type="application/ld+json">`)

**Interfaces:**
- Consumes: `seoGeoPlugin` из `./vite-plugins/seo-geo` (Task 3).

- [ ] **Step 1: Подключить плагин в `vite.config.ts`**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { seoGeoPlugin } from './vite-plugins/seo-geo'

// Set SINGLEFILE=1 to emit one self-contained dist/index.html (all JS/CSS/images inlined) —
// used to publish shareable preview artifacts. Normal build stays multi-file.
const single = !!(globalThis as { process?: { env?: Record<string, string> } }).process?.env?.SINGLEFILE

export default defineConfig({
  plugins: [react(), seoGeoPlugin(), ...(single ? [viteSingleFile()] : [])],
  build: single
    ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 100_000, reportCompressedSize: false }
    : {},
  server: { port: 5173 },
})
```

- [ ] **Step 2: Удалить статический JSON-LD блок из `index.html`**

Удалить строки 26–44 (весь блок `<script type="application/ld+json">...Organization...</script>`, включая пустую строку перед ним после блока `twitter:image`). Файл `index.html` после правки должен заканчивать `<head>` сразу после `<meta name="twitter:image" .../>`:

```html
    <meta name="twitter:image" content="https://chemmetalleng.com/og-image.webp" />
  </head>
```

- [ ] **Step 3: Собрать проект**

Run: `npm run build`
Expected: сборка проходит без ошибок (`tsc --noEmit && vite build`).

- [ ] **Step 4: Проверить, что JSON-LD появился в `dist/index.html`, а старого блока нет**

Run:
```bash
grep -c 'application/ld+json' dist/index.html
```
Expected: `1` (ровно один блок — сгенерированный плагином; если будет `0` или ошибка — плагин не сработал или regex `</head>` не нашёл совпадение).

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts index.html
git commit -m "feat(seo): подключить seo-geo плагин, убрать статический JSON-LD из index.html"
```

---

### Task 5: Скрипт проверки сборки + деплой

**Files:**
- Create: `scripts/verify-seo-geo.mjs`

**Interfaces:**
- Consumes: `dist/index.html`, `dist/llms.txt` (результат сборки из Task 4).

- [ ] **Step 1: Написать скрипт проверки**

```js
// scripts/verify-seo-geo.mjs
import { readFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf-8')
const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
if (!match) {
  console.error('FAIL: JSON-LD script tag not found in dist/index.html')
  process.exit(1)
}

const data = JSON.parse(match[1])
const graph = data['@graph']
if (!Array.isArray(graph)) {
  console.error('FAIL: @graph is not an array')
  process.exit(1)
}

const byType = (t) => graph.filter((n) => n['@type'] === t)
const orgs = byType('Organization')
const services = byType('Service')
const products = byType('Product')

const checks = [
  [orgs.length === 1, `expected 1 Organization, got ${orgs.length}`],
  [services.length === 6, `expected 6 Service, got ${services.length}`],
  [products.length === 6, `expected 6 Product, got ${products.length}`],
  [Array.isArray(orgs[0]?.knowsAbout) && orgs[0].knowsAbout.length === 6, 'Organization.knowsAbout must have 6 entries'],
  [products.every((p) => Array.isArray(p.additionalProperty) && p.additionalProperty.length > 0), 'every Product needs non-empty additionalProperty'],
]

const failures = checks.filter(([ok]) => !ok)
if (failures.length) {
  for (const [, msg] of failures) console.error(`FAIL: ${msg}`)
  process.exit(1)
}

const llmsTxt = readFileSync('dist/llms.txt', 'utf-8')
if (!llmsTxt.startsWith('# ')) {
  console.error('FAIL: dist/llms.txt does not start with a markdown heading')
  process.exit(1)
}
if (!llmsTxt.includes('## Направления деятельности') || !llmsTxt.includes('## Оборудование')) {
  console.error('FAIL: dist/llms.txt missing expected sections')
  process.exit(1)
}

console.log(`OK: ${orgs.length} Organization, ${services.length} Service, ${products.length} Product, llms.txt valid`)
```

- [ ] **Step 2: Запустить проверку против уже собранного `dist/` (из Task 4)**

Run: `node scripts/verify-seo-geo.mjs`
Expected: `OK: 1 Organization, 6 Service, 6 Product, llms.txt valid`
Если `FAIL` — вернуться к Task 3/4 и исправить генератор, затем пересобрать (`npm run build`) и повторить проверку.

- [ ] **Step 3: Commit скрипта**

```bash
git add scripts/verify-seo-geo.mjs
git commit -m "test(seo): скрипт проверки сгенерированного JSON-LD и llms.txt"
```

- [ ] **Step 4: Задеплоить**

```bash
git push origin main
```

Дождаться завершения workflow `Deploy to nic.ru (FTP)`:
```bash
until s=$(gh run list --repo ErnestC77/himmetallin-site --limit 5 --json status,name,createdAt | jq -r '[.[] | select(.name=="Deploy to nic.ru (FTP)")][0].status'); [ "$s" = "completed" ]; do sleep 8; done
gh run list --repo ErnestC77/himmetallin-site --limit 1 --json name,conclusion
```
Expected: `conclusion: "success"`.

- [ ] **Step 5: Проверить на проде**

```bash
curl -s https://chemmetalleng.com/llms.txt | head -5
curl -s https://chemmetalleng.com/ | grep -c 'application/ld+json'
curl -s https://chemmetalleng.com/ | grep -o '"@type":"Service"' | wc -l
curl -s https://chemmetalleng.com/ | grep -o '"@type":"Product"' | wc -l
```
Expected: `llms.txt` отдаёт markdown с `# ООО «ХИММЕТАЛЛИН»`; один блок `application/ld+json`; 6 вхождений `Service`; 6 вхождений `Product`.

- [ ] **Step 6: Визуально проверить прод**

Open: `https://chemmetalleng.com/`
Expected: страница выглядит так же, как до изменений (визуальных отличий нет).

---

## Self-Review

**Spec coverage:**
- Разделение данных (`services.ts` без картинок + `data.ts` реэкспорт) — Task 1, 2. ✅
- Vite-плагин, JSON-LD `@graph` (Organization+knowsAbout, Service×6, Product×6 с additionalProperty) — Task 3. ✅
- `llms.txt` (все секции из спеки: заголовок, компания, направления, оборудование, отрасли, сертификация) — Task 3 (`buildLlmsTxt`). ✅
- Подключение плагина в `vite.config.ts`, удаление статического блока из `index.html` — Task 4. ✅
- `robots.txt` — сознательно не трогаем (уже соответствует спеке). ✅
- Проверка (build, JSON.parse, curl, визуальный чек, Rich Results Test) — Task 4 Step 4, Task 5. Rich Results Test — внешний ручной шаг, отмечен в Task 5 Step 6 как визуальная проверка прод-версии (сам инструмент вызывается пользователем вручную вне плана).

**Placeholder scan:** ссылок на TBD/TODO нет, все шаги содержат полный код.

**Type consistency:** `EquipmentContent` (без `img`) определён в Task 1, импортируется в Task 2 (`data.ts`, расширяется до `EquipmentItem = EquipmentContent & { img: string }`) и в Task 3 (`vite-plugins/seo-geo.ts`, используется как есть для `equipment.map`). Поля `id`/`h`/`p`/`items`/`specs`/`sub` используются одинаково во всех трёх файлах.
