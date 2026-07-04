import { useEffect, useState } from 'react'
import { Logo } from '../ui'
import { navLinks, CONTACTS } from '../data'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="ХИММЕТАЛЛИН — на главную"><Logo /></a>
        <nav className="menu">
          {navLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="nav-right">
          <a className="nav-phone" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
          <button className="burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(v => !v)}>
            <svg viewBox="0 0 24 24">{open
              ? <path d="M6 6l12 12M18 6L6 18" />
              : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      <nav className={`mobile-menu${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {navLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        <a className="phone" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
      </nav>
    </header>
  )
}
