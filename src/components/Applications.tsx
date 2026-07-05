import { Ic, Reveal } from '../ui'
import { applications } from '../data'

export default function Applications() {
  return (
    <section className="sec on-light on-paper2" id="apps">
      <div className="wrap">
        <Reveal className="eyebrow">Применение</Reveal>
        <Reveal><h2 className="big">Области применения</h2></Reveal>
        <div className="appgrid">
          {applications.map((a) => (
            <Reveal className="appcard" key={a.h}>
              <div className="ai"><Ic name={a.icon} className="ic" /></div>
              <h4>{a.h}</h4>
              <p>{a.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
