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

    //this.createSearchBox = function (map) {
    //    // Create the search box and link it to the UI element.
    //    var input = document.getElementById('pac-input');
    //    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    //};


    this.searchedLocation = function (searchedLoc) {
        var filteredList = [],
            recenteredMap;

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
