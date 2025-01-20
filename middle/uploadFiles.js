const fs = require("fs");

const multer = require("multer");

module.exports.upload = (path) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path;
      ensureDirectoryExists(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${Math.random() * 10000}-${file.originalname}`);
    },
  });
  function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
  const upload = multer({ storage });
  return upload.any();
};
