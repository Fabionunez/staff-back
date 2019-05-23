const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'fabionunez',
  api_key: '212419513475981',
  api_secret: 'pQ04Ilo6vxg8O7TYzyZd095Iojw'
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