// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Get the current location
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

// Function to get the current location
document.getElementById("Blackspot").addEventListener("click", submitForm);

function submitForm(e) {
  e.preventDefault();

  var latitude = getElementVal("latitude");
  var longitude = getElementVal("longitude");
  var accuracy = getElementVal("accuracy");
  var landmark = getElementVal("landmark");
  var description = getElementVal("description");

  saveMessages(latitude, longitude, accuracy, landmark, description);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert and rest the form
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
    document.getElementById("litterform").reset();
  }, 3000);
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

const saveMessages = (latitude, longitude, accuracy, landmark, description) => {
  const blackspotDB = getDatabase(app);
  set(ref(blackspotDB, "Blackspot/"), {
    latitude: latitude,
    longitude: longitude,
    accuracy: accuracy,
    landmark: landmark,
    description: description,
  });
};
