// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVjcOqEzhZmeUXEmOyT89EJ6xoajqhsFM",
  authDomain: "my-project-eaeb4.firebaseapp.com",
  projectId: "my-project-eaeb4",
  storageBucket: "my-project-eaeb4.appspot.com",
  messagingSenderId: "213704135796",
  appId: "1:213704135796:web:9b9a4d08a987b43069ed21",
  measurementId: "G-3DCQL1P2QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage()