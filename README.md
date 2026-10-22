# Watchlist

Watchlist is a movie and TV series discovery app built with **React Native and Expo**. Users can browse titles, search and filter the catalog, save favorites, and share movies or series. Registered users can also create, edit, and delete their own reviews and view personal activity statistics.

The mobile app communicates with a custom **Express REST API**, which stores users, movies, reviews, and favorites in **MongoDB Atlas**.

## Features

- **Discover:** Browse movies and TV series and open a detailed view with a poster, release year, genres, description, and reviews.
- **Search:** Search by title, filter by movie/TV series and genre, and sort by year or title. Filter controls can be shown or hidden.
- **Accounts:** Register, log in, stay logged in between app launches, and log out.
- **Favorites:** Add and remove favorites, stored per account in MongoDB.
- **Reviews:** Give a title a rating from 1 to 5 stars and write a review (up to 1,000 characters). Edit or delete your own reviews. Each user can submit one review per title.
- **Profile:** View your review count, average rating, number of favorites, most favorited genre, and your reviews.
- **Sharing:** Use the device's native share menu to share a title and its description.
- **Feedback:** Loading indicators, empty states, error messages, and retry controls in key screens.

You can browse and search without an account. Adding favorites, writing reviews, and accessing personal content require login.

## Tech stack

| Mobile app | Backend | Database |
| --- | --- | --- |
| React Native, Expo, JavaScript | Node.js, Express | MongoDB Atlas, Mongoose |
| React Navigation (tabs and stacks) | REST API, JWT authentication | Movies, users, reviews, favorites |
| Expo SecureStore, Expo Vector Icons | bcryptjs, express-rate-limit | |

Movie information comes from the project's own database. Posters are loaded from external image URLs; a separate movie API is not required.

## Prerequisites

Before starting, install or set up:

