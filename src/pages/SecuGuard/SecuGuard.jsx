import './SecuGuard.css';
import './SecuGuard.desktop.css';
import './SecuGuard.mobile.css';
import { ArrowRight, BadgeCheck, Building2, Flame, Mail, MapPin, Phone, ShieldCheck, Users } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../../context/languageStore.js';
import { asset } from '../../data/siteData.js';

const serviceIcons = [Building2, Users, Flame, ShieldCheck];

export default function SecuGuard() {
  const { copy } = useLanguage();
  const page = copy.secuguard;

  return (
    <main className="secuguard-page">
      <section className="secuguard-hero">
        <div className="secuguard-hero__bg" />
        <div className="container secuguard-hero__content">
          <span className="section-eyebrow">{page.eyebrow}</span>
          <h1>{page.heroTitle}</h1>
          <p>{page.heroText}</p>
          <div className="secuguard-hero__actions">
            <a className="viel-button" href="#secuguard-contact">{page.primary} <ArrowRight size={18} /></a>
            <a className="viel-button outline" href="#secuguard-services">{page.secondary}</a>
            <a className="viel-button outline" href="https://secuguard-security.com/" target="_blank" rel="noreferrer">secuguard-security.com</a>
          </div>
        </div>
      </section>

      <section className="secuguard-intro">
        <div className="container secuguard-intro__grid">
          <div>
            <span className="section-eyebrow">SecuGuard</span>
            <h2>{page.introTitle}</h2>
            <p>{page.introText}</p>
          </div>
          <div className="secuguard-contact-card">
            <a href={`tel:${page.phone.replaceAll(' ', '')}`}><Phone size={20} /> {page.phone}</a>
            <a href={`mailto:${page.email}`}><Mail size={20} /> {page.email}</a>
            <p><MapPin size={20} /> {page.address}</p>
          </div>
        </div>
      </section>

      <section className="secuguard-services" id="secuguard-services">
        <div className="container secuguard-services__head">
          <span className="section-eyebrow">SecuGuard</span>
          <h2>{page.servicesTitle}</h2>
          <p>{page.servicesText}</p>
        </div>
        <div className="container secuguard-services__grid">
          {page.services.map(([title, desc], index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <article className="secuguard-service-card" key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="secuguard-standards">
        <div className="container secuguard-standards__grid">
          <div className="secuguard-standards__image">
            <img src={asset('modern-glass-building.jpg')} alt="SecuGuard security site" />
          </div>
          <div>
            <span className="section-eyebrow">SecuGuard</span>
            <h2>{page.standardsTitle}</h2>
            <div className="secuguard-standards__list">
              {page.standards.map((item) => (
                <div key={item}><BadgeCheck size={19} /> <span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="secuguard-contact" id="secuguard-contact">
        <div className="container secuguard-contact__inner">
          <span className="section-eyebrow">Kontakt</span>
          <h2>{page.contactTitle}</h2>
          <p>{page.contactText}</p>
          <div>
            <a className="viel-button" href={`mailto:${page.email}`}>{page.primary}</a>
            <a className="viel-button outline" href="https://secuguard-security.com/" target="_blank" rel="noreferrer">secuguard-security.com</a>
          </div>
        </div>
      </section>
    </main>
  );
}
