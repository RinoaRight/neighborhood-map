var initialLocations = [
    ['Khram Zhivonachalnoy Troitsy V Ostankino', 55.824061, 37.613699],
    ['Park Ostankino', 55.829135, 37.615363],
    ['Teletsentr', 55.821795, 37.608850],
    ['Twin Pigs', 55.820891, 37.607262],
    ['Ostankino Television Tower', 55.819686, 37.611725],
    ['Ostankinskiy Prud', 55.822705, 37.613979]

];

var Location = function (data) {
    this.name = ko.observable(data[0]);
    this.latitude = ko.observable(data[1]);
    this.longitude = ko.observable(data[2]);
};

var ViewModel = function () {
    var self = this;
    var infowindow = new google.maps.InfoWindow();
    var marker, i, place;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function (location) {
        self.locationList.push(new Location(location));
    });

    this.fullLocationList = this.locationList().slice();

    this.centerLocation = ko.observable(this.locationList()[0]);

    this.currentLocation = ko.observable();

    this.createMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(this.centerLocation().latitude(), this.centerLocation().longitude()),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.addMarkers = function () {
        for (i = 0; i < self.locationList().length; i += 1) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(self.locationList()[i].latitude(), self.locationList()[i].longitude()),
                map: self.createMap
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(self.locationList()[i].name());
                    infowindow.open(self.createMap, marker);
                }
            })(marker, i));
        }
    };

    //this.addMarkers();

    this.searchedLocation = function () {
        var locList = self.locationList().slice(),
            length = locList.length,
            valueEntered = self.currentLocation();

        var filteredList = locList.filter(function(loc){
            return loc.name() === valueEntered;
        });

        self.locationList = ko.observableArray(filteredList);

        self.addMarkers();

        self.locationList = ko.observableArray(self.fullLocationList);

    };

    this.createSearchBox = function () {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        //var searchBox = new google.maps.places.SearchBox(input);
        //self.createMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        //// Listen for the event fired when the user selects an item from the
        //// pick list. Retrieve the matching places for that item.
        //google.maps.event.addListener(searchBox, 'places_changed', function () {
        //    var places = searchBox.getPlaces();
        //    var markers = [];
        //    var bounds = new google.maps.LatLngBounds();
        //
        //    if (places.length == 0) {
        //        return;
        //    }
        //    for (i = 0; marker = markers[i]; i++) {
        //        marker.setMap(null);
        //    }
        //
        //    // For each place, get the icon, place name, and location.
        //    for (i = 0; place = places[i]; i++) {
        //        var image = {
        //            url: place.icon,
        //            size: new google.maps.Size(71, 71),
        //            origin: new google.maps.Point(0, 0),
        //            anchor: new google.maps.Point(17, 34),
        //            scaledSize: new google.maps.Size(25, 25)
        //        };
        //
        //        // Create a marker for each place.
        //        var marker = new google.maps.Marker({
        //            map: self.createMap,
        //            icon: image,
        //            title: place.name,
        //            position: place.geometry.location
        //        });
        //
        //        markers.push(marker);
        //
        //        bounds.extend(place.geometry.location);
        //    }
        //
        //    self.createMap.fitBounds(bounds);
        //});
        //
        //
        //google.maps.event.addListener(map, 'bounds_changed', function() {
        //    var bounds = map.getBounds();
        //    searchBox.setBounds(bounds);
        //});
    };

    google.maps.event.addDomListener(window, 'load', this.createSearchBox());
};


ko.applyBindings(new ViewModel());
