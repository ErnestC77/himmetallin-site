import { useEffect, useState } from 'react'
import { Ic, Reveal } from '../ui'
import { equipment, equipmentNotes, equipmentCert } from '../data'

export default function Equipment() {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section className="sec on-dark" id="eq">
      <div className="wrap">
        <Reveal className="eyebrow">Поставляемое оборудование</Reveal>
        <Reveal><h2 className="big">Критически важное технологическое оборудование</h2></Reveal>
        <div className="egrid">
          {equipment.map((e, i) => (
            <Reveal className="ecard" key={e.h} id={e.id}>
              <div className="ephoto">
                <img src={e.img} alt={e.h} loading="lazy" />
              </div>
              <h3>{e.h}</h3>
              <div className="elists">
                <ul className="elist">
                  {e.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                {e.sub && (
                  <>
                    <div className="elist-sub">{e.sub.title}</div>
                    <ul className="elist">
                      {e.sub.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </>
                )}
              </div>
              <button className="eacc-btn" onClick={() => setOpen(i)}>
                Технические характеристики
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="eq-notes">
          {equipmentNotes.map((n) => (
            <Reveal className="eqnote" key={n.h}>
              <span className="ni"><Ic name={n.icon} className="ic" /></span>
              <div><h4>{n.h}</h4><p>{n.p}</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal className="eq-cert">
          <span className="ni"><Ic name="shield" className="ic" /></span>
          <p>{equipmentCert}</p>
        </Reveal>
      </div>

      {open !== null && (
        <div className="eq-modal" onClick={() => setOpen(null)}>
          <div className="eq-modal-panel" role="dialog" aria-modal="true" aria-label={equipment[open].h}
            onClick={(e) => e.stopPropagation()}>
            <div className="eq-modal-head">
              <h3>{equipment[open].h}</h3>
              <button className="eq-modal-close" aria-label="Закрыть" autoFocus onClick={() => setOpen(null)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="especs">
              {equipment[open].specs.map((s) => (
                <div className="srow" key={s.k}>
                  <span className="sk">{s.k}</span>
                  <span className="sv">{s.v}</span>
                </div>
              ))}
            </div>
            <p className="enote">{equipment[open].p}</p>
          </div>
        </div>
      )}
    </section>
  )
}
