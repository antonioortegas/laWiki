<template>
    <div id="map" style="height: 500px;"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
    name: 'MapComponent',
    props: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        markerLatitude: {
            type: Number,
            required: false,
            default: null
        },
        markerLongitude: {
            type: Number,
            required: false,
            default: null
        },
        markerText: {
            type: String,
            required: false,
            default: 'Another marker'
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            const map = L.map('map').setView([this.latitude, this.longitude], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

             // Add another marker if coordinates are provided
             if (this.markerLatitude !== null && this.markerLongitude !== null) {
                L.marker([this.markerLatitude, this.markerLongitude]).addTo(map)
                    .bindPopup(this.markerText)
                    .openPopup();
            }
        }
    }
};
</script>

<style>
#map {
    width: 100%;
    height: 100%;
}
</style>