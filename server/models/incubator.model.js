const mongoose = require('mongoose');

const incubatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: String,
  website: String,
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: String
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: String
  },
  established: Date,
  focus_areas: [{
    type: String
  }],
  services_offered: [{
    type: String
  }],
  metrics: {
    startups_incubated: {
      type: Number,
      default: 0
    },
    success_rate: {
      type: Number,
      default: 0
    },
    funding_raised: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Incubator', incubatorSchema); 