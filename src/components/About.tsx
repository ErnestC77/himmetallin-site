import { Reveal } from '../ui'
import { aboutPoints, photos } from '../data'

export default function About() {
  return (
    <section className="sec on-light" id="about">
      <div className="wrap">
        <Reveal className="eyebrow">О компании</Reveal>
        <Reveal><h2 className="big">Технологический партнёр<br />для сложных промышленных объектов</h2></Reveal>
        <div className="about-grid">
          <Reveal className="about-copy">
            <p>Обладая высокими техническими компетенциями и пониманием строгости отраслевых стандартов, мы выступаем надёжным технологическим партнёром, способным решать сложные задачи модернизации и капитального строительства объектов.</p>
            <p>Наша миссия — экономически эффективные, безопасные и высокопроизводительные решения. Мы берём на себя полную ответственность за весь жизненный цикл проекта: от предпроектного обследования и проектно-сметной документации до подбора, производства, прямой поставки и сервисного обслуживания оборудования — минимизируя риски заказчика на стыке проектирования и снабжения.</p>
            <div className="about-points">
              {aboutPoints.map((p) => (
                <div className="apoint" key={p.n}>
                  <div className="n mono">{p.n}</div>
                  <div><h4>{p.h}</h4><p>{p.p}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="about-media">
            <img src={photos.about} alt="Инженеры ХИММЕТАЛЛИН за проектной документацией" loading="lazy" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
