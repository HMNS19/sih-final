// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth,signInWithPopup,GoogleAuthProvider,} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import { getFirestore,collection, addDoc ,getDocs,doc,setDoc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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



function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);

  // Style adjustments for left alignment and red font:
  messageDiv.style.cssText = `
    display: block;
    opacity: 1;
    color: red;
    text-align: left; /* Ensures left alignment */
    transition: opacity 1s ease-out; /* Smooth fade-out animation */
  `;
  messageDiv.innerHTML = message;

  // Fade-out after 5 seconds:
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const clgname = document.getElementById("collegeName").value;

  createUserWithEmailAndPassword(auth, email, password,firstName,lastName,clgname)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        clgname: clgname,
      };
      saveInfo(email,firstName,lastName,clgname)
      showMessage("Account Created Successfully", "signUpMessage");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000); // 2000 milliseconds = 2 seconds
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("unable to create User", "signUpMessage");
      }
    });
});

async function saveInfo(email,firstName,lastName,clgname){
  try {
    const db = getFirestore(app);
    const docRef = doc(db, "users", user.uid);
await setDoc(docRef, {
  email: email,
  firstName: firstName,
  lastName: lastName,
  clgname: clgname,
  points:100
}), 
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  // const querySnapshot = await getDocs(collection(db, "users"));
  // querySnapshot.forEach((doc) => {
  //   console.log(`${doc.id} => ${doc.data()}`);
  // });
  
  }
   

//---------------------------------------------

document.getElementById("googleSignInButton").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      //for fetching username
       //console.log(user.email);
      
      //window.location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});

const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("login is successful", "signInMessage");
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

const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");

signUpButton.addEventListener("click", function () {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});
signInButton.addEventListener("click", function () {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});

//hi
const asStudent = document.getElementById("student");
const collegeNameContainer = document.getElementById("collegeNameContainer");

asStudent.addEventListener("change", (e) => {
  if (e.target.checked) {
    collegeNameContainer.style.display = "block";
  } else {
    collegeNameContainer.style.display = "none";
  }
});
