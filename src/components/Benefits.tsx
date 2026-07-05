import { Ic, Reveal } from '../ui'
import { benefits } from '../data'

export default function Benefits() {
  return (
    <section className="sec on-light">
      <div className="wrap">
        <Reveal className="eyebrow">Гарантии</Reveal>
        <Reveal><h2 className="big">Мы гарантируем своим заказчикам</h2></Reveal>
        <div className="bgrid">
          {benefits.map((b, i) => (
            <Reveal className="bitem" key={i}>
              <span className="bi"><Ic name={b.icon} className="ic" /></span>
              <p>{b.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
