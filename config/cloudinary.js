const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'staff',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null);
  }
});

const parser = multer({ storage: storage });

module.exports = parser;