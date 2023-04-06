// Store our API endpoint as queryUrl.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url).then(function(data) {
    console.log(data);

    var features = data.features;
    var depths = [];

    for (var i = 0; i < features.length; i++) {
        var coordinates = features[i].geometry.coordinates;
        var lat = coordinates[1];
        var lon = coordinates[0];
        var depth = coordinates[2];
        depths.push(depth);
        var properties = features[i].properties;
        var place = properties.place;
        var mag = properties.mag;
        
        // Create the circle for each earthquake
        circles = L.circleMarker([lat, lon], {
            color: "black",
            weight: 1,
            fillColor: circleColor(depth),
            fillOpacity: 0.75,
            radius: circleRadius(mag)
        }).bindPopup(`<h3>${place}</h3><h4>Magnitude: ${mag}<br/>Depth: ${depth} KM<br></h4>`).addTo(myMap);
    };
});

// Create function to determine the radius of the circles
function circleRadius(mag) {
    return mag * 5
};

// Create function to select the color to fill the circles
function circleColor(depth) {
    if (depth < 10) return "Green"
    else if (depth < 30) return "LightGreen"
    else if (depth < 50) return "Yellow"
    else if (depth < 70) return "papayawhip"
    else if (depth < 90) return "Orange"
    else return "Red"
};

// Create street tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create map object
var myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 5,
    layers: street
});

// Create legend box
var legend = L.control({position: "bottomleft"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<h3>Earthquake depth (km)</h3>';
    div.innerHTML += '<i style = "background: Green"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style = "background: LightGreen"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style = "background: Yellow"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style = "background: papayawhip"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style = "background: Orange"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style = "background: Red"></i><span>90+</span><br>';
 
    return div;
};

// Add legend box into the map
legend.addTo(myMap)