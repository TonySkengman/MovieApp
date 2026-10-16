
import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getMyReviews } from '../services/reviewService';
import { getFavorites } from '../services/favoriteService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [reviewCount, setReviewCount] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [mostFavoritedGenre, setMostFavoritedGenre] = useState(null);

  const username = user?.username || 'Unknown user';

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProfileStats() {
        try {
          const reviews = await getMyReviews();

          if (isActive) {
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
          }
        } catch (error) {
          console.error('Could not load reviews:', error);

          if (isActive) {
            setReviewCount(null);
            setAverageRating(null);
          }
        }

        try {
          const response = await getFavorites();

          const favorites = Array.isArray(response)
            ? response
            : response.favorites || [];

          if (isActive) {
            setFavoriteCount(favorites.length);

            const genreCounts = {};

            favorites.forEach((favorite) => {
              const movie = favorite.movie || favorite;
              const genres = movie.genres || [];

              genres.forEach((genre) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
              });
            });

            const sortedGenres = Object.entries(genreCounts).sort(
              (a, b) => b[1] - a[1]
            );

            if (sortedGenres.length > 0) {
              const highestCount = sortedGenres[0][1];

              const topGenres = sortedGenres
                .filter(([, count]) => count === highestCount)
                .map(([genre]) => genre);

              setMostFavoritedGenre(topGenres.join(', '));
            } else {
              setMostFavoritedGenre(null);
            }
          }
        } catch (error) {
          console.error('Could not load favorites:', error);

          if (isActive) {
            setFavoriteCount(null);
            setMostFavoritedGenre(null);
          }
        }
      }

      loadProfileStats();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.username}>{username}</Text>
        <Text style={styles.subtitle}>Watchlist account</Text>
      </View>

      <Text style={styles.sectionTitle}>My Activity</Text>

      <View style={styles.statsContainer}>
        <Pressable
          style={styles.statsCard}
          onPress={() => navigation.navigate('MyReviews')}
          accessibilityRole="button"
          accessibilityLabel={`Reviews Made: ${reviewCount ?? 'unknown'}`}
        >
          <View style={styles.statsIcon}>
            <Text style={styles.reviewIcon}>★</Text>
          </View>

          <Text style={styles.statsLabel}>Reviews Made</Text>
          <Text style={styles.statsValue}>
            {reviewCount === null ? '—' : reviewCount}
          </Text>
        </Pressable>

        <Pressable
          style={styles.statsCard}
          onPress={() => navigation.navigate('Favorites')}
          accessibilityRole="button"
          accessibilityLabel={`Favorites: ${favoriteCount ?? 'unknown'}`}
        >
          <View style={styles.statsIcon}>
            <Text style={styles.favoriteIcon}>♥</Text>
          </View>

          <Text style={styles.statsLabel}>Favorites</Text>
          <Text style={styles.statsValue}>
            {favoriteCount === null ? '—' : favoriteCount}
          </Text>
        </Pressable>

        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Text style={styles.ratingIcon}>★</Text>
          </View>

          <Text style={styles.statsLabel}>Average Rating</Text>
          <Text style={styles.statsValue}>
            {averageRating === null ? '—' : `${averageRating}/5`}
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Text style={styles.genreIcon}>🎬</Text>
          </View>

          <Text style={styles.statsLabel}>Most Favorited Genre</Text>
          <Text
            style={styles.genreValue}
            numberOfLines={3}
            adjustsFontSizeToFit
          >
            {mostFavoritedGenre || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={styles.reviewsButton}
          onPress={() => navigation.navigate('MyReviews')}
          accessibilityRole="button"
        >
          <Text style={styles.reviewsButtonText}>My Reviews</Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={logout}
          accessibilityRole="button"
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
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
  bottomSection: {
    marginTop: 'auto',
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
