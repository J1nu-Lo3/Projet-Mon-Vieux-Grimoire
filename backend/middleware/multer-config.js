const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500000,
  },
  fileFilter: (req, file, cb) => {
    if (!MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Format de fichier non autorisé'), false);
    } else {
      cb(null, true);
    }
  },
}).single('image');

module.exports = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return next();
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join('images', filename);

    try {
      await sharp(req.file.buffer)
        .rotate()
        .resize({
          width: 500,
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      req.file.filename = filename;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Erreur optimisation image' });
    }
  });
};
