
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FavoriteButton from './FavoriteButton';
import MoviePoster from './MoviePoster';
import ShareButton from './ShareButton';

export default function MovieCard({ movie }) {
  const navigation = useNavigation();

  function openDetails() {
    navigation.navigate('MovieDetails', { movie });
  }

  const title = movie.title;
  const year = movie.year;
  const type = movie.type;

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
        <View style={styles.movieInfoRow}>
          <Pressable style={styles.details} onPress={openDetails}>
            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.year}>
              {year}
            </Text>

            <Text style={styles.type}>
              {type === 'series' ? 'TV Show' : 'Movie'}
            </Text>
          </Pressable>

          <View style={styles.actionButtons}>
            <ShareButton movie={movie} />
            <FavoriteButton movie={movie} />
          </View>
        </View>

        {movie.genres?.length > 0 && (
          <Text style={styles.genre}>
            {movie.genres.join(', ')}
          </Text>
        )}
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
    marginTop: 8,
  },
  movieInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  details: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
