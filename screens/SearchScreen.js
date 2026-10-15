
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { searchMovies } from '../services/movieService';
import MovieRow from '../components/MovieRow';

const types = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'series' },
];

const genres = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Sci-Fi',
  'Thriller',
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchMovies() {
      setLoading(true);
      setError('');

      try {
        const results = await searchMovies(
          query,
          selectedType,
          selectedGenre
        );

        if (active) {
          setMovies(results);
        }
      } catch (err) {
        if (active) {
          setError('Could not load titles. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      active = false;
    };
  }, [query, selectedType, selectedGenre]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie or TV show..."
        placeholderTextColor="#888888"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search for a movie or TV show"
      />

      <Text style={styles.sectionTitle}>Type</Text>

      <View style={styles.filterRow}>
        {types.map((type) => (
          <Text
            key={type.value}
            onPress={() => setSelectedType(type.value)}
            style={[
              styles.filterChip,
              selectedType === type.value && styles.selectedChip,
            ]}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedType === type.value,
            }}
          >
            {type.label}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Genre</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreScrollContent}
      >
        {genres.map((genre) => (
          <Text
            key={genre}
            onPress={() => setSelectedGenre(genre)}
            style={[
              styles.filterChip,
              styles.genreChip,
              selectedGenre === genre && styles.selectedChip,
            ]}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedGenre === genre,
            }}
          >
            {genre}
          </Text>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Results</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={styles.status}
        />
      ) : error ? (
        <Text style={styles.statusText}>{error}</Text>
      ) : movies.length === 0 ? (
        <Text style={styles.statusText}>No titles found.</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieRow item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.resultsList}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  heading: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: '#242424',
    color: '#ffffff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    color: '#dddddd',
    backgroundColor: '#242424',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedChip: {
    backgroundColor: '#e50914',
    color: '#ffffff',
  },
  genreScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 20,
  },
  genreScrollContent: {
    alignItems: 'center',
    paddingRight: 4,
  },
  genreChip: {
    marginRight: 8,
  },
  resultsList: {
    paddingBottom: 24,
  },
  status: {
    marginTop: 30,
  },
  statusText: {
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
  },
});
