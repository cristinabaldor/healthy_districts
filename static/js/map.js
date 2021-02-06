// Creating map object


// Adding tile layer
var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
})

var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/light-v10",
  accessToken: API_KEY
})

var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 5,
  // layers: [lightmap, satellitemap]
});


lightmap.addTo(myMap);


var obesity_layer = new L.LayerGroup();
var income_layer = new L.LayerGroup();
var race_layer = new L.LayerGroup();
var smoking_layer = new L.LayerGroup();
var uninsured_layer = new L.LayerGroup();
var repdensity_layer = new L.LayerGroup();
var party_layer = new L.LayerGroup();

var baseMaps = {
  Grayscale: lightmap,
  "Dark Mode": darkmap,
  // Satellite: satellitemap,

}

var overlays = {
  "Political Party": party_layer,
  "Representation Density": repdensity_layer,
  "Obesity Rates": obesity_layer,
  "Median Income": income_layer,
  "Race (White vs. Non-White": race_layer,
  "Current Smokers": smoking_layer,
  "Uninsured": uninsured_layer,
};

L
  .control
  .layers(baseMaps, overlays)
  .addTo(myMap)


// Load in geojson data
var geoData = "static/data/healthy_districts.geojson"

var geojson;

// Choosing Party Colors

function chooseColor(party) {
  switch (party) {
    case "Republican":
      return "rgb(255, 99, 132)";
    case "Democrat":
      return "#104e8b";
    default:
      return "lightseagreen";
  }
}




// // Grab data with d3
d3.json(geoData, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function (feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.party),
        fillOpacity: 0.8,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.3
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.8
          })
        }
      })


      layer.bindPopup("<h3>" + feature.properties.state_district + "</h3> <hr> <h3>" +
        feature.properties.full_name + "</h3>" +
        "Party: " + feature.properties.party +
        "<br>Total Constituents: " + parseInt(feature.properties.totalpop).toLocaleString() +
        "<br>Median Income: " + "$" + parseInt(feature.properties.median_household_income).toLocaleString() +
        "<br>Uninsured: " + (feature.properties.lackinsurance * 100).toPrecision(2) + "%" +
        "<br>Current Smokers: " + (feature.properties.csmoking * 100).toPrecision(2) + "%" +
        "<br>Obesity Rate: " + (feature.properties.obesity * 100).toPrecision(2) + "%")

        .addTo(party_layer);

    }
  })
})

  party_layer.addTo(myMap);


  d3.json(geoData, function (densitydata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(densitydata, {

      // Define what  property in the features to use
      valueProperty: "totalpop",

      // Set color scale
      scale: ["white", "blue"],

      // Number of breaks in step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>Constituents: " + feature.properties.totalpop)
      }
    }).addTo(repdensity_layer);
  })

  // repdensity_layer.addTo(myMap);

  // // Grab data with d3
  d3.json(geoData, function (incomedata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(incomedata, {

      // Define what  property in the features to use
      valueProperty: "median_household_income",

      // Set color scale
      scale: ["white", "green"],

      // Number of breaks in step range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>Median Income: " + feature.properties.median_household_income)
      }
    }).addTo(income_layer)
  })

  // income_layer.addTo(myMap);

  d3.json(geoData, function (obesitydata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(obesitydata, {

      // Define what  property in the features to use
      valueProperty: "obesity",

      // Set color scale
      scale: ["white", "purple"],

      // Number of breaks in step range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>Obesity Rate: " + feature.properties.obesity)
      }
    }).addTo(obesity_layer);
  })

  // obesity_layer.addTo(myMap);

  d3.json(geoData, function (racedata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(racedata, {

      // Define what  property in the features to use
      valueProperty: "white",

      // Set color scale
      scale: ["brown", "white"],

      // Number of breaks in step range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>White Population: " + feature.properties.white)
      }
    }).addTo(race_layer);
  })

  // race_layer.addTo(myMap);

  d3.json(geoData, function (smokingdata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(smokingdata, {

      // Define what  property in the features to use
      valueProperty: "csmoking",

      // Set color scale
      scale: ["white", "red"],

      // Number of breaks in step range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>Current Smokers: " + feature.properties.csmoking)
      }
    }).addTo(smoking_layer);
  })

  // smoking_layer.addTo(myMap);

  d3.json(geoData, function (uninsureddata) {
    // console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(uninsureddata, {

      // Define what  property in the features to use
      valueProperty: "lackinsurance",

      // Set color scale
      scale: ["white", "blue"],

      // Number of breaks in step range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 0.5,
        fillOpacity: 0.4
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("District: " + feature.properties.state_district +
          "<br>Representative: " + feature.properties.full_name + ", " + feature.properties.party +
          "<br>Uninsured: " + feature.properties.lackinsurance)
      }
    }).addTo(uninsured_layer);
  })

  // uninsured_layer.addTo(myMap);

  // Merge with Dataset on GEOID

  // income_layer.eachLayer(function (layer) {
  //   if (layer.feature.properties.GEOID === district_health.GEOID) {
  //     for (var key in district_health) {
  //       layer.feature.properties[key] = district_health[key];
  //     }
  //   }
  // }).addTo(myMap);


  // Set up the legend
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function () {
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = geojson.options.limits;
  //   var colors = geojson.options.colors;
  //   var labels = [];

  //   // Add min & max
  //   var legendInfo = "<h1>Median Income</h1>" +
  //     "<div class=\"labels\">" +
  //     "<div class=\"min\">" + limits[0] + "</div>" +
  //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //     "</div>";

  //   div.innerHTML = legendInfo;

  //   limits.forEach(function (limit, index) {
  //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //   });

  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };

  // // Adding legend to the map
  // legend.addTo(income_layer);



  parseInt



