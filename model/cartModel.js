// const mongoose =require("mongoose");

// const productSchema = new mongoose.Schema({
//     productId:String,
//     quantity: {type:Number, default:1}
// })

// const cartSchema=new mongoose.Schema({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         required:true
//     },
//     items:[Object]
// })


// const cartModel=new mongoose.model("Cart",cartSchema);

// module.exports=cartModel;










const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  },
  selectedVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product.variants"
  }
});

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  items: [cartItemSchema]
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
