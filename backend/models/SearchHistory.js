const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
          user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                    index: true,
          },
          budget: {
                    type: String,
                    required: true,
          },
          numberOfPeople: {
                    type: String,
                    required: true,
          },
          destinationPreference: {
                    type: String,
                    default: '',
          },
          surpriseMe: {
                    type: Boolean,
                    default: false,
          },
          destination: {
                    type: String,
                    default: '',
          },
}, {
          timestamps: true,
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
