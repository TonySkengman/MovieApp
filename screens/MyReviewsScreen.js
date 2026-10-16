import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import { getMyReviews, deleteReview } from '../services/reviewService';
import BackButton from '../components/BackButton';
import MoviePoster from '../components/MoviePoster';
import { getUserFriendlyError } from '../utils/errorMessages';

export default function MyReviewsScreen() {
  const navigation = useNavigation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadReviews = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      const data = await getMyReviews();
      setReviews(data);
    } catch (err) {
      setError(
        getUserFriendlyError(
          err,
          'Could not load your reviews. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [loadReviews])
  );

  function handleEdit(review) {
    navigation.navigate('AddReview', {
      movie: review.movie,
      review,
      isEditing: true,
    });
  }

  function handleDelete(review) {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(review._id);

              await deleteReview(review._id);

              setReviews((currentReviews) =>
                currentReviews.filter(
                  (item) => item._id !== review._id
                )
              );
            } catch (err) {
              Alert.alert(
                'Error',
                getUserFriendlyError(
                  err,
                  'Could not delete the review. Please try again.'
                )
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }

  function renderReview({ item }) {
    const movie = item.movie;

    return (
      <View style={styles.reviewCard}>
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
            <Text style={styles.movieYear}>{movie.year}</Text>
          ) : null}

          <Text style={styles.rating}>
            {'★'.repeat(item.rating)}
            <Text style={styles.emptyStars}>
              {'☆'.repeat(5 - item.rating)}
            </Text>
            <Text style={styles.ratingNumber}>
              {' '}{item.rating}/5
            </Text>
          </Text>

          <Text style={styles.reviewText}>{item.text}</Text>

          <View style={styles.reviewActions}>
            <Pressable
              style={styles.editButton}
              onPress={() => handleEdit(item)}
              accessibilityRole="button"
            >
              <Text style={styles.editButtonText}>
                Edit review
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
              disabled={deletingId === item._id}
              accessibilityRole="button"
            >
              {deletingId === item._id ? (
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>My Reviews</Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator
            size="large"
            color="#e50914"
          />
          <Text style={styles.statusText}>
            Loading reviews...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadReviews}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item._id}
          contentContainerStyle={
            reviews.length === 0
              ? styles.emptyList
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyTitle}>
                No reviews yet
              </Text>
              <Text style={styles.statusText}>
                Your movie reviews will appear here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingTop: 120,
    paddingHorizontal: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
    gap: 14,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  statusText: {
    color: '#aaaaaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});