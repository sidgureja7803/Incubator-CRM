const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  startup_id: {
    type: String,
    required: true,
    unique: true
  },
  startup_name: {
    type: String,
    required: true
  },
  description: String,
  founding_date: Date,
  website: String,
  logo_url: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Terminated'],
    default: 'Active'
  },
  incubator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    required: true
  },
  team_members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  intellectual_properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IntellectualProperty'
  }],
  funding_rounds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingRound'
  }],
  fees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee'
  }],
  updates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Update'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Startup', startupSchema); 