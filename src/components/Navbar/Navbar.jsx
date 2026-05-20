import './Navbar.css';
import './Navbar.desktop.css';
import './Navbar.mobile.css';
import { Menu, Phone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/languageStore.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { copy, language, toggleLanguage } = useLanguage();
  const useSolidNav = scrolled || location.pathname !== '/';
  const scrollHomeTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  useEffect(() => {
    let animationFrame = 0;
    let isPastThreshold = window.scrollY > 80;

    setScrolled(isPastThreshold);

    const updateScrolledState = () => {
      animationFrame = 0;
      const nextIsPastThreshold = window.scrollY > 80;

      if (nextIsPastThreshold !== isPastThreshold) {
        isPastThreshold = nextIsPastThreshold;
        setScrolled(nextIsPastThreshold);
      }
    };

    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateScrolledState);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className={`site-nav ${useSolidNav ? 'is-scrolled' : ''}`}>
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__logo" aria-label="VIEL Gebäudeservice Startseite" onClick={scrollHomeTop}>
          <img src={useSolidNav ? '/logo.png' : '/assets/viel/logo-white.png'} alt="VIEL Gebäudeservice" className="site-nav__logo-img" />
        </Link>
        <nav className="site-nav__links" aria-label="Hauptnavigation">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="site-nav__actions">
          <button className="site-nav__language" type="button" onClick={toggleLanguage} aria-label="Switch language">
            {language.toUpperCase()} / {copy.toggleLabel}
          </button>
          <a className="site-nav__cta" href="tel:03021467832">
            <Phone size={14} /> 030 21467832
          </a>
        </div>
        <button className="site-nav__toggle" type="button" aria-label={language === 'de' ? 'Menü öffnen' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
        <div className={`site-nav__drawer ${open ? 'is-open' : ''}`}>
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <button type="button" onClick={toggleLanguage}>{copy.toggleLabel}</button>
          <a href="tel:03021467832">030 21467832</a>
        </div>
      </div>
    </header>
  );
}
