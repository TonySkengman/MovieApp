import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "../config/api";

async function authRequest(endpoint, username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  await SecureStore.setItemAsync("authToken", data.token);

  return data.user;
}

export function register(username, password) {
  return authRequest("register", username, password);
}

export function login(username, password) {
  return authRequest("login", username, password);
}

export async function logout() {
  await SecureStore.deleteItemAsync("authToken");
}

export async function getToken() {
  return SecureStore.getItemAsync("authToken");
}
