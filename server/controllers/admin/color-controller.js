const Color = require("../../models/Color.js");

const addColor = async (req, res) => {
  try {
    const { name, value } = req.body;

    const existingColor = await Color.findOne({ name });
    if (existingColor) {
      return res.status(400).json({ message: "Color already exists" });
    }

    const newColor = new Color({ name, value });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    await Color.findByIdAndDelete(id);

    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addColor, deleteColor, getColors };
