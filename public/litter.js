// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref as dbRef,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    document.getElementById("latitude").textContent = latitude;
    document.getElementById("longitude").textContent = longitude;
    document.getElementById("accuracy").textContent = accuracy;
  },
  (error) => {
    console.error("Error getting location:", error);
  }
);

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCui4rUSBEeRa0pYFzPBkvFd4amdfCAlM4",
  authDomain: "reactdemo-84e45.firebaseapp.com",
  databaseURL: "https://reactdemo-84e45-default-rtdb.firebaseio.com",
  projectId: "reactdemo-84e45",
  storageBucket: "reactdemo-84e45.appspot.com",
  messagingSenderId: "921002504696",
  appId: "1:921002504696:web:886580d928bd8d9357a60d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let uploadFile = (file, name) => {
  return new Promise((resolve, reject) => {
    const storageRef = storageRef(
      storage,
      `images/${name.split(" ").join("-")}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  }).catch((error) => {
    console.error("Error uploading file:", error);
  });
};

// Event listener for form submission
document.getElementById("Blackspot").addEventListener("click", submitForm);

function submitForm(e) {
  e.preventDefault();

  const latitude = getElementVal("latitude");
  const longitude = getElementVal("longitude");
  const accuracy = getElementVal("accuracy");
  const landmark = getElementVal("landmark");
  const description = getElementVal("description");
  const file = getElementVal("file");

  uploadFile(file, "blackspot_image")
    .then((downloadURL) => {
      saveMessages(
        latitude,
        longitude,
        accuracy,
        landmark,
        description,
        downloadURL
      );
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });

  // Enable alert
  document.querySelector(".alert").style.display = "block";

  // Remove the alert and reset the form
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
    document.getElementById("litterform").reset();
  }, 3000);
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

const saveMessages = (
  latitude,
  longitude,
  accuracy,
  landmark,
  description,
  downloadURL
) => {
  const blackspotDB = getDatabase(app);
  const newMessageRef = dbRef(blackspotDB, "Blackspot/" + Date.now());
  set(newMessageRef, {
    latitude: latitude,
    longitude: longitude,
    accuracy: accuracy,
    landmark: landmark,
    description: description,
    image: downloadURL,
  });
};
