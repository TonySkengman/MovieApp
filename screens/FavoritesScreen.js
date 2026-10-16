import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { useFavorites } from '../context/FavoritesContext';
import MovieRow from '../components/MovieRow';

export default function FavoritesScreen() {
  const {
    favorites,
    isLoading,
    error,
    reloadFavorites,
  } = useFavorites();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.message}>
          Loading favorites...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Favorites</Text>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorMessage}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={reloadFavorites}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>
              TRY AGAIN
            </Text>
          </Pressable>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>
            You haven't added any favorites yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MovieRow item={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 16,
    paddingTop: 70,
  },
  heading: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  errorMessage: {
    color: '#ff7777',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});