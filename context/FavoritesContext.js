import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isLoggedIn } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    async function loadFavorites() {
      setIsLoading(true);

      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [isLoggedIn]);

  function isFavorite(movieId) {
    return favorites.some((movie) => movie._id === movieId);
  }

  async function toggleFavorite(movie) {
    const movieId = movie._id;

    if (!movieId) {
      throw new Error("Movie ID is missing.");
    }

    if (isFavorite(movieId)) {
      await removeFavorite(movieId);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => favorite._id !== movieId),
      );
    } else {
      await addFavorite(movieId);

      setFavorites((currentFavorites) => {
        if (currentFavorites.some((favorite) => favorite._id === movieId)) {
          return currentFavorites;
        }

        return [...currentFavorites, movie];
      });
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
