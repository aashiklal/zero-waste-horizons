function initMap() {
    var centerCoords = { lat: -37.8100243, lng: 144.9643672 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: centerCoords
    });
}

window.onload = initMap;
