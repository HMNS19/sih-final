let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 12,
  });
  const image = "images/dustbin1.png";
  new google.maps.Marker({
    position: { lat: 12.9716, lng: 77.5946 },
    map: map,
    label: "dustbin1",
    title: "Bangalore",
    icon: image,
    animation: google.maps.Animation.DROP,
  });
}
