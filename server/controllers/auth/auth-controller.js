const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Cart = require("../../models/Cart");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User already exists with the same email!",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Sorry, an error occured",
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password, guestId } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User does not exist! Please register",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    let userCart;

    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      if (guestCart) {
        userCart = await Cart.findOne({ userId: checkUser._id });
        if (!userCart) {
          userCart = new Cart({ userId: checkUser._id, items: [] });
        }

        guestCart.items.forEach((guestItem) => {
          const existingItemIndex = userCart.items.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString()
          );

          if (existingItemIndex > -1) {
            userCart.items[existingItemIndex].quantity += guestItem.quantity;
          } else {
            userCart.items.push(guestItem);
          }
        });

        await userCart.save();
        await Cart.deleteOne({ guestId });
      }
    } else {
      userCart =
        (await Cart.findOne({ userId: checkUser._id })) ||
        new Cart({ userId: checkUser._id, items: [] });
    }

    res.cookie("token", token, { httpOnly: true, secure: true }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
      cart: userCart ? userCart.items : [],
    });

    // res.status(200).json({
    //   success: true,
    //   message: "Logged in successfully",
    //   token,
    //   user: {
    //     email: checkUser.email,
    //     role: checkUser.role,
    //     id: checkUser._id,
    //     userName: checkUser.userName,
    //   },
    // });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Sorry, an error occurred",
    });
  }
};

// login with google
const loginWithGoogle = async (req, res) => {
  const { googleToken, guestId } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Google token" });
    }

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        userName: name,
        googleId: sub,
        role: "user",
        password: null,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    let userCart;

    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      if (guestCart) {
        userCart = await Cart.findOne({ userId: user._id });
        if (!userCart) {
          userCart = new Cart({ userId: user._id, items: [] });
        }

        guestCart.items.forEach((guestItem) => {
          const existingItemIndex = userCart.items.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString()
          );

          if (existingItemIndex > -1) {
            userCart.items[existingItemIndex].quantity += guestItem.quantity;
          } else {
            userCart.items.push(guestItem);
          }
        });

        await userCart.save();
        await Cart.deleteOne({ guestId });
      }
    } else {
      userCart =
        (await Cart.findOne({ userId: user._id })) ||
        new Cart({ userId: user._id, items: [] });
    }

    res.cookie("token", jwtToken, { httpOnly: true, secure: true }).json({
      success: true,
      message: "Logged in successfully via Google",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
      },
      cart: userCart ? userCart.items : [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Sorry, an error occurred during Google login",
    });
  }
};

// logout
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(200)
        .json({ success: true, message: "Already logged out" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.email) {
      return res
        .status(200)
        .json({ success: true, message: "Already logged out" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user?.googleId) {
      return res
        .status(200)
        .json({ success: true, message: "Already logged out" });
    }

    res
      .clearCookie("token")
      .json({ success: true, message: "Successfully signed out" });
  } catch (error) {
    console.error("Server-side Google Sign-Out Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during sign-out.",
    });
  }
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthenticated user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthenticated user!",
//     });

//   try {
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorised user!",
//     });
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  loginWithGoogle,
};
