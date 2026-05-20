const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const gaId = import.meta.env.VITE_GA_ID;

let analyticsLoaded = false;

const loadScript = (src, attributes = {}) => {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;

  Object.entries(attributes).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });

  document.head.appendChild(script);
};

export const initAnalytics = () => {
  if (analyticsLoaded || typeof window === 'undefined') return;
  analyticsLoaded = true;

  if (plausibleDomain) {
    loadScript('https://plausible.io/js/script.js', { 'data-domain': plausibleDomain });
  }

  if (gaId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
  }
};

export const trackEvent = (name, props = {}) => {
  if (typeof window === 'undefined') return;

  window.plausible?.(name, { props });
  window.gtag?.('event', name, props);
};
