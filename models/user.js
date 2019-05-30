const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: String, //mail
  password: String,
  name: String,
  surname: String,
  title: String,
  companyPhone: String, 
  dateStart: String, //change to date in next version
  birthDate: String, //change to date in next version
  gender: String,
  nationality: String,
  phone: String,
  photo: String,
  identificationNumber: String,
  socialSecurityNumber: String,
  address: String,
  city: String,
  postalCode: String,
  province: String,
  country: String,
  emergencyContact: String,
  emergencyPhone: String,
  managerID: String, //change to objetId in next version
  companyID: String, //change to objectId in next version
  isAdmin: Boolean,
  imageUrl: String

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;