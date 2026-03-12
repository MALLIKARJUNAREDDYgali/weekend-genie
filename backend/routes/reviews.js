const express = require('express');
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — Submit a new review (authenticated)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { destination, rating, comment, budget, numberOfPeople } = req.body;

    if (!destination || !rating || !comment) {
      return res.status(400).json({ error: 'Destination, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      userId: req.user._id,
      userName: req.user.full_name || req.user.email.split('@')[0],
      destination,
      rating: Math.round(rating),
      comment: comment.substring(0, 500),
      budget: budget || '',
      numberOfPeople: numberOfPeople || '',
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// GET /api/reviews — Get all reviews (public, newest first)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, destination } = req.query;
    const query = destination ? { destination: new RegExp(destination, 'i') } : {};

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/stats — Get aggregate stats
router.get('/stats', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      totalReviews,
      averageRating: avgRating.length > 0 ? Math.round(avgRating[0].avgRating * 10) / 10 : 0,
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

// DELETE /api/reviews/:id — Delete own review (authenticated)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
