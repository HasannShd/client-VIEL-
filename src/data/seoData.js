export const siteUrl = 'https://www.viel-gs.de';
export const siteName = 'VIEL Gebäudeservice';
export const defaultImage = `${siteUrl}/logo.png`;

const defaultDescription = 'VIEL Gebäudeservice Berlin: professionelle Gebäudereinigung, Büroreinigung, Glasreinigung, Grundreinigung, Winterdienst und Sicherheitsdienste für Gewerbe und Hausverwaltungen.';

export const seoByPath = {
  '/': {
    title: 'VIEL Gebäudeservice Berlin | Gebäudereinigung, Winterdienst & Sicherheit',
    description: defaultDescription,
    keywords: 'Gebäudereinigung Berlin, Büroreinigung Berlin, Glasreinigung Berlin, Winterdienst Berlin, Sicherheitsdienst Berlin, Facility Management Berlin'
  },
  '/winterdienst': {
    title: 'Winterdienst Berlin | Schneeräumung & Streudienst | VIEL',
    description: 'Zuverlässiger Winterdienst in Berlin mit Schneeräumung, Streudienst, Kontrollgängen und Dokumentation für Gewerbe, Immobilien und Hausverwaltungen.',
    keywords: 'Winterdienst Berlin, Schneeräumung Berlin, Streudienst Berlin, Räumpflicht Berlin'
  },
  '/secuguard': {
    title: 'Sicherheitsdienst Berlin | Objektschutz & Brandschutzwache | VIEL',
    description: 'Professionelle Sicherheitsdienste in Berlin: Objektschutz, Veranstaltungsschutz, Brandschutzwache, Empfangsdienst, Kontrollgänge und mobile Streifen.',
    keywords: 'Sicherheitsdienst Berlin, Objektschutz Berlin, Brandschutzwache Berlin, Veranstaltungsschutz Berlin'
  },
  '/blog': {
    title: 'VIEL Blog | Reinigung, Winterdienst & Sicherheit in Berlin',
    description: 'Tipps und Einblicke rund um Gebäudereinigung, Winterdienst, Sicherheit und Facility Services in Berlin.',
    keywords: 'Gebäudereinigung Blog, Facility Service Berlin, Reinigung Tipps, Winterdienst Tipps'
  },
  '/blog/1': {
    title: 'Professionelle Büroreinigung | Warum sie wichtig ist | VIEL',
    description: 'Warum professionelle Büroreinigung Vertrauen schafft, Mitarbeitende schützt und Arbeitsbereiche in Berlin sauber und repräsentativ hält.'
  },
  '/blog/2': {
    title: 'Glas- und Fensterreinigung | Tipps für Fassaden | VIEL',
    description: 'Tipps zur professionellen Glas- und Fensterreinigung für helle Räume, gepflegte Fassaden und einen starken ersten Eindruck.'
  },
  '/blog/3': {
    title: 'Winterdienst | Sicherheit und Sauberkeit im Winter | VIEL',
    description: 'Was Eigentümer und Hausverwaltungen beim Winterdienst in Berlin beachten sollten, von Schneeräumung bis Dokumentation.'
  },
  '/blog/4': {
    title: 'Grundreinigung | Der Neuanfang für Ihre Immobilie | VIEL',
    description: 'Wann eine professionelle Grundreinigung sinnvoll ist und wie stark beanspruchte Flächen wieder nutzbar und gepflegt werden.'
  },
  '/blog/5': {
    title: 'Nachhaltigkeit in der Gebäudereinigung | VIEL',
    description: 'Wie umweltfreundliche Reinigungsmethoden, effiziente Abläufe und passende Materialien gute Reinigung und Umweltschutz verbinden.'
  },
  '/blog/6': {
    title: 'Qualitätsstandards in der Gebäudereinigung | VIEL',
    description: 'Warum klare Checklisten, geschulte Teams und persönliche Ansprechpartner die Qualität in der Gebäudereinigung sichern.'
  },
  '/datenschutz': {
    title: 'Datenschutz | VIEL Gebäudeservice',
    description: 'Datenschutzerklärung von VIEL Gebäudeservice für die Nutzung der Website und Kontaktformulare.'
  },
  '/impressum': {
    title: 'Impressum | VIEL Gebäudeservice',
    description: 'Impressum und Anbieterkennzeichnung von VIEL Gebäudeservice.'
  }
};

export const normalizeSeoPath = (pathname = '/') => {
  if (seoByPath[pathname]) return pathname;
  if (pathname.startsWith('/blog/')) return seoByPath[pathname] ? pathname : '/blog';
  return '/';
};

export const buildCanonicalUrl = (pathname = '/') => {
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  return `${siteUrl}${cleanPath}`;
};

export const getSeoForPath = (pathname = '/') => {
  const key = normalizeSeoPath(pathname);
  return seoByPath[key] || seoByPath['/'];
};

const businessSchema = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${siteUrl}/#business`,
  name: siteName,
  url: siteUrl,
  image: defaultImage,
  logo: defaultImage,
  telephone: '+49 30 21467832',
  email: 'Info@viel-gs.de',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Erich-Kuttner-Straße 31',
    addressLocality: 'Berlin',
    postalCode: '10369',
    addressCountry: 'DE'
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Berlin' },
    { '@type': 'AdministrativeArea', name: 'Brandenburg' }
  ],
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  }],
  sameAs: ['https://www.google.com/maps/place/VIEL+Geb%C3%A4udeservice+GmbH/'],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gebäudereinigung Berlin' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Winterdienst Berlin' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sicherheitsdienst Berlin' } }
  ]
};

const serviceSchemaByPath = {
  '/winterdienst': {
    '@type': 'Service',
    '@id': `${siteUrl}/winterdienst#service`,
    name: 'Winterdienst Berlin',
    serviceType: 'Winterdienst, Schneeräumung und Streudienst',
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: ['Berlin', 'Brandenburg'],
    url: `${siteUrl}/winterdienst`
  },
  '/secuguard': {
    '@type': 'Service',
    '@id': `${siteUrl}/secuguard#service`,
    name: 'Sicherheitsdienst Berlin',
    serviceType: 'Objektschutz, Veranstaltungsschutz, Brandschutzwache und Kontrollgänge',
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: ['Berlin', 'Brandenburg'],
    url: `${siteUrl}/secuguard`
  }
};

export const getStructuredDataForPath = (pathname = '/') => {
  const seo = getSeoForPath(pathname);
  const canonicalUrl = buildCanonicalUrl(normalizeSeoPath(pathname));
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: 'de-DE',
      publisher: { '@id': `${siteUrl}/#business` }
    },
    businessSchema,
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', url: defaultImage },
      inLanguage: 'de-DE'
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Start', item: siteUrl },
        ...(normalizeSeoPath(pathname) === '/'
          ? []
          : [{ '@type': 'ListItem', position: 2, name: seo.title.split('|')[0].trim(), item: canonicalUrl }])
      ]
    }
  ];

  if (serviceSchemaByPath[normalizeSeoPath(pathname)]) {
    graph.push(serviceSchemaByPath[normalizeSeoPath(pathname)]);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
};
