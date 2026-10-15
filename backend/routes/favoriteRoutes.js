
import express from 'express';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/favorites
router.get('/', async (req, res) => {
  try {
    const user = await req.user.populate('favorites');

    res.json(user.favorites);
  } catch (error) {
    console.error('Could not fetch favorites:', error);

    res.status(500).json({
      message: 'Could not fetch favorites.',
    });
  }
});

// POST /api/favorites/:movieId
router.post('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID.',
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found.',
      });
    }

    if (!req.user.favorites.some((id) => id.equals(movie._id))) {
      req.user.favorites.push(movie._id);
      await req.user.save();
    }

    res.status(200).json({
      message: 'Added to favorites.',
    });
  } catch (error) {
    console.error('Could not add favorite:', error);

    res.status(500).json({
      message: 'Could not add favorite.',
    });
  }
});

// DELETE /api/favorites/:movieId
router.delete('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID.',
      });
    }

    req.user.favorites = req.user.favorites.filter(
      (id) => !id.equals(movieId)
    );

    await req.user.save();

    res.json({
      message: 'Removed from favorites.',
    });
  } catch (error) {
    console.error('Could not remove favorite:', error);

    res.status(500).json({
      message: 'Could not remove favorite.',
    });
  }
});

export default router;
