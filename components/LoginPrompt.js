
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginPrompt({ message, onLogin }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="lock-closed-outline"
        size={42}
        color="#e50914"
      />

      <Text style={styles.text}>{message}</Text>

      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Logga in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
