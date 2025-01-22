const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = "data:" + file.mimetype + ";base64," + b64;
      const result = await imageUploadUtil(url);
      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during image upload.",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      images,
      title,
      description,
      category,
      product,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newlyCreatedProduct = new Product({
      images,
      title,
      description,
      category,
      product,
      price,
      salePrice,
      totalStock,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const totalProducts = await Product.countDocuments({});
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      images,
      title,
      description,
      category,
      product,
      price,
      salePrice,
      totalStock,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.product = product || findProduct.product;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.images = images || findProduct.images;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
