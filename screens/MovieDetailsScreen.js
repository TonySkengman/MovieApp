
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from '../components/FavoriteButton';
import BackButton from '../components/BackButton';

export default function MovieDetailsScreen({ route, navigation }) {
  const { movie } = route.params;

  const poster = movie.Poster || movie.poster;
  const title = movie.Title || movie.title;
  const year = movie.Year || movie.year;
  const type = movie.Type || movie.type;
  const genres = movie.genres || [];
  const description =
    movie.description || movie.Plot || 'No description available.';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

        <BackButton />

        <View style={styles.headerSpacer} />
      </View>

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

        <Text style={styles.sectionTitle}>Overview</Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
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
  poster: {
    width: '100%',
    height: 420,
    backgroundColor: '#222222',
  },
  posterPlaceholder: {
    height: 300,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaaaaa',
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
    marginTop: 8,
  },
  year: {
    color: '#aaaaaa',
    fontSize: 15,
  },
  type: {
    color: '#e50914',
    fontWeight: 'bold',
  },
  genres: {
    color: '#cccccc',
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
});
