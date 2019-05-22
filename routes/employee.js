const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Company = require('../models/user');


// /employee  (list) in the front /employees
router.get('/', (req, res, next) => {
  //get the company you belong
  //get the users of that company


  User.findOne({_id: req.session.currentUser._id})
    .then((employee) => {

      console.log(employee.companyID)

      User.find({companyID: employee.companyID})
      .then((employees) => {
        console.log(employees)
        res.status(200).json(employees);
  
      })
      .catch((err) => console.log(err));


    })
    .catch((err) => console.log(err))




  
});

// /employee/add
router.post('/add', (req, res, next) => {
  // check if the user exist
  // if it doesn't create a new user
  // add all the extra user data

  

  const { name, surname, username, password } = req.body;
  


  User.findOne({
      username
    }, 'username')
    .then((userExists) => {
      if (userExists) {
        const err = new Error('Unprocessable Entity');
        err.status = 422;
        err.statusMessage = 'username-not-unique';
        next(err);
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);


      User.findOne({_id: req.session.currentUser._id})
        .then((user) =>{
          
          const newUser = new User({
            name,
            surname,
            username,
            password: hashPass,
            companyID: user.companyID
          });
    
          
          newUser.save()
            .then((user) => {
              // TODO delete password 
              //req.session.currentUser = newUser;
              res.status(200).json(user);
            })
            .catch((err) => console.log(err))

        })

    })
    .catch(next);
  
});

// /employee/delete
router.post('/delete', (req, res, next) => {

  
});

// /employee
router.get('/edit/:id', (req, res, next) => {

  
    User.findById(req.params.id)
    .then((employee) => {

      res.status(200).json(employee);


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
