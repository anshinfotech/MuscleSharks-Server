const {makeAnOrder, statusUpdate, cancelOrder, deleteOrder, getAllOrders, getSingleOrder, getAllOrdersOfUser, makeAnOrderOnline} = require("../controllers/orderController");
const verifyToken = require("../middleware/userMiddleware");

const router=require("express").Router();


router.post("/orderNow",verifyToken,makeAnOrder);
router.post("/orderOnline",verifyToken,makeAnOrderOnline);
router.post("/order-status/:orderId",statusUpdate);
router.get("/cancel-order/:orderId",cancelOrder);
router.get("/allOrders",getAllOrders);
router.get("/getOrder/:id",getSingleOrder);
router.get("/getAllOrdersUser",verifyToken,getAllOrdersOfUser)
// router.put("/updateOrder",updateOrder);
router.delete("/delete-order/:orderId",deleteOrder);


module.exports=router;