const mongoose = require('mongoose');

const intellectualPropertySchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Other']
  },
  application_number: String,
  filing_date: Date,
  status: {
    type: String,
    enum: ['Pending', 'Granted', 'Rejected', 'Abandoned'],
    default: 'Pending'
  },
  grant_date: Date,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('IntellectualProperty', intellectualPropertySchema); 