let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: 12.9716, lng: 77.5946},
        zoom : 12
         
    });
    new google.maps.Marker({
        position: {lat: 12.9716, lng:77.5946},
        map: map,
        label: "dustbin1",
        title: "Bangalore",
        animation: google.maps.Animation.DROP    
    })
}