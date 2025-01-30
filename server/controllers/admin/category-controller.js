const Category = require("../../models/Category.js");

// Fetch all categories
const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Add a parent category
const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return res.status(400).json({ error: "Category already exists" });

    const newCategory = new Category({ name, subcategories: [] });
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Add a subcategory
const addSubcategory = async (req, res) => {
  const { parent, name } = req.body;

  try {
    const category = await Category.findOne({ name: parent });

    if (!category) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    // Ensure subcategory is valid and not duplicated
    if (!name) {
      return res.status(400).json({ error: "Subcategory name is required" });
    }

    if (category.subcategories.includes(name)) {
      return res.status(400).json({ error: "Subcategory already exists" });
    }

    // Push new subcategory
    category.subcategories.push(name);
    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add subcategory" });
  }
};

// Delete a parent category
const deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ name: req.params.name });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// Delete a subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.parent });
    if (!category)
      return res.status(404).json({ error: "Parent category not found" });

    category.subcategories = category.subcategories.filter(
      (sub) => sub !== req.params.sub
    );
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};

module.exports = {
  fetchCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
};
