function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, handleLocationError);
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
}

function showNearestDelegation(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const delegations = [
        { name: 'posadas', lat: -27.362, lng: -55.900 },
        { name: 'apostoles', lat: -27.912, lng: -55.755 },
        { name: 'aristobulo', lat: -27.098, lng: -54.894 },
        // Agrega las coordenadas de todas las demás delegaciones
    ];

    let nearestDelegation = delegations[0];
    let minDistance = calculateDistance(userLat, userLng, delegations[0].lat, delegations[0].lng);

    for (let i = 1; i < delegations.length; i++) {
        const distance = calculateDistance(userLat, userLng, delegations[i].lat, delegations[i].lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestDelegation = delegations[i];
        }
    }

    document.getElementById('serviceoptions').value = nearestDelegation.name;
    changeDelegation();
    alert(`Delegación más cercana: ${nearestDelegation.name} a ${minDistance.toFixed(2)} km`);


}

function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("El usuario denegó la solicitud de geolocalización.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("La ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            alert("La solicitud de geolocalización ha expirado.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Se produjo un error desconocido.");
            break;
    }
}


function haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function initMap(position) {

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    // Donde esta centrado el mapa
    const center = { lat: -27.38070958527348, lng: -55.918537948654766 };
     
    const options = { zoom: 8, scaleControl: true, center: center };
   
    var map = new google.maps.Map(document.getElementById('map'), options);
  
    
    
    const delegations = [
        { name: 'posadas', lat: -27.36600823108378, lng: -55.892998289260845 },//-27.36600823108378, -55.892998289260845
        { name: 'apostoles', lat: -27.912, lng: -55.755 },
        { name: 'aristobulo', lat: -27.098, lng: -54.894 },
        // Agrega las coordenadas de todas las demás delegaciones
    ];

    let nearestDelegation = delegations[0];
    let minDistance = calculateDistance(userLat, userLng, delegations[0].lat, delegations[0].lng);

    for (let i = 1; i < delegations.length; i++) {
        const distance = calculateDistance(userLat, userLng, delegations[i].lat, delegations[i].lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestDelegation = delegations[i];
        }
    }

    const dakota = { lat: userLat, lng: userLng };
    const frick = { lat: nearestDelegation.lat,  lng: nearestDelegation.lng };

    
    // The markers for The Dakota and The Frick Collection
    //var mk1 = new google.maps.Marker({ position: dakota, map: map });
    //var mk2 = new google.maps.Marker({ position: frick, map: map });

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // Existing map object displays directions
    // Create route from existing points used for markers
    const route = {
        origin: dakota,
        destination: frick,
        travelMode: 'DRIVING'
    }

    directionsService.route(route,
        function (response, status) { // anonymous function to capture directions
            if (status !== 'OK') {
                window.alert('Directions request failed due to ' + status);
                return;
            } else {
                directionsRenderer.setDirections(response); // Add route to the map
                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                if (!directionsData) {
                    window.alert('Directions request failed');
                    return;
                }
                else {
                    document.getElementById('msg').innerHTML += " La distancia manejando es " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
                }
            }
        });

}

// Llama a la función al cargar la página
window.onload = getUserLocation;