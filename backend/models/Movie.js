
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
