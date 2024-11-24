<template>
  <div>
    <h1>OpenStreetMap in Vue</h1>
    <MapComponent 
      :latitude="36.7150" 
      :longitude="-4.4783" 
      :markerLatitude="36.7150"
      :markerLongitude="-4.4783"
      markerText="Módulo de prisión de Alcalá meco" />
  </div>
</template>

<script>
import MapComponent from "./components/mapComponent.vue";

export default {
  components: {
    MapComponent,
  },
};
</script>