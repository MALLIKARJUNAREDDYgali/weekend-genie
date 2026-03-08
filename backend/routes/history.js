const express = require('express');
const SearchHistory = require('../models/SearchHistory');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/history - Get search history for logged-in user
router.get('/', authMiddleware, async (req, res) => {
          try {
                    const history = await SearchHistory.find({ user_id: req.user._id })
                              .sort({ createdAt: -1 })
                              .limit(20);

                    res.json(history);
          } catch (error) {
                    console.error('Error fetching search history:', error);
                    res.status(500).json({ error: 'Failed to fetch search history' });
          }
});

// POST /api/history - Save a new search to history
router.post('/', authMiddleware, async (req, res) => {
          try {
                    const { budget, numberOfPeople, destinationPreference, surpriseMe, destination } = req.body;

                    const historyItem = new SearchHistory({
                              user_id: req.user._id,
                              budget,
                              numberOfPeople,
                              destinationPreference: destinationPreference || '',
                              surpriseMe: surpriseMe || false,
                              destination: destination || '',
                    });
                    await historyItem.save();

                    res.status(201).json(historyItem);
          } catch (error) {
                    console.error('Error saving search history:', error);
                    res.status(500).json({ error: 'Failed to save search history' });
          }
});

// DELETE /api/history/:id - Delete a single history item
router.delete('/:id', authMiddleware, async (req, res) => {
          try {
                    const item = await SearchHistory.findOneAndDelete({
                              _id: req.params.id,
                              user_id: req.user._id,
                    });

                    if (!item) {
                              return res.status(404).json({ error: 'History item not found' });
                    }

                    res.json({ message: 'History item deleted' });
          } catch (error) {
                    console.error('Error deleting history item:', error);
                    res.status(500).json({ error: 'Failed to delete history item' });
          }
});

// DELETE /api/history - Clear all history for the user
router.delete('/', authMiddleware, async (req, res) => {
          try {
                    await SearchHistory.deleteMany({ user_id: req.user._id });
                    res.json({ message: 'All history cleared' });
          } catch (error) {
                    console.error('Error clearing history:', error);
                    res.status(500).json({ error: 'Failed to clear history' });
          }
});

module.exports = router;
