const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Employee = require("../models/employee");
// console.log(Employee);

const JWT_SECRET = "firstProject1729";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      role,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});


router.post("/login", async (req, res) => {
  try {
      const { email, password, role } = req.body;

      let user;

      if (role === "admin") {
        user = await User.findOne({ email });
      }else if (role === "employee") {
        user = await Employee.findOne({ email });
      }else {
        return res.status(400).json({ message: "Invalid role" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔥 IMPORTANT ROLE VERIFICATION
      if (user.role !== role) {
        return res.status(403).json({ message: "Role mismatch" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7h" }
    );
    console.log("its is coming up to here : auth.js");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" ,err});
  }
});

router.post("/logout", (req, res) => {
  // JWT logout = frontend simply deletes token
  res.status(200).json({ message: "Logout successful (client-side token removed)" });
});

module.exports = router;
