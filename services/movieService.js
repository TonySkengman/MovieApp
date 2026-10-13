
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

const BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(query, type = 'movie') {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    type,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to connect to OMDb.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No results found.');
  }

  return data.Search;
}

export async function getMovieDetails(imdbID) {
  const params = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID,
    plot: 'full',
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch movie details.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found.');
  }

  return data;
}
