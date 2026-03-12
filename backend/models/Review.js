const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  budget: {
    type: String,
    default: '',
  },
  numberOfPeople: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for faster queries
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ destination: 1 });

module.exports = mongoose.model('Review', reviewSchema);
