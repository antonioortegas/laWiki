<template>
    <div id="map" ref="map" style="height: 400px;"></div>
  </template>
  
  <script>
  import L from "leaflet"; // Import Leaflet
  
  export default {
    name: "MapComponent",
    mounted() {
      // Initialize the map
      this.map = L.map(this.$refs.map).setView([51.505, -0.09], 13);
  
      // Add the OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
  
      // Add a marker
      L.marker([51.505, -0.09])
        .addTo(this.map)
        .bindPopup("This is a popup marker.")
        .openPopup();
    },
    beforeUnmount() {
      if (this.map) {
        this.map.remove(); // Clean up the map when the component is destroyed
      }
    },
  };
  </script>
  
  <style>
  /* Set a height for the map container */
  #map {
    height: 100%;
    width: 100%;
  }
  </style>
  