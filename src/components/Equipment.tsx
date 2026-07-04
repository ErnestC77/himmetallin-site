import { Reveal } from '../ui'
import { equipment } from '../data'

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
                <p>{e.p}</p>
                <div className="specs">{e.specs.map((s) => <span key={s}>{s}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
