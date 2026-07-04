import { Ic, Reveal } from '../ui'
import { heroChips, heroMeta, photos } from '../data'

export default function Hero() {
  return (
    <section className="hero on-dark" id="top">
      <img className="hero-bg" src={photos.heroBg} alt="" aria-hidden="true" />
      <div className="hero-scrim" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <Reveal className="eyebrow">НПЗ / металлургия / инжиниринг</Reveal>
          <Reveal><h1 style={{ marginTop: 20 }}>Инжиниринг и комплексное оснащение</h1></Reveal>
          <Reveal><p className="sub">ООО «ХИММЕТАЛЛИН» — специализированная инжиниринговая компания: полный комплекс услуг по проектированию технологических установок и комплектации предприятий нефтеперерабатывающей и металлургической промышленности.</p></Reveal>
          <Reveal>
            <div className="hero-chips">
              {heroChips.map((c) => (
                <div className="hchip" key={c.text}><Ic name={c.icon} className="ic" />{c.text}</div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="hero-cta">
              <a className="btn btn-light" href="#eq">Оборудование<Ic name="arrow" className="ic" /></a>
              <a className="btn btn-outline" href="#contacts">Контакты</a>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-meta">
          {heroMeta.map((m) => (
            <div className="hmeta" key={m.k}><div className="k">{m.k}</div><div className="v">{m.v}</div></div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
