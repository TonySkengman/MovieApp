
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ movie }) {
  const { isLoggedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isUpdating, setIsUpdating] = useState(false);

  const movieId = movie._id;
  const favorite = isFavorite(movieId);

  async function handlePress() {
    if (!isLoggedIn) {
      Alert.alert(
        'Login required',
        'Please log in to add movies and TV shows to your favorites.',
        [{ text: 'OK' }]
      );

      return;
    }

    if (!movieId || isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      await toggleFavorite(movie);
    } catch (error) {
      Alert.alert(
        'Something went wrong',
        error.message ||
          'Could not update favorites. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={isUpdating}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={
        favorite ? 'Remove from favorites' : 'Add to favorites'
      }
    >
      <Ionicons
        name={favorite ? 'heart' : 'heart-outline'}
        size={26}
        color="#e50914"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
