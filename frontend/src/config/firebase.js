import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// For debugging, log the environment variables
console.log('Firebase Config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

const firebaseConfig = {
  apiKey: "AIzaSyAscre_yuHlBoyuSl4Mabc_zpbBadE1qyQ",
  authDomain: "glowslot-c9a22.firebaseapp.com",
  projectId: "glowslot-c9a22",
  storageBucket: "glowslot-c9a22.firebasestorage.app",
  messagingSenderId: "965968677010",
  appId: "1:965968677010:web:c08ed737de073f3c623e4b",
  measurementId: "G-WGVKHFREE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    // Send the token to your backend
    const response = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend response:', errorText);
      throw new Error('Failed to authenticate with backend');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export { auth, googleProvider };
