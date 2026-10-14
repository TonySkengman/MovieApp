
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMovies() {
      try {
        const results = await searchMovies('', 'all');
        setMovies(results);
      } catch (error) {
        console.error('Could not load movies:', error);
        setError('Kunde inte hämta filmer. Försök igen.');
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover Movies</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : movies.length === 0 ? (
        <Text style={styles.message}>
          Inga filmer eller serier hittades.
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <MovieCard movie={item} />
          )}
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
    paddingTop: 60,
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
  message: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
});
