<template>
    <div class="notification-bell">
      <!-- Icon -->
      <div class="bell" @click="toggleNotifications">
        <i class="fas fa-bell"></i>
        <span v-if="unreadCount > 0" class="indicator">{{ unreadCount }}</span>
      </div>
  
      <!-- Notification List -->
      <div v-if="isDropdownOpen" class="notification-list">
        <ul>
          <li
            v-for="notification in notifications"
            :key="notification.id"
            :class="{ unread: !notification.read }"
            @click="markAsRead(notification)"
          >
            {{ notification.message }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "NotificationBell",
    props: {
      notifications: {
        type: Array,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isDropdownOpen: false,
      };
    },
    computed: {
      unreadCount() {
        return this.notifications.filter((n) => !n.read).length;
      },
    },
    methods: {
      toggleNotifications() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
  
      async markAsRead(notification) {
        if (notification.read) return;
  
        notification.read = true;
  
        // Send read call to the server
        try {
          const response = await axios.put(
            `http://localhost:3001/users/${this.userId}/read/`,  // MODIFY TO FINAL ENDPOINT
            { id: notification.id }
          );
  
          // Si la notificación se actualiza correctamente
          console.log('Notificación marcada como leída:', response.data);
        } catch (error) {
          console.error('Error al actualizar la notificación:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .notification-bell {
    position: relative;
    display: inline-block;
  }
  
  .bell {
    cursor: pointer;
    position: relative;
    font-size: 24px;
  }
  
  .indicator {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .notification-list {
    position: absolute;
    top: 35px;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .notification-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .notification-list li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    color: black;
  }
  
  .notification-list li.unread {
    background: white;
  }
  
  .notification-list li:not(.unread) {
    background: #f9f9f9;
    color: gray;
    font-style: italic;
  }
  
  .notification-list li:hover {
    background: #ececec;
  }
  </style>
  