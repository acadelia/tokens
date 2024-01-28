import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import {
  signUpBodyValidation,
  logInBodyValidation,
} from "../utils/validationSchema.js";

const router = Router();

// signup
router.post("/signUp", async (req, res) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: true, message: "User with given email already exists" });
    }

    // Determine if the user should have the "admin" role
    const isAdminUser = isAdmin(req.body.email);

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user instance with the "admin" role if applicable
    const newUser = new User({
      ...req.body,
      password: hashPassword,
      roles: isAdminUser ? ["user", "admin"] : ["user"],
    });

    await newUser.save();

    res
      .status(201)
      .json({ error: false, message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Function to determine if the user should have the "admin" role
function isAdmin(email) {
  // Implement your logic to determine if the user should have the "admin" role
  // For example, you might check if the email matches a predefined admin email
  const adminEmails = ["admin@example.com", "another_admin@example.com"];
  return adminEmails.includes(email.toLowerCase());
}

// login
router.post("/logIn", async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Logged in sucessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
