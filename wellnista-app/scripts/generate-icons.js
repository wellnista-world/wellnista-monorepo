// Renders every app icon from public/icon.svg (the Wellnista AI mark).
//
//   node scripts/generate-icons.js
//
// Outputs (all in public/):
//   icons/icon-{72..512}.png       "any" icons for the manifest
//   icons/maskable-{192,512}.png   full-bleed variant for Android adaptive icons
//   apple-touch-icon.png           180x180 for iOS home screen
//   favicon-32.png, favicon.ico    browser tab
//   logo.png                       512x512 general-purpose logo
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public');
const source = path.join(root, 'icon.svg');
const iconsDir = path.join(root, 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

fs.mkdirSync(iconsDir, { recursive: true });

// Maskable icons are rendered full-bleed (no rounded tile, no inner border):
// the launcher applies its own mask, and the mark already sits inside the
// central 80% safe zone.
const fullBleedSvg = Buffer.from(
  fs
    .readFileSync(source, 'utf8')
    .replace('rx="112"', 'rx="0"')
    .replace(/<rect x="1" y="1"[^>]*\/>/, '')
);

async function render(size, out, { maskable = false } = {}) {
  const input = maskable ? fullBleedSvg : source;
  await sharp(input, { density: 384 }).resize(size, size).png().toFile(out);
}

async function main() {
  for (const size of sizes) {
    await render(size, path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`icon-${size}x${size}.png`);
  }
  for (const size of [192, 512]) {
    await render(size, path.join(iconsDir, `maskable-${size}x${size}.png`), { maskable: true });
    console.log(`maskable-${size}x${size}.png`);
  }
  await render(180, path.join(root, 'apple-touch-icon.png'));
  await render(32, path.join(root, 'favicon-32.png'));
  await render(512, path.join(root, 'logo.png'));

  // favicon.ico: sharp cannot write ICO; embed the 32px PNG in an ICO container.
  const png32 = fs.readFileSync(path.join(root, 'favicon-32.png'));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(png32.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset
  fs.writeFileSync(path.join(root, 'favicon.ico'), Buffer.concat([header, entry, png32]));
  console.log('apple-touch-icon.png, favicon-32.png, favicon.ico, logo.png');
}

main().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
