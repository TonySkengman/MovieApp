
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import BackButton from '../components/BackButton';
import FavoriteButton from '../components/FavoriteButton';
import { addReview } from '../services/reviewService';

export default function AddReviewScreen({ route, navigation }) {
  const { movie } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const poster = movie.Poster || movie.poster;
  const title = movie.Title || movie.title;
  const year = movie.Year || movie.year;
  const type = movie.Type || movie.type;
  const genres = movie.genres || [];
  const description =
    movie.description || movie.Plot || 'No description available.';

  async function handleSubmitReview() {
    if (rating === 0) {
      Alert.alert('Missing rating', 'Please select a star rating.');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Missing review', 'Please enter your review.');
      return;
    }

    try {
      setSubmitting(true);

      await addReview(movie._id, rating, reviewText.trim());

      Alert.alert('Success', 'Your review has been submitted.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Could not submit review', error.message);
    } finally {
      setSubmitting(false);
    }
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
          {poster ? (
            <Image
              source={{ uri: poster }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.posterPlaceholder}>
              <Text style={styles.placeholderText}>
                No image available
              </Text>
            </View>
          )}

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

            <View style={styles.favoriteButtonContainer}>
              <FavoriteButton movie={movie} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>{description}</Text>

        <Text style={styles.sectionTitle}>Add Review</Text>

        <Text style={styles.label}>Your rating</Text>

        <View style={styles.ratingSelector}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable
              key={value}
              onPress={() => setRating(value)}
              accessibilityRole="button"
              accessibilityLabel={`${value} out of 5 stars`}
              accessibilityState={{ selected: rating === value }}
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

        <Text style={styles.label}>Your review</Text>

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
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Review'}
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
  poster: {
    width: 110,
    height: 165,
    borderRadius: 6,
    backgroundColor: '#222222',
  },
  posterPlaceholder: {
    width: 110,
    height: 165,
    borderRadius: 6,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'center',
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
  favoriteButtonContainer: {
    alignSelf: 'flex-start',
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
