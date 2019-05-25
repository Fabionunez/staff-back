const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: String, //mail
  password: String,
  name: String,
  surname: String,
  title: String,
  companyPhone: String,
  dateStart: String,
  birthDate: String,
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
  managerID: String,
  companyID: String,
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