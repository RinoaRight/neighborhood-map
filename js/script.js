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

// TODO: make new map only in cases when the marker is farther than n pxls from the previous;
// TODO: make search based on parts of words (maybe autocomplete as well), and make it register insensitive
// TODO: correct input of empty field or out-of-search-range object
var ViewModel = function () {
    var TILE_SIZE = 256;
    var self = this,
        infowindow = new google.maps.InfoWindow();
    var marker, i, initialMap;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function (location) {
        self.locationList.push(new Location(location));
    });

    // Determines the location that was selected last
    this.currentLocationName = ko.observable();

    // Creates map centered at the specified location
    initialMap = new google.maps.Map(document.getElementById('map'), {
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
        }
    };

    this.createMap = function (map, locList) {
        self.addMarkers(map, locList);
    };


    function bound(value, opt_min, opt_max) {
        if (opt_min != null) value = Math.max(value, opt_min);
        if (opt_max != null) value = Math.min(value, opt_max);
        return value;
    }

    function degreesToRadians(deg) {
        return deg * (Math.PI / 180);
    }

    //function radiansToDegrees(rad) {
    //    return rad / (Math.PI / 180);
    //}

    /** @constructor */
    function MercatorProjection() {
        this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
                                                  TILE_SIZE / 2);
        this.pixelsPerLonDegree_ = TILE_SIZE / 360;
        this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
    }

    MercatorProjection.prototype.fromLatLngToPoint = function(latLng,
                                                              opt_point) {
        var me = this;
        var point = opt_point || new google.maps.Point(0, 0);
        var origin = me.pixelOrigin_;

        point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
                         0.9999);
        point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
                             -me.pixelsPerLonRadian_;
        return point;
    };



    this.searchedLocation = function (searchedLoc) {
        var filteredList = [],
            recenteredMap;


        var projection = new MercatorProjection();
        var testCoord = new google.maps.LatLng (filteredList[0].latitude(), filteredList[0].longitude());
        console.log(projection.fromLatLngToPoint(testCoord));

        if (!(searchedLoc instanceof Location)) {
            filteredList = self.locationList().filter(function (loc) {
                return loc.name() === self.currentLocationName();
            });
        } else {
            filteredList = self.locationList().filter(function (loc) {
                return loc.name() === searchedLoc.name();
            });
        }

        recenteredMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(filteredList[0].latitude(), filteredList[0].longitude()),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        //remove all markers
        self.createMap(initialMap, []);

        // add marker(s) of the found location(s)
        self.createMap(recenteredMap, filteredList);

    };

    // Initialization: create the initial map with all markers present
    this.createMap(initialMap, self.locationList());

};

ko.applyBindings(new ViewModel());
