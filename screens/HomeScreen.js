
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        Watchlist
      </Text>

      <Text style={styles.heading}>
        Discover movies
      </Text>

      <Text style={styles.description}>
        Find your next favorite movie.
      </Text>

      <View style={styles.movieList}>
        <Text style={styles.movieTitle}>Interstellar</Text>
        <Text style={styles.movieTitle}>Inception</Text>
        <Text style={styles.movieTitle}>The Dark Knight</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    color: '#e50914',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  heading: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#aaaaaa',
    fontSize: 16,
    marginBottom: 30,
  },
  movieList: {
    gap: 16,
  },
  movieTitle: {
    color: '#ffffff',
    backgroundColor: '#222222',
    padding: 18,
    borderRadius: 8,
    fontSize: 16,
  },
});
