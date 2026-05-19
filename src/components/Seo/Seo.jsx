import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildCanonicalUrl, defaultImage, getSeoForPath, getStructuredDataForPath, normalizeSeoPath, siteName } from '../../data/seoData.js';

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
    const seo = getSeoForPath(pathname);
    const canonicalUrl = buildCanonicalUrl(normalizeSeoPath(pathname));

    document.title = seo.title;
    setMeta('meta[name="description"]', {
      match: { name: 'description' },
      values: { name: 'description', content: seo.description }
    });
    setMeta('meta[name="keywords"]', {
      match: { name: 'keywords' },
      values: { name: 'keywords', content: seo.keywords || '' }
    });
    setMeta('meta[name="robots"]', {
      match: { name: 'robots' },
      values: { name: 'robots', content: key === '/impressum' || key === '/datenschutz' ? 'index, follow, noarchive' : 'index, follow' }
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
    setMeta('meta[property="og:type"]', {
      match: { property: 'og:type' },
      values: { property: 'og:type', content: pathname.startsWith('/blog/') ? 'article' : 'website' }
    });
    setMeta('meta[property="og:site_name"]', {
      match: { property: 'og:site_name' },
      values: { property: 'og:site_name', content: siteName }
    });
    setMeta('meta[property="og:image"]', {
      match: { property: 'og:image' },
      values: { property: 'og:image', content: defaultImage }
    });
    setMeta('meta[name="twitter:title"]', {
      match: { name: 'twitter:title' },
      values: { name: 'twitter:title', content: seo.title }
    });
    setMeta('meta[name="twitter:description"]', {
      match: { name: 'twitter:description' },
      values: { name: 'twitter:description', content: seo.description }
    });
    setMeta('meta[name="twitter:image"]', {
      match: { name: 'twitter:image' },
      values: { name: 'twitter:image', content: defaultImage }
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let structuredData = document.head.querySelector('script[data-seo-schema="true"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      structuredData.setAttribute('data-seo-schema', 'true');
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(getStructuredDataForPath(pathname));
  }, [pathname]);

  return null;
}
