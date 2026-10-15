
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getToken,
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getToken();

        if (!token) {
          return;
        }

        const response = await fetch(
          'http://10.0.2.2:3000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          await logoutUser();
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(username, password) {
    const loggedInUser = await loginUser(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(username, password) {
    const newUser = await registerUser(username, password);
    setUser(newUser);
    return newUser;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
