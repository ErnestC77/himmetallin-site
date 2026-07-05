import { Ic, Reveal } from '../ui'
import { directions } from '../data'

export default function Directions() {
  return (
    <section className="sec on-light on-paper2" id="dir">
      <div className="wrap">
        <Reveal className="eyebrow">Направления</Reveal>
        <Reveal><h2 className="big">Основные направления деятельности</h2></Reveal>
        <div className="dgrid">
          {directions.map((d) => (
            <Reveal className="dcard" key={d.n}>
              <a className="card-cover" href={d.href} aria-label={d.h}></a>
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
