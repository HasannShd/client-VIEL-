import './Winterdienst.css';
import './Winterdienst.desktop.css';
import './Winterdienst.mobile.css';
import { ArrowRight, BadgeCheck, CalendarCheck, ClipboardCheck, Mail, MapPin, Phone, Route, ShieldCheck, Snowflake } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../../context/languageStore.js';
import { asset } from '../../data/siteData.js';

const serviceIcons = [Snowflake, ShieldCheck, Route, CalendarCheck, ClipboardCheck, MapPin];

export default function Winterdienst() {
  const { copy } = useLanguage();
  const page = copy.winterdienst;

  return (
    <main className="winterdienst-page">
      <section className="winterdienst-hero">
        <div className="winterdienst-hero__bg" />
        <div className="container winterdienst-hero__content">
          <span className="section-eyebrow">{page.eyebrow}</span>
          <h1>{page.heroTitle}</h1>
          <p>{page.heroText}</p>
          <div className="winterdienst-hero__actions">
            <a className="viel-button" href="#winterdienst-contact">{page.primary} <ArrowRight size={18} /></a>
            <a className="viel-button outline" href="#winterdienst-services">{page.secondary}</a>
          </div>
        </div>
      </section>

      <section className="winterdienst-intro">
        <div className="container winterdienst-intro__grid">
          <div>
            <span className="section-eyebrow">VIEL Winterdienst</span>
            <h2>{page.introTitle}</h2>
            <p>{page.introText}</p>
          </div>
          <div className="winterdienst-contact-card">
            <a href={`tel:${page.phone.replaceAll(' ', '')}`}><Phone size={20} /> {page.phone}</a>
            <a href={`mailto:${page.email}`}><Mail size={20} /> {page.email}</a>
            <p><MapPin size={20} /> {page.address}</p>
          </div>
        </div>
      </section>

      <section className="winterdienst-services" id="winterdienst-services">
        <div className="container winterdienst-services__head">
          <span className="section-eyebrow">VIEL Winterdienst</span>
          <h2>{page.servicesTitle}</h2>
          <p>{page.servicesText}</p>
        </div>
        <div className="container winterdienst-services__grid">
          {page.services.map(([title, desc], index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <article className="winterdienst-service-card" key={title}>
                <Icon size={25} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="winterdienst-standards">
        <div className="container winterdienst-standards__grid">
          <div className="winterdienst-standards__image">
            <img src={asset('snowplow.png')} alt="VIEL Winterdienst Schneeräumung" />
          </div>
          <div>
            <span className="section-eyebrow">{page.standardsEyebrow}</span>
            <h2>{page.standardsTitle}</h2>
            <div className="winterdienst-standards__list">
              {page.standards.map((item) => (
                <div key={item}><BadgeCheck size={19} /> <span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="winterdienst-contact" id="winterdienst-contact">
        <div className="container winterdienst-contact__inner">
          <span className="section-eyebrow">{page.contactEyebrow}</span>
          <h2>{page.contactTitle}</h2>
          <p>{page.contactText}</p>
          <div>
            <a className="viel-button" href={`mailto:${page.email}?subject=${encodeURIComponent(page.primary)}`}>{page.primary}</a>
            <a className="viel-button outline" href={`tel:${page.phone.replaceAll(' ', '')}`}>{page.phone}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
