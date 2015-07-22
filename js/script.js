var initialLocations = [
    ['Khram Zhivonachalnoy Troitsy V Ostankino', 55.824061, 37.613699],
    ['Park Ostankino', 55.829135, 37.615363],
    ['Teletsentr', 55.821795, 37.608850],
    ['Twin Pigs', 55.820891, 37.607262],
    ['Ostankino Television Tower', 55.819686, 37.611725],
    ['Ostankinskiy Prud', 55.822705, 37.613979],
    ['All-Russian Exhibition Center', 55.831112, 37.629835],
    ['Krugovaya Kinopanorama', 55.827050, 37.630028],
    ['Memorial Museum of Cosmonautics', 55.822699, 37.639963],
    ['Moscow Botanical Garden', 55.838933, 37.603000]
];

var Location = function (data) {
    this.name = ko.observable(data[0]);
    this.latitude = ko.observable(data[1]);
    this.longitude = ko.observable(data[2]);
};

// TODO: correct input of empty field or out-of-search-range object
var ViewModel = function () {
    var TILE_SIZE = 256;
    var pixelMaxDiff = 300;
    var self = this,
        infowindow = new google.maps.InfoWindow();
    var marker, i, currentMap, currentLocation, previousLocation;
    var markers = [];
    this.locationNames = [];

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function (location) {
        self.locationList.push(new Location(location));
    });

    this.locationList().forEach(function (location) {
        self.locationNames.push(location.name());
    });

    // Determines the location that was selected last
    this.currentLocationName = ko.observable();

    currentLocation = this.locationList()[0];

    // Create map centered at the initially specified location
    currentMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
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

    function bound(value, opt_min, opt_max) {
        if (opt_min != null) {
            value = Math.max(value, opt_min);
        }
        if (opt_max != null) {
            value = Math.min(value, opt_max);
        }
        return value;
    }

    function degreesToRadians(deg) {
        return deg * (Math.PI / 180);
    }

    /** @constructor */
    function MercatorProjection() {
        this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
                                                  TILE_SIZE / 2);
        this.pixelsPerLonDegree_ = TILE_SIZE / 360;
        this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
    }

    MercatorProjection.prototype.fromLatLngToPoint = function (latLng,
                                                               opt_point) {
        var me = this;
        var point = opt_point || new google.maps.Point(0, 0);
        var origin = me.pixelOrigin_;

        point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
                         0.9999);
        point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
        return point;
    };


    this.searchedLocation = function (searchedLoc) {
        var filteredList = [],
            projection = new MercatorProjection(),
            numTiles = 1 << currentMap.getZoom(),
            currentLocationLatLng,
            previousLocationLatLng,
            currentLocPxlCoord,
            previousLocPxlCoord,
            cathetus1,
            cathetus2,
            distance;

        var square = function (a) {
            return a * a
        };


        // Set the map on all markers in the array.
        var setAllMap = function (map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        };

        // Remove the markers from the map, but keeps them in the array.
        var clearMarkers = function () {
            setAllMap(null);
        };

        // check the input from the searchbox; then check the input from the clicked element of the list of locations;
        // in the latter case also change this.currentLocationName()
        if (!(searchedLoc instanceof Location)) {
            filteredList = self.locationList().filter(function (loc) {
                return loc.name() === self.currentLocationName();
            });
        } else {
            self.currentLocationName(searchedLoc.name());
            filteredList = self.locationList().filter(function (loc) {
                return loc.name() === searchedLoc.name();
            });
        }

        // Check the input for validity (discard empty or those not in the list of available locations)
        if (filteredList.length === 0) {
            return;
        }

        previousLocation = currentLocation;
        currentLocation = filteredList[0];
        currentLocationLatLng = new google.maps.LatLng(currentLocation.latitude(), currentLocation.longitude());
        previousLocationLatLng = new google.maps.LatLng(previousLocation.latitude(), previousLocation.longitude());
        previousLocPxlCoord = projection.fromLatLngToPoint(currentLocationLatLng);
        currentLocPxlCoord = projection.fromLatLngToPoint(previousLocationLatLng);
        cathetus1 = Math.abs(previousLocPxlCoord.x - currentLocPxlCoord.x) * numTiles;
        cathetus2 = Math.abs(previousLocPxlCoord.y - currentLocPxlCoord.y) * numTiles;
        distance = Math.sqrt(square(cathetus1) + square(cathetus2));

        clearMarkers();

        // add marker(s) of the found location(s) and recenter map if the distance between the found location and
        // previous map center is big enough
        if (distance > pixelMaxDiff) {
            currentMap.setCenter(currentLocationLatLng);
            self.addMarkers(currentMap, filteredList);

        } else {
            self.addMarkers(currentMap, filteredList);
        }

    };

    // Initialization: create the initial map with all markers present
    this.addMarkers(currentMap, self.locationList());

};

ko.applyBindings(new ViewModel());

