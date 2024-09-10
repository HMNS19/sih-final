let locations = [];
let map; // Declare the map variable here

function initMap(mapInstance) {
  map = mapInstance; // Assign the map object here
  let marker;

  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    addLocation(lat, lng);
    marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
    });
    marker.addListener("click", () => {
      removeLocation(lat, lng);
    });
  });

  // Retrieve locations from local storage
  const storedLocations = localStorage.getItem("locations");
  if (storedLocations) {
    locations = JSON.parse(storedLocations);
    locations.forEach((location) => {
      marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
      });
      marker.addListener("click", () => {
        removeLocation(location.lat, location.lng);
      });
    });
  }
}

function addLocation(lat, lng) {
  locations.push({ lat, lng });
  localStorage.setItem("locations", JSON.stringify(locations));
}

function removeLocation(lat, lng) {
  const index = locations.findIndex(
    (location) => location.lat === lat && location.lng === lng
  );
  if (index !== -1) {
    locations.splice(index, 1);
    localStorage.setItem("locations", JSON.stringify(locations));
    // Remove the marker from the map
    const markers = map.getMarkers();
    for (let i = 0; i < markers.length; i++) {
      if (
        markers[i].getPosition().lat() === lat &&
        markers[i].getPosition().lng() === lng
      ) {
        markers[i].setMap(null);
        break;
      }
    }
  }
}

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  const mapElement = document.getElementById("map");
  initMap(
    new google.maps.Map(mapElement, {
      center: { lat: latitude, lng: longitude },
      zoom: 10,
    })
  );
  mapElement.dataset.lat = latitude;
  mapElement.dataset.lng = longitude;
});
