const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./../model/User");

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    console.error("Error hashing password", err);
    process.exit(1);
  }
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        isVerified: false,
        msg: "Please enter username and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        isVerified: false,
        msg: `User already exists with username ${email}`,
      });
    }

    const hashedPassword = await securePassword(password);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const accessToken = newUser.generateAccessToken(secretKey);
    res.status(201).json({
      isVerified: true,
      msg: "User created successfully",
      accessToken,
    });
  } catch (err) {
    console.error("Error in signup", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        isVerified: false,
        msg: "Please fill all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        isVerified: false,
        msg: "User does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        isVerified: false,
        msg: "Password is incorrect",
      });
    }

    const accessToken = user.generateAccessToken(secretKey);
    res.status(200).json({
      isVerified: true,
      msg: "User is verified",
      token: accessToken,
    });
  } catch (err) {
    console.error("Error logging in user", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { signup, login };
