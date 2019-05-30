const express = require('express');
const router = express.Router();

const Team = require('../models/team');
const Company = require('../models/company');
const User = require('../models/user');





// -----------------------------------------------------------------
//
//                  /team/list   LIST OF THE TEAMS
//
// -----------------------------------------------------------------
router.get('/list', (req, res, next) => {

  // Check the current session to see:
  // - If you are an admin

  const { _id } = req.session.currentUser;

  Company.findOne({userAdminId:_id})
    .then((company) => {

      // check the permissions to see the list of teams
      if(company.userAdminId === _id){

        Team.find({companyId: company._id})
        .populate('usersIds')
        .then((teams) => {
          res.status(200).json(teams)})
        .catch((err) => console.log(err))

      }else{
        res.status(200).json({canViewList: false});
      }

    })
    .catch((err) => console.log(err))

});







// -----------------------------------------------------------------
//
//                 /team/new   CREATE NEW TEAM
//
// -----------------------------------------------------------------
router.post('/new', (req, res, next) => {

  const { _id } = req.session.currentUser;
  const {name, usersIds, teamLeaderid, mission, vision } = req.body;

  // check the admin of the company from the session
  Company.findOne({userAdminId:_id})
    .then((company) => {
      

      // check the permissions to create a team
      if(company.userAdminId === _id){

        // create a new team
        const newTeam = new Team({
          name,
          usersIds,
          teamLeaderid,
          mission,
          vision,
          companyId: company._id
        });

        // save the new team in mongo
        newTeam.save()
          .then((team)=>{
            res.status(200).json(team);
          })
          .catch((err) => console.log(err))

        }else{
          res.status(200).json({canCreate: false});
        }

      })
    .catch((err) => console.log(err))


});








// -----------------------------------------------------------------
//
//            /team/view:id   GET THE INFO OF ONE TEAM
//
// -----------------------------------------------------------------
router.get('/view/:id', (req, res, next) => {

  const { _id } = req.session.currentUser;
  const teamToView = req.params.id;

  // check the admin of the company from the session
  Company.findOne({userAdminId:_id})
    .then((company) => {


      // get the team to view
      Team.findById(teamToView) /*.populate('companyId')*/
        .then((team) =>{

          if(company._id.toString() === team.companyId){

            Team.findById(req.params.id)
            .populate('usersIds')
            .then((team) => {
              res.status(200).json(team);
            })
            .catch((err) => console.log(err));

          }else{
            res.status(200).json({canView: false});
          }

        })
    
    })
    .catch((err) => console.log(err))

});









// -----------------------------------------------------------------
//
//            /team/delete:id   DELETE ONE TEAM
//
// -----------------------------------------------------------------
router.delete('/delete/:id', (req, res, next) => {

  const { _id } = req.session.currentUser;
  const teamToDelete = req.params.id;

  // check the admin of the company from the session
  Company.findOne({userAdminId:_id})
    .then((company) => {


      // get the team to delete
      Team.findById(teamToDelete)
        .then((team) =>{

          if(company._id.toString() === team.companyId){

            // console.log("can delete")
            Team.findByIdAndDelete(req.params.id)
            .then((team) => {
              res.status(200).json(team);
            })
            .catch((err) => console.log(err));

          }else{
            // console.log("no permissions")
            res.status(200).json({canDelete: false});
          }

        })
      
    })
    .catch((err) => console.log(err))

});






// -----------------------------------------------------------------
//
//                   /team/edit   EDIT A TEAM
//
// -----------------------------------------------------------------
router.put('/edit', (req, res, next) => {

  const { _id } = req.session.currentUser;
  const {id, name, usersIds, teamLeaderid, mission, vision} = req.body;

  // check the admin of the company from the session
  Company.findOne({userAdminId:_id})
    .then((company) => {


      // get the team to edit
      Team.findById(id)
        .then((team) =>{

          if(company._id.toString() === team.companyId){

            // console.log("can edit")
            Team.findByIdAndUpdate(id, { $set: {name, usersIds, teamLeaderid, mission, vision}}, { new: true })
            .then((team) => {
              res.status(200).json(team);
            })
            .catch((err) => console.log(err));

          }else{
            // console.log("no permissions")
            res.status(200).json({canEdit: false});
          }

        })
      
    })
    .catch((err) => console.log(err)) 



});





module.exports = router;
