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
const offerRouter = require("./routes/offerRouter");

dbConnection();
app.use(
  cors({
    credentials: true,
    origin: "https://www.musclesharks.in",
  })
);
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://www.musclesharks.in"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());
app.use(express.json());


app.use("/api", userRouter);
app.use("/api", productRoutes);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", adminRouter);
app.use("/api", couponRouter);
app.use("/api", offerRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on PORT ${process.env.PORT} ........`)
);
