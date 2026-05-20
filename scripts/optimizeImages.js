import sharp from 'sharp';

const jobs = [
  ['public/assets/viel/hero-front-screen.png', 'public/assets/viel/hero-front-screen.webp', 1280, 70],
  ['public/assets/viel/viel-security-officer.png', 'public/assets/viel/viel-security-officer.webp', 1200, 70],
  ['public/assets/viel/snowplow.png', 'public/assets/viel/snowplow.webp', 1200, 70],
  ['public/assets/viel/secuguard-officer.png', 'public/assets/viel/secuguard-officer.webp', 900, 70],
  ['public/assets/viel/viel-mitarbeiterin-2.png', 'public/assets/viel/viel-mitarbeiterin-2.webp', 900, 74],
  ['public/assets/viel/viel-mitarbeiter-1.png', 'public/assets/viel/viel-mitarbeiter-1.webp', 900, 74],
  ['public/assets/viel/viel-unterhaltsreinigung.jpg', 'public/assets/viel/viel-unterhaltsreinigung.webp', 900, 74],
  ['public/assets/viel/glass-cleaning-highrise.jpg', 'public/assets/viel/glass-cleaning-highrise.webp', 900, 74],
  ['public/assets/viel/office-cleaning-pro.jpg', 'public/assets/viel/office-cleaning-pro.webp', 900, 72],
  ['public/assets/viel/office-cleaning-team.jpg', 'public/assets/viel/office-cleaning-team.webp', 900, 72],
  ['public/assets/viel/viel-treppenhaus.jpg', 'public/assets/viel/viel-treppenhaus.webp', 900, 72],
  ['public/assets/viel/viel-bauend-original.jpg', 'public/assets/viel/viel-bauend-original.webp', 900, 72],
  ['public/assets/viel/modern-glass-building.jpg', 'public/assets/viel/modern-glass-building.webp', 1100, 70],
  ['public/assets/viel/viel-cleaning-robot.png', 'public/assets/viel/viel-cleaning-robot.webp', 900, 72]
];

for (const [source, target, width, quality] of jobs) {
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(target);
}
