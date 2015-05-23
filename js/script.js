
var locations = [
    ['Park Ostankino', 55.829135, 37.615363],
    ['Teletsentr', 55.821795, 37.608850],
    ['Twin Pigs', 55.820891, 37.607262],
    ['Ostankino Television Tower', 55.819686, 37.611725],
    ['Khram Zhivonachalnoy Troitsy V Ostankino', 55.824061, 37.613699],
    ['Ostankinskiy Prud', 55.822705, 37.613979]

];

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(55.824061, 37.613699),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();

var marker, i;

for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
        }
    })(marker, i));
}

//ko.applyBindings(myViewModel);
