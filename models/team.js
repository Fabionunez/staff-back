const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teamSchema = new Schema({
  name: String,
  usersIds: [{ type: Schema.Types.ObjectId, ref:"User"}],
  teamLeaderid: String,
  companyId: String, /*{type: Schema.Types.ObjectId, ref:"Company"},*/
  mission: String,
  vision: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;