const productModel = require("../model/productModel");
const userModel = require("../model/userModel");


// const addProduct=async(req,res)=>{
//     const {name,desc,price,discount,stock,category}=req.body;
//     try {
//         const product=await productModel.create(req.body)    
//         res.status(200).send({success:true,CreatedProduct:product})   
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:"Internal Server Error"})
//     }
// }
const addProduct = async (req, res) => {
    const { name, description, variants, image , category, createdDate,certificate,instructions } = req.body;
  
    try {
      const product = await productModel.create({
        name,
        description,
        variants,
        // stock,
        // rating,
        image,
        // reviews,
        certificate,
        category,
        // numberOfReviews,
        createdDate,
        instructions
      });
  
      res.status(200).send({ success: true, createdProduct: product });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
};



const getSingleProduct=async(req,res)=>{
    const {id}=req.params;
    try {
        const product=await productModel.findById(id);
        if(!product){
            return res.status(400).send({success:false,msg:"Product Not Found"})
        }
        res.status(200).send({success:true,SingleProduct:product})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:"Internal Server Error"})
    }
}



const getAllProduct=async(req,res)=>{
    try {
        const products=await productModel.find();
        if(products.length<1){
            return res.status(400).send({success:false,Message:"No Products"})
        }
        res.status(200).send({success:true,Products:products})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


const deleteProduct=async(req,res)=>{
    const {id}=req.params;
    try {
        const deletedProduct=await productModel.findByIdAndDelete(id);
        res.status(200).send({success:true,Deleted_Product:deletedProduct})
    } catch (error) {
        console.log(error);
        req.status(500).send({success:false,error:error.message})
    }
}



const updateProduct=async(req,res)=>{
    const {id}=req.params;
    try {
        const updatedProduct=await productModel.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).send({success:true,UpdateProduct:updatedProduct})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}

const updatePrice = async (req, res) => {
    const { id } = req.params;
    
    const { variantId, newPrice } = req.body; // Assuming variantId and newPrice are provided in the request body

    try {
        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: id, "variants._id": variantId }, // Find the product by id and variant by variantId
            { $set: { "variants.$.price": newPrice } }, // Update the price of the matched variant
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ success: false, error: "Product or variant not found" });
        }

        res.status(200).send({ success: true, updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
};

const updateDiscount = async (req, res) => {
    const { id } = req.params;
    const { variantId, newDiscount } = req.body; // Assuming variantId and newDiscount are provided in the request body

    console.log("Received request to update discount for productId:", id);
    console.log("VariantId:", variantId);
    console.log("New Discount:", newDiscount);

    try {
        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: id, "variants._id": variantId },
            { $set: { "variants.$.discount": newDiscount } },
            { new: true }
        );

        if (!updatedProduct) {
            console.error("Product or variant not found");
            return res.status(404).send({ success: false, error: "Product or variant not found" });
        }

        console.log("Discount updated successfully:", updatedProduct);
        res.status(200).send({ success: true, updatedProduct });
    } catch (error) {
        console.error("Error updating discount:", error);
        res.status(500).send({ success: false, error: error.message });
    }
};






const deleteReview = async (req, res) => {
    const { productId } = req.params;
    const { reviewId } = req.body;

    try {
        const product = await productModel.findById(productId);
        let reviews = product.reviews;
        product.reviews = reviews.filter(review =>review._id.toString() !== reviewId);
        product.numberOfReviews = product.reviews.length;
        await product.save();
        res.status(200).send({ success: true, new_Reviews: product });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
}









// const reviews=async(req,res)=>{
//     const userId=req.user.userId;
//     const {productId}=req.params;
//     const {comment}=req.body;
//     try {
//         const product=await productModel.findById(productId);

//         console.log(userId);
//         const user=await userModel.findById(userId);
//         const newReviews={
//             userId:userId,
//             name:user.name,
//             // rating:Number(rating),
//             comment:comment
//         }
//         product.reviews.push(newReviews);
//         let totalNumberOfReviews=product.reviews.length;
//         product.numberOfReviews=totalNumberOfReviews;
//         await product.save();

//         res.status(200).send({success:true,Added_Product:product})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:error.message})
//     }
// }




// const addRating=async(req,res)=>{
//     const {rating}=req.body;
//     const {productId}=req.params;
//     try {
//         console.log("hello",productId);
//         const product=await productModel.findById(productId);
//         console.log(product);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:error.message});
//     }
// }



// Add a review to a product
const reviews=async(req, res) => {
  try {
    const { comment, rating } = req.body;
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }

    const userId = req.user.userId; // Assuming you have authentication middleware setting userId in req.user
    const user=await userModel.findById(userId)
    console.log(product.reviews);
    const userReviewIndex = product.reviews.findIndex((review) => review.userId === userId);
    
    const newReview = {
        userId,
        name: user.name, // Assuming you have user information available in req.user
        comment,
        rating: Number(rating)
    };
    console.log(userReviewIndex);

    if (userReviewIndex !== -1) {
      // If user already submitted a review, update it
      product.reviews[userReviewIndex] = newReview;
    } else {
      product.reviews.push(newReview);
    }

    // Calculate new average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / product.reviews.length;
    product.rating = averageRating.toFixed(1);

    // Save the updated product
    await product.save();

    return res.status(200).json({ success: true, msg: 'Review submitted successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
}





const getAllReviews = async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await productModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, msg: 'Product not found' });
      }
  
      return res.status(200).json({ success: true, reviews: product.reviews });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
  };
  
  module.exports = { getAllReviews };
  

// Assuming you already have the required imports and other routes...
const getAllProductsSorted = async (req, res) => {
    try {
        const { sortType } = req.params;

        let sortedProducts = [];

        switch(sortType) {
            case 'newest':
                sortedProducts = await productModel.find().sort({ createdAt: -1 });
                break;
            case 'priceHighToLow':
                sortedProducts = await productModel.find().sort({ price: -1 });
                break;
            case 'priceLowToHigh':
                sortedProducts = await productModel.find().sort({ price: 1 });
                break;
            case 'bestRating':
                sortedProducts = await productModel.find().sort({ rating: -1 });
                break;
            default:
                sortedProducts = await productModel.find();
        }

        res.status(200).json({ success: true, sortedProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};









module.exports={addProduct,getSingleProduct,getAllProduct,getAllProductsSorted,deleteProduct,updateProduct,deleteReview,reviews,getAllReviews,updatePrice,updateDiscount}