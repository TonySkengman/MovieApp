
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FavoriteButton from './FavoriteButton';
import MoviePoster from './MoviePoster';

export default function MovieCard({ movie }) {
  const navigation = useNavigation();

  function openDetails() {
    navigation.navigate('MovieDetails', { movie });
  }

  return (
    <View style={styles.movie}>
      <Pressable onPress={openDetails}>
        <View style={styles.posterContainer}>
          <MoviePoster
            uri={movie.Poster || movie.poster}
            width="100%"
            height={220}
            borderRadius={8}
          />
        </View>
      </Pressable>

      <View style={styles.movieInfo}>
        <Pressable style={styles.details} onPress={openDetails}>
          <Text style={styles.title}>
            {movie.Title || movie.title}
          </Text>

          <View style={styles.yearTypeRow}>
            <Text style={styles.year}>
              {movie.Year || movie.year}
            </Text>

            <Text style={styles.type}>
              {(movie.Type || movie.type) === 'series'
                ? 'TV Show'
                : 'Movie'}
            </Text>
          </View>

          {movie.genres?.length > 0 && (
            <Text style={styles.genre}>
              {movie.genres.join(', ')}
            </Text>
          )}
        </Pressable>

        <View style={styles.favoriteButton}>
          <FavoriteButton movie={movie} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  movie: {
    flex: 1,
    margin: 8,
  },
  posterContainer: {
    position: 'relative',
  },
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 8,
  },
  details: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  yearTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  favoriteButton: {
    marginTop: 0,
  },
});
