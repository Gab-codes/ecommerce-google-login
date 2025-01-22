require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const usersRouter = require("./routes/find-user/find-user-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRoute = require("./routes/admin/order-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopcartRouter = require("./routes/shop/cart-routes");
const ShopAddresstRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const adminAdashboardRouter = require("./routes/admin/dashboard-routes");
const allUsersRouter = require("./routes/admin/users-routes");

//create a database connection.
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/admin/dashboard", adminAdashboardRouter);
app.use("/api/admin/users", allUsersRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopcartRouter);
app.use("/api/shop/address", ShopAddresstRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
