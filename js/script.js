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
    var self = this,
        infowindow = new google.maps.InfoWindow(),
        markers = [];
    // TODO: check if 'place' is still needed
    var marker, i, place, createInitialMap;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function (location) {
        self.locationList.push(new Location(location));
    });
    // TODO: check if this is still needed
    this.fullLocationList = this.locationList.slice();

    // Determines the location that was selected last
    this.currentLocation = ko.observable();

    // Creates map centered at the specified location
    createInitialMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(this.locationList()[0].latitude(), this.locationList()[0].longitude()),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.addMarkers = function (map, locList) {
        for (i = 0; i < locList.length; i += 1) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locList[i].latitude(), locList[i].longitude()),
                map: map
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locList[i].name());
                    infowindow.open(map, marker);
                }
            })(marker, i));
            markers.push(marker);
        }
    };

    // Sets the map on all markers in the array
    this.setAllMap = function (map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    };

    this.addMarkers(createInitialMap, this.locationList());

    this.searchedLocation = function () {
        var filteredList = [],
            createRecenteredMap;

        filteredList = self.locationList().filter(function (loc) {
            return loc.name() === self.currentLocation();
        });

        createRecenteredMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(filteredList[0].latitude(), filteredList[0].longitude()),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        //remove all markers
        self.setAllMap(null);

        // add marker(s) of the found location(s)
        self.addMarkers(createRecenteredMap, filteredList);

    };

    this.createSearchBox = function () {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        //var searchBox = new google.maps.places.SearchBox(input);
        //createInitialMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
        //            map: createInitialMap,
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
        //    createInitialMap.fitBounds(bounds);
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
