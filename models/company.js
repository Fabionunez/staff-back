const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const companySchema = new Schema({
  tradeName: String,
  corporateName: String,
  taxIdNumber: String,
  address: String,
  city: String,
  postalCode: Number,
  province: String,
  country: String,
  userAdminId: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;