1. **Node.js and npm** (a current Node.js version supported by the project's Expo SDK).
2. **Git** to clone the repository.
3. **Android Studio with an Android emulator**, or **Xcode with an iOS simulator** (macOS), or a compatible physical device with the appropriate Expo runtime.
4. A **MongoDB Atlas** cluster and a database user with permission to read and write the app's database.
5. Internet access for MongoDB Atlas and external poster images.

> The project is configured for the **Android emulator** by default. Other devices need a small API URL change, described below.

## Getting started (new developer)

The Expo app lives in the **repository root**; the Express API lives in **`backend/`**. They need to run in **two separate terminals**.

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_FOLDER>
```

Replace the placeholders with the actual GitHub repository URL and folder name. If you already have the project locally, open the project folder in your terminal instead.

### 2. Install dependencies

From the project root:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
```

### 3. Set up MongoDB Atlas

In [MongoDB Atlas](https://www.mongodb.com/atlas):

1. Create a cluster if you do not already have one.
2. Create a **database user** with an appropriate username and password.
3. In **Network Access**, allow your current IP address to connect to the cluster.
4. Copy the **Drivers / connection string** for the cluster. Replace the username, password, and database name in that string with your own values. URL-encode special characters in the password if needed.

Inside **`backend/`**, create a file named **`.env`**. You can copy the accompanying `.env.example` file (`cp .env.example .env`) and fill in your own values, or create `.env` manually:

```dotenv
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
PORT=3000
```

- `MONGODB_URI` is your MongoDB Atlas connection string, including the database name you want to use.
- `JWT_SECRET` is a long, random secret used to sign authentication tokens. For example, you can generate one with `openssl rand -hex 32` and paste the output as the value.
- `PORT` controls the API port. The app is configured for port **3000**.

**Never commit `.env`, database passwords, or JWT secrets to GitHub.** The project's `backend/.gitignore` ignores `backend/.env`. The provided `backend/.env.example` contains placeholders only and is safe to include in Git.

### 4. Add sample movies and TV series

Still inside `backend/`, run:

```bash
npm run seed
```

This script inserts the sample catalog into your configured MongoDB database and updates any matching titles by title and year. Run it when setting up an empty database; you normally only need to run it once.

### 5. Start the backend

From `backend/`:

```bash
npm run dev
```

The development command uses **nodemon**, so the API restarts when backend files change. For a normal start, use `npm start` instead.

A successful start should print messages similar to:

```text
Connected to MongoDB Atlas
Server running on port 3000
```

You can test the API from your computer:

- `http://localhost:3000/` — should respond with `Filmapp API is running!`
- `http://localhost:3000/api/movies` — should return JSON containing movies and TV series (after seeding).

**Leave this terminal running.**

### 6. Configure the mobile app's API URL

Open **`config/api.js`** in the repository root:

```js
const API_BASE_URL = 'http://10.0.2.2:3000/api';

export default API_BASE_URL;
```

Select the address that matches where you run the mobile app:

| Where the app runs | API base URL |
| --- | --- |
| Android Studio emulator (default) | `http://10.0.2.2:3000/api` |
| iOS simulator on the same Mac | `http://localhost:3000/api` |
| Physical phone on the same Wi-Fi as the computer | `http://YOUR_COMPUTER_LOCAL_IP:3000/api` |

For a physical device, replace `YOUR_COMPUTER_LOCAL_IP` with your computer's local network address (for example, `192.168.1.25`). **Do not use `localhost` on a physical phone**—that refers to the phone itself. Ensure the phone can reach the computer and that the computer's firewall permits connections to port 3000. Depending on the device's security settings, plain HTTP access may need additional configuration.

### 7. Start Expo

Open **a second terminal**, navigate to the **repository root** (not `backend/`), and run:

```bash
npx expo start
```

Then:

- Press **`a`** to open the Android emulator (start a virtual device in Android Studio first).
- Press **`i`** to open the iOS simulator on macOS, if Xcode and the simulator are installed.
- For a physical device, follow the Expo terminal's instructions for the runtime compatible with this project.

**Keep both terminals open** while using the app: one for the Express backend and one for Expo.

## Quick start (after the first setup)

Once dependencies, MongoDB, seed data, and the API URL are configured:

**Terminal 1 — backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Expo (project root):**

```bash
npx expo start
```

Press `a` to launch on the Android emulator. If you closed the emulator, start it from Android Studio first.

## How to use the app

1. Open **Home** to browse the catalog, or **Search** to combine search, filters, and sorting.
2. Tap a poster or title to open **Movie Details** and read reviews.
3. Open **Sign up** to register a new account, or **Log in** if you already have one.
4. When logged in, tap the heart icon to save a favorite. Open **Favorites** to see your saved titles.
5. From a movie's detail screen, choose **Add Review** to rate and review it.
6. Open **Profile** → **My Reviews** to edit or delete reviews; the Profile screen also shows personal statistics.
7. Tap the share icon to open the device's sharing options.
8. Use **Log out** on the Profile screen to end the session.

## Authentication and local storage

- Registration and login are handled by the Express API.
- Passwords are **hashed with bcryptjs** before they are stored in MongoDB; plaintext passwords are not stored by the app.
- The API returns a **JWT** after successful registration or login.
- The mobile app stores the token in **Expo SecureStore** under the key `authToken` and uses it to restore the session after restarting.
- Authenticated requests send the token with `Authorization: Bearer <token>`.
- The backend validates tokens and limits users to changing **their own reviews and favorites**.
- Logging out removes the token from SecureStore.
- Favorites and reviews are stored on the server against the user account, not in local AsyncStorage. No separate offline movie catalog is implemented.

## REST API

Default local base URL: `http://localhost:3000/api`

| Method | Endpoint | Purpose | Login required |
| --- | --- | --- | --- |
| GET | `/movies` | List/search/filter movies and series | No |
| POST | `/auth/register` | Create an account | No |
| POST | `/auth/login` | Log in | No |
| GET | `/auth/me` | Get the signed-in user | Yes |
| GET | `/favorites` | Get your favorites | Yes |
| POST | `/favorites/:movieId` | Add a favorite | Yes |
| DELETE | `/favorites/:movieId` | Remove a favorite | Yes |
| GET | `/reviews/:movieId` | List reviews for a movie | No |
| GET | `/reviews/my` | Get your own reviews | Yes |
| POST | `/reviews/:movieId` | Add a review | Yes |
| PUT | `/reviews/review/:reviewId` | Edit your review | Yes |
| DELETE | `/reviews/review/:reviewId` | Delete your review | Yes |

Movie filters supported by `GET /movies`: `search` (title), `type` (`movie` or `series`), and `genre`. Sorting currently takes place in the mobile app.

## Project structure

```text
Watchlist/
├── App.js                   # App providers and root navigation
├── app.json                 # Expo configuration
├── backend/
│   ├── controllers/         # Authentication controllers
│   ├── middleware/          # JWT authentication middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # Express API routes
│   ├── seed.js              # Sample movies and TV series
│   ├── server.js            # API entry point
│   └── .env                 # Your local secrets (not committed)
├── components/              # Reusable UI components
├── config/api.js            # Mobile API base URL
├── context/                 # Auth and favorites state
├── navigation/              # React Navigation tabs and stacks
├── screens/                 # App screens
├── services/                # API request functions
└── utils/                   # Shared utilities and error messages
```

## Troubleshooting

**`Network request failed` or no data in the app**

- Make sure the backend is running on port `3000` and MongoDB Atlas is connected.
- Open `http://localhost:3000/api/movies` in your computer's browser to check the API.
- Make sure `config/api.js` points to the correct address for your emulator or device.
- On a physical device, check that both devices are on the same network and the firewall allows the connection.

**The backend cannot connect to MongoDB**

- Confirm the `MONGODB_URI` value in `backend/.env` is correct.
- Check the Atlas database user and IP access list.
- Make sure the MongoDB cluster is available.

**The app loads but no movies appear**

- Run `npm run seed` from the `backend/` folder, then refresh the app.

**The Android emulator does not open**

- Start an Android virtual device through Android Studio's Device Manager before pressing `a` in the Expo terminal.

**Changes are not appearing**

- Save your source files and reload the app from the Expo terminal. If necessary, stop Expo and restart with `npx expo start -c` to clear its cache.

## Known limitations

- **A local backend is required:** This repository is not configured with a publicly hosted API. The backend and database connection must be set up by whoever runs the project.
- **Device-specific API URL:** The included `config/api.js` defaults to Android Studio's emulator (`10.0.2.2`). iOS simulators and physical devices need another URL.
- **Seeded catalog:** Movie and series records come from the included sample dataset; the app does not automatically sync a full external movie catalog.
- **No offline catalog:** Movie lists, reviews, and favorites require access to the API. SecureStore retains the authentication token locally, but movie data is not cached for offline browsing.
- **External posters:** Poster images depend on third-party image URLs remaining available.
- **Testing:** The repository does not include an automated test suite for the mobile app or backend.

## Security and repository notes

Keep `.env` private. Use your own MongoDB Atlas credentials and JWT secret when cloning this project. If you share or submit a ZIP of the project, **exclude `backend/.env` and `node_modules/`**. Do not publish any secrets or credentials in screenshots, commits, or documentation.

---

**Project:** Watchlist — Individual React Native project (React Native + Expo, REST API, MongoDB Atlas).
