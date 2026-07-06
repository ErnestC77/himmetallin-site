import { Reveal } from '../ui'
import { designItems, designPhoto } from '../data'

export default function Design() {
  return (
    <section className="sec on-dark" id="design">
      <div className="wrap">
        <Reveal className="eyebrow">Проектирование</Reveal>
        <Reveal><h2 className="big">Проектирование технологических установок</h2></Reveal>
        <Reveal><p className="lead">Нормативно-техническая база и параметры проектирования.</p></Reveal>
        <div className="design-grid">
          <Reveal className="design-media">
            <img src={designPhoto} alt="Проектирование технологической установки: CAD-модель и схемы ПАЗ / АСУ ТП" loading="lazy" />
          </Reveal>
          <div className="design-list">
            {designItems.map((d) => (
              <Reveal className="ditem" key={d.k}>
                <div className="dk">{d.k}</div>
                <p>{d.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
