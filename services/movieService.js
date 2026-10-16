import API_BASE_URL from "../constants/api";

const API_URL = `${API_BASE_URL}/movies`;

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

    return await response.json();
  } catch (error) {
    console.error('searchMovies error:', error);
    throw error;
  }
}
