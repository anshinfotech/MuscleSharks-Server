// const mongoose = require('mongoose');

// // Define the Coupon Schema
// const couponSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   discountAmount: {
//     type: Number,
//     required: true
//   },
//   expiryDate: {
//     type: Date,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Create the Coupon model
// const couponModel = mongoose.model('Coupon', couponSchema);

// module.exports = couponModel;




const mongoose = require('mongoose');

// Define the Coupon Schema
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountAmount: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  active: {  // Added field for coupon activation status
    type: Boolean,
    default: true // Assuming coupons are active by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Coupon model
const couponModel = mongoose.model('Coupon', couponSchema);

module.exports = couponModel;
