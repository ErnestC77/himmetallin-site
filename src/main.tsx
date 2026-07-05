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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
