// Get the elements
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const accuracyElement = document.getElementById("accuracy");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadTask,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCui4rUSBEeRa0pYFzPBkvFd4amdfCAlM4",
  authDomain: "reactdemo-84e45.firebaseapp.com",
  databaseURL: "https://reactdemo-84e45-default-rtdb.firebaseio.com",
  projectId: "reactdemo-84e45",
  storageBucket: "reactdemo-84e45.appspot.com",
  messagingSenderId: "921002504696",
  appId: "1:921002504696:web:886580d928bd8d9357a60d",
};

const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase(app);

// Get a reference to Firebase Storage
const storage = getStorage(app);

// Function to get the current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        latitudeElement.textContent = latitude;
        longitudeElement.textContent = longitude;
        accuracyElement.textContent = accuracy;

        // Store location data in Firebase Realtime Database
        db.ref("location").set({
          latitude,
          longitude,
          accuracy,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to handle file input
function handleFileInput() {
  const files = fileInput.files;
  const fileListHTML = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileListHTML.push(`<li>${file.name} - ${file.size} bytes</li>`);

    // Upload file to Firebase Storage
    const uploadTask = storage.ref(`files/${file.name}`).put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        // Handle successful upload
        console.log("File uploaded successfully!");
      }
    );
  }

  fileList.innerHTML = fileListHTML.join("");
}

// Add event listener to file input
fileInput.addEventListener("change", handleFileInput);

// Get the current location on page load
getLocation();
