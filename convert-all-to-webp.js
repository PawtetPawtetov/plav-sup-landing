const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesRoot = './images';

function walkDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', dir, err);
      return;
    }
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      fs.stat(fullPath, (statErr, stats) => {
        if (statErr) return;
        if (stats.isDirectory()) {
          walkDir(fullPath);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const outputPath = path.join(dir, path.basename(file, ext) + '.webp');
            sharp(fullPath)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(outputPath)
              .then(() => {
                console.log('✅ Конвертирован: ' + fullPath + ' → ' + outputPath);
                fs.unlinkSync(fullPath);
                console.log('🗑️ Удалён оригинал: ' + fullPath);
              })
              .catch(err => console.error('❌ Ошибка: ' + fullPath, err));
          }
        }
      });
    });
  });
}

walkDir(imagesRoot);
