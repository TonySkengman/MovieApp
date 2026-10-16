import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={styles.backText}>← Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 75,
    left: 24,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
  },
});