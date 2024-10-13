// Initializing the map
const map = L.map('map').setView([20, 0], 2);  // Center the map globally

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FFEDA0';
}

// Function to get the radius based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 4;  // Scale the radius based on the magnitude
}

// Fetch earthquake GeoJSON data from the provided URL
const geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

d3.json(geojsonUrl).then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // Create circle markers with customized styles based on depth and magnitude
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),  // Depth is the 3rd coordinate
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // Add popups to each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
                             <p>Magnitude: ${feature.properties.mag}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                             <p>Date: ${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(map);
});

// Add a legend to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend'),
          grades = [0, 10, 30, 50, 70, 90],
          labels = [];

    div.innerHTML += '<strong>Depth (km)</strong><br>';
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);
