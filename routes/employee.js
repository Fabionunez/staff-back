const express = require('express');
const router = express.Router();


const User = require('../models/user');

// /employee
router.get('/edit/:id', (req, res, next) => {

  // const { _id } = req.query;

  // User.findOne({ _id })
  //   .then((company) => {
  //     // res.status(200).json(company);

  //   })
  //   .catch((err) => console.log(err));

});

router.post('/', (req, res, next) => {
  const { tradeName, corporateName, taxIdNumber, adress, city, postalCode, state, country } = req.body;
  
  const { _id } = req.session.currentUser;

  Company.findOneAndUpdate({ userAdminId: _id}, { $set: { tradeName, corporateName, taxIdNumber, adress, city, postalCode, state, country }}, { new: true })
  .then((company) => {
    res.status(200).json(company);

  })
  .catch((err) => console.log(err));
  

  
});

module.exports = router;
