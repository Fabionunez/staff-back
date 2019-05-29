const express = require('express');
const router = express.Router();


const Company = require('../models/company');
const parser = require('../config/cloudinary');

// /company
router.get('/', (req, res, next) => {


  const { _id } = req.session.currentUser;
  const {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country, imageUrl} = req.body;


  Company.findOne({userAdminId:_id})
    .then((company) =>{
      //console.log(company)
      res.status(200).json(company);
    })
    .catch((err) => console.log(err))


});



router.get('/logo', (req, res, next) => {

  const { companyID  } = req.session.currentUser;

  Company.findById(companyID)
    .then((company) =>{
      //console.log(company)
      res.status(200).json(company);
    })
    .catch((err) => console.log(err))


});







router.put('/', (req, res, next) => {

    
  const {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country, imageUrl } = req.body;

  console.log(req.body);
  
  const { _id } = req.session.currentUser;

  Company.findOneAndUpdate({ userAdminId: _id}, { $set: {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country, imageUrl}}, { new: true })
  .then((company) => {
    res.status(200).json(company);

  })
  .catch((err) => console.log(err));
  

  
});


router.post('/image', parser.single('photo'), (req, res, next) => {
  console.log('file upload company');
  if (!req.file) {
    next(new Error('No file uploaded!'));
  };
  const imageUrl = req.file.secure_url;
  res.json(imageUrl).status(200);
});




module.exports = router;
