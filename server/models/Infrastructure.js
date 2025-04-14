const mongoose = require('mongoose');

const infrastructureSchema = new mongoose.Schema({
  incubatorName: {
    type: String,
    required: true
  },
  infraId: {
    type: String,
    required: true,
    unique: true
  },
  infraType: {
    type: String,
    required: true
  },
  infraCapacity: {
    type: String,
    required: true
  },
  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Infrastructure', infrastructureSchema); 