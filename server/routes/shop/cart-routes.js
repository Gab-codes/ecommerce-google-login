const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:id", fetchCartItems);
router.put("/update-cart", updateCartItemQty);
router.delete("/:id/:productId", deleteCartItem);

module.exports = router;
