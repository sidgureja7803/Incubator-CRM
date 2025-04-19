const mongoose = require('mongoose');

const fundingRoundSchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  round_type: {
    type: String,
    required: true,
    enum: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Grant', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  date: {
    type: Date,
    required: true
  },
  lead_investor: String,
  investors: [{
    name: String,
    website: String,
    investment_amount: Number
  }],
  valuation: Number,
  description: String,
  equity_sold: {
    type: Number,
    min: 0,
    max: 100
  },
  documents: [{
    title: String,
    url: String,
    upload_date: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('FundingRound', fundingRoundSchema); 