const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  logo: String,
  website: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  industry: String,
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'early', 'growth', 'mature'],
    default: 'idea'
  },
  foundingDate: Date,
  teamSize: Number,
  applications: [{
    incubator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incubator'
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    fundingRequired: Number,
    productDescription: String,
    impact: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Startup', startupSchema); 