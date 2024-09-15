import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
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
const storage = getStorage(app);
const database = getDatabase(app);

let uploadedImageURL = "";
let currentLatitude = null;
let currentLongitude = null;

// Get current geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    console.log("Current location:", currentLatitude, currentLongitude);
  },
  (error) => {
    console.error("Error retrieving geolocation:", error);
  }
);

async function uploadImage() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    try {
      const imageRef = storageRef(storage, `uploaded_images/${file.name}`);
      await uploadBytes(imageRef, file);
      uploadedImageURL = await getDownloadURL(imageRef);
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = uploadedImageURL;
      console.log("Image uploaded successfully:", uploadedImageURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  } else {
    console.error("No file selected");
  }
}

const uploadButton = document.getElementById("uploadImage");
uploadButton.addEventListener("click", uploadImage);

document
  .getElementById("litterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const pincodeValue = document.getElementById("pincode").value;
    const descriptionValue = document.getElementById("description").value;
    const landmarkIdValue = document.getElementById("landmarkId").value;

    if (
      !pincodeValue ||
      !descriptionValue ||
      !uploadedImageURL ||
      !landmarkIdValue ||
      currentLatitude === null ||
      currentLongitude === null
    ) {
      console.error(
        "Please fill all fields, upload an image, and ensure location is available."
      );
      return;
    }

    // Reference to the database for the specific pincode
    const pincodeRef = dbRef(database, `litters/${pincodeValue}`);

    // Push a new entry under the pincode
    const newLitterRef = push(pincodeRef);

    // Save the litter data
    set(newLitterRef, {
      pincode: pincodeValue,
      description: descriptionValue,
      imageURL: uploadedImageURL,
      landmarkId: landmarkIdValue,
      latitude: currentLatitude,
      longitude: currentLongitude,
      timestamp: Date.now(),
    })
      .then(() => {
        console.log("Data saved successfully!");
        alert("Submission successful!");
        document.getElementById("litterForm").reset();
        document.getElementById("imagePreview").src = "";
        uploadedImageURL = "";
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Error submitting data. Please try again.");
      });
  });
