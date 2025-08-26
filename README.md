# RentEase — Real Estate Rentals (HTML/CSS/JS + Firebase + Vercel)

A responsive rental website with EN/AR, light/dark mode, filters, and an admin dashboard using Firebase (Auth, Firestore, Storage). Deployed as a static site on Vercel.

## Quick Start
1) Open `index.html` with a local server (e.g., VSCode Live Server).
2) Replace Firebase config placeholders in `app.js` and `admin.js`.
3) Replace the Google Form link in `app.js` (variable `formUrl`).

## Firebase Setup
1) Create a Firebase project.
2) Enable Firestore (Production mode). Create collection `properties`.
3) Enable Authentication (Email/Password). Create an admin user.
4) Enable Storage (default bucket).
5) In `app.js` and `admin.js`, set:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Firestore Data Model (collection: properties)
- title (string)
- description (string)
- type (string: apartment | room | studio)
- price (number)
- gender (string: male | female)
- university (string)
- area (string)
- location (string)
- city (string)
- images (array<string> URLs)
- video (string URL)
- availability (boolean)
- roomsLeft (number)

### Optional Security Rules (example)
Firestore:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{docId} {
      allow read: if true;
      allow write: if request.auth != null; // tighten to admin-only for production
    }
  }
}
```
Storage:
```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // tighten to admin-only for production
    }
  }
}
```

## Admin Dashboard
- Visit `/admin.html`.
- Log in with the Email/Password admin account.
- Create/Update properties (uploads go to Firebase Storage, URLs saved in Firestore).
- Edit/Delete existing entries from the dashboard grid.

## Deployment (Vercel)
- Install CLI: `npm i -g vercel`
- Deploy from the project folder: `vercel --prod`
- Routes are configured in `vercel.json`.

## Notes
- API keys are public by design; protect data with security rules.
- Update branding, colors in `styles.css`.
- The main page uses fallback demo data if Firestore isn’t configured.
