import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for client to enter the app
const enterApp = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    if (!name || !phone) {
      return res.json({ success: false, message: "Please provide name and phone" });
    }

    // Check if user exists by phone
    let user = await userModel.findOne({ phone });

    if (!user) {
      // Create new user
      const newUser = new userModel({
        name,
        phone,
        location,
      });
      user = await newUser.save();
    } else {
      // Optionally update name/location if they changed
      user.name = name;
      user.location = location;
      await user.save();
    }

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (
      phone === process.env.ADMIN_PHONE &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(phone + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { enterApp, adminLogin };
