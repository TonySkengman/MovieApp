import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { getUserFriendlyError } from '../utils/errorMessages';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const results = await searchMovies('', 'all');
      setMovies(results);
    } catch (error) {
      console.error('Could not load movies:', error);

      setError(
        getUserFriendlyError(
          error,
          'Could not load movies. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover Movies</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadMovies}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      ) : movies.length === 0 ? (
        <Text style={styles.message}>
          No movies or TV shows found.
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => <MovieCard movie={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 16,
    paddingTop: 70,
  },
  heading: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});