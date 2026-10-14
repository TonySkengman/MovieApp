
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const titles = [
  {
    title: 'The Dark Knight',
    year: 2008,
    type: 'movie',
    genres: ['Action', 'Crime', 'Drama'],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: 'Batman faces the Joker.',
  },
  {
    title: 'Interstellar',
    year: 2014,
    type: 'movie',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: 'A journey beyond Earth.',
  },
  {
    title: 'The Hangover',
    year: 2009,
    type: 'movie',
    genres: ['Comedy'],
    poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/9QiVIlFzZZlIX0yrfaoaOTWvxHW.jpg",
    description: 'A bachelor party goes wrong.',
  },
  {
    title: 'The Conjuring',
    year: 2013,
    type: 'movie',
    genres: ['Horror', 'Thriller'],
    poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    description: 'Paranormal investigators face a case.',
  },
  {
    title: 'Breaking Bad',
    year: 2008,
    type: 'series',
    genres: ['Crime', 'Drama', 'Thriller'],
    poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    description: 'A chemistry teacher enters the drug trade.',
  },
  {
    title: 'Stranger Things',
    year: 2016,
    type: 'series',
    genres: ['Drama', 'Fantasy', 'Horror'],
    poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    description: 'Friends encounter supernatural mysteries.',
  },
  {
    title: 'The Office',
    year: 2005,
    type: 'series',
    genres: ['Comedy'],
    poster: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    description: 'A comedy about office workers.',
  },
  {
    title: 'The Boys',
    year: 2019,
    type: 'series',
    genres: ['Action', 'Comedy', 'Drama'],
    poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    description: 'A group takes on corrupt superheroes.',
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const count = await Movie.countDocuments();

    if (count > 0) {
      console.log('Database already contains titles. Nothing added.');
      return;
    }

    await Movie.insertMany(titles);
    console.log('Test movies and series added!');
  } catch (error) {
    console.error('Could not seed database:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
