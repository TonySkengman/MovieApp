
import { View, Text, Image, StyleSheet } from 'react-native';

export default function MovieCard({ movie }) {
  return (
    <View style={styles.movie}>
      <Image
        source={{ uri: movie.Poster }}
        style={styles.poster}
      />

      <Text style={styles.title}>{movie.Title}</Text>

      <View style={styles.yearTypeRow}>
        <Text style={styles.year}>{movie.Year}</Text>

        <Text style={styles.type}>
          {movie.Type === 'series' ? 'TV Show' : 'Movie'}
        </Text>
      </View>

      {movie.genres?.length > 0 && (
        <Text style={styles.genre}>
          {movie.genres.join(', ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  yearTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  year: {
    color: '#aaaaaa',
  },
  type: {
    color: '#e50914',
    fontSize: 12,
    fontWeight: 'bold',
  },
  genre: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
});
