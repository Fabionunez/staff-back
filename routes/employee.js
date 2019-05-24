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

// /employee/add
router.post('/add', (req, res, next) => {
  // check if the user exist
  // if it doesn't create a new user
  // add all the extra user data

  const { name, surname, title, imageUrl, username, password } = req.body;
  
  User.findOne({username}, 'username')
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
            title,
            username,
            password: hashPass,
            companyID: user.companyID,
            imageUrl
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




// /employee/edit/:id  Visualizacion
router.get('/edit/:id', (req, res, next) => {

  const { name, surname, title, imageUrl, username, password } = req.body;

  console.log("req.session.currentUser._id:", req.session.currentUser._id);
  console.log("id:", req.params.id);

  if (req.session.currentUser._id === req.params.id){
    console.log("in conditional backend")
    User.findById(req.params.id)
    .then((employee) => {

      res.status(200).json(employee);
    })
    .catch((err) => console.log(err));

  }else{
    res.status(200).json({message:"error"})
  }

});


// /employee/edit/:id  (save and update)
router.put('/edit', (req, res, next) => {

  //check if you have the rights to edit this user
  // to do it check if the company of the user in the session 
  // is the admin of the company of the user to edit

  //console.log(req.session.currenUser_id, )


  const { id, name, surname, title, imageUrl, username, password } = req.body;

  // console.log("req.session.currentUser._id:", req.session.currentUser._id);
  // console.log("id:", id);


  // check if you are the one editing
  if (req.session.currentUser._id === id){

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findByIdAndUpdate(id, {$set: { name, surname, title, imageUrl, username, hashPass } })
    .then((employee) => {
      //employee.password = hashPass;
      //console.log(employee);
      res.status(200).json(employee);
    })
    .catch((err) => console.log(err));

  }else{
    return null;
  }


});





// /employee/delete/:id 
router.delete('/delete/:id', (req, res, next) => {

  //check if you have the rights to delete this user
  // to do it check if the company of the user in the session 
  // is the admin of the company of the user to edit

  //console.log(req.params.id)


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
