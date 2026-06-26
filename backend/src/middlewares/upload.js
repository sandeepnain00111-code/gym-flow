/**
 * Multer middleware configured with memoryStorage.
 * Files are held in memory (Buffer) and then pushed to Cloudinary —
 * nothing is ever written to local disk.
 *
 * Limits enforced:
 *   - Max file size: 5 MB
 *   - Allowed types: image/jpeg, image/png, image/webp, image/gif
 */
const multer = require('multer');

// Use memoryStorage — no disk writes, buffer handed directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

module.exports = upload;
