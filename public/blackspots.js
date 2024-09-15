import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

import { getDatabase, ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";


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
const database = getDatabase(app);  // Correct initialization of getDatabase

document.getElementById('searchPincode').addEventListener('click', () => {
    console.log("print Step1");
    const pincode = document.getElementById('pincode').value.trim();
    fetchPincodeData(pincode);
});

function fetchPincodeData(pincode) {
    
    const pincodeRef = dbRef(database, 'litters');  // dbRef used for database reference
    
    onValue(pincodeRef, (snapshot) => {
        
        const data = snapshot.val();
        const pincodeFrequency = {};
        
        if (data) {
            
            Object.values(data).forEach(record => {
                if (record.pincode) {
                    
                    if (!pincodeFrequency[record.pincode]) {
                        pincodeFrequency[record.pincode] = 0;
                        
                    }
                    pincodeFrequency[record.pincode]++;
                }
            });
        }

        updateTable(pincodeFrequency, pincode);
        //------------------
    });
}

function updateTable(frequencyData, searchedPincode) {
    const tbody = document.querySelector('#frequencyTable tbody');
    tbody.innerHTML = '';

    for (const [pincode, frequency] of Object.entries(frequencyData)) {
        if (!searchedPincode || searchedPincode === pincode) {
            const row = document.createElement('tr');
            const pincodeCell = document.createElement('td');
            pincodeCell.textContent = pincode;
            const frequencyCell = document.createElement('td');
            frequencyCell.textContent = frequency;
            row.appendChild(pincodeCell);
            row.appendChild(frequencyCell);
            tbody.appendChild(row);
        }
    }
}
