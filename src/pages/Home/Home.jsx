import './Home.css';
import './Home.desktop.css';
import './Home.mobile.css';
import { AlertCircle, ArrowRight, Award, Building2, Calculator, Check, Clock, Euro, FileText, Leaf, Mail, MapPin, Phone, Shield, Snowflake, Sparkles, Star, ThumbsUp, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/languageStore.js';
import { asset, frequencyRate, monthlyVisitMultiplier, serviceRate } from '../../data/siteData.js';
import { sendSubmission } from '../../services/submissionService.js';

const quoteDefault = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: 'Büroreinigung',
  area: 1000,
  frequency: 'wöchentlich',
  notes: ''
};

const getVolumeDiscount = (area) => {
  if (area >= 20000) return 0.78;
  if (area >= 5000) return 0.86;
  if (area >= 1500) return 0.94;
  return 1;
};

export default function Home() {
  const { copy, language } = useLanguage();
  const home = copy.home;
  const blogPosts = copy.blog.posts;
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [quote, setQuote] = useState(quoteDefault);

  const price = useMemo(() => {
    const area = Number(quote.area) || quoteDefault.area;
    const baseRate = serviceRate[quote.service] || serviceRate.Büroreinigung;
    const frequencyMultiplier = frequencyRate[quote.frequency] || 1;
    const estimate = area * baseRate * frequencyMultiplier * getVolumeDiscount(area);

    return Math.max(120, Math.round(estimate));
  }, [quote.area, quote.frequency, quote.service]);
  const monthlyPrice = useMemo(() => {
    return Math.round(price * (monthlyVisitMultiplier[quote.frequency] || 1));
  }, [price, quote.frequency]);
  const selectedServiceLabel = home.serviceOptions.find((item) => item.value === quote.service)?.label || quote.service;
  const selectedFrequencyLabel = home.frequencyOptions.find((item) => item.value === quote.frequency)?.label || quote.frequency;
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const formatNumber = (value) => Number(value).toLocaleString(locale);
  const formatEuro = (value) => value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getSuccessMessage = () => (
    language === 'de'
      ? 'Danke. Ihre Anfrage wurde gesendet.'
      : 'Thanks. Your inquiry has been sent.'
  );
  const getErrorMessage = () => (
    language === 'de'
      ? 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.'
      : 'The inquiry could not be sent. Please try again.'
  );
  const setPending = (key) => setSubmissionStatus({ key, state: 'pending', message: '' });
  const setResult = (key, state, message) => setSubmissionStatus({ key, state, message });
  const submitToBackend = async (key, payload) => {
    setPending(key);
    try {
      await sendSubmission({ ...payload, language });
      setResult(key, 'success', getSuccessMessage());
      return true;
    } catch {
      setResult(key, 'error', getErrorMessage());
      return false;
    }
  };
  const renderStatus = (key) => {
    if (submissionStatus.key !== key || !submissionStatus.message) return null;

    return (
      <p className={`submission-status ${submissionStatus.state}`} role="status">
        {submissionStatus.message}
      </p>
    );
  };
  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    const sent = await submitToBackend('quote', {
      type: 'quote',
      subject: language === 'de' ? 'Angebotsanfrage - VIEL Gebäudeservice' : 'Quote request - VIEL Gebäudeservice',
      data: {
        name: quote.name,
        email: quote.email,
        company: quote.company,
        phone: quote.phone,
        service: selectedServiceLabel,
        area: `${formatNumber(quote.area)} m²`,
        frequency: selectedFrequencyLabel,
        pricePerVisit: `${formatEuro(price)} €`,
        monthlyEstimate: home.quotePerMonth.replace('{value}', formatEuro(monthlyPrice)),
        notes: quote.notes
      }
    });

    if (sent) setQuote(quoteDefault);
  };
  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const sent = await submitToBackend('newsletter', {
      type: 'newsletter',
      subject: language === 'de' ? 'Newsletter Anmeldung - VIEL Gebäudeservice' : 'Newsletter signup - VIEL Gebäudeservice',
      data: {
        newsletterEmail: formData.get('newsletterEmail')
      }
    });

    if (sent) form.reset();
  };
  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const sent = await submitToBackend('contact', {
      type: 'contact',
      subject: language === 'de' ? 'Kontaktanfrage - VIEL Gebäudeservice' : 'Contact inquiry - VIEL Gebäudeservice',
      data: {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        message: formData.get('message')
      }
    });

    if (sent) form.reset();
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
            <div className="about-section__image large"><img src={asset('viel-cleaning-robot.jpg')} alt="VIEL Gebäudeservice – Professionelle Reinigungstechnik" loading="lazy" decoding="async" /></div>
            <div className="about-section__image small"><img src={asset('cleaning-team-pro.webp')} alt="VIEL Gebäudeservice Team" loading="lazy" decoding="async" /></div>
            <div className="about-section__image tall"><img src={asset('viel-mitarbeiterin-2.webp')} alt="VIEL Gebäudeservice Fahrzeug" loading="lazy" decoding="async" /></div>
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
              <img src={service.image} alt={service.title} loading="lazy" decoding="async" />
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

      {/* ── Security Section ── */}
      <section className="home-security">
        <div className="container home-security__inner">
          <div className="home-security__text">
            <span className="section-eyebrow">{home.securityEyebrow}</span>
            <h2>{home.securityTitle}</h2>
            <p>{home.securityText}</p>
            <ul className="security-panel__list">
              {home.securityBenefits.map((item) => (
                <li key={item.title}>
                  <Shield size={15} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="security-panel__actions">
              <a className="viel-button" href="/secuguard">{home.securityPageButton} <ArrowRight size={18} /></a>
            </div>
          </div>
          <div className="home-security__image">
            <img src={asset('viel-security-officer.webp')} alt="VIEL Sicherheit – Professioneller Sicherheitsdienst" loading="lazy" decoding="async" />
            <div className="home-security__image-overlay" />
          </div>
        </div>
      </section>

      {/* ── Winter Service Section ── */}
      <section className="home-winter">
        <div className="container home-winter__head">
          <span className="section-eyebrow">{home.winterEyebrow}</span>
          <h2>{home.winterTitle}</h2>
          <p>{home.winterText}</p>
        </div>
        <div className="container home-winter__grid">
          <article className="winter-panel">
            <div className="winter-panel__image">
            <img src={asset('snowplow.webp')} alt="VIEL Winterdienst – Schneepflug im Einsatz" loading="lazy" decoding="async" />
            </div>
            <div className="winter-panel__content">
              <span className="section-eyebrow">{home.winterEyebrow}</span>
              <h3>{home.winterTitle}</h3>
              <p>{home.winterText}</p>
              <a className="viel-button" href="/winterdienst">{home.winterPageButton} <ArrowRight size={18} /></a>
            </div>
          </article>
          {home.winterBenefits.map((item) => (
            <div className="feature-item" key={item.title}>
              <Snowflake size={22} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quality Promises Section ── */}
      <section className="promises-section" id="qualitaet">
        <div className="container promises-section__inner">
          <div className="promises-section__lead">
            <span className="section-eyebrow promises-eyebrow">{home.promisesEyebrow}</span>
            <h2>{home.promisesTitle}</h2>
            <p>{home.promisesSubtitle}</p>
            <a href="#kontakt" className="viel-button promises-cta">{home.aboutButton} <ArrowRight size={18} /></a>
          </div>
          <div className="promises-grid">
            {home.qualityPromises.map((item, i) => {
              const icons = [Users, Check, FileText, Clock, Euro, Phone, Award, Leaf];
              const Icon = icons[i] || Check;
              return (
                <div className="promise-card" key={item.title}>
                  <div className="promise-card__icon"><Icon size={20} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-section__head">
            <span className="section-eyebrow">{home.testimonialsEyebrow}</span>
            <h2>{home.testimonialsTitle}</h2>
            <p>{home.testimonialsSubtitle}</p>
          </div>
          <div className="testimonials-section__grid">
            {home.testimonials.map((item) => (
              <article className="testimonial-card" key={item.name}>
                <div className="testimonial-card__quote">&ldquo;</div>
                <div className="testimonial-card__stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
                <p>{item.text}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                  <div>
                    <h3>{item.name}</h3>
                    <span>{item.company}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects / References Section ── */}
      <section className="projects-section">
        <div className="container projects-section__head">
          <span className="section-eyebrow">{home.projectsEyebrow}</span>
          <h2>{home.projectsTitle}</h2>
          <p>{home.projectsSubtitle}</p>
        </div>
        <div className="container projects-grid">
          {home.cases.map((item) => (
            <article className="project-card" key={item.title}>
              <div className="project-card__image">
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
              </div>
              <div className="project-card__body">
                <span className="project-card__client"><Building2 size={13} /> {item.client}</span>
                <h3>{item.title}</h3>
                <div className="project-card__rows">
                  <div>
                    <strong>{language === 'de' ? 'Herausforderung' : 'Challenge'}</strong>
                    <p>{item.challenge}</p>
                  </div>
                  <div>
                    <strong>{language === 'de' ? 'Lösung' : 'Solution'}</strong>
                    <p>{item.solution}</p>
                  </div>
                  <div className="project-card__result">
                    <ThumbsUp size={14} />
                    <p>{item.result}</p>
                  </div>
                </div>
                <a href="#kontakt" className="viel-button dark project-card__cta">{home.projectsInquiry} <ArrowRight size={16} /></a>
              </div>
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
                {home.frequencyOptions.map((item) => (
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
            <button className="quote-submit" type="submit" disabled={submissionStatus.key === 'quote' && submissionStatus.state === 'pending'}>
              {submissionStatus.key === 'quote' && submissionStatus.state === 'pending' ? (language === 'de' ? 'Wird gesendet...' : 'Sending...') : home.quoteRequest}
            </button>
            {renderStatus('quote')}
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
          <Link to="/blog">{home.allPosts} <ArrowRight size={18} /></Link>
        </div>
        <div className="container blog-preview__grid">
          {blogPosts.slice(0, 3).map((post) => (
            <Link className="blog-preview-card" to={`/blog/${post.id}`} key={post.id}>
              <img src={post.image} alt={post.title} loading="lazy" decoding="async" />
              <div>
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </Link>
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
            <button className="viel-button" type="submit" disabled={submissionStatus.key === 'newsletter' && submissionStatus.state === 'pending'}>
              {submissionStatus.key === 'newsletter' && submissionStatus.state === 'pending' ? (language === 'de' ? 'Wird gesendet...' : 'Sending...') : home.subscribe}
            </button>
            {renderStatus('newsletter')}
          </form>
        </div>
      </section>

      {/* ── Location Section ── */}
      <section className="location-section">
        <div className="container location-section__head">
          <span className="section-eyebrow">{home.locationEyebrow}</span>
          <h2>{home.locationTitle}</h2>
        </div>
        <div className="location-map-wrap">
          <a
            href="https://www.google.com/maps/place/VIEL+Geb%C3%A4udeservice+GmbH/@52.445743,13.3468907,45213m/data=!3m1!1e3!4m14!1m7!3m6!1s0x4a475e4723f0ae89:0x7da483ab59e83d08!2sVIEL+Geb%C3%A4udeservice+GmbH!8m2!3d52.5068766!4d13.4247534!16s%2Fg%2F11z21c7w7l!3m5!1s0x4a475e4723f0ae89:0x7da483ab59e83d08!8m2!3d52.5068766!4d13.4247534!16s%2Fg%2F11z21c7w7l?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="location-map-link"
            aria-label={home.locationOpen}
          >
            <iframe
              title="VIEL Gebäudeservice – Standort Berlin"
              src="https://maps.google.com/maps?q=52.5068766,13.4247534&hl=de&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', pointerEvents: 'none' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="location-map-overlay">
              <MapPin size={28} />
              <span>{home.locationOpen}</span>
            </div>
          </a>
        </div>
        <div className="location-info">
          <div className="container location-info__inner">
            <div className="location-info__item">
              <strong>{home.locationAddress}</strong>
              <p>Erich-Kuttner-Straße 31<br />10369 Berlin, Deutschland</p>
            </div>
            <div className="location-info__item">
              <strong>{home.locationPhone}</strong>
              <a href="tel:03021467832">030 21467832</a>
            </div>
            <div className="location-info__item">
              <strong>{home.locationEmail}</strong>
              <a href="mailto:Info@viel-gs.de">Info@viel-gs.de</a>
            </div>
            <div className="location-info__item">
              <strong>{home.locationHours}</strong>
              <p>{home.hours}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="kontakt">
        <div className="container contact-section__grid">
          <div>
            <span className="section-eyebrow">{home.contactEyebrow}</span>
            <h2 className="section-title">{home.contactTitle}</h2>
            <p className="section-copy">{home.contactText}</p>
            <div className="contact-list">
              <a href="mailto:Info@viel-gs.de"><Mail size={20} /> Info@viel-gs.de</a>
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
            <button className="viel-button dark" type="submit" disabled={submissionStatus.key === 'contact' && submissionStatus.state === 'pending'}>
              {submissionStatus.key === 'contact' && submissionStatus.state === 'pending' ? (language === 'de' ? 'Wird gesendet...' : 'Sending...') : home.send}
            </button>
            {renderStatus('contact')}
          </form>
        </div>
      </section>
    </main>
  );
}
