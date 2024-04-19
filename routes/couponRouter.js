const router =require("express").Router();
const { createCoupon, applyCoupon, deleteCoupon, allCoupon } = require("../controllers/couponController");
const verifyAdminToken = require("../middleware/adminMiddleware");


router.post("/make-coupon",verifyAdminToken,createCoupon);
router.post("/apply-coupon",applyCoupon);
router.delete("/delete-coupon/:id",verifyAdminToken,deleteCoupon);
router.get("/allCoupons", allCoupon);



module.exports=router