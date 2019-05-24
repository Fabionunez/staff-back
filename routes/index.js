const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Company = require('../models/company');

const employeeRouter = require('./employee');

const companyRouter = require('./company');

//  * '/'
router.use('/company', companyRouter);

router.use('/employee', employeeRouter);



const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

router.get('/me', isLoggedIn(), (req, res, next) => {
  res.json(req.session.currentUser);
});


// (login)
router.post('/login', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
  const { username, password } = req.body;

  console.log(username, password)
  User.findOne({
      username
    })
    .then((user) => {
      if (!user) {
        const err = new Error('Not Found');
        err.status = 404;
        err.statusMessage = 'Not Found';
        next(err)
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      } else {
        const err = new Error('Unauthorized');
        err.status = 401;
        err.statusMessage = 'Unauthorized';
        next(err);
      }
    })
    .catch(next);
});

router.post('/signup', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
  const { name, surname, corporateName, username, password, imageUrl } = req.body;

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

      const newUser = new User({
        name,
        surname,
        username,
        imageUrl,
        password: hashPass,
        isAdmin: true
      });

      newUser.save().then((user) => {
        // TODO delete password 
        req.session.currentUser = newUser;
        const newCompany = new Company({
          corporateName,
          userAdminId: newUser._id
        })
        newCompany.save().then(()=>{
          console.log(newCompany);
          const companyId = newCompany._id
          User.findByIdAndUpdate({ _id: newUser._id}, {$set: { companyID: companyId }}, { new: true })
            .then((user)=>{
              res.status(200).json(user);
            })
            .catch((err) => console.log(err));
        })
      });
    })
    .catch(next);
});

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

module.exports = router;
