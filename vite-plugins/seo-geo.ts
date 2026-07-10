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
