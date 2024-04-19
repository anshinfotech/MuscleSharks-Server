const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product's Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Product's Description is Required"],
  },
  variants: [
    {
      price: {
        type: Number,
        required: [true, "Variant's Price is Required"],
      },
      unit: {
        type: String,
        required: [true, "Variant's Weight (lbs) is Required"],
      },
      quantity: {
        type: Number,
        required: [true, "Variant's Quantity is Required"],
      },
      discount:{
        type:Number,
        required:[true,"Variant's Discount is Required"]
      },
      stock: {
        type: Number,
        default: 1,
      }
      // Add more variant properties if needed
    }
  ],
  rating: {
    type: Number,
    default: 0,
  },
  image: [],
  certificate:{
    type :String ,
    // required : true
  },
  instructions:String,
  reviews: [
    {
      userId: {
        type: String,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Category is Required"],
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const productModel = new mongoose.model("Product", productSchema);

module.exports = productModel;
