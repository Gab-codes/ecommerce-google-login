const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    const skip = (pageInt - 1) * limitInt;

    const orders = await Order.find({})
      .sort({ orderDate: -1 }) 
      .skip(skip) 
      .limit(limitInt); 

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitInt),
      currentPage: pageInt,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};



const getOrderDetailsForAdmin = async (req, res) => {
 try {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
   return res.status(404).json({
    success: false,
    message: "Order not found!",
   });
  }

  res.status(200).json({
   success: true,
   data: order,
  });
 } catch (e) {
  console.log(e);
  res.status(500).json({
   success: false,
   message: "Some error occurred!",
  });
 }
};

const updateOrderStatus = async (req, res) => {
 try {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findById(id);

  if (!order) {
   return res.status(404).json({
    success: false,
    message: "Order not found!",
   });
  }

  await Order.findByIdAndUpdate(id, { orderStatus });

  res.status(200).json({
   success: true,
   message: "Order status is updated successfully!",
  });
 } catch (e) {
  console.log(e);
  res.status(500).json({
   success: false,
   message: "Some error occurred!",
  });
 }
};

module.exports = {
 getAllOrdersOfAllUsers,
 getOrderDetailsForAdmin,
 updateOrderStatus,
};
