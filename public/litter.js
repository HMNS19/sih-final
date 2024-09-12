import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

// Event listener for form submission

//abhinav-location

document.getElementById("submitLitter").addEventListener("click", submitForm);

function submitForm(e) {
  e.preventDefault();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      const landmark = getElementVal("landmark");
      const description = getElementVal("description");
      console.log(latitude, longitude, accuracy, landmark, description);
      console.log("hi");

      saveMessages(latitude, longitude, accuracy, landmark, description);
    },
    (error) => {
      console.error("Error getting location:", error);
    }
  );

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

const saveMessages = (latitude, longitude, accuracy, landmark, description) => {
  const blackspotDB = getDatabase(app);
  set(ref(blackspotDB, "litters/" + landmark), {
    latitude: latitude,
    longitude: longitude,
    accuracy: accuracy,
    landmark: landmark,
    description: description,
  });
};
