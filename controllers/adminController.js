const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// One-time registration
exports.register = async (req, res) => {
  const existing = await Admin.findOne();
  if (existing) return res.status(403).json({ message: "Admin already exists" });

  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hashed });
  res.json({ message: "Admin created", admin });
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};
