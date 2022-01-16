var outdoors_background = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?' + 'access_token=pk.eyJ1IjoiamNvcnRlejAyIiwiYSI6ImNreWhsMDR1YzEzZnAzMXBsOGx4MnZ1cXUifQ.w2w9UGschUOzfD1oNrImIA');
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 'access_token=pk.eyJ1IjoiamNvcnRlejAyIiwiYSI6ImNreWhsMDR1YzEzZnAzMXBsOGx4MnZ1cXUifQ.w2w9UGschUOzfD1oNrImIA');

var myMap = L.map("map", {
  center: [44.96, -103.77],
  zoom: 5,
  layers: [layer1]
});

layer1.addto(map);

var earthquakes = new L.LayerGroup()
var tectonicplates = new L.LayerGroup();

var baseMaps = {
  Outdoors: outdoors_background
  Satellite: satellitemap_background
};

var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};

L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

  var earthquake_data = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';

d3.json(earthquake_data),function(data) {
  
  function markerSize(magnitude) {
    if (magnitude = 0){
      return 1;
    }
    return magnitude * 3;
  }

  function chooseColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#581845";
      case magnitude > 4:
        return "#900C3F";
      case magnitude > 3:
        return "#C70039";
      case magnitude > 2:
        return "#FF5733";
      case magnitude > 1:
        return "#FFC300";
      default:
        return "#DAF7A6";
    }
  } 

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),   
      stroke: true,
      weight: 0.5
    };
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }  }
  
  }).addTo(earthquakes);
  
  earthquakes.addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);

  // retrive Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer to the map.
      tectonicplates.addTo(map);
    });
  }
});
