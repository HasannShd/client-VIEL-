export const asset = (name) => `/assets/viel/${name}`;

export const navLinks = [
  { label: 'Start', href: '/#home' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Qualität', href: '/#qualitaet' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontakt', href: '/#kontakt' }
];

export const services = [
  {
    title: 'Büroreinigung',
    desc: 'Tägliche, wöchentliche oder individuelle Reinigung Ihrer Büroflächen nach höchsten Hygienestandards.',
    image: asset('office-cleaning-pro.jpg')
  },
  {
    title: 'Glas- & Fensterreinigung',
    desc: 'Streifenfreie Reinigung von Fenstern, Glasfassaden und Schaufenstern mit professioneller Ausrüstung.',
    image: asset('glass-cleaning-highrise.webp')
  },
  {
    title: 'Grundreinigung',
    desc: 'Intensive Reinigung stark beanspruchter Flächen bis ins Detail, ideal bei besonderen Anforderungen.',
    image: asset('bauendreinigung-pro.webp')
  },
  {
    title: 'Unterhaltsreinigung',
    desc: 'Regelmäßige Reinigung für dauerhaft gepflegte Immobilien, Büros und Wohnanlagen.',
    image: asset('viel-unterhaltsreinigung.webp')
  },
  {
    title: 'Treppenhausreinigung',
    desc: 'Zuverlässige Pflege von Eingängen, Fluren, Handläufen, Aufzügen und Gemeinschaftsflächen.',
    image: asset('viel-treppenhaus.jpg')
  },
  {
    title: 'Bauendreinigung',
    desc: 'Professionelle Endreinigung nach Bau, Umbau oder Renovierung bis zur sauberen Übergabe.',
    image: asset('viel-bauend-original.jpg')
  }
];

export const winterBenefits = [
  { title: '24/7 Bereitschaft', desc: 'Unsere Einsatzteams sind bei Schnee und Eis zuverlässig erreichbar.' },
  { title: 'Professionelle Ausrüstung', desc: 'Moderne Räumtechnik sorgt für schnelle und gründliche Ergebnisse.' },
  { title: 'Umweltschonendes Streugut', desc: 'Wir setzen auf nachhaltige Materialien und saubere Ausführung.' },
  { title: 'Gesetzliche Räumpflicht', desc: 'Wir übernehmen Räum- und Streupflichten zuverlässig für Ihre Immobilie.' }
];

export const securityBenefits = [
  { title: 'Objektschutz', desc: 'Professionelle Überwachung für Gewerbeimmobilien und Wohnanlagen.' },
  { title: 'Kontrollgänge', desc: 'Regelmäßige Rundgänge schaffen Sicherheit und dokumentierte Abläufe.' },
  { title: 'Zugangskontrolle', desc: 'Diskrete Kontrolle sensibler Bereiche und kontrollierter Besucherzugänge.' },
  { title: 'Sicherheitsberatung', desc: 'Individuelle Konzepte für Objekte, Mieter und Betreiber.' }
];

export const qualityPoints = [
  'Erfahrenes und geschultes Fachpersonal',
  'Sorgfältige und gründliche Reinigung',
  'Individuelle Reinigungspläne',
  'Zuverlässige und termingerechte Ausführung',
  'Faire und transparente Preise',
  'Persönlicher Ansprechpartner'
];

export const testimonials = [
  {
    name: 'Thomas Müller',
    company: 'Berliner Immobilienverwaltung GmbH',
    text: 'VIEL Gebäudeservice hat unsere Erwartungen weit übertroffen. Die Zuverlässigkeit und Professionalität sind beeindruckend. Wir arbeiten seit 3 Jahren zusammen.'
  },
  {
    name: 'Sandra Weber',
    company: 'Bürocenter Berlin-Mitte',
    text: 'Sehr gute Kommunikation, faire Preise und flexible Lösungen. VIEL Gebäudeservice ist unser verlässlicher Partner für alle Reinigungsaufgaben.'
  },
  {
    name: 'Petra Schmidt',
    company: 'Verwaltung Friedrichshain Wohnkomplex',
    text: 'Die Winterdienste von VIEL sind hervorragend. Schnell, zuverlässig und immer pünktlich. Wir sind sehr zufrieden mit der Zusammenarbeit.'
  }
];

export const cases = [
  {
    title: 'Großflächige Büroreinigung Berlin-Mitte',
    client: 'Technologie-Startup, 5.000 m²',
    challenge: 'Tägliche Reinigung für 200+ Mitarbeiter mit höchsten Hygienestandards',
    result: 'Flexible Abendteams und messbar sauberere Arbeitsbereiche',
    image: asset('office-cleaning-team.jpg')
  },
  {
    title: 'Winterdienst Gewerbeparkanlage',
    client: 'Gewerbepark Friedrichshain, 50.000 m²',
    challenge: '24/7 Schneeräumung und Streudienste während Extremwetter',
    result: 'Sichere Wege, pünktliche Öffnung und volle Dokumentation',
    image: asset('winter-snow-removal.jpeg')
  }
];

export const blogPosts = [
  {
    id: 1,
    title: 'Professionelle Büroreinigung - Warum sie wichtig ist',
    excerpt: 'Eine saubere Büroumgebung steigert die Produktivität und das Wohlbefinden Ihrer Mitarbeiter.',
    date: '15. März 2026',
    author: 'VIEL Team',
    category: 'Büroreinigung',
    image: asset('office-cleaning-pro.jpg')
  },
  {
    id: 2,
    title: 'Glas- und Fensterreinigung - Tipps für strahlende Fassaden',
    excerpt: 'Saubere Fenster und Glasflächen geben Ihrem Gebäude ein professionelles Aussehen.',
    date: '10. März 2026',
    author: 'VIEL Team',
    category: 'Glas & Fenster',
    image: asset('glass-cleaning-highrise.webp')
  },
  {
    id: 3,
    title: 'Winterdienste - Sicherheit und Sauberkeit das ganze Jahr',
    excerpt: 'Der Winter stellt besondere Anforderungen an die Gebäudereinigung.',
    date: '5. März 2026',
    author: 'VIEL Team',
    category: 'Winterdienst',
    image: asset('winter-snow-removal.jpeg')
  },
  {
    id: 4,
    title: 'Grundreinigung - Der Neuanfang für Ihre Immobilie',
    excerpt: 'Eine professionelle Grundreinigung bringt Ihre Immobilie wieder in neuen Glanz.',
    date: '1. März 2026',
    author: 'VIEL Team',
    category: 'Grundreinigung',
    image: asset('bauendreinigung-pro.webp')
  },
  {
    id: 5,
    title: 'Nachhaltigkeit in der Gebäudereinigung',
    excerpt: 'Umweltfreundliche Reinigungsmethoden sind gut für Umwelt, Gebäude und Gesundheit.',
    date: '25. Februar 2026',
    author: 'VIEL Team',
    category: 'Nachhaltigkeit',
    image: asset('modern-glass-building.jpg')
  },
  {
    id: 6,
    title: 'Qualitätsstandards in der Gebäudereinigung',
    excerpt: 'Hohe Qualitätsstandards sind das Fundament unserer Arbeit.',
    date: '20. Februar 2026',
    author: 'VIEL Team',
    category: 'Qualität',
    image: asset('cleaning-team-pro.webp')
  }
];

export const blogArticles = {
  1: {
    ...blogPosts[0],
    content: [
      'Ein sauberes Büro ist mehr als nur eine Frage der Optik. Es schafft Vertrauen, schützt Mitarbeitende und sorgt dafür, dass Kunden Ihre Räume als professionell wahrnehmen.',
      'Professionelle Büroreinigung umfasst Arbeitsplätze, Böden, Sanitärbereiche, Küchen, Oberflächen und Technik. Der wichtigste Punkt ist ein klarer Reinigungsplan, der zu den Abläufen des Unternehmens passt.',
      'VIEL Gebäudeservice bietet maßgeschneiderte Büroreinigungslösungen, die perfekt zu Ihren Anforderungen passen.'
    ]
  },
  2: {
    ...blogPosts[1],
    content: [
      'Glasflächen prägen die Außenwirkung einer Immobilie. Saubere Fenster bringen mehr Licht in Räume und lassen Fassaden gepflegt wirken.',
      'Wir arbeiten mit professioneller Ausrüstung und materialschonenden Reinigungsmitteln, um auch große Glasflächen sicher und streifenfrei zu reinigen.'
    ]
  },
  3: {
    ...blogPosts[2],
    content: [
      'Der Winter bringt besondere Herausforderungen für Eigentümer, Gewerbeflächen und Hausverwaltungen mit sich.',
      'Winterdienste von VIEL Gebäudeservice umfassen Schneeräumung, Streudienst, Kontrollfahrten und zuverlässige Dokumentation.',
      'Professionelle Winterdienste schützen Ihre Immobilie und Ihre Besucher vor Unfällen und Beschädigungen.'
    ]
  },
  4: {
    ...blogPosts[3],
    content: [
      'Grundreinigung ist ideal, wenn reguläre Unterhaltsreinigung nicht mehr ausreicht oder ein Objekt neu vorbereitet werden soll.',
      'Wir entfernen hartnäckige Verschmutzungen, behandeln Böden und reinigen stark beanspruchte Bereiche gründlich.'
    ]
  },
  5: {
    ...blogPosts[4],
    content: [
      'Nachhaltigkeit ist ein Kernwert von VIEL Gebäudeservice. Wir setzen auf umweltfreundliche Reinigungsmethoden, effiziente Abläufe und passende Reinigungsmittel.',
      'Gute Reinigung und Umweltschutz sind kein Widerspruch. Sie ergänzen sich, wenn Planung, Material und Ausführung stimmen.'
    ]
  },
  6: {
    ...blogPosts[5],
    content: [
      'Qualität ist nicht verhandelbar. Bei VIEL Gebäudeservice setzen wir auf geschulte Teams, klare Checklisten und persönliche Ansprechpartner.',
      'So sichern wir wiederholbare Ergebnisse und langfristige Zufriedenheit unserer Kunden.'
    ]
  }
};

export const serviceRate = {
  Büroreinigung: 0.08,
  Glasreinigung: 0.12,
  Grundreinigung: 0.18,
  Unterhaltsreinigung: 0.07,
  Treppenhausreinigung: 0.06,
  Bauendreinigung: 0.22,
  Winterdienst: 0.09,
  Sicherheitsdienste: 0.12
};

export const frequencyRate = {
  täglich: 0.72,
  wöchentlich: 0.9,
  monatlich: 1,
  einmalig: 1.15
};

export const monthlyVisitMultiplier = {
  täglich: 21.5,
  wöchentlich: 4.33,
  monatlich: 1,
  einmalig: 1
};
