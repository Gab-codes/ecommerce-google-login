const express = require("express");

const {
  getColors,
  addColor,
  deleteColor,
} = require("../../controllers/admin/color-controller");

const router = express.Router();

router.get("/", getColors);
router.post("/add", addColor);
router.delete("/delete/:id", deleteColor);

module.exports = router;
