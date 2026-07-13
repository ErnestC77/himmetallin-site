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
const websites = byType('WebSite')
const services = byType('Service')
const products = byType('Product')

const checks = [
  [orgs.length === 1, `expected 1 Organization, got ${orgs.length}`],
  [websites.length === 1, `expected 1 WebSite, got ${websites.length}`],
  [services.length === 6, `expected 6 Service, got ${services.length}`],
  [products.length === 0, `expected 0 Product (merged into Service.additionalProperty), got ${products.length}`],
  [Array.isArray(orgs[0]?.knowsAbout) && orgs[0].knowsAbout.length === 6, 'Organization.knowsAbout must have 6 entries'],
  [Array.isArray(orgs[0]?.alternateName) && orgs[0].alternateName.length === 6, 'Organization.alternateName must have 6 entries'],
  [typeof orgs[0]?.description === 'string' && orgs[0].description.length > 0, 'Organization.description must be non-empty'],
  [typeof orgs[0]?.taxID === 'string' && orgs[0].taxID.length > 0, 'Organization.taxID must be non-empty'],
  [websites[0]?.publisher?.['@id'] === orgs[0]?.['@id'], 'WebSite.publisher must reference the Organization @id'],
  [services.filter((s) => Array.isArray(s.additionalProperty) && s.additionalProperty.length > 0).length === 5, 'expected exactly 5 of 6 Service entries to carry equipment additionalProperty (the design/#design direction has none)'],
]

const failures = checks.filter(([ok]) => !ok)
if (failures.length) {
  for (const [, msg] of failures) console.error(`FAIL: ${msg}`)
  process.exit(1)
}

if (!html.includes('Полную совместимость поставляемых узлов.')) {
  console.error('FAIL: dist/index.html has no prerendered visible page content (still an empty <div id="root">?)')
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
if (!llmsTxt.includes('Альтернативные написания')) {
  console.error('FAIL: dist/llms.txt missing alternate names line')
  process.exit(1)
}

console.log(`OK: ${orgs.length} Organization, ${websites.length} WebSite, ${services.length} Service (5 with additionalProperty), 0 Product, llms.txt valid`)
