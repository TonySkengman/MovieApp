import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import { getUserFriendlyError } from '../utils/errorMessages';

export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    try {
      setIsLoading(true);

      await login(username.trim(), password);

      const returnTo = route.params?.returnTo;

      if (returnTo) {
        navigation.replace('MainTabs', {
          screen: returnTo,
        });
      } else {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      setError(
        getUserFriendlyError(
          error,
          'Unable to log in. Please try again.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.logo}>THE WATCHLIST</Text>

      <Text style={styles.subtitle}>
        Your next favorite movie awaits.
      </Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Log in</Text>
        )}
      </Pressable>

      <Text
        style={styles.signup}
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
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
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