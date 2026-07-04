import { Logo } from '../ui'
import { navLinks, CONTACTS } from '../data'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <a className="brand" href="#top" aria-label="ХИММЕТАЛЛИН"><Logo /></a>
            <p style={{ marginTop: 18, fontSize: 14, maxWidth: '36ch' }}>
              Инжиниринг и комплексное оснащение объектов нефтепереработки и металлургии.
            </p>
          </div>
          <div>
            <h5>Навигация</h5>
            <ul>{navLinks.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
          </div>
          <div>
            <h5>Контакты</h5>
            <ul>
              <li>{CONTACTS.phone}</li>
              <li>{CONTACTS.email}</li>
              <li>{CONTACTS.hours}</li>
            </ul>
          </div>
        </div>
        <div className="fbot">
          <span>© 2026 {CONTACTS.company}. Все права защищены.</span>
        </div>
      </div>
    </footer>
  )
}
