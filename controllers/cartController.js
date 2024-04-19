const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");

const addCart = async (req, res) => {
    const { productId, quantity, selectedVariantId } = req.body;

    try {
        let cart = await cartModel.findOne({ user: req.user.userId });

        if (!cart) {
            cart = new cartModel({ user: req.user.userId, items: [] });
        }

        const existProduct = cart.items.find(item => item.product.toString() === productId.toString());

        if (!existProduct) {
            cart.items.push({ product: productId, quantity, selectedVariant: selectedVariantId });
        }

        const finalCart = await cart.save();

        res.status(200).send({ success: true, cart: finalCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
}


const getCart = async (req, res) => {
    try {
      const cart = await cartModel.findOne({ user: req.user.userId });
  
      if (!cart) {
        return res.status(404).send({ success: false, message: "Cart not found" });
      }
  
      const productPromises = cart.items.map(async (item) => {
        try {
          const product = await productModel.findById(item.product);
  
          // Add a check for product existence and its variants property
          if (product && product.variants) {
            let selectedVariantDetails = null;
            if (item.selectedVariant) {
              const selectedVariant = product.variants.find(v => v._id.toString() === item.selectedVariant.toString());
              selectedVariantDetails = selectedVariant;
            }
  
            return {
              name: product.name,
              image: product.image,
              productId: product._id.toString(),
              variantId: selectedVariantDetails ? selectedVariantDetails._id.toString() : null,
              selectedVariantDetails: selectedVariantDetails,
              quantity: item.quantity,
            };
          } else {
            // Handle the case where product or its variants are null or undefined
            return {
              name: "Product Name Unavailable",
              image: "Image Unavailable",
              productId: "Product ID Unavailable",
              variantId: null,
              selectedVariantDetails: null,
              quantity: item.quantity,
            };
          }
        } catch (productError) {
          // Handle errors in fetching product details
          console.log(productError);
          return {
            name: "Product Name Unavailable",
            image: "Image Unavailable",
            productId: "Product ID Unavailable",
            variantId: null,
            selectedVariantDetails: null,
            quantity: item.quantity,
          };
        }
      });
  
      const products = await Promise.all(productPromises);
      console.log(products);
  
      res.status(200).send({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error: error.message });
    }
  };
  







  



// const deleteCart=async(req,res)=>{
//     const {productId}=req.params;
//     // const {userId}=req.user.userId;
//     console.log(productId);
//     try {
//         const cart=await cartModel.findOne({user:req.user.userId})
        
//         if(!cart){
//             return res.status(401).send({success:false,error:"Empty Cart"})
//         }
//         console.log(cart.items);

//         const cartProduct=cart.items.filter(item=>item.product.toString()!==productId);
//         console.log(cartProduct);

//         cart.items=cartProduct;

//         const updatedCart=await cart.save();
//         res.status(200).send({success:true,CART:updatedCart})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:error.message});
//     }
// }





const deleteCart = async (req, res) => {
    const { variantId } = req.params;

    try {
        const cart = await cartModel.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(401).send({ success: false, error: "Empty Cart" });
        }

        console.log(cart.items[0].selectedVariant.toString(),variantId); 
        const updatedItems = cart.items.filter(item => item.selectedVariant.toString() !== variantId);

        if (updatedItems.length === cart.items.length) {
            return res.status(404).send({ success: false, message: "Item not found in cart" });
        }

        cart.items = updatedItems;

        const updatedCart = await cart.save();
        res.status(200).send({ success: true, CART: updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

  






const updateCart = async (req, res) => {
    const { variantId } = req.query;
    const { quantity } = req.body || 1;

    try {
        const cart = await cartModel.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(401).send({ success: false, error: "Cart is Empty" });
        }

        const getProduct = cart.items.find((item) => item.selectedVariant && item.selectedVariant.toString() === variantId);

        if (!getProduct) {
            return res.status(404).send({ success: false, error: "Variant not found in cart" });
        }

        getProduct.quantity = quantity;

        const productIndex = cart.items.findIndex((item) => item.selectedVariant && item.selectedVariant.toString() === variantId);

        cart.items.splice(productIndex, 1, getProduct);

        const updatedCart = await cart.save();

        res.status(200).send({ success: true, updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
    }
}





const getSingleProduct=async(req,res)=>{
    const {userId} =req.params;
    const productId=req.query.id;
    try {
        const cart=await cartModel.findOne({user:userId});
        const getProduct=cart.items.filter((item)=>item.product===productId);
        if(!getProduct)return res.status(400).send({success:false,error:"Product Not Found"});

        const productDetails=await productModel.findById(productId);
        res.status(200).send({success:true,SingleProduct:productDetails})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message});
    }
}

module.exports={addCart,deleteCart,updateCart,getCart,getSingleProduct};













// const cartModel = require("../model/cartModel");
// const productModel = require("../model/productModel");

// const addCart = async (req, res) => {
//   const { productId, quantity, selectedVariantId } = req.body;

//   try {
//     let cart = await cartModel.findOne({ user: req.user.userId });

//     if (!cart) {
//       cart = new cartModel({ user: req.user.userId, items: [] });
//     }

//     const existProducts = cart.items.filter(
//       (item) =>
//         item.product.toString() === productId &&
//         (!selectedVariantId || item.selectedVariant.toString() === selectedVariantId)
//     );

//     if (existProducts.length < 1) {
//       cart.items.push({
//         product: productId,
//         quantity,
//         selectedVariant: selectedVariantId
//       });
//     }

//     const finalCart = await cart.save();
//     res.status(200).send({ success: true, cart: finalCart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// };

// const getCart = async (req, res) => {
//   try {
//     const cart = await cartModel.findOne({ user: req.user.userId });

//     if (!cart) {
//       return res.status(404).send({ success: false, message: "Cart not found" });
//     }

//     const productPromises = cart.items.map(async (item) => {
//       const product = await productModel.findById(item.product);

//       if (item.selectedVariant) {
//         const variant = product.variants.find(v => v._id.toString() === item.selectedVariant.toString());
//         return { ...product.toObject(), quantity: item.quantity, selectedVariant: variant };
//       }

//       return { ...product.toObject(), quantity: item.quantity };
//     });

//     const products = await Promise.all(productPromises);

//     res.status(200).send({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// };

// const deleteCart = async (req, res) => {
//   const { productId, selectedVariantId } = req.params;

//   try {
//     const cart = await cartModel.findOne({ user: req.user.userId });

//     if (!cart) {
//       return res.status(401).send({ success: false, error: "Empty Cart" });
//     }

//     const cartProduct = cart.items.filter((item) => {
//       const isProductMatch = item.product.toString() === productId;
//       const isVariantMatch = !selectedVariantId || (item.selectedVariant && item.selectedVariant.toString() === selectedVariantId);

//       return isProductMatch && isVariantMatch;
//     });

//     cart.items = cartProduct;

//     const updatedCart = await cart.save();
//     res.status(200).send({ success: true, CART: updatedCart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// };

// const updateCart = async (req, res) => {
//   const { productId, selectedVariantId } = req.params;
//   const { quantity } = req.body || 1;

//   try {
//     const cart = await cartModel.findOne({ user: req.user.userId });

//     if (!cart) {
//       return res.status(401).send({ success: false, error: "Cart is Empty" });
//     }

//     const getProduct = cart.items.find((item) =>
//       item.product.toString() === productId &&
//       (!selectedVariantId || (item.selectedVariant && item.selectedVariant.toString() === selectedVariantId))
//     );

//     if (!getProduct) {
//       return res.status(404).send({ success: false, message: "Product not found in cart" });
//     }

//     getProduct.quantity = quantity;

//     const productIndex = cart.items.findIndex(item => 
//       item.product.toString() === productId &&
//       (!selectedVariantId || (item.selectedVariant && item.selectedVariant.toString() === selectedVariantId))
//     );
    
//     cart.items.splice(productIndex, 1, getProduct);

//     const updatedCart = await cart.save();
//     res.status(200).send({ success: true, updatedCart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// };


// const getSingleProduct=async(req,res)=>{
//     const {userId} =req.params;
//     const productId=req.query.id;
//     try {
//         const cart=await cartModel.findOne({user:userId});
//         const getProduct=cart.items.filter((item)=>item.product===productId);
//         if(!getProduct)return res.status(400).send({success:false,error:"Product Not Found"});

//         const productDetails=await productModel.findById(productId);
//         res.status(200).send({success:true,SingleProduct:productDetails})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:error.message});
//     }
// }




// module.exports = { addCart, deleteCart, updateCart, getCart ,getSingleProduct };
