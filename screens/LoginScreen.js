
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>THE WATCHLIST</Text>

      <Text style={styles.subtitle}>
        Your next favorite movie awaits.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#888888"
        secureTextEntry
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>

      <Text style={styles.signup}
        onPress={() => navigation.navigate('Signup')}
        >
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    color: '#e50914',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222222',
    color: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signup: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 25,
  },
});
