import { View, Text, Image, StyleSheet } from 'react-native';

export default function MovieCard({ movie }) {
  return (
    <View style={styles.movie}>
      <Image
        source={{ uri: movie.Poster }}
        style={styles.poster}
      />

      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.year}>{movie.Year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  movie: {
    flex: 1,
    margin: 8,
  },
  poster: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  year: {
    color: '#aaaaaa',
    marginTop: 4,
    marginBottom: 12,
  },
});