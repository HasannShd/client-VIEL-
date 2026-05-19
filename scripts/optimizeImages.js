import sharp from 'sharp';

const jobs = [
  ['public/assets/viel/hero-front-screen.png', 'public/assets/viel/hero-front-screen.webp', 1680, 78],
  ['public/assets/viel/viel-security-officer.png', 'public/assets/viel/viel-security-officer.webp', 1680, 78],
  ['public/assets/viel/snowplow.png', 'public/assets/viel/snowplow.webp', 1680, 78],
  ['public/assets/viel/secuguard-officer.png', 'public/assets/viel/secuguard-officer.webp', 1680, 78],
  ['public/assets/viel/viel-mitarbeiterin-2.png', 'public/assets/viel/viel-mitarbeiterin-2.webp', 1100, 76],
  ['public/assets/viel/viel-mitarbeiter-1.png', 'public/assets/viel/viel-mitarbeiter-1.webp', 1100, 76],
  ['public/assets/viel/viel-unterhaltsreinigung.jpg', 'public/assets/viel/viel-unterhaltsreinigung.webp', 1100, 76],
  ['public/assets/viel/glass-cleaning-highrise.jpg', 'public/assets/viel/glass-cleaning-highrise.webp', 1100, 76]
];

for (const [source, target, width, quality] of jobs) {
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(target);
}
