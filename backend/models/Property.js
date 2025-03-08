const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyAddress: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  propertyAmt: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema); 