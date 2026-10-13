
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      const batman = await searchMovies('Batman');
      const avengers = await searchMovies('Avengers');
      const spiderMan = await searchMovies('Spider-Man');
      const harryPotter = await searchMovies('Harry Potter');
      const starWars = await searchMovies('Star Wars');

      const allMovies = [
        ...batman,
        ...avengers,
        ...spiderMan,
        ...harryPotter,
        ...starWars,
      ];

      setMovies(allMovies);
    }

    loadMovies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover Movies</Text>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        numColumns={2}
        renderItem={({ item }) => (
          <MovieCard movie={item} />
        )}
      />
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
  movie: {
    flex: 1,
    margin: 8,
  },
  poster: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  year: {
    color: '#aaaaaa',
    marginTop: 4,
    marginBottom: 12,
  },
});
