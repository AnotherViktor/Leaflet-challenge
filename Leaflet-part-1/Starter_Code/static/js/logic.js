// logic.js

// Define the GeoJSON URL
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
const myMap = L.map("map").setView([37.09, -95.71], 5); // Centered on the US

// Add a tile layer (background map image) to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to set the style of each earthquake marker based on its properties
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]), // Depth determines color
    color: "#000000",
    radius: getRadius(feature.properties.mag), // Magnitude determines radius
    stroke: true,
    weight: 0.5
  };
}

// Function to determine the color of a marker based on depth
function getColor(depth) {
  return depth > 90 ? "#FF4500" :
         depth > 70 ? "#FF6347" :
         depth > 50 ? "#FFA500" :
         depth > 30 ? "#FFD700" :
         depth > 10 ? "#ADFF2F" :
                      "#00FF00";
}

// Function to determine the radius of a marker based on magnitude
function getRadius(magnitude) {
  return magnitude === 0 ? 1 : magnitude * 4; // Minimum size for magnitude 0
}

// Fetch the GeoJSON data
d3.json(earthquakeUrl).then(function(data) {
  // Create a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Turn each feature into a circle marker on the map
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style each marker
    style: styleInfo,
    // Add popups with information about the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km<br>Location: ${feature.properties.place}`);
    }
  }).addTo(myMap);
});
