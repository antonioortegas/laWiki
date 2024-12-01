<template>
  <div class="notification-bell">
    <!-- Bell icon -->
    <div class="bell" @click="toggleNotifications">
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="indicator">{{ unreadCount }}</span>
    </div>

    <!-- Notification list -->
    <div v-if="isDropdownOpen" class="notification-list">
      <ul>
        <li v-for="notification in notifications" :key="notification.id"
          :class="{ unread: !notification.read, placeholder: notification.isPlaceholder }"
          @click="markAsRead(notification)">
          <div class="notification-content">
            <span>{{ notification.message }}</span>
            <button v-if="!notification.isPlaceholder" class="delete-btn"
              @click.stop="deleteNotification(notification)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    // Count the number of unread notifications
    unreadCount() {
      return this.notifications.filter((n) => !n.read && !n.isPlaceholder).length;
    },
  },
  methods: {
    toggleNotifications() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async deleteNotification(notification) {
      if (notification.isPlaceholder) {
        return;
      }

      try {
        await axios.delete(
          `/api/users/${this.userId}/deleteNotification/${notification._id}`
        );
        console.log("Notificación eliminada:", notification._id);
        this.$emit("notificationDeleted", notification._id);
      } catch (error) {
        console.error("Error al eliminar la notificación:", error);
      }
    },
    async markAsRead(notification) {
      if (notification.read) return;

      notification.read = true;

      // Send read call to the server
      try {
        const response = await axios.put(
          `/api/users/${this.userId}/read/`,
          { idNotification: notification._id }
        );
      } catch (error) {
        console.error('Error al actualizar la notificación:', error);
        console.error('Detalle del error:', error.response?.data || error.message);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  color: black;
}

.notification-list li.placeholder {
  background: #f5f5f5;
  color: gray;
  font-style: italic;
}

.notification-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.notification-content span {
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: gray;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-btn:hover {
  color: red;
}

.notification-list li.unread {
  background: white;
}

.notification-list li:not(.unread) {
  background: #f9f9f9;
  color: gray;
}

.notification-list li:hover {
  background: #ececec;
}
</style>
