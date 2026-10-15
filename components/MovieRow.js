
import { View, Text, Image, StyleSheet } from 'react-native';

export default function MovieRow({ item }) {
  return (
    <View style={styles.movieCard}>
      {item.Poster ? (
        <Image
          source={{ uri: item.Poster }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.Title}</Text>

        <Text style={styles.movieYear}>
          {item.Year} ·{' '}
          <Text style={styles.movieType}>
            {item.Type === 'series' ? 'TV Show' : 'Movie'}
          </Text>
        </Text>

        {item.genres?.length > 0 && (
          <Text style={styles.movieGenres}>
            {item.genres.join(', ')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#222222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 140,
    backgroundColor: '#333333',
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  movieTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  movieYear: {
    color: '#aaaaaa',
    marginBottom: 8,
  },
  movieType: {
    color: '#e50914',
    fontWeight: 'bold',
  },
  movieGenres: {
    color: '#cccccc',
    fontSize: 12,
  },
});
