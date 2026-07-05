import { useEffect, useRef, useState } from 'react'
import { Logo } from '../ui'
import { navLinks, equipment, CONTACTS } from '../data'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [eqOpen, setEqOpen] = useState(false)
  const [eqMobOpen, setEqMobOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)

  const closeMobile = () => { setOpen(false); setEqMobOpen(false) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!eqOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setEqOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setEqOpen(false) }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [eqOpen])

  return (
    <header className={scrolled || open ? 'scrolled' : ''}>
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="ХИММЕТАЛЛИН — на главную"><Logo /></a>
        <nav className="menu">
          {navLinks.map((l) => l.href === '#eq' ? (
            <div className={`menu-dd${eqOpen ? ' open' : ''}`} key={l.href} ref={ddRef}
              onMouseEnter={() => setEqOpen(true)} onMouseLeave={() => setEqOpen(false)}>
              <button className="menu-dd-btn" aria-expanded={eqOpen} aria-haspopup="true"
                onClick={() => setEqOpen(v => !v)}>
                {l.label}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {eqOpen && (
                <div className="dd-panel">
                  {equipment.map((e) => (
                    <a key={e.id} href={`#${e.id}`} onClick={() => setEqOpen(false)}>{e.h}</a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-right">
          <a className="nav-phone" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
          <button className="burger" aria-label="Меню" aria-expanded={open}
            onClick={() => { if (open) setEqMobOpen(false); setOpen(v => !v) }}>
            <svg viewBox="0 0 24 24">{open
              ? <path d="M6 6l12 12M18 6L6 18" />
              : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      <nav className={`mobile-menu${open ? ' open' : ''}`}>
        {navLinks.map((l) => l.href === '#eq' ? (
          <div key={l.href}>
            <button className={`mob-dd-btn${eqMobOpen ? ' open' : ''}`} aria-expanded={eqMobOpen}
              onClick={() => setEqMobOpen(v => !v)}>
              {l.label}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {eqMobOpen && equipment.map((e) => (
              <a key={e.id} className="sub" href={`#${e.id}`} onClick={closeMobile}>{e.h}</a>
            ))}
          </div>
        ) : (
          <a key={l.href} href={l.href} onClick={closeMobile}>{l.label}</a>
        ))}
        <a className="phone" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`} onClick={closeMobile}>{CONTACTS.phone}</a>
      </nav>
    </header>
  )
}
