
import { getToken } from './authService';

const API_BASE_URL = 'http://10.0.2.2:3000/api';

async function favoritesRequest(endpoint, options = {}) {
  const token = await getToken();

  if (!token) {
    throw new Error('You must be logged in to manage favorites.');
  }

  const response = await fetch(`${API_BASE_URL}/favorites${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export function getFavorites() {
  return favoritesRequest('');
}

export function addFavorite(movieId) {
  return favoritesRequest(`/${movieId}`, {
    method: 'POST',
  });
}

export function removeFavorite(movieId) {
  return favoritesRequest(`/${movieId}`, {
    method: 'DELETE',
  });
}
