import { Ic, Reveal } from '../ui'
import { CONTACTS, REQUISITES } from '../data'

export default function Contacts() {
  return (
    <section className="sec on-dark" id="contacts">
      <div className="wrap">
        <Reveal className="eyebrow">Контакты и реквизиты</Reveal>
        <Reveal><h2 className="big">Официальная информация компании</h2></Reveal>
        <Reveal className="cpanel">
          <h3 className="cpanel-h">{CONTACTS.company}</h3>
          <p className="cpanel-full">Полное наименование — {CONTACTS.companyFull}.</p>
          <div className="cgrid-info">
            <div className="cline"><span className="ci"><Ic name="phone" className="ic" /></span>
              <div><div className="l">Телефон</div><a className="v" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a></div></div>
            <div className="cline"><span className="ci"><Ic name="mail" className="ic" /></span>
              <div><div className="l">Email</div><a className="v lc" href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></div></div>
            <div className="cline"><span className="ci"><Ic name="pin" className="ic" /></span>
              <div><div className="l">Юридический и почтовый адрес</div><div className="v lc">{CONTACTS.address}</div></div></div>
            <div className="cline"><span className="ci"><Ic name="clock" className="ic" /></span>
              <div><div className="l">График работы</div><div className="v">{CONTACTS.hours}</div></div></div>
          </div>
          <div className="req">
            {REQUISITES.map((r) => (
              <div key={r.k}><div className="rk">{r.k}</div><div className="rv mono">{r.v}</div></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
