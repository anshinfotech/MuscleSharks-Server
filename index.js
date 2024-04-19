require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const userRouter = require("./routes/userRouter");
const productRoutes = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRouter");
const couponRouter = require("./routes/couponRouter");
const cartRouter = require("./routes/cartRouter");
const adminRouter = require("./routes/adminRouter");
const paymentRouter = require("./routes/paymentRoute");
const offerRouter = require("./routes/offerRouter");
const Razorpay = require("razorpay");

dbConnection();

app.use(
  cors({
    credentials: true,
    origin: "https://muscle-sharks-client.vercel.app/",
  })
);

app.use(cookieParser());
app.use(express.json());


app.use("/api", userRouter);
app.use("/api", productRoutes);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", adminRouter);
app.use("/api", couponRouter);
app.use("/api", paymentRouter);
app.use("/api", offerRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on PORT ${process.env.PORT} ........`)
);
