import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteUrl = 'https://www.viel-gs.de';

const seoByPath = {
  '/': {
    title: 'VIEL Gebäudeservice Berlin | Gebäudereinigung, Winterdienst & Sicherheit',
    description: 'Professionelle Gebäudereinigung, Büroreinigung, Glasreinigung, Winterdienst und Sicherheitsdienste für Gewerbe, Hausverwaltungen und Immobilien in Berlin.'
  },
  '/winterdienst': {
    title: 'Winterdienst Berlin | Schneeräumung & Streudienst | VIEL',
    description: 'Zuverlässiger Winterdienst in Berlin mit Schneeräumung, Streudienst, Kontrollgängen und Dokumentation für Gewerbe und Hausverwaltungen.'
  },
  '/secuguard': {
    title: 'Sicherheitsdienst Berlin | Objektschutz & Brandschutzwache | VIEL',
    description: 'Professionelle Sicherheitsdienste in Berlin: Objektschutz, Veranstaltungsschutz, Brandschutzwache, Empfangsdienst und mobile Streifen.'
  },
  '/blog': {
    title: 'VIEL Blog | Reinigung, Winterdienst & Sicherheit in Berlin',
    description: 'Tipps und Einblicke rund um Gebäudereinigung, Winterdienst, Sicherheit und Facility Services in Berlin.'
  },
  '/datenschutz': {
    title: 'Datenschutz | VIEL Gebäudeservice',
    description: 'Datenschutzerklärung von VIEL Gebäudeservice.'
  },
  '/impressum': {
    title: 'Impressum | VIEL Gebäudeservice',
    description: 'Impressum und Anbieterkennzeichnung von VIEL Gebäudeservice.'
  }
};

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes.match || {}).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }

  Object.entries(attributes.values).forEach(([key, value]) => element.setAttribute(key, value));
};

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = pathname.startsWith('/blog/') ? '/blog' : pathname;
    const seo = seoByPath[key] || seoByPath['/'];
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`;

    document.title = seo.title;
    setMeta('meta[name="description"]', {
      match: { name: 'description' },
      values: { name: 'description', content: seo.description }
    });
    setMeta('meta[property="og:title"]', {
      match: { property: 'og:title' },
      values: { property: 'og:title', content: seo.title }
    });
    setMeta('meta[property="og:description"]', {
      match: { property: 'og:description' },
      values: { property: 'og:description', content: seo.description }
    });
    setMeta('meta[property="og:url"]', {
      match: { property: 'og:url' },
      values: { property: 'og:url', content: canonicalUrl }
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [pathname]);

  return null;
}
