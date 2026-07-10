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
  'Модульные тепловые инженерные системы', 'АСУ ТП · ПАЗ · Exd / Exi', 'Сервисное обслуживание',
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
