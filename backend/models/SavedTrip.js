const mongoose = require('mongoose');

const savedTripSchema = new mongoose.Schema({
          user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
          },
          destination: {
                    type: String,
                    required: true,
          },
          budget: {
                    type: String,
                    required: true,
          },
          number_of_people: {
                    type: String,
                    required: true,
          },
          trip_data: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true,
          },
          is_favorite: {
                    type: Boolean,
                    default: false,
          },
}, {
          timestamps: true,
});

module.exports = mongoose.model('SavedTrip', savedTripSchema);
