const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function blurRegions(filePath, regions) {
  const meta = await sharp(filePath).metadata();
  console.log(`  ${path.basename(filePath)} (${meta.width}x${meta.height})`);

  const composites = [];
  for (const r of regions) {
    // Clamp to image bounds
    const left = Math.max(0, r.x);
    const top = Math.max(0, r.y);
    const width = Math.min(r.w, meta.width - left);
    const height = Math.min(r.h, meta.height - top);

    const blurred = await sharp(filePath)
      .extract({ left, top, width, height })
      .blur(25)
      .toBuffer();

    composites.push({ input: blurred, left, top });
  }

  const tmpPath = filePath.replace('.png', '-tmp.png');
  await sharp(filePath).composite(composites).toFile(tmpPath);
  fs.renameSync(tmpPath, filePath);
  console.log(`  ✓ ${regions.length} region(s) blurred`);
}

(async () => {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(DIR, file);
    const regions = [
      // Bottom-left sidebar: "Tom Rivera" + "Admin" + TR avatar
      // Visible in extracted region: within last 180px height, first 320px width
      // Add padding above to cover avatar fully
      { x: 0, y: 1600 - 180, w: 320, h: 120 },

      // Top-right header: "TR" avatar + "Tom" + dropdown chevron
      { x: 2560 - 360, y: 0, w: 360, h: 80 },
    ];

    await blurRegions(filePath, regions);
  }

  console.log('\nDone.');
})();
