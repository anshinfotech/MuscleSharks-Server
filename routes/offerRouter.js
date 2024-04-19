const router =require("express").Router();

const { createOffer, deleteOffer, allOffer } = require("../controllers/offerController");
const verifyAdminToken = require("../middleware/adminMiddleware");


router.post("/make-offer",verifyAdminToken,createOffer);
// router.post("/apply-coupon",applyCoupon);
router.delete("/delete-offer/:id",verifyAdminToken,deleteOffer);
router.get("/allOffers", allOffer);



module.exports=router