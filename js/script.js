
var initialLocations = [
    ['Khram Zhivonachalnoy Troitsy V Ostankino', 55.824061, 37.613699],
    ['Park Ostankino', 55.829135, 37.615363],
    ['Teletsentr', 55.821795, 37.608850],
    ['Twin Pigs', 55.820891, 37.607262],
    ['Ostankino Television Tower', 55.819686, 37.611725],
    ['Ostankinskiy Prud', 55.822705, 37.613979]

];

var Location = function(data){
    this.name = ko.observable(data[0]);
    this.latitude = ko.observable(data[1]);
    this.longitude = ko.observable(data[2]);
};

var ViewModel = function() {
    var self = this;
    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(location) {
        self.locationList.push(new Location(location));
    });

    this.centerLocation = ko.observable(this.locationList()[0]);

    this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(this.centerLocation().latitude(), this.centerLocation().longitude()),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.addMarkers = function(){
        for (i = 0; i < self.locationList().length; i +=1) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(self.locationList()[i].latitude(), self.locationList()[i].longitude()),
                map: self.map
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(self.locationList()[i].name());
                    infowindow.open(self.map, marker);
                }
            })(marker, i));
        }
    };

    this.addMarkers();
};

ko.applyBindings(new ViewModel());
