import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"


    const firebaseConfig = {
        apiKey: "AIzaSyCui4rUSBEeRa0pYFzPBkvFd4amdfCAlM4",
        authDomain: "reactdemo-84e45.firebaseapp.com",
        projectId: "reactdemo-84e45",
        storageBucket: "reactdemo-84e45.appspot.com",
        messagingSenderId: "921002504696",
        appId: "1:921002504696:web:886580d928bd8d9357a60d"
      };

 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth(app);
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='login.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })
