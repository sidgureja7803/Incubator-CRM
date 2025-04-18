const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  profile_picture: String,
  bio: String,
  email: String,
  phone: String,
  linkedin: String,
  twitter: String,
  github: String,
  website: String,
  education: [{
    institution: String,
    degree: String,
    field: String,
    start_year: Number,
    end_year: Number
  }],
  work_experience: [{
    company: String,
    role: String,
    start_date: Date,
    end_date: Date,
    description: String
  }],
  skills: [String],
  is_founder: {
    type: Boolean,
    default: false
  },
  equity_percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  joining_date: Date,
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema); 