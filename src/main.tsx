import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

// Сорвавшаяся по сети lazy-загрузка картинки (CDN-глюк) на iOS не повторяется
// и оставляет иконку битого изображения. Повторяем загрузку до двух раз.
const imgRetries = new WeakMap<HTMLImageElement, number>()
window.addEventListener(
  'error',
  (e) => {
    const img = e.target as HTMLImageElement | null
    if (!img || img.tagName !== 'IMG' || !img.src) return
    const attempt = (imgRetries.get(img) ?? 0) + 1
    if (attempt > 2) return
    imgRetries.set(img, attempt)
    const base = img.src.split('?')[0]
    setTimeout(() => { img.src = `${base}?retry=${attempt}` }, 700 * attempt)
  },
  true,
)

// iOS восстанавливает вкладку из bfcache вместе с уже битыми картинками, и событие
// error для них больше не приходит. При показе страницы перезагружаем все битые <img>.
function healBrokenImages() {
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.src) {
      const base = img.src.split('?')[0]
      img.src = `${base}?heal=${Date.now()}`
    }
  })
}
window.addEventListener('pageshow', healBrokenImages)
document.addEventListener('visibilitychange', () => { if (!document.hidden) healBrokenImages() })

// Временная диагностика: открыть /?debug=1 — панель с состоянием рендера
// (для разбора девайс-специфичных артефактов). Удалить после отладки.
if (new URLSearchParams(location.search).has('debug')) {
  const panel = document.createElement('div')
  panel.style.cssText = 'position:fixed;left:8px;bottom:8px;right:8px;z-index:99999;background:rgba(0,0,0,.88);color:#7CFC7C;font:11px/1.5 ui-monospace,monospace;padding:10px;border-radius:6px;white-space:pre-wrap;word-break:break-all;pointer-events:none'
  const update = () => {
    const m = document.querySelector<HTMLElement>('.design-media')
    const img = m?.querySelector('img')
    const r = m?.getBoundingClientRect()
    const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop())
    panel.textContent = [
      navigator.userAgent,
      `innerW=${window.innerWidth} vvScale=${(window.visualViewport?.scale ?? 1).toFixed(2)} dpr=${window.devicePixelRatio}`,
      `mq940=${matchMedia('(max-width:940px)').matches} mq400=${matchMedia('(max-width:400px)').matches}`,
      `AR=${CSS.supports('aspect-ratio', '16/10')} subgrid=${CSS.supports('grid-template-rows', 'subgrid')}`,
      m && r ? `media=${Math.round(r.width)}x${Math.round(r.height)} cls=[${m.className}]` : 'design-media: NOT FOUND',
      img ? `img: complete=${img.complete} naturalW=${img.naturalWidth} src=${(img.currentSrc || img.src).split('/').pop()}` : 'img: none',
      `brokenImgs=[${broken.join(', ')}]`,
    ].join('\n')
  }
  update()
  setInterval(update, 1000)
  document.body.appendChild(panel)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
