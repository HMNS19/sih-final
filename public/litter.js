// Get the elements
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const accuracyElement = document.getElementById("accuracy");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Function to get the current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        latitudeElement.textContent = latitude;
        longitudeElement.textContent = longitude;
        accuracyElement.textContent = accuracy;
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to handle file input
function handleFileInput() {
  const files = fileInput.files;
  const fileListHTML = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileListHTML.push(`<li>${file.name} - ${file.size} bytes</li>`);
  }
  fileList.innerHTML = fileListHTML.join("");
}

// Add event listener to file input
fileInput.addEventListener("change", handleFileInput);

// Get the current location on page load
getLocation();
