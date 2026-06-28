import './Footer.css';
import './Footer.desktop.css';
import './Footer.mobile.css';
import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/languageStore.js';
import { asset } from '../../data/siteData.js';

export default function Footer() {
  const { copy } = useLanguage();
  const scrollHomeTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Link to="/" className="site-footer__logo-link" aria-label="VIEL Gebäudeservice Startseite" onClick={scrollHomeTop}>
            <img src={asset('logo-blue.png')} alt="VIEL Gebäudeservice" className="site-footer__logo" />
          </Link>
          <p>{copy.footer.tagline}</p>
          <p>{copy.footer.description}</p>
        </div>
        <div>
          <h3>{copy.footer.navigation}</h3>
          <ul>
            {copy.nav.slice(1, 6).map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{copy.footer.services}</h3>
          <ul>
            {copy.home.services.map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{copy.footer.contact}</h3>
          <div className="site-footer__contact">
            <p><MapPin size={16} /> Erich-Kuttner-Straße 31, 10369 Berlin</p>
            <a href="tel:03021467832"><Phone size={16} /> 030 21467832</a>
            <a href="mailto:Info@viel-gs.de"><Mail size={16} /> Info@viel-gs.de</a>
          </div>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} VIEL Gebäudeservice. {copy.footer.rights} · <a href="https://www.webiqq.com" target="_blank" rel="noopener noreferrer" style={{color:'inherit',opacity:0.6,textDecoration:'none'}}>Built by Webiqq</a></span>
        <div>
          <Link to="/impressum">{copy.footer.imprint}</Link>
          <Link to="/datenschutz">{copy.footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
