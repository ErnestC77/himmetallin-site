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
