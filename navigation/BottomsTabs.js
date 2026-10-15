import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LoginPrompt from '../components/LoginPrompt';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();


function FavoritesTab({ navigation }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <LoginPrompt
        message="Log in to see your favorites"
        onLogin={() =>
          navigation.getParent()?.navigate('Login', {
            returnTo: 'Favorites',
          })
        }
      />
    );
  }

  return <FavoritesScreen />;
}


function ProfileTab({ navigation }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <LoginPrompt
        message="Log in to access your account"
        onLogin={() =>
          navigation.getParent()?.navigate('Login', {
            returnTo: 'Profile',
          })
        }
      />
    );
  }

  return <ProfileScreen />;
}


function PlaceholderScreen({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#181818',
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
});