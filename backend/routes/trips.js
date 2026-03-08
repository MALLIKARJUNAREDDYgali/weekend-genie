const express = require('express');
const SavedTrip = require('../models/SavedTrip');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/trips - Get all saved trips for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
          try {
                    const trips = await SavedTrip.find({ user_id: req.user._id })
                              .sort({ createdAt: -1 });
                    res.json(trips);
          } catch (error) {
                    console.error('Error fetching trips:', error);
                    res.status(500).json({ error: 'Failed to fetch trips' });
          }
});

// POST /api/trips - Save a new trip
router.post('/', authMiddleware, async (req, res) => {
          try {
                    const { destination, budget, number_of_people, trip_data } = req.body;

                    const trip = new SavedTrip({
                              user_id: req.user._id,
                              destination,
                              budget,
                              number_of_people,
                              trip_data,
                    });
                    await trip.save();

                    res.status(201).json(trip);
          } catch (error) {
                    console.error('Error saving trip:', error);
                    res.status(500).json({ error: 'Failed to save trip' });
          }
});

// PATCH /api/trips/:id/favorite - Toggle favorite
router.patch('/:id/favorite', authMiddleware, async (req, res) => {
          try {
                    const trip = await SavedTrip.findOne({ _id: req.params.id, user_id: req.user._id });
                    if (!trip) {
                              return res.status(404).json({ error: 'Trip not found' });
                    }

                    trip.is_favorite = !trip.is_favorite;
                    await trip.save();

                    res.json(trip);
          } catch (error) {
                    console.error('Error toggling favorite:', error);
                    res.status(500).json({ error: 'Failed to update trip' });
          }
});

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', authMiddleware, async (req, res) => {
          try {
                    const trip = await SavedTrip.findOneAndDelete({
                              _id: req.params.id,
                              user_id: req.user._id,
                    });

                    if (!trip) {
                              return res.status(404).json({ error: 'Trip not found' });
                    }

                    res.json({ message: 'Trip deleted successfully' });
          } catch (error) {
                    console.error('Error deleting trip:', error);
                    res.status(500).json({ error: 'Failed to delete trip' });
          }
});

module.exports = router;
