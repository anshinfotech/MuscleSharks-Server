const { checkout, paymentVerification } = require("../controllers/paymentControler");
const verifyToken = require("../middleware/userMiddleware");
const router = require('express').Router();

router.post("/checkout", verifyToken,checkout);
router.post("/paymentverification", verifyToken,paymentVerification);

module.exports = router;
