import { tickerItems } from '../data'

export default function Ticker() {
  const items = [...tickerItems, ...tickerItems]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="track">
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}
