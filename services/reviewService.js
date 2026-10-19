import { getToken } from "./authService";
import API_BASE_URL from "../config/api";

async function reviewRequest(endpoint, options = {}) {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}/reviews${endpoint}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function getReviews(movieId) {
  return reviewRequest(`/${movieId}`);
}

export function addReview(movieId, rating, text) {
  return reviewRequest(`/${movieId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, text }),
  });
}

export function updateReview(reviewId, rating, text) {
  return reviewRequest(`/review/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, text }),
  });
}

export function deleteReview(reviewId) {
  return reviewRequest(`/review/${reviewId}`, {
    method: "DELETE",
  });
}

export function getMyReviews() {
  return reviewRequest("/my");
}
