import './Home.css';
import './Home.desktop.css';
import './Home.mobile.css';
import { AlertCircle, ArrowRight, Building2, Calculator, Check, Clock, Euro, Mail, MapPin, Phone, Shield, Snowflake, Sparkles, Star } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useLanguage } from '../../context/languageStore.js';
import { asset, frequencyRate, serviceRate } from '../../data/siteData.js';

const inquiryEmail = 'info@viel-gs.de';

export default function Home() {
  const { copy, language } = useLanguage();
  const home = copy.home;
  const blogPosts = copy.blog.posts;
  const [quote, setQuote] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Büroreinigung',
    area: 31400,
    frequency: 'wöchentlich',
    notes: ''
  });

  const price = useMemo(() => {
    const base = serviceRate[quote.service] || 0.5;
    const frequency = frequencyRate[quote.frequency] || 0.25;
    return Math.max(100, Math.round(Number(quote.area) * base * frequency));
  }, [quote]);
  const monthlyPrice = useMemo(() => {
    const multipliers = {
      täglich: 20,
      wöchentlich: 4.3,
      monatlich: 1,
      einmalig: 1
    };
    return Math.round(price * (multipliers[quote.frequency] || 1));
  }, [price, quote.frequency]);
  const selectedServiceLabel = home.serviceOptions.find((item) => item.value === quote.service)?.label || quote.service;
  const selectedFrequencyLabel = home.frequencyOptions.find((item) => item.value === quote.frequency)?.label || quote.frequency;
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const formatNumber = (value) => Number(value).toLocaleString(locale);
  const formatEuro = (value) => value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const openMailInquiry = (subject, lines) => {
    const body = lines.filter(Boolean).join('\n');
    window.location.href = `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const handleQuoteSubmit = (event) => {
    event.preventDefault();
    openMailInquiry(
      language === 'de' ? 'Angebotsanfrage - VIEL Gebäudeservice' : 'Quote request - VIEL Gebäudeservice',
      [
        language === 'de' ? 'Neue Angebotsanfrage:' : 'New quote request:',
        '',
        `${home.name.replace(' *', '')}: ${quote.name}`,
        `${home.email.replace(' *', '')}: ${quote.email}`,
        `${home.company}: ${quote.company || '-'}`,
        `${language === 'de' ? 'Telefon' : 'Phone'}: ${quote.phone || '-'}`,
        `${home.serviceLabel}: ${selectedServiceLabel}`,
        `${home.areaLabel}: ${formatNumber(quote.area)} m²`,
        `${home.frequencyLabel}: ${selectedFrequencyLabel}`,
        `${home.quotePriceLabel}: ${formatEuro(price)} €`,
        `${home.quotePerMonth.replace('{value}', formatEuro(monthlyPrice))}`,
        '',
        `${home.quoteNotesLabel}:`,
        quote.notes || '-'
      ]
    );
  };
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    openMailInquiry(
      language === 'de' ? 'Newsletter Anmeldung - VIEL Gebäudeservice' : 'Newsletter signup - VIEL Gebäudeservice',
      [
        language === 'de' ? 'Bitte diese E-Mail-Adresse zum Newsletter hinzufügen:' : 'Please add this email address to the newsletter:',
        '',
        `${home.email.replace(' *', '')}: ${formData.get('newsletterEmail')}`
      ]
    );
  };
  const handleContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    openMailInquiry(
      language === 'de' ? 'Kontaktanfrage - VIEL Gebäudeservice' : 'Contact inquiry - VIEL Gebäudeservice',
      [
        language === 'de' ? 'Neue Kontaktanfrage:' : 'New contact inquiry:',
        '',
        `${home.name.replace(' *', '')}: ${formData.get('name')}`,
        `${home.company}: ${formData.get('company') || '-'}`,
        `${home.email.replace(' *', '')}: ${formData.get('email')}`,
        '',
        `${home.message.replace(' *', '')}:`,
        formData.get('message')
      ]
    );
  };

  return (
    <main className="home-page">
      <section className="hero-section" id="home">
        <div className="hero-section__bg" />
        <div className="hero-section__shade" />
        <div className="container hero-section__content">
          <div className="hero-section__eyebrow">{home.heroEyebrow}</div>
          <h1>
            {home.heroLines.map((line) => <span className="hero-section__line" key={line}><strong>VIEL</strong> {line}</span>)}
          </h1>
          <p>{home.heroText}</p>
          <div className="hero-section__actions">
            <a href="#kontakt" className="viel-button">{home.heroPrimary} <ArrowRight size={18} /></a>
            <a href="#leistungen" className="viel-button outline">{home.heroSecondary}</a>
          </div>
        </div>
        <svg className="hero-section__angle" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 90L1440 0V90H0Z" fill="white" />
        </svg>
      </section>

      <section className="about-section" id="ueber-uns">
        <div className="container about-section__grid">
          <div className="about-section__media">
            <div className="about-section__image large"><img src={asset('cleaning-team-pro.webp')} alt="VIEL Gebäudeservice Team" /></div>
            <div className="about-section__image small"><img src={asset('viel-mitarbeiter-1.png')} alt="VIEL Team bei der Arbeit" /></div>
            <div className="about-section__image tall"><img src={asset('viel-mitarbeiterin-2.png')} alt="VIEL Gebäudeservice Fahrzeug" /></div>
            <div className="about-section__badge"><strong>20+</strong><span>{home.years}</span></div>
          </div>
          <div className="about-section__copy">
            <span className="section-eyebrow">{home.aboutEyebrow}</span>
            <h2 className="section-title">{home.aboutTitle}</h2>
            <p className="section-copy">{home.aboutTextOne}</p>
            <p className="section-copy">{home.aboutTextTwo}</p>
            <a href="#kontakt" className="viel-button dark">{home.aboutButton}</a>
          </div>
        </div>
      </section>

      <section className="services-section" id="leistungen">
        <div className="container services-section__head">
          <span className="section-eyebrow">{home.servicesEyebrow}</span>
          <h2>{home.servicesTitle}</h2>
          <p>{home.servicesIntro}</p>
        </div>
        <div className="container services-section__grid">
          {home.services.map((service) => (
            <article className="service-card" key={service.title}>
              <img src={service.image} alt={service.title} />
              <div className="service-card__overlay" />
              <div className="service-card__content">
                <Sparkles size={26} />
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="winter-security">
        <div className="container winter-security__head">
          <span className="section-eyebrow">{home.winterEyebrow} · {home.securityEyebrow}</span>
          <h2>{home.winterTitle} {home.securityTitle}</h2>
          <p>{home.winterText} {home.securityText}</p>
        </div>
        <div className="container winter-security__grid">
          <article className="winter-panel">
            <div className="winter-panel__image">
              <img src={asset('modern-glass-building.jpg')} alt="VIEL winter service and building protection" />
            </div>
            <div className="winter-panel__content">
              <span className="section-eyebrow">{home.winterEyebrow}</span>
              <h3>{home.winterTitle}</h3>
              <p>{home.winterText}</p>
              <a className="viel-button" href="/winterdienst">{home.winterPageButton} <ArrowRight size={18} /></a>
            </div>
          </article>
          <div className="winter-security__features">
            <div className="feature-column">
              <div className="feature-column__label"><Snowflake size={18} /> {home.winterEyebrow}</div>
              {home.winterBenefits.map((item) => (
                <div className="feature-item" key={item.title}>
                  <Snowflake size={22} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="feature-column security-column">
              <div className="feature-column__label"><Shield size={18} /> {home.securityEyebrow}</div>
              {home.securityBenefits.map((item) => (
                <div className="feature-item light" key={item.title}>
                  <Shield size={22} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="quality-section" id="qualitaet">
        <div className="container quality-section__head">
          <span className="section-eyebrow">{home.qualityEyebrow}</span>
          <h2><span>VIEL</span> {home.qualityTitle}<br />{home.qualitySuffix}</h2>
          <p>{home.qualityText}</p>
        </div>
        <div className="container quality-section__grid">
          {home.qualityPoints.map((point) => (
            <div className="quality-point" key={point}>
              <Check size={19} />
              <span>{point}</span>
            </div>
          ))}
        </div>
        <div className="container cases-grid">
          {home.cases.map((item) => (
            <article className="case-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.client}</span>
                <h3>{item.title}</h3>
                <p>{item.challenge}</p>
                <strong>{item.result}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container testimonials-section__grid">
          {home.testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <div className="testimonial-card__stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
              <p>{item.text}</p>
              <h3>{item.name}</h3>
              <span>{item.company}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div className="container quote-section__head">
          <span className="section-eyebrow">{home.quoteEyebrow}</span>
          <h2><Calculator size={44} /> {home.quoteGeneratorTitle}</h2>
          <p>{home.quoteGeneratorText}</p>
        </div>
        <div className="container quote-section__grid">
          <form className="quote-generator-form" onSubmit={handleQuoteSubmit}>
            <div className="quote-form__split">
              <label>{home.name}<input required type="text" value={quote.name} placeholder={home.quoteNamePlaceholder} onChange={(event) => setQuote({ ...quote, name: event.target.value })} /></label>
              <label>{home.email}<input required type="email" value={quote.email} placeholder={home.quoteEmailPlaceholder} onChange={(event) => setQuote({ ...quote, email: event.target.value })} /></label>
            </div>
            <div className="quote-form__split">
              <label>{home.company}<input type="text" value={quote.company} placeholder={home.quoteCompanyPlaceholder} onChange={(event) => setQuote({ ...quote, company: event.target.value })} /></label>
              <label>{language === 'de' ? 'Telefon' : 'Phone'}<input type="tel" value={quote.phone} placeholder={home.quotePhonePlaceholder} onChange={(event) => setQuote({ ...quote, phone: event.target.value })} /></label>
            </div>
            <label>{home.serviceLabel} *
              <select value={quote.service} onChange={(event) => setQuote({ ...quote, service: event.target.value })}>
                {home.serviceOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label className="quote-range-label">
              {home.areaLabel}: {formatNumber(quote.area)} m²
              <input type="range" min="100" max="50000" step="100" value={quote.area} onChange={(event) => setQuote({ ...quote, area: Number(event.target.value) })} />
              <span><small>100 m²</small><small>50.000 m²</small></span>
            </label>
            <fieldset className="quote-frequency">
              <legend>{home.frequencyLabel} *</legend>
              <div>
                {home.frequencyOptions.slice(0, 3).map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={quote.frequency === item.value ? 'is-active' : ''}
                    onClick={() => setQuote({ ...quote, frequency: item.value })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label>{home.quoteNotesLabel}
              <textarea rows="4" value={quote.notes} placeholder={home.quoteNotesPlaceholder} onChange={(event) => setQuote({ ...quote, notes: event.target.value })} />
            </label>
            <button className="quote-submit" type="submit">{home.quoteRequest}</button>
          </form>
          <aside className="quote-summary-wrap">
            <div className="quote-summary">
              <h3>{home.quoteSummaryTitle}</h3>
              <dl>
                <div><dt>{home.quoteSummaryService}</dt><dd>{selectedServiceLabel}</dd></div>
                <div><dt>{home.quoteSummaryArea}</dt><dd>{formatNumber(quote.area)} m²</dd></div>
                <div><dt>{home.quoteSummaryFrequency}</dt><dd>{selectedFrequencyLabel}</dd></div>
              </dl>
              <div className="quote-price-card">
                <span>{home.quotePriceLabel}</span>
                <strong>{formatEuro(price)} €</strong>
                <small>{home.quotePerMonth.replace('{value}', formatEuro(monthlyPrice))}</small>
              </div>
              <div className="quote-warning"><AlertCircle size={21} /><span>{home.quoteWarning}</span></div>
            </div>
            <div className="quote-next">
              <h3>{home.quoteNextTitle}</h3>
              <ol>
                {home.quoteNextSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section className="blog-preview">
        <div className="container blog-preview__head">
          <span className="section-eyebrow">{home.blogEyebrow}</span>
          <h2>{home.blogTitle}</h2>
          <a href="/blog">{home.allPosts} <ArrowRight size={18} /></a>
        </div>
        <div className="container blog-preview__grid">
          {blogPosts.slice(0, 3).map((post) => (
            <a className="blog-preview-card" href={`/blog/${post.id}`} key={post.id}>
              <img src={post.image} alt={post.title} />
              <div>
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container newsletter-section__inner">
          <div>
            <span className="section-eyebrow">{home.newsletterEyebrow}</span>
            <h2>{home.newsletterTitle}</h2>
          </div>
          <form onSubmit={handleNewsletterSubmit}>
            <input required type="email" name="newsletterEmail" placeholder={home.emailPlaceholder} aria-label={home.emailPlaceholder} />
            <button className="viel-button" type="submit">{home.subscribe}</button>
          </form>
        </div>
      </section>

      <section className="contact-section" id="kontakt">
        <div className="container contact-section__grid">
          <div>
            <span className="section-eyebrow">{home.contactEyebrow}</span>
            <h2 className="section-title">{home.contactTitle}</h2>
            <p className="section-copy">{home.contactText}</p>
            <div className="contact-list">
              <a href="mailto:info@viel-gs.de"><Mail size={20} /> info@viel-gs.de</a>
              <a href="tel:03021467832"><Phone size={20} /> 030 21467832</a>
              <p><MapPin size={20} /> Erich-Kuttner-Straße 31, 10369 Berlin</p>
              <p><Clock size={20} /> {home.hours}</p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="contact-form__split">
              <label>{home.name}<input required type="text" name="name" /></label>
              <label>{home.company}<input type="text" name="company" /></label>
            </div>
            <label>{home.email}<input required type="email" name="email" /></label>
            <label>{home.message}<textarea required rows="5" name="message" /></label>
            <label className="contact-form__check"><input required type="checkbox" /> <span>{home.privacyConsent}</span></label>
            <label className="contact-form__check"><input required type="checkbox" /> <span>{home.dataConsent}</span></label>
            <button className="viel-button dark" type="submit">{home.send}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
