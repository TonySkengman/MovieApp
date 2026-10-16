const API_URL = 'http://10.0.2.2:3000/api/movies';

export async function searchMovies(query = '', type = 'movie', genre = 'all') {
  try {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.append('search', query.trim());
    }

    if (type && type !== 'all') {
      params.append('type', type);
    }

    if (genre && genre !== 'all') {
      params.append('genre', genre);
    }

    const url = `${API_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Could not fetch movies. Please try again later.');
    }

    const movies = await response.json();

    return movies.map((movie) => ({
      ...movie,
      Title: movie.title,
      Year: String(movie.year),
      Poster: movie.poster || '',
      imdbID: movie._id,
      Type: movie.type,
    }));
  } catch (error) {
    console.error('searchMovies error:', error);
    throw error;
  }
}

export async function getMovieDetails(id) {
  try {
    const movies = await searchMovies('', 'all');

    const movie = movies.find(
      (item) => item._id === id || item.imdbID === id
    );

    if (!movie) {
      throw new Error('Movie not found.');
    }

    return {
      ...movie,
      Plot: movie.description,
      Genre: movie.genres.join(', '),
    };
  } catch (error) {
    console.error('getMovieDetails error:', error);
    throw error;
  }
}
