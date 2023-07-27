const mongoose = require('mongoose');

const dispenserSchema = new mongoose.Schema({
  flow_volume: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'closed',
  },
  openTime: Date,
  closeTime: Date,
  drink_name: {
    type: String,
  
  },
  tank_size: {
    type: Number,
    min: 0,
  },
  remaining: {
    type: Number,
    min: 0,
  }
});

const Dispenser = mongoose.model('Dispenser', dispenserSchema);

module.exports = Dispenser;
