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
    if (['.webp', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, path.basename(file, ext) + '.webp');
      sharp(inputPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✅ Конвертирован: ${file} → ${path.basename(outputPath)}`);
          // Удаляем оригинал, если конвертация успешна
          fs.unlinkSync(inputPath);
          console.log(`🗑️ Удалён оригинал: ${file}`);
        })
        .catch(err => console.error(`❌ Ошибка при конвертации ${file}:`, err));
    }
  });
});