
import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('movie', 'title year poster type genres description')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: 'Could not fetch your reviews.',
    });
  }
});


router.get('/:movieId', async (req, res) => {
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

    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Could not fetch reviews:', error);

    res.status(500).json({
      message: 'Could not fetch reviews.',
    });
  }
});



router.post('/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, text } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        message: 'Invalid movie ID.',
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    if (
      typeof text !== 'string' ||
      !text.trim() ||
      text.trim().length > 1000
    ) {
      return res.status(400).json({
        message: 'Review text must contain 1–1000 characters.',
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found.',
      });
    }

    const review = await Review.create({
      movie: movieId,
      user: req.user._id,
      rating,
      text: text.trim(),
    });

    await review.populate('user', 'username');

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'You have already reviewed this movie.',
      });
    }

    console.error('Could not create review:', error);

    res.status(500).json({
      message: 'Could not create review.',
    });
  }
});


router.put('/review/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: 'Invalid review ID.',
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    if (
      typeof text !== 'string' ||
      !text.trim() ||
      text.trim().length > 1000
    ) {
      return res.status(400).json({
        message: 'Review text must contain 1–1000 characters.',
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or you do not have permission to edit it.',
      });
    }

    review.rating = rating;
    review.text = text.trim();

    await review.save();
    await review.populate('user', 'username');

    res.json(review);
  } catch (error) {
    console.error('Could not update review:', error);

    res.status(500).json({
      message: 'Could not update review.',
    });
  }
});


router.delete('/review/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: 'Invalid review ID.',
      });
    }

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or you do not have permission to delete it.',
      });
    }

    res.json({
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    console.error('Could not delete review:', error);

    res.status(500).json({
      message: 'Could not delete review.',
    });
  }
});

export default router;
