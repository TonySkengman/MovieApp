
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import FavoriteButton from '../components/FavoriteButton';
import BackButton from '../components/BackButton';
import MoviePoster from '../components/MoviePoster';
import { getReviews } from '../services/reviewService';

export default function MovieDetailsScreen({ route, navigation }) {
  const { movie } = route.params;

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  const poster = movie.Poster || movie.poster;
  const title = movie.Title || movie.title;
  const year = movie.Year || movie.year;
  const type = movie.Type || movie.type;
  const genres = movie.genres || [];
  const description =
    movie.description || movie.Plot || 'No description available.';

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadReviews() {
        try {
          setReviewsLoading(true);
          setReviewsError('');

          const data = await getReviews(movie._id);

          if (isActive) {
            setReviews(data);
          }
        } catch (error) {
          if (isActive) {
            setReviewsError(error.message);
          }
        } finally {
          if (isActive) {
            setReviewsLoading(false);
          }
        }
      }

      loadReviews();

      return () => {
        isActive = false;
      };
    }, [movie._id])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerSpacer} />
      </View>

      <MoviePoster
        uri={poster}
        width="100%"
        height={420}
        placeholderHeight={300}
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <FavoriteButton movie={movie} />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.year}>{year}</Text>
          <Text style={styles.type}>
            {type === 'series' ? 'TV Show' : 'Movie'}
          </Text>
        </View>

        {genres.length > 0 && (
          <Text style={styles.genres}>
            {genres.join(' · ')}
          </Text>
        )}

        <Pressable
          style={styles.addReviewButton}
          onPress={() =>
            navigation.navigate('AddReview', { movie })
          }
          accessibilityRole="button"
        >
          <Text style={styles.addReviewButtonText}>
            ADD REVIEW
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>{description}</Text>

        <Text style={styles.sectionTitle}>Reviews</Text>

        {reviewsLoading ? (
          <Text style={styles.statusText}>
            Loading reviews...
          </Text>
        ) : reviewsError ? (
          <Text style={styles.errorText}>{reviewsError}</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.statusText}>
            No reviews yet. Be the first to review this movie!
          </Text>
        ) : (
          reviews.map((review) => (
            <View key={review._id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUsername}>
                  {review.user?.username || 'User'}
                </Text>

                <Text style={styles.reviewRating}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </Text>
              </View>

              <Text style={styles.reviewText}>
                {review.text}
              </Text>

              {review.createdAt && (
                <Text style={styles.reviewDate}>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 70,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  year: {
    color: '#cccccc',
    fontSize: 15,
  },
  type: {
    color: '#cccccc',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  genres: {
    color: '#aaaaaa',
    fontSize: 14,
    marginTop: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 10,
  },
  description: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 24,
  },
  addReviewButton: {
    backgroundColor: '#e50914',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addReviewButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#aaaaaa',
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#ff7777',
    fontSize: 15,
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewUsername: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  reviewRating: {
    color: '#f5c518',
    fontSize: 16,
  },
  reviewText: {
    color: '#cccccc',
    fontSize: 15,
    lineHeight: 22,
  },
  reviewDate: {
    color: '#888888',
    fontSize: 12,
    marginTop: 12,
  },
});
