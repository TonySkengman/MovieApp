
import { Pressable, Share, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShareButton({ movie }) {
  async function shareMovie() {
    try {
      const title = movie.title;
      const year = movie.year;
      const description =
        movie.description || 'No description available.';

      await Share.share({
        message: `${title} (${year})\n\n${description}`,
      });
    } catch (error) {
      console.error('Could not share movie:', error);
    }
  }

  return (
    <Pressable
      onPress={shareMovie}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={`Share ${movie.title}`}
      hitSlop={8}
    >
      <Ionicons
        name="share-outline"
        size={24}
        color="#ffffff"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
