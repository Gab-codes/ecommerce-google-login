const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be a valid non-empty string.",
      });
    }

    const regEx = new RegExp(keyword.trim(), "i"); 
    
    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { product: regEx },
      ],
    };

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const searchResults = await Product.find(createSearchQuery)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: searchResults,
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalResults: await Product.countDocuments(createSearchQuery), 
      },
    });
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for products.",
    });
  }
};

module.exports = { searchProducts };
