const express = require('express');
const router = express.Router();


const User = require('../models/user');
const Company = require('../models/user');


// /employee/add
router.post('/add', (req, res, next) => {

  
});

// /employee/delete
router.post('/delete', (req, res, next) => {

  
});

// /employee
router.get('/edit/:id', (req, res, next) => {

  const { _id } = req.query;
  
  // sacas el id de empresa del empleado
  // compruebas a ver si el administrador de esa empresa es igual al id de la sesión

    User.findOne(_id)
    .then((employee) => {

      Company.findOne({_id: employee._id})
        .then((company) =>{
          
          if(company._id === employee._id){
            res.status(200).json(employee);
          }

        })
        .catch((err) => console.log(err))

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
