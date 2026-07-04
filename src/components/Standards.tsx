import { Ic, Reveal } from '../ui'
import { standards } from '../data'

export default function Standards() {
  return (
    <section className="sec on-light on-paper2" id="std">
      <div className="wrap">
        <Reveal className="eyebrow">Стандарты и нормативы</Reveal>
        <Reveal><h2 className="big">Документация и соответствие отраслевым требованиям</h2></Reveal>
        <div className="stgrid">
          {standards.map((s) => (
            <Reveal className="stcard" key={s.h}>
              <div className="st-h"><Ic name={s.icon} className="ic" />{s.h}</div>
              <p>{s.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
