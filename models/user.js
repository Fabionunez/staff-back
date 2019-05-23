const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: String, //mail
  password: String,
  name: String,
  surname: String,
  title: String,
  companyPhone: Number,
  dateStart: Date,
  birthDate: Date,
  gender: String,
  nationality: String,
  phone: Number,
  photo: String,
  identificationNumber: String,
  socialSecurityNumber: Number,
  address: String,
  city: String,
  postalCode: Number,
  state: String,
  country: String,
  emergencyContact: String,
  emergencyPhone: Number,
  managerID: String,
  companyID: String,
  isAdmin: Boolean
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;