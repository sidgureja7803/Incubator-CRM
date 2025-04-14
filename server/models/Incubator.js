const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  duration: String,
  startDate: Date,
  endDate: Date,
  capacity: Number,
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'upcoming'
  }
});

const incubatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  logo: String,
  website: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  programs: [programSchema],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Incubator', incubatorSchema); 