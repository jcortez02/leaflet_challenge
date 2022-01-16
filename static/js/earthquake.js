var myMap = L.map("map", {
  center: [44.96, -103.77],
  zoom: 4.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var earthquake_data = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';
