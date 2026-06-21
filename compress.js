const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './images';
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки images:', err);
    return;
  }
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(imagesDir, file);
      sharp(inputPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(inputPath + '.tmp.jpg')
        .then(() => {
          fs.renameSync(inputPath + '.tmp.jpg', inputPath);
          console.log(`✅ Сжат: ${file}`);
        })
        .catch(err => console.error(`❌ Ошибка при сжатии ${file}:`, err));
    }
  });
});