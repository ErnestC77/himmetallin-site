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

const ALTERNATE_NAMES = [
  'ХИММЕТАЛЛИН',
  'Химметаллин',
  'Химметалл Инжиниринг',
  'ООО «Химметалл Инжиниринг»',
  'CHEMMETALLENG',
  'Chemmetall Engineering',
]

const ORGANIZATION_DESCRIPTION = 'ООО «ХИММЕТАЛЛИН» — проектирование технологических установок и комплектация предприятий нефтепереработки и металлургии. Насосы, теплообменники, ёмкости, котельные, АСУ ТП.'

// Какие категории оборудования (equipment[].id) относятся к какому направлению
// (directions[].href) — направление "Системы охлаждения" объединяет две категории
// оборудования (АВО и градирни), поэтому связь не выводится из строк автоматически.
const DIRECTION_EQUIPMENT_IDS: Record<string, string[]> = {
  '#design': [],
  '#eq-pump': ['eq-pump'],
  '#eq-cooling': ['eq-cooling', 'eq-tower'],
  '#eq-hx': ['eq-hx'],
  '#eq-vessel': ['eq-vessel'],
  '#eq-boiler': ['eq-boiler'],
}

export function buildJsonLd(): { '@context': string; '@graph': object[] } {
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: CONTACTS.company,
    legalName: CONTACTS.companyFull,
    alternateName: ALTERNATE_NAMES,
    url: `${SITE_URL}/`,
    description: ORGANIZATION_DESCRIPTION,
    logo: `${SITE_URL}/logo.svg`,
    email: CONTACTS.email,
    telephone: CONTACTS.phone,
    taxID: REQUISITES.find((r) => r.k === 'ИНН')?.v,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Варшавское шоссе, д. 33, этаж 12, помещение 1а/1',
      addressLocality: 'Москва',
      postalCode: '117105',
      addressCountry: 'RU',
    },
    knowsAbout: applications.map((a) => a.h),
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: CONTACTS.company,
    alternateName: CONTACTS.companyFull,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ru-RU',
  }

  const services = directions.map((d) => {
    const equipmentIds = DIRECTION_EQUIPMENT_IDS[d.href] ?? []
    const relatedEquipment = equipment.filter((e) => equipmentIds.includes(e.id))
    const additionalProperty = relatedEquipment.flatMap((e) =>
      e.specs.map((s) => ({
        '@type': 'PropertyValue',
        name: `${e.h}: ${s.k}`,
        value: s.v,
      })),
    )
    return {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-${d.href.slice(1)}`,
      name: d.h,
      description: d.p,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'RU',
      ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
    }
  })

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, ...services],
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
  lines.push(`- Альтернативные написания: ${ALTERNATE_NAMES.join(', ')}`)
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
    const specLine = e.specs
      .slice(0, 3)
      .map((s) => `${s.k}: ${s.v.split('\n')[0].replace(/;\s*$/, '')}`)
      .join('; ')
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
      const jsonLd = JSON.stringify(buildJsonLd(), null, 2).replace(/</g, '\\u003c')
      const script = `    <script type="application/ld+json">\n${jsonLd}\n    </script>\n  `
      return html.replace('</head>', () => `${script}</head>`)
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
