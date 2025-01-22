const User = require("../../models/User");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    const skip = (pageInt - 1) * limitInt;

    const users = await User.find({}).skip(skip).limit(limitInt);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitInt),
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

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await User.findByIdAndUpdate(id, { role });

    res.status(200).json({
      success: true,
      message: "User role updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
