import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

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

async function uploadImage() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    try {
      const storageRef = ref(storage, `uploaded_images/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = imageURL;
      console.log("Image uploaded successfully:", imageURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  } else {
    console.error("No file selected");
  }
}

const uploadButton = document.getElementById("uploadImage");
uploadButton.addEventListener("click", uploadImage);

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyCui4rUSBEeRa0pYFzPBkvFd4amdfCAlM4",
//   authDomain: "reactdemo-84e45.firebaseapp.com",
//   databaseURL: "https://reactdemo-84e45-default-rtdb.firebaseio.com",
//   projectId: "reactdemo-84e45",
//   storageBucket: "reactdemo-84e45.appspot.com",
//   messagingSenderId: "921002504696",
//   appId: "1:921002504696:web:886580d928bd8d9357a60d",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const storage = getStorage(app);

// const fileInput = document.getElementById("fileInput");
// const uploadButton = document.getElementById("uploadImage");
// const imagePreview = document.getElementById("imagePreview");
// const fileList = document.getElementById("fileList");
// const dropzone = document.getElementById("imageUploader");

// let file;
// let fileName;
// let uploadedFileName;
// let isLoading = false;

// async function uploadImage() {
//   const file = fileInput.files[0];

//   if (!file) {
//     console.error("No file selected");
//     return;
//   }

//   if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
//     console.error("Only image files are allowed");
//     return;
//   }

//   try {
//     isLoading = true;
//     const storageRef = ref(storage, `uploaded_images/${file.name}`);
//     await uploadBytes(storageRef, file);

//     const imageURL = await getDownloadURL(storageRef);
//     imagePreview.src = imageURL;
//     imagePreview.style.display = "block";
//     isLoading = false;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//   }
// }

// uploadButton.addEventListener("click", uploadImage);

// fileInput.addEventListener("change", (e) => {
//   file = e.target.files[0];
//   fileName = Math.round(Math.random() * 9999) + file.name;
//   if (fileName) {
//     fileList.style.display = "block";
//   }
//   fileList.innerHTML = fileName;
//   console.log(file, fileName);
// });
