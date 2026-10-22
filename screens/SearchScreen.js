
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { searchMovies } from '../services/movieService';
import MovieRow from '../components/MovieRow';
import { getUserFriendlyError } from '../utils/errorMessages';

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
  'Animation',
  'Mystery',
];

const sortOptions = [
  { label: 'Newest year', value: 'newest' },
  { label: 'Oldest year', value: 'oldest' },
  { label: 'Title A–Z', value: 'titleAsc' },
  { label: 'Title Z–A', value: 'titleDesc' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(true);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

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
          setError(
            getUserFriendlyError(
              err,
              'Could not load titles. Please try again.'
            )
          );
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
  }, [query, selectedType, selectedGenre, retryCount]);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (Number(a.year) || 0) - (Number(b.year) || 0);

        case 'titleAsc':
          return (a.title || '').localeCompare(b.title || '');

        case 'titleDesc':
          return (b.title || '').localeCompare(a.title || '');

        case 'newest':
        default:
          return (Number(b.year) || 0) - (Number(a.year) || 0);
      }
    });
  }, [movies, sortBy]);

  const activeFilterCount = [
    query.trim() !== '',
    selectedType !== 'all',
    selectedGenre !== 'All',
  ].filter(Boolean).length;

  function clearFilters() {
    setQuery('');
    setSelectedType('all');
    setSelectedGenre('All');
    setSortBy('newest');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search</Text>

      <View style={styles.searchRow}>
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

        <Pressable
          style={[
            styles.filterToggle,
            showFilters && styles.filterToggleActive,
          ]}
          onPress={() => setShowFilters((visible) => !visible)}
          accessibilityRole="button"
          accessibilityLabel={
            showFilters ? 'Hide filters' : 'Show filters'
          }
          accessibilityState={{ expanded: showFilters }}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {showFilters && (
        <>
          <Text style={styles.sectionTitle}>Type</Text>

          <View style={styles.filterRow}>
            {types.map((type) => (
              <Pressable
                key={type.value}
                onPress={() => setSelectedType(type.value)}
                style={[
                  styles.filterChip,
                  selectedType === type.value &&
                    styles.selectedChip,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${type.label}`}
                accessibilityState={{
                  selected: selectedType === type.value,
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedType === type.value &&
                      styles.selectedChipText,
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
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
              <Pressable
                key={genre}
                onPress={() => setSelectedGenre(genre)}
                style={[
                  styles.filterChip,
                  styles.genreChip,
                  selectedGenre === genre &&
                    styles.selectedChip,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${genre}`}
                accessibilityState={{
                  selected: selectedGenre === genre,
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedGenre === genre &&
                      styles.selectedChipText,
                  ]}
                >
                  {genre}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Sort by</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortScroll}
            contentContainerStyle={styles.sortScrollContent}
          >
            {sortOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setSortBy(option.value)}
                style={[
                  styles.filterChip,
                  styles.sortChip,
                  sortBy === option.value &&
                    styles.selectedChip,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Sort by ${option.label}`}
                accessibilityState={{
                  selected: sortBy === option.value,
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    sortBy === option.value &&
                      styles.selectedChipText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>Results</Text>

        {activeFilterCount > 0 && (
          <Pressable
            onPress={clearFilters}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search and filters"
          >
            <Text style={styles.clearButton}>
              Clear filters
            </Text>
          </Pressable>
        )}
      </View>

      {!loading && !error && (
        <Text style={styles.resultCount}>
          {sortedMovies.length}{' '}
          {sortedMovies.length === 1 ? 'result' : 'results'}
          {activeFilterCount > 0
            ? ` · ${activeFilterCount} active ${
                activeFilterCount === 1 ? 'filter' : 'filters'
              }`
            : ''}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={styles.status}
        />
      ) : error ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() =>
              setRetryCount((count) => count + 1)
            }
            accessibilityRole="button"
            accessibilityLabel="Try loading titles again"
          >
            <Text style={styles.retryButtonText}>
              TRY AGAIN
            </Text>
          </Pressable>
        </View>
      ) : sortedMovies.length === 0 ? (
        <Text style={styles.statusText}>
          No titles found.
        </Text>
      ) : (
        <FlatList
          data={sortedMovies}
          renderItem={({ item }) => (
            <MovieRow item={item} />
          )}
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
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  heading: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#242424',
    color: '#ffffff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  filterToggle: {
    width: 50,
    height: 50,
    backgroundColor: '#242424',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#e50914',
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
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 22,
  },
  filterText: {
    color: '#dddddd',
    fontSize: 14,
  },
  selectedChip: {
    backgroundColor: '#e50914',
  },
  selectedChipText: {
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
  sortScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 16,
  },
  sortScrollContent: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 4,
  },
  sortChip: {
    marginRight: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearButton: {
    color: '#ff7777',
    fontSize: 14,
    marginBottom: 10,
  },
  resultCount: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 8,
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
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});
