<template>
    <div>
      <h1>Prueba de NotificationBell</h1>
      <NotificationBell :notifications="notifications" />
    </div>
  </template>

  <script>
  import NotificationBell from "./Notification.vue";
  import axios from 'axios';

  export default {
    components: { NotificationBell },
    data() {
      return {
        notifications: [], // Lista inicial
        userId: '673ce5d3fab87753faa8455c' // TODO: Cambia esto al ID dinámico del usuario
      };
    },
    async mounted() {
      try {
        const response = await axios.get(`http://localhost:3001/users/${this.userId}/notifications`);

        console.log("Respuesta del backend:", response.data); // Depuración
        this.notifications = response.data || [];
      } catch (error) {
        console.error('Error al obtener lista de notificaciones:', error);
      }
    }
  };
  </script>

  <style scoped>
  h1 {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
