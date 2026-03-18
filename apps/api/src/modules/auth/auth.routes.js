const express = require("express");
const { register, login } = require("./auth.service");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await register({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    const result = await login({ email, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = { authRouter: router };
