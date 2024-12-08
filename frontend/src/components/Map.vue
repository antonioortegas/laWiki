<template>
    <div  :style="mapStyle"id="map" ></div>
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
        },
        width: {
            type: String,
            required: false,
            default: '100%'
        },
        height: {
            type: String,
            required: false,
            default: '100%'
        },
        zoom: {
            type: Number,
            required: false,
            default: 13
        },
        position: {
            type: String,
            required: false,
            default: 'relative'
        },
        top: {
            type: String,
            required: false,
            default: 'auto'
        },
        right: {
            type: String,
            required: false,
            default: 'auto'
        },
        bottom: {
            type: String,
            required: false,
            default: 'auto'
        },
        left: {
            type: String,
            required: false,
            default: 'auto'
        }
    },
    computed: {
        mapStyle() {
            return {
                width: this.width,
                height: this.height,
                position: this.position,
                top: this.top,
                right: this.right,
                bottom: this.bottom,
                left: this.left
            };
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            const map = L.map('map').setView([this.latitude, this.longitude], this.zoom);

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
    width: 32rempx !important;
    height: 16rem !important;
    inset: 0px !important;
    z-index: 0 !important;
}
</style>