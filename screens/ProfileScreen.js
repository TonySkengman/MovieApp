
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { getMyReviews } from '../services/reviewService';
import { getFavorites } from '../services/favoriteService';
import { getUserFriendlyError } from '../utils/errorMessages';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [mostFavoritedGenre, setMostFavoritedGenre] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [favoritesError, setFavoritesError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const username = user?.username || 'Unknown user';

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProfileStats() {
        setLoading(true);
        setReviewsError('');
        setFavoritesError('');

        const [reviewsResult, favoritesResult] =
          await Promise.allSettled([
            getMyReviews(),
            getFavorites(),
          ]);

        if (!isActive) {
          return;
        }

        // Handle review statistics
        if (reviewsResult.status === 'fulfilled') {
          const reviews = reviewsResult.value;

          setReviewCount(reviews.length);

          if (reviews.length > 0) {
            const totalRating = reviews.reduce(
              (total, review) => total + review.rating,
              0
            );

            setAverageRating(
              (totalRating / reviews.length).toFixed(1)
            );
          } else {
            setAverageRating(null);
          }
        } else {
          console.error(
            'Could not load reviews:',
            reviewsResult.reason
          );

          setReviewCount(null);
          setAverageRating(null);

          setReviewsError(
            getUserFriendlyError(
              reviewsResult.reason,
              'Could not load your review statistics.'
            )
          );
        }

        // Handle favorite statistics
        if (favoritesResult.status === 'fulfilled') {
          const response = favoritesResult.value;

          const favorites = Array.isArray(response)
            ? response
            : response.favorites || [];

          setFavoriteCount(favorites.length);

          const genreCounts = {};

          favorites.forEach((favorite) => {
            const movie = favorite.movie || favorite;
            const genres = movie.genres || [];

            genres.forEach((genre) => {
              genreCounts[genre] =
                (genreCounts[genre] || 0) + 1;
            });
          });

          const sortedGenres = Object.entries(
            genreCounts
          ).sort((a, b) => b[1] - a[1]);

          if (sortedGenres.length > 0) {
            const highestCount = sortedGenres[0][1];

            const topGenres = sortedGenres
              .filter(([, count]) => count === highestCount)
              .map(([genre]) => genre);

            setMostFavoritedGenre(topGenres.join(', '));
          } else {
            setMostFavoritedGenre(null);
          }
        } else {
          console.error(
            'Could not load favorites:',
            favoritesResult.reason
          );

          setFavoriteCount(null);
          setMostFavoritedGenre(null);

          setFavoritesError(
            getUserFriendlyError(
              favoritesResult.reason,
              'Could not load your favorite statistics.'
            )
          );
        }

        setLoading(false);
      }

      loadProfileStats();

      return () => {
        isActive = false;
      };
    }, [retryCount])
  );

  function handleRetry() {
    setRetryCount((count) => count + 1);
  }

  const hasError = Boolean(reviewsError || favoritesError);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.username}>{username}</Text>

        <Text style={styles.subtitle}>
          Watchlist account
        </Text>
      </View>

      <Text style={styles.sectionTitle}>My Activity</Text>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color="#e50914"
          />
          <Text style={styles.loadingText}>
            Loading your activity...
          </Text>
        </View>
      )}

      {/* Error messages */}
      {!loading && hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Could not load all profile statistics
          </Text>

          {reviewsError !== '' && (
            <Text style={styles.errorText}>
              Reviews: {reviewsError}
            </Text>
          )}

          {favoritesError !== '' && (
            <Text style={styles.errorText}>
              Favorites: {favoritesError}
            </Text>
          )}

          <Pressable
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry loading profile statistics"
          >
            <Text style={styles.retryButtonText}>
              TRY AGAIN
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.statsContainer}>
        {/* Reviews Made */}
        <Pressable
          style={styles.statsCard}
          onPress={() => navigation.navigate('MyReviews')}
          accessibilityRole="button"
          accessibilityLabel={`Reviews Made: ${
            reviewCount ?? 'unknown'
          }`}
        >
          <View style={styles.statsIcon}>
            <Text style={styles.reviewIcon}>★</Text>
          </View>

          <Text style={styles.statsLabel}>
            Reviews Made
          </Text>

          <Text style={styles.statsValue}>
            {loading || reviewCount === null
              ? '—'
              : reviewCount}
          </Text>
        </Pressable>

        {/* Favorites */}
        <Pressable
          style={styles.statsCard}
          onPress={() => navigation.navigate('Favorites')}
          accessibilityRole="button"
          accessibilityLabel={`Favorites: ${
            favoriteCount ?? 'unknown'
          }`}
        >
          <View style={styles.statsIcon}>
            <Text style={styles.favoriteIcon}>♥</Text>
          </View>

          <Text style={styles.statsLabel}>
            Favorites
          </Text>

          <Text style={styles.statsValue}>
            {loading || favoriteCount === null
              ? '—'
              : favoriteCount}
          </Text>
        </Pressable>

        {/* Average Rating */}
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Text style={styles.ratingIcon}>★</Text>
          </View>

          <Text style={styles.statsLabel}>
            Average Rating
          </Text>

          <Text style={styles.statsValue}>
            {loading || averageRating === null
              ? '—'
              : `${averageRating}/5`}
          </Text>
        </View>

        {/* Most Favorited Genre */}
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Text style={styles.genreIcon}>🎬</Text>
          </View>

          <Text style={styles.statsLabel}>
            Most Favorited Genre
          </Text>

          <Text
            style={styles.genreValue}
            numberOfLines={3}
            adjustsFontSizeToFit
          >
            {loading ? '—' : mostFavoritedGenre || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={styles.reviewsButton}
          onPress={() => navigation.navigate('MyReviews')}
          accessibilityRole="button"
          accessibilityLabel="My Reviews"
        >
          <Text style={styles.reviewsButtonText}>
            My Reviews
          </Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutButtonText}>
            Log out
          </Text>
        </Pressable>
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
    flexGrow: 1,
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  username: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 6,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '40%',
    minHeight: 145,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#292020',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  reviewIcon: {
    color: '#e50914',
    fontSize: 26,
  },
  favoriteIcon: {
    color: '#e50914',
    fontSize: 26,
  },
  ratingIcon: {
    color: '#f5c518',
    fontSize: 26,
  },
  genreIcon: {
    fontSize: 24,
  },
  statsLabel: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  statsValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  genreValue: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Loading styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  loadingText: {
    color: '#aaaaaa',
    fontSize: 14,
  },

  // Error styles
  errorContainer: {
    backgroundColor: '#241819',
    borderWidth: 1,
    borderColor: '#743034',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorTitle: {
    color: '#ff7777',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: '#cccccc',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Bottom buttons
  bottomSection: {
    marginTop: 'auto',
    paddingTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  reviewsButton: {
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#444444',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e50914',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
