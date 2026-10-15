
import { View, Text, Image, StyleSheet } from 'react-native';

import FavoriteButton from './FavoriteButton';

export default function MovieRow({ item }) {
  const poster = item.Poster || item.poster;
  const title = item.Title || item.title;
  const year = item.Year || item.year;
  const type = item.Type || item.type;

  return (
    <View style={styles.movieCard}>
      {poster ? (
        <Image
          source={{ uri: poster }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}

      <View style={styles.movieInfo}>
        <View style={styles.details}>
          <Text style={styles.movieTitle}>
            {title}
          </Text>

          <Text style={styles.movieYear}>
            {year} ·{' '}
            <Text style={styles.movieType}>
              {type === 'series' ? 'TV Show' : 'Movie'}
            </Text>
          </Text>

          {item.genres?.length > 0 && (
            <Text style={styles.movieGenres}>
              {item.genres.join(', ')}
            </Text>
          )}
        </View>

        <View style={styles.favoriteButton}>
          <FavoriteButton movie={item} />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  details: {
    flex: 1,
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
  favoriteButton: {
    alignSelf: 'center',
    marginTop: 8,
    marginRight: 15,
  },
});
