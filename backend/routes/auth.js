const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
          return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
          try {
                    const { email, password, full_name } = req.body;

                    if (!email || !password) {
                              return res.status(400).json({ error: 'Email and password are required' });
                    }

                    if (password.length < 6) {
                              return res.status(400).json({ error: 'Password must be at least 6 characters' });
                    }

                    // Check if user already exists
                    const existingUser = await User.findOne({ email: email.toLowerCase() });
                    if (existingUser) {
                              return res.status(400).json({ error: 'Email already registered' });
                    }

                    // Create user
                    const user = new User({
                              email: email.toLowerCase(),
                              password,
                              full_name: full_name || '',
                    });
                    await user.save();

                    // Generate token
                    const token = generateToken(user._id);

                    res.status(201).json({
                              user: user.toJSON(),
                              token,
                              message: 'Account created successfully',
                    });
          } catch (error) {
                    console.error('Signup error:', error.message);
                    console.error('Signup error name:', error.name);
                    console.error('Signup error stack:', error.stack);
                    res.status(500).json({ error: 'Failed to create account: ' + error.message });
          }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
          try {
                    const { email, password } = req.body;

                    if (!email || !password) {
                              return res.status(400).json({ error: 'Email and password are required' });
                    }

                    // Find user
                    const user = await User.findOne({ email: email.toLowerCase() });
                    if (!user) {
                              return res.status(401).json({ error: 'Invalid email or password' });
                    }

                    // Check password
                    const isMatch = await user.comparePassword(password);
                    if (!isMatch) {
                              return res.status(401).json({ error: 'Invalid email or password' });
                    }

                    // Generate token
                    const token = generateToken(user._id);

                    res.json({
                              user: user.toJSON(),
                              token,
                              message: 'Logged in successfully',
                    });
          } catch (error) {
                    console.error('Login error:', error);
                    res.status(500).json({ error: 'Failed to log in' });
          }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req, res) => {
          res.json({ user: req.user.toJSON() });
});

// POST /api/auth/signout
router.post('/signout', (req, res) => {
          // JWT is stateless, so we just return success
          // Client should delete the token
          res.json({ message: 'Signed out successfully' });
});

module.exports = router;
