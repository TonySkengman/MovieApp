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
import ReviewCard from '../components/ReviewCard';
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

  function handleMoviePress(movie) {
    if (!movie?._id) {
      Alert.alert(
        'Movie unavailable',
        'This movie or series could not be opened.'
      );
      return;
    }

    navigation.navigate('MovieDetails', { movie });
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

              Alert.alert(
                'Success',
                'Your review has been deleted.'
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
    return (
      <ReviewCard
        review={item}
        onPress={() => handleMoviePress(item.movie)}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
        deleting={deletingId === item._id}
      />
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
            accessibilityLabel="Try loading reviews again"
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
