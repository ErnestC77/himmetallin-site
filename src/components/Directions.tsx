import { Ic, Reveal } from '../ui'
import { directions } from '../data'

export default function Directions() {
  return (
    <section className="sec on-light on-paper2" id="dir">
      <div className="wrap">
        <Reveal className="eyebrow">Основные направления</Reveal>
        <Reveal><h2 className="big">Компетенции для объектов НПЗ, химии и металлургии</h2></Reveal>
        <div className="dgrid">
          {directions.map((d) => (
            <Reveal className="dcard" key={d.n}>
              <div className="di"><Ic name={d.icon} className="ic" /></div>
              <h3>{d.h}</h3>
              <p>{d.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
