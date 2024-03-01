
var map = L.map('map').setView([0, 0], 2);

// Base maps
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to get marker color based on depth
function getMarkerColor(depth) {
    return depth < 30 ? 'lightgreen' :
           depth < 70 ? 'orange' :
                        'red';
}

// Fetch earthquake data from USGS GeoJSON feed
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
fetch(url)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];

                var markerSize = magnitude * 5;
                var markerColor = getMarkerColor(depth);

                var marker = L.circleMarker(latlng, {
                    radius: markerSize,
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 0.7
                });

                // Popup content
                var popupContent = `<b>Location:</b> ${feature.properties.place}<br>`;
                popupContent += `<b>Magnitude:</b> ${magnitude}<br>`;
                popupContent += `<b>Depth:</b> ${depth} km`;

                marker.bindPopup(popupContent);

                return marker;
            }
        }).addTo(map);

        // Legend
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<b>Depth Legend</b><br>';
            div.innerHTML += '<i style="background: lightgreen"></i> Depth < 30 km<br>';
            div.innerHTML += '<i style="background: orange"></i> 30 km ≤ Depth < 70 km<br>';
            div.innerHTML += '<i style="background: red"></i> Depth ≥ 70 km<br>';
            return div;
        };
        legend.addTo(map);
    })
    .catch(error => {
        console.error('Error loading earthquake data:', error);
    });




  