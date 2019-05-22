const express = require('express');
const router = express.Router();


const Company = require('../models/company');

// /company
router.get('/', (req, res, next) => {

  const { _id } = req.session.currentUser;

  Company.findOne({ userAdminId: _id })
    .then((company) => {
      res.status(200).json(company);

    })
    .catch((err) => console.log(err));

});

router.post('/', (req, res, next) => {
  const { tradeName, corporateName, taxIdNumber, address, city, postalCode, state, country } = req.body;
  
  const { _id } = req.session.currentUser;

  Company.findOneAndUpdate({ userAdminId: _id}, { $set: { tradeName, corporateName, taxIdNumber, address, city, postalCode, state, country }}, { new: true })
  .then((company) => {
    res.status(200).json(company);

  })
  .catch((err) => console.log(err));
  

  
});

module.exports = router;
