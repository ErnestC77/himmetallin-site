import { Ic, Reveal } from '../ui'
import { equipment, equipmentNotes } from '../data'

export default function Equipment() {
  return (
    <section className="sec on-dark" id="eq">
      <div className="wrap">
        <Reveal className="eyebrow">Поставляемое оборудование</Reveal>
        <Reveal><h2 className="big">Критически важные технологические узлы</h2></Reveal>
        <div className="egrid">
          {equipment.map((e) => (
            <Reveal className="ecard" key={e.code}>
              <div className="ephoto">
                <span className="code">{e.code}</span>
                <img src={e.img} alt={e.h} loading="lazy" />
              </div>
              <div className="ebody">
                <h3>{e.h}</h3>
                <ul className="elist">
                  {e.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <p className="enote">{e.p}</p>
              </div>
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
      </div>
    </section>
  )
}
