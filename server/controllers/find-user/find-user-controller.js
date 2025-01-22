const User = require("../../models/User");

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id, "userName");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userName: user.userName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserById };
