import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import LoginPrompt from '../components/LoginPrompt';
import AddReviewScreen from '../screens/AddReviewScreen';
import MyReviewsScreen from '../screens/MyReviewsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="AddReview" component={AddReviewScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="AddReview" component={AddReviewScreen} />
    </Stack.Navigator>
  );
}

function FavoritesTab({ navigation }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <LoginPrompt
        message="Log in to see your favorites"
        onLogin={() =>
          navigation.getParent()?.getParent()?.navigate('Login', {
            returnTo: 'Favorites',
          })
        }
      />
    );
  }

  return <FavoritesScreen />;
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesScreen" component={FavoritesTab} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="AddReview" component={AddReviewScreen} />
    </Stack.Navigator>
  );
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

  return <ProfileStack />;
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen}/>
      <Stack.Screen name="AddReview" component={AddReviewScreen} />
    </Stack.Navigator>
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
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
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
