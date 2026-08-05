const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'productos')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `producto-${req.params.id}-${Date.now()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
    const error = new Error('Formato de imagen no soportado (usa JPG, PNG o WEBP)');
    error.status = 400;
    return cb(error);
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

function subirImagen(req, res, next) {
  upload.single('imagen')(req, res, (error) => {
    if (error) {
      error.status = error.status || 400;
      return next(error);
    }
    next();
  });
}

module.exports = subirImagen;
