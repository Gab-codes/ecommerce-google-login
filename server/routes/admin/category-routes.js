const express = require("express");

const {
  fetchCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
} = require("../../controllers/admin/category-controller");

const router = express.Router();

router.get("/", fetchCategories);
router.post("/", addCategory);
router.post("/subcategory", addSubcategory);
router.delete("/:name", deleteCategory);
router.delete("/:parent/subcategory/:sub", deleteSubcategory);

module.exports = router;
