import { Ic, Reveal } from '../ui'
import { CONTACTS } from '../data'

export default function Contacts() {
  return (
    <section className="sec on-dark" id="contacts">
      <div className="wrap">
        <Reveal className="eyebrow">Контакты и реквизиты</Reveal>
        <Reveal><h2 className="big">Официальная информация компании</h2></Reveal>
        <Reveal className="cpanel">
          <h3 className="cpanel-h">{CONTACTS.company}</h3>
          <div className="cgrid-info">
            <div className="cline"><span className="ci"><Ic name="phone" className="ic" /></span>
              <div><div className="l">Телефон</div><a className="v" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a></div></div>
            <div className="cline"><span className="ci"><Ic name="mail" className="ic" /></span>
              <div><div className="l">Email</div><a className="v lc" href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></div></div>
            <div className="cline"><span className="ci"><Ic name="pin" className="ic" /></span>
              <div><div className="l">Адрес</div><div className="v lc">{CONTACTS.address}</div></div></div>
            <div className="cline"><span className="ci"><Ic name="clock" className="ic" /></span>
              <div><div className="l">График работы</div><div className="v">{CONTACTS.hours}</div></div></div>
          </div>
          <div className="req">
            <div><div className="rk">ИНН</div><div className="rv">уточняется</div></div>
            <div><div className="rk">КПП</div><div className="rv">уточняется</div></div>
            <div><div className="rk">ОГРН</div><div className="rv">уточняется</div></div>
            <div><div className="rk">Банк / р/с</div><div className="rv">уточняется</div></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
