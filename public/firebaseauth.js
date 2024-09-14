// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// Function to show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.cssText = `
    display: block;
    opacity: 1;
    color: red;
    text-align: left;
    transition: opacity 1s ease-out;
  `;
  messageDiv.innerHTML = message;

  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign up event listener
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const clgname = document.getElementById("collegeName").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const sanitizedEmail = email.replace(/\./g, '_'); // Sanitize email to use as a key

      saveInfo(sanitizedEmail, firstName, lastName, clgname);
      showMessage("Account Created Successfully", "signUpMessage");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000); // 2000 milliseconds = 2 seconds
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        showMessage("Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("Unable to create User", "signUpMessage");
      }
    });
});

// Function to save user info
async function saveInfo(emailKey, firstName, lastName, clgname) {
  try {
    const userRef = dbRef(database, `users/${emailKey}`);
    await set(userRef, {
      email: emailKey.replace(/_/g, '.'), // Convert back to original email format
      firstName: firstName,
      lastName: lastName,
      clgname: clgname,
      points: 100
    });
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error submitting data. Please try again.");
  }
}

// Google Sign-In event listener
document.getElementById("googleSignInButton").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      window.location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // Handle errors
    });
});

// Sign in event listener
const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login is successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});

// Sign up/sign in form toggle
const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");

signUpButton.addEventListener("click", () => {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});
signInButton.addEventListener("click", () => {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});

// Toggle college name input based on student checkbox
const asStudent = document.getElementById("student");
const collegeNameContainer = document.getElementById("collegeNameContainer");

asStudent.addEventListener("change", (e) => {
  collegeNameContainer.style.display = e.target.checked ? "block" : "none";
});
