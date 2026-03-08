const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
          try {
                    const authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                              return res.status(401).json({ error: 'No token provided' });
                    }

                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    const user = await User.findById(decoded.userId);
                    if (!user) {
                              return res.status(401).json({ error: 'User not found' });
                    }

                    req.user = user;
                    next();
          } catch (error) {
                    return res.status(401).json({ error: 'Invalid token' });
          }
};

// Optional auth - doesn't fail if no token, just sets req.user to null
const optionalAuth = async (req, res, next) => {
          try {
                    const authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                              req.user = null;
                              return next();
                    }

                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    const user = await User.findById(decoded.userId);
                    req.user = user || null;
                    next();
          } catch (error) {
                    req.user = null;
                    next();
          }
};

module.exports = { authMiddleware, optionalAuth };
