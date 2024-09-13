// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, set , ref  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCui4rUSBEeRa0pYFzPBkvFd4amdfCAlM4",
  authDomain: "reactdemo-84e45.firebaseapp.com",
  databaseURL: "https://reactdemo-84e45-default-rtdb.firebaseio.com",
  projectId: "reactdemo-84e45",
  storageBucket: "reactdemo-84e45.appspot.com",
  messagingSenderId: "921002504696",
  appId: "1:921002504696:web:886580d928bd8d9357a60d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


document.getElementById("contact").addEventListener("click",submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var email = getElementVal("email");
  var phone= getElementVal("phone");
  var subject= getElementVal("subject");
  var msg = getElementVal("msg");
 


  saveMessages(name, email,phone,subject,msg);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert and rest the form
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
    document.getElementById("contactusForm").reset();
  }, 3000);

  
  
}


const getElementVal = (id) => {
    return document.getElementById(id).value;
  };


const saveMessages=(name, email,phone,subject,msg) => {
    
    const contactusDB = getDatabase(app);
    set(ref(contactusDB, 'Contact/'+name), {
    name: name,
    email: email,
    phone:phone,
    subject:subject,
    msg:msg
    
  });
};