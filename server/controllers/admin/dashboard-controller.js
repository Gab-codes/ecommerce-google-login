const Product = require("../../models/Product");
const Order = require("../../models/Order");

const getAdminDashboardMetrics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({});
    
    const totalProductsSold = orders
      .filter(order => order.orderStatus === "delivered") 
      .reduce((acc, order) => {
        return acc + order.cartItems.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
      }, 0);
    
    const totalRevenue = orders
      .filter(order => order.orderStatus === "delivered")
      .reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalProductsSold,
        totalRevenue,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard metrics",
    });
  }
};

module.exports = { getAdminDashboardMetrics };
