const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Company = require('../models/company');
const parser = require('../config/cloudinary');



// /employee  (list) in the front /employees
router.get('/', (req, res, next) => {
  //get the company you belong
  //get the users of that company


  User.findOne({_id: req.session.currentUser._id})
    .then((employee) => {

      User.find({companyID: employee.companyID})
      .then((employees) => {
        //console.log(employees)
        res.status(200).json(employees);
  
      })
      .catch((err) => console.log(err));


    })
    .catch((err) => console.log(err))

});











// -----------------------------------------------------------------
//
//         // /employee/add   ADD EMPLOYEE
//
// -----------------------------------------------------------------

router.post('/add', (req, res, next) => {

  const {             
    username,
    password,
    name,
    surname,
    title,
    companyPhone,
    dateStart,
    birthDate,
    gender,
    nationality,
    phone,
    identificationNumber,
    socialSecurityNumber,
    address,
    city,
    postalCode,
    province,
    country,
    emergencyContact,
    emergencyPhone,
    managerID,
    imageUrl } = req.body;
  
  
  User.findOne({username}, 'username')
    .then((employeeMatch) => {

      console.log(employeeMatch);

      if(employeeMatch !== null){ 
        res.status(200).json({userExists: true});
        // const err = new Error('Unprocessable Entity');
        // err.status = 422;
        // err.statusMessage = 'username-not-unique';
        // next(err);
      }else{
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        User.findOne({_id: req.session.currentUser._id})
          .then((user) =>{
            
            const newUser = new User({
              username,
              name,
              surname,
              title,
              companyPhone,
              dateStart,
              birthDate,
              gender,
              nationality,
              phone,
              identificationNumber,
              socialSecurityNumber,
              address,
              city,
              postalCode,
              province,
              country,
              emergencyContact,
              emergencyPhone,
              managerID,
              imageUrl,
              password: hashPass,
              companyID: user.companyID
            });
        
            newUser.save()
              .then((user) => {
                // TODO delete password 
                //req.session.currentUser = newUser;
                console.log("in save")
                res.status(200).json(user);
              })
              .catch((err) => console.log(err))

          })
      }
    })
    .catch(next);
  
});






// -----------------------------------------------------------------
//
//         /employee/view/:id   VIEW PROFILE (VIEW DATA)
//
// -----------------------------------------------------------------

router.get('/view/:id', (req, res, next) => {

  const userToView = req.params.id;

  const { companyID } = req.session.currentUser;

  console.log("req.session.currentUser", req.session.currentUser)

  console.log("userToView: ",userToView);
  console.log("companyID: ",companyID);

  User.findById(userToView) // find the user of the url param
    .then((employee) => {
      if (employee.companyID === companyID){ // check if the user have the same company as the user
        // Let the user see the data
        res.status(200).json(employee);

      }else{
        res.status(200).json({permissions: false})
      }
    })
    .catch((err) => console.log(err))


});







// -----------------------------------------------------------------
//
//         /employee/edit/:id   EDIT EMPLOYEE (VIEW DATA)
//
// -----------------------------------------------------------------

router.get('/edit/:id', (req, res, next) => {


  const { _id, companyID, isAdmin } = req.session.currentUser;

  const userToEdit = req.params.id;

  console.log("companyID", companyID)

  if(isAdmin){ // 1.- Check if you are an admin

    User.findById(userToEdit) // 1.2.- Get the user to edit and obtain his company ID
      .then((employee) => {
        if (companyID === employee.companyID){ // 1.3.- Check if the user belongs the user admin's company
          // Let the user see the data
          res.status(200).json(employee);

        }else{
          res.status(200).json({permissions: false})
        }
      })
      .catch((err) => console.log(err))

  }else if(_id === userToEdit){ // 2.- Check if the user is editing himself
    // Let the user see the data

    User.findById(userToEdit) // Let the user see the data
    .then((employee) => {
        res.status(200).json(employee);
    })
    .catch((err) => console.log(err))

  }else{
    // send json with indications to redirec
    res.status(200).json({permissions: false})
  }


});







// -----------------------------------------------------------------
//
//         /employee/edit/:id   EDIT EMPLOYEE  (MODIFY DATA)
//
// -----------------------------------------------------------------
router.put('/edit', (req, res, next) => {

  const {
    id, 
    username,
    password,
    name,
    surname,
    title,
    companyPhone,
    dateStart,
    birthDate,
    gender,
    nationality,
    phone,
    identificationNumber,
    socialSecurityNumber,
    address,
    city,
    postalCode,
    province,
    country,
    emergencyContact,
    emergencyPhone,
    managerID,
    imageUrl
   } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  // console.log("*****************************************************")
  // console.log("req.body.username", username);
  // console.log("req.body.id", id);

  User.findOne({username: username}) // find if exist a user with the email recieved
   .then((employeeMatch) =>{

      if(employeeMatch === null){ 
        console.log("No encontró ningún usuario con ese mail. Adelante con el update")
        User.findByIdAndUpdate(id, {$set: {     
          username,
          hashPass,
          name,
          surname,
          title,
          companyPhone,
          dateStart,
          birthDate,
          gender,
          nationality,
          phone,
          identificationNumber,
          socialSecurityNumber,
          address,
          city,
          postalCode,
          province,
          country,
          emergencyContact,
          emergencyPhone,
          managerID,
          imageUrl } })
        .then((employee) => {
          res.status(200).json(employee);
        })
        .catch((err) => console.log(err));   

      }else{
        console.log("sí encontró un usuario con ese mail")
        User.findById(id)
        .then((employeeToEdit) =>{

          if(employeeToEdit.username === username){
            console.log("El email no ha cambiado. Adelante con el update")
            User.findByIdAndUpdate(id, {$set: {     
              username,
              hashPass,
              name,
              surname,
              title,
              companyPhone,
              dateStart,
              birthDate,
              gender,
              nationality,
              phone,
              identificationNumber,
              socialSecurityNumber,
              address,
              city,
              postalCode,
              province,
              country,
              emergencyContact,
              emergencyPhone,
              managerID,
              imageUrl } })
            .then((employee) => {
              res.status(200).json(employee);
            })
            .catch((err) => console.log(err));   
          }else{
            // const err = new Error('Unprocessable Entity');
            // err.status = 422;
            // err.statusMessage = 'username-not-unique';
            // next(err);
            console.log("el mail tiene un match con otro usuario diferente de ti. Enviar json para señalar el error")
            res.status(200).json({userExists: true});
          }
        })
        .catch((err) => console.log(err))

    }

   })
   .catch((err) => console.log(err))


});







// -----------------------------------------------------------------
//
//         /employee/delete/:id    DELETE EMPLOYEE
//
// -----------------------------------------------------------------
router.delete('/delete/:id', (req, res, next) => {

  // check if you have the rights to delete this user
  // to do it check if the company of the user in the session 
  // is the admin of the company of the user to edit

  User.findByIdAndDelete(req.params.id)
  .then((employee) => {
    res.status(200).json(employee);
  })
  .catch((err) => console.log(err));



});


router.post('/image', parser.single('photo'), (req, res, next) => {
  //console.log('file upload');
  if (!req.file) {
    next(new Error('No file uploaded!'));
  };
  const imageUrl = req.file.secure_url;
  res.json(imageUrl).status(200);
});


module.exports = router;
