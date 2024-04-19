require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// console.log(process.env.RAZORPAY_API_KEY);
// console.log(process.env.RAZORPAY_API_SECRET);

const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const order = await instance.orders.create(options);
    console.log(order);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const text = razorpay_order_id + "|" + razorpay_payment_id;
  const secret = process.env.RAZORPAY_API_SECRET;
  console.log(process.env.RAZORPAY_API_SECRET);

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      res.redirect(
        `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } catch (error) {
      res.json(error);
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

module.exports = { checkout, paymentVerification };
