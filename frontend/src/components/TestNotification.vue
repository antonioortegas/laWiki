<template>
    <div>
      <h1>Prueba de NotificationBell</h1>
      <NotificationBell :notifications="notifications" />
    </div>
  </template>
  
  <script>
  import NotificationBell from "./Notification.vue";
  
  export default {
    name: "TestNotificationBell",
    components: {
      NotificationBell,
    },
    data() {
      return {
        notifications: this.generateRandomNotifications(),
      };
    },
    methods: {
      generateRandomNotifications() {
        const notifications = [];
        for (let i = 1; i <= 10; i++) {
          notifications.push({
            id: i,
            message: `Notificación ${i}`,
            read: Math.random() > 0.5, // Aleatorio: leído o no leído
          });
        }
        return notifications;
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  