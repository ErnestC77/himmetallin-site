import { webkit, devices } from 'playwright'

const browser = await webkit.launch()
const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'] })
const page = await ctx.newPage()
await page.goto('https://himmetallin-site.onrender.com/?wk=1', { waitUntil: 'networkidle' })

// плавный скролл до секции проектирования, как палец
const targetY = await page.evaluate(() => {
  const el = document.getElementById('design')
  return el.getBoundingClientRect().top + window.scrollY
})
for (let y = 0; y <= targetY + 400; y += 350) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(1200)

const info = await page.evaluate(() => {
  const media = document.querySelector('.design-media')
  const img = media?.querySelector('img')
  const meta = document.querySelector('.design-meta')
  const bad = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop())
  return {
    ua: navigator.userAgent.slice(0, 80),
    mediaRect: media ? (r => ({ w: Math.round(r.width), h: Math.round(r.height) }))(media.getBoundingClientRect()) : null,
    metaCols: meta ? getComputedStyle(meta).gridTemplateColumns : null,
    imgOk: img ? img.complete && img.naturalWidth > 0 : null,
    subgridOK: CSS.supports('grid-template-rows', 'subgrid'),
    brokenImgs: bad,
    hScroll: document.documentElement.scrollWidth > window.innerWidth,
  }
})
console.log(JSON.stringify(info, null, 1))

await page.evaluate((yy) => window.scrollTo(0, yy - 120), targetY)
await page.waitForTimeout(600)
await page.screenshot({ path: 'concepts/webkit-design.png' })
await browser.close()
console.log('screenshot saved')
