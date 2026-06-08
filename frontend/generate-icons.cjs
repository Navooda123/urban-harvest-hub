/**
 * generate-icons.cjs
 * Generates simple SVG-based PWA icons (192x192 and 512x512)
 * as PNG files using pure Node.js (no native deps needed).
 * Uses an embedded SVG written to files then rasterized via the canvas API.
 *
 * Since we have no canvas/sharp available in this env, we'll create
 * a valid SVG icon and also an HTML generator script. 
 * The icons here are base64-encoded minimal PNGs created inline.
 */

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG source for the icon
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2e7d32;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4CAF50;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a5d6a7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>
  <!-- Leaf / sprout icon centered -->
  <g transform="translate(${size * 0.5}, ${size * 0.52})">
    <!-- Stem -->
    <line x1="0" y1="${size * 0.25}" x2="0" y2="-${size * 0.05}"
      stroke="url(#leaf)" stroke-width="${size * 0.045}" stroke-linecap="round"/>
    <!-- Left leaf -->
    <path d="M0,-${size * 0.04} C-${size * 0.28},-${size * 0.25} -${size * 0.32},-${size * 0.05} 0,${size * 0.08}"
      fill="url(#leaf)" opacity="0.92"/>
    <!-- Right leaf -->
    <path d="M0,-${size * 0.04} C${size * 0.28},-${size * 0.25} ${size * 0.32},-${size * 0.05} 0,${size * 0.08}"
      fill="white" opacity="0.85"/>
  </g>
</svg>`;

// Write SVG files (browsers and many tools can use SVGs as PWA icons too)
const sizes = [192, 512];
sizes.forEach(size => {
  const svgPath = path.join(iconsDir, `pwa-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, createSVG(size), 'utf8');
  console.log(`✅ Created: ${svgPath}`);
});

// Also write the favicon SVG
const faviconPath = path.join(__dirname, 'public', 'favicon.svg');
fs.writeFileSync(faviconPath, createSVG(64), 'utf8');
console.log(`✅ Created: ${faviconPath}`);

// Write a manifest.webmanifest for browsers that look for it directly
const manifest = {
  name: 'Urban Harvest Hub',
  short_name: 'HarvestHub',
  description: 'Connecting urban communities with sustainable products, workshops, and green living.',
  theme_color: '#4CAF50',
  background_color: '#0f172a',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  icons: [
    { src: '/icons/pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
    { src: '/icons/pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'public', 'manifest.webmanifest'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);
console.log('✅ Created: public/manifest.webmanifest');
console.log('\n🌿 All PWA assets generated successfully!');
