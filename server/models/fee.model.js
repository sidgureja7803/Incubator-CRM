const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Regular Fee', 'One-time Fee', 'Service Fee', 'Other']
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'one-time'],
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  payment_date: Date,
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema); 