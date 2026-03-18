const jwt = require("jsonwebtoken");
const User = require("./user.model");
const { env } = require("../../config/env");

async function register({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    token
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || user.provider !== 'email') {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    token
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

module.exports = {
  register,
  login,
  generateToken
};
