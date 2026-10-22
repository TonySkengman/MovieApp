
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import BackButton from '../components/BackButton';
import FavoriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import MoviePoster from '../components/MoviePoster';
import { addReview, updateReview } from '../services/reviewService';
import { getUserFriendlyError } from '../utils/errorMessages';
import { useAuth } from '../context/AuthContext';

export default function AddReviewScreen({ route, navigation }) {
  const { isLoggedIn, isLoading } = useAuth();
  const { movie, review, isEditing = false } = route.params;

  const [rating, setRating] = useState(review?.rating ?? 0);
  const [reviewText, setReviewText] = useState(review?.text ?? '');
  const [submitting, setSubmitting] = useState(false);

  const poster = movie.poster;
  const title = movie.title;
  const year = movie.year;
  const type = movie.type;
  const genres = movie.genres || [];
  const description =
    movie.description || 'No description available.';

  async function handleSubmitReview() {
    if (isLoading || !isLoggedIn) {
      Alert.alert(
        'Login required',
        'You need to log in to add or edit a review.'
      );
      return;
    }

    if (rating === 0) {
      Alert.alert(
        'Missing rating',
        'Please select a star rating.'
      );
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert(
        'Missing review',
        'Please enter your review.'
      );
      return;
    }

    try {
      setSubmitting(true);

      if (isEditing) {
        await updateReview(
          review._id,
          rating,
          reviewText.trim()
        );

        Alert.alert(
          'Success',
          'Your review has been updated.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        await addReview(
          movie._id,
          rating,
          reviewText.trim()
        );

        Alert.alert(
          'Success',
          'Your review has been submitted.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        isEditing
          ? 'Could not update review'
          : 'Could not submit review',
        getUserFriendlyError(
          error,
          isEditing
            ? 'Unable to update your review. Please try again.'
            : 'Unable to submit your review. Please try again.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Wait until authentication status has been restored.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#e50914"
        />
      </View>
    );
  }

  // Prevent logged-out users from accessing the review form.
  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>
          Login required
        </Text>

        <Text style={styles.loginMessage}>
          You need to log in to add or edit reviews.
        </Text>

        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.loginButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.movieInfo}>
          <MoviePoster
            uri={poster}
            width={110}
            height={165}
            placeholderFontSize={12}
          />

          <View style={styles.movieDetails}>
            <Text style={styles.title}>{title}</Text>

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

            <View style={styles.actionButtons}>
              <ShareButton movie={movie} />
              <FavoriteButton movie={movie} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>

        <Text style={styles.sectionTitle}>
          {isEditing ? 'Edit Review' : 'Add Review'}
        </Text>

        <Text style={styles.label}>
          Your rating
        </Text>

        <View style={styles.ratingSelector}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable
              key={value}
              onPress={() => setRating(value)}
              accessibilityRole="button"
              accessibilityLabel={`${value} out of 5 stars`}
              accessibilityState={{
                selected: rating === value,
              }}
            >
              <Text
                style={[
                  styles.star,
                  value <= rating && styles.selectedStar,
                ]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>
          Your review
        </Text>

        <TextInput
          style={styles.reviewInput}
          placeholder="What did you think of this movie?"
          placeholderTextColor="#888888"
          value={reviewText}
          onChangeText={setReviewText}
          multiline
          maxLength={1000}
          textAlignVertical="top"
          accessibilityLabel="Your review"
        />

        <Text style={styles.characterCount}>
          {reviewText.length}/1000
        </Text>

        <Pressable
          style={[
            styles.submitButton,
            submitting && styles.disabledButton,
          ]}
          onPress={handleSubmitReview}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel={
            isEditing ? 'Save changes' : 'Submit review'
          }
        >
          <Text style={styles.submitButtonText}>
            {submitting
              ? isEditing
                ? 'Saving...'
                : 'Submitting...'
              : isEditing
                ? 'Save Changes'
                : 'Submit Review'}
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
    paddingBottom: 30,
  },

  // Authentication loading screen
  loadingContainer: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Screen shown when the user is not logged in
  loginContainer: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loginTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loginMessage: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Existing screen styles
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
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  movieDetails: {
    flex: 1,
    gap: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
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
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 4,
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
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  star: {
    color: '#555555',
    fontSize: 40,
  },
  selectedStar: {
    color: '#f5c518',
  },
  reviewInput: {
    minHeight: 160,
    backgroundColor: '#1c1c1c',
    color: '#ffffff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  characterCount: {
    color: '#888888',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 24,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#e50914',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
