const router=require("express").Router();
const { addProduct, getSingleProduct, getAllProduct, deleteProduct, updateProduct, reviews, deleteReview, addRating, getAllReviews, getAllProductsSorted, updatePrice, updateDiscount} = require("../controllers/productController");
const verifyToken = require("../middleware/userMiddleware");



router.post("/addProduct",addProduct);
router.get("/getProduct/:id",getSingleProduct);
router.get("/getAllProduct",);
router.get("/getAllProducts",getAllProduct);
router.delete("/deleteProduct/:id",deleteProduct);
router.put("/updateProduct/:id",updateProduct)
router.put("/updatePrice/:id",updatePrice)
router.put("/updateDiscount/:id",updateDiscount)
router.post("/review/:productId",verifyToken,reviews)
router.delete("/deleteReview/:productId",deleteReview);
router.get("/getReview/:productId",getAllReviews);
router.get('/products/sort/:sortType', getAllProductsSorted);
// router.post("/addRating/:productId",verifyToken,addRating);

module.exports=router;