
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import MoviePoster from './MoviePoster';

export default function ReviewCard({
  review,
  onPress,
  onEdit,
  onDelete,
  deleting,
}) {
  const movie = review.movie;

  return (
    <Pressable
      style={styles.reviewCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${movie?.title || 'movie'}`}
    >
      <MoviePoster
        uri={movie?.poster}
        width={100}
        height={150}
        placeholderText="No poster"
        placeholderFontSize={12}
      />

      <View style={styles.reviewContent}>
        <Text style={styles.movieTitle}>
          {movie?.title || 'Unknown movie'}
        </Text>

        {movie?.year ? (
          <Text style={styles.movieYear}>
            {movie.year}
          </Text>
        ) : null}

        <Text style={styles.rating}>
          {'★'.repeat(review.rating)}
          <Text style={styles.emptyStars}>
            {'☆'.repeat(5 - review.rating)}
          </Text>
          <Text style={styles.ratingNumber}>
            {' '}{review.rating}/5
          </Text>
        </Text>

        <Text style={styles.reviewText}>
          {review.text}
        </Text>

        <View style={styles.reviewActions}>
          <Pressable
            style={styles.editButton}
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit review for ${movie?.title || 'movie'}`}
          >
            <Text style={styles.editButtonText}>
              Edit review
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={onDelete}
            disabled={deleting}
            accessibilityRole="button"
            accessibilityLabel={`Delete review for ${movie?.title || 'movie'}`}
            accessibilityState={{
              disabled: deleting,
              busy: deleting,
            }}
          >
            {deleting ? (
              <ActivityIndicator
                color="#ffffff"
                size="small"
              />
            ) : (
              <Text style={styles.deleteButtonText}>
                Delete review
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 12,
    gap: 14,
  },
  reviewContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  movieTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  movieYear: {
    color: '#888888',
    fontSize: 13,
    marginTop: 3,
  },
  rating: {
    color: '#f5c518',
    fontSize: 18,
    marginTop: 8,
  },
  emptyStars: {
    color: '#666666',
  },
  ratingNumber: {
    color: '#aaaaaa',
    fontSize: 13,
  },
  reviewText: {
    color: '#dddddd',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    flexShrink: 1,
  },
  reviewActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e50914',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
