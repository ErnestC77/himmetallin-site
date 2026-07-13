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
