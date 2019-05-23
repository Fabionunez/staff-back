const express = require('express');
const router = express.Router();


const Company = require('../models/company');

// /company
router.get('/', (req, res, next) => {

  console.log("hi")

  const { _id } = req.session.currentUser;
  const {tradeName, corporateName, taxIdNumber, address, city, postalCode, province, country} = req.body;
  // Still need to check if I am the admin before to show


  Company.findOne({userAdminId:_id})
    .then((company) =>{
      console.log(company)
      res.status(200).json(company);
    })
    .catch((err) => console.log(err))


  // const { _id } = req.session.currentUser;
  // console.log("backend /company")
  
  // Company.findOne({ userAdminId: _id })
  //   .then((company) => {
  //     res.status(200).json(company);

  //   })
  //   .catch((err) => console.log(err));

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
