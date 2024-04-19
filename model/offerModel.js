const mongoose = require("mongoose");

const offerScheme = new mongoose.Schema({
  offerImg: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const offerModel = mongoose.model('offers', offerScheme);

module.exports = offerModel
