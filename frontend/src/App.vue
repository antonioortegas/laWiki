<template>
  <div>
    <h1>OpenStreetMap in Vue</h1>
    <MapComponent />
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