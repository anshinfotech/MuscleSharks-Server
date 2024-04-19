const {addCart, deleteCart, updateCart, getCart, getSingleProduct} = require("../controllers/cartController");
const verifyToken = require("../middleware/userMiddleware");

const router =require("express").Router()

router.post("/addCart",verifyToken,addCart);
router.delete("/cart/deleteProduct/:variantId",verifyToken, deleteCart);
router.put("/cart-update",verifyToken,updateCart);
router.get("/getCart",verifyToken,getCart)
router.get("/cart/product-details",getSingleProduct)

module.exports=router;