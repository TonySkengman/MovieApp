
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const titles = [
  // Movies
  {
    title: 'Inception',
    year: 2010,
    type: 'movie',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    description: 'A thief enters peoples dreams to steal secrets.',
  },
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
    title: 'Fight Club',
    year: 1999,
    type: 'movie',
    genres: ['Drama', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    description: 'An office worker forms an underground fight club.',
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    type: 'movie',
    genres: ['Drama', 'Romance'],
    poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    description: 'A man witnesses major moments in American history.',
  },
  {
    title: 'Gladiator',
    year: 2000,
    type: 'movie',
    genres: ['Action', 'Drama', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    description: 'A betrayed Roman general seeks revenge.',
  },
  {
    title: 'Joker',
    year: 2019,
    type: 'movie',
    genres: ['Crime', 'Drama', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    description: 'A troubled man descends into madness.',
  },
  {
    title: 'Parasite',
    year: 2019,
    type: 'movie',
    genres: ['Thriller', 'Drama', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    description: 'A poor family becomes entangled with a wealthy household.',
  },
  {
    title: 'Spider-Man: No Way Home',
    year: 2021,
    type: 'movie',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    description: 'Peter Parker faces visitors from other universes.',
  },
  {
    title: 'Top Gun: Maverick',
    year: 2022,
    type: 'movie',
    genres: ['Action', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    description: 'A veteran pilot trains a new generation of aviators.',
  },
  {
    title: 'Oppenheimer',
    year: 2023,
    type: 'movie',
    genres: ['Drama', 'History', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    description: 'The story of the scientist behind the atomic bomb.',
  },
  {
    title: 'John Wick',
    year: 2014,
    type: 'movie',
    genres: ['Action', 'Thriller', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    description: 'A retired assassin returns to the criminal underworld.',
  },
  {
    title: 'Toy Story',
    year: 1995,
    type: 'movie',
    genres: ['Animation', 'Adventure', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    description: 'Toys come to life when humans are not around.',
  },
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    type: 'movie',
    genres: ['Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    description: 'Two prisoners form a friendship over many years.',
  },

  // Series
  {
    title: 'Game of Thrones',
    year: 2011,
    type: 'series',
    genres: ['Drama', 'Fantasy', 'Action'],
    poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    description: 'Noble families fight for control of the Iron Throne.',
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
  {
    title: 'The Last of Us',
    year: 2023,
    type: 'series',
    genres: ['Drama', 'Action', 'Horror'],
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    description: 'A smuggler escorts a teenager through a devastated world.',
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
    title: 'Sherlock',
    year: 2010,
    type: 'series',
    genres: ['Crime', 'Drama', 'Mystery'],
    poster: 'https://image.tmdb.org/t/p/original/A14sF9jEek617FvXplIsBUKzqEj.jpg',
    description: 'Sherlock Holmes solves crimes in modern London.',
  },
  {
    title: 'Friends',
    year: 1994,
    type: 'series',
    genres: ['Comedy', 'Romance'],
    poster: 'https://image.tmdb.org/t/p/w500/2koX1xLkpTQM4IZebYvKysFW1Nh.jpg',
    description: 'Six friends navigate life and relationships in New York.',
  },
  {
    title: 'The Mandalorian',
    year: 2019,
    type: 'series',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    description: 'A lone bounty hunter travels through the Star Wars galaxy.',
  },
  {
    title: 'Peaky Blinders',
    year: 2013,
    type: 'series',
    genres: ['Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    description: 'A criminal family rises to power in Birmingham.',
  },
  {
    title: 'Wednesday',
    year: 2022,
    type: 'series',
    genres: ['Comedy', 'Fantasy', 'Mystery'],
    poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    description: 'Wednesday Addams investigates mysteries at Nevermore Academy.',
  },
  {
    title: 'The Bear',
    year: 2022,
    type: 'series',
    genres: ['Drama', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
    description: 'A talented chef tries to transform his familys restaurant.',
  },
  {
    title: 'Arcane',
    year: 2021,
    type: 'series',
    genres: ['Animation', 'Action', 'Fantasy'],
    poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    description: 'Two sisters are caught in a conflict between rival cities.',
  },
  {
    title: 'The Walking Dead',
    year: 2010,
    type: 'series',
    genres: ['Drama', 'Horror', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg',
    description: 'Survivors struggle to stay alive in a zombie apocalypse.',
  },
  {
    title: 'Lost',
    year: 2004,
    type: 'series',
    genres: ['Adventure', 'Drama', 'Mystery'],
    poster: 'https://image.tmdb.org/t/p/w500/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg',
    description: 'Plane crash survivors uncover secrets on a mysterious island.',
  },
  {
    title: 'Chernobyl',
    year: 2019,
    type: 'series',
    genres: ['Drama', 'History', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    description: 'The people involved respond to the Chernobyl nuclear disaster.',
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const operations = titles.map((title) => ({
      updateOne: {
        filter: {
          title: title.title,
          year: title.year,
        },
        update: {
          $set: title,
        },
        upsert: true,
      },
    }));

    const result = await Movie.bulkWrite(operations);

    const arcane = await Movie.findOne({
  title: 'Arcane',
  year: 2021,
});

    console.log(`Added ${result.upsertedCount} new titles.`);
    console.log('Existing titles were left unchanged.');
  } catch (error) {
    console.error('Could not seed database:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
