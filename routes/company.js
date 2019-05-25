const express = require('express');
const router = express.Router();


const Company = require('../models/company');

// /company
router.get('/', (req, res, next) => {


  const { _id } = req.session.currentUser;
  const {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country} = req.body;


  Company.findOne({userAdminId:_id})
    .then((company) =>{
      //console.log(company)
      res.status(200).json(company);
    })
    .catch((err) => console.log(err))


});







router.put('/', (req, res, next) => {

    
  const {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country} = req.body;

  console.log(req.body);
  
  const { _id } = req.session.currentUser;

  Company.findOneAndUpdate({ userAdminId: _id}, { $set: {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country}}, { new: true })
  .then((company) => {
    res.status(200).json(company);

  })
  .catch((err) => console.log(err));
  

  
});



module.exports = router;
