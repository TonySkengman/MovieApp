# Watchlist 🎬

**Watchlist** is a movie and TV show app built with **React Native and Expo**. Browse titles, find something to watch, save favorites, and write reviews.

The app uses a custom **Node.js / Express REST API** with **MongoDB Atlas** for movies, accounts, favorites, and reviews.

## Features

- **Browse and search** movies and TV shows by title, type, and genre; sort by year or title.
- **Movie details** with posters, descriptions, genres, and reviews.
- **Accounts** with registration, login, and logout.
- **Favorites** saved to your account.
- **Reviews**: add a 1–5 star rating, edit your review, or delete it.
- **Profile** with your reviews, favorites, and activity statistics.
- **Share** movies and TV shows using your device's share menu.

You can browse without logging in. An account is needed for favorites, reviews, and your profile.

## Built with

- **App:** React Native, Expo, React Navigation, JavaScript
- **Backend:** Node.js, Express, REST API, JWT authentication
- **Database:** MongoDB Atlas and Mongoose
- **Local storage:** Expo SecureStore for login tokens

## Getting started

**You'll need:** Node.js/npm, MongoDB Atlas, and Android Studio with an Android emulator (the default setup). You'll also need Git if you're cloning the repository.

The **backend** and **Expo app** run in separate terminals.

### 1. Download the project

Clone the GitHub repository:

```bash
git clone https://github.com/TonySkengman/MovieApp.git
cd MovieApp
```

Or open the project folder if you've already downloaded it.

### 2. Install dependencies

In the project folder, run:

```bash
npm install
cd backend
npm install
```

### 3. Set up MongoDB

1. Create a free cluster and database user at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Allow your current IP address in **Network Access**.
3. Copy your MongoDB connection string.
4. In the `backend` folder, create a file named `.env` (or copy `.env.example` if available) with:

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
PORT=3000
```

Replace the placeholder values with your own. **Never upload `.env` or passwords to GitHub.**

### 4. Add sample movies

Still in `backend`, run this once to populate an empty database:

```bash
npm run seed
```

### 5. Start the backend

In the same terminal:

```bash
npm run dev
```

Keep this terminal running. The API should be available at `http://localhost:3000`.

### 6. Start the mobile app

Open a **second terminal** in the main project folder (not `backend`) and run:

```bash
npx expo start
```

Start an Android emulator in Android Studio, then press **`a`** in the Expo terminal to launch the app.

**Keep both terminals running** while using Watchlist.

### Using an iPhone or a physical phone?

The app's `config/api.js` defaults to the **Android emulator**:

```js
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

Change the URL if necessary:

| Device | API URL |
| --- | --- |
| Android emulator | `http://10.0.2.2:3000/api` |
| iOS simulator (same Mac) | `http://localhost:3000/api` |
| Physical phone (same Wi-Fi) | `http://YOUR_COMPUTER_IP:3000/api` |

For a physical phone, the computer must be reachable on the local network, and firewall/device settings must allow the HTTP connection.

## Starting it again later

Once setup is complete, you only need **two terminals**:

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

**Terminal 2 — project root**

```bash
npx expo start
```

Press **`a`** to open the Android emulator.

## API, login, and local storage

- The mobile app uses the project's own **Express REST API** to fetch movies and manage user data.
- Reviews support **GET, POST, PUT, and DELETE** requests. Favorites can be added and removed.
- Users register and log in through the API. Passwords are hashed before storage.
- After login, the app saves its **JWT token** in **Expo SecureStore** so the session can persist across app restarts.
- Logging out removes the stored token. The backend checks authorization for protected actions.
- Favorites and reviews are saved in **MongoDB**, not locally on the device.

## Mobile functionality

Watchlist uses React Native's **Share** feature to open the device's native sharing menu for a movie or TV show.

## Known limitations

- The backend is **not hosted publicly**. To run the app, you must start it locally and connect to a MongoDB Atlas database.
- The default API URL is configured for the **Android emulator**. Other devices need a different address.
- The movie catalog contains **sample data** added with `npm run seed`, not a continuously updated external catalog.
- An internet connection is required for API data and external poster images; there is no offline movie catalog.

## Troubleshooting

- **No movies showing?** Make sure the backend is running, MongoDB is connected, and you've run `npm run seed`.
- **Network request failed?** Check the URL in `config/api.js` and whether the backend is running on port `3000`.
- **Expo won't open Android?** Start a virtual device in Android Studio first, then press `a`.

---

*Watchlist — Individual React Native project.*
