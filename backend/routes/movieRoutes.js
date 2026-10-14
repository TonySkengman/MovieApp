
import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /api/movies
// GET /api/movies?search=batman
// GET /api/movies?genre=Action
// GET /api/movies?type=series

router.get('/', async (req, res) => {
  try {
    const { search, genre, type } = req.query;
    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i',
      };
    }

    if (genre && genre !== 'All') {
      filter.genres = genre;
    }

    if (type) {
      if (!['movie', 'series'].includes(type)) {
        return res.status(400).json({
          message: 'Type must be movie or series.',
        });
      }

      filter.type = type;
    }

    const titles = await Movie.find(filter).sort({ title: 1 });

    res.json(titles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Could not fetch titles.',
    });
  }
});

export default router;
