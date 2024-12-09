<script setup>
import axios from "axios";
defineProps({
  username: {
    type: String,
    required: true,
    default: "Username",
  },
  userPfp: {
    type: String,
    required: true,
    default: "https://placehold.co/400x400",
  },
});

const exampleUserId = "SprenBonded";
</script>

<template>
  <nav class="relative">
    <!-- Add relative position to the nav -->
    <div class="flex bg-primary py-2 px-2 items-center justify-between">
      <!-- Left Section (Logo) -->
      <a class="flex items-center hover:scale-105" href="/">
        <img src="../assets/logo.jpg" class="h-12 rounded-xl" alt="laWiki Logo" />
      </a>

      <!-- Center Section (Text) -->
      <a class="absolute left-1/2 transform -translate-x-1/2 flex items-center hover:scale-105 hover:underline" href="/">
        <span class="font-heading font-bold text-3xl">laWiki</span>
      </a>

      <!-- Right Section (Avatar) -->
      <div class="flex items-center space-x-1 font-body">
        <div class="relative mr-2">
          <NotificationBell
            :notifications="notifications"
            :user-id="userId"
            @notificationDeleted="removeNotification"
             />
        </div>
        <router-link :to="{ name: 'ProfilePage', params: { userId: exampleUserId } }">
        <div class="flex items-center hover:scale-105">
            <span class="hidden sm:block text-md md:text-md font-semibold mr-2 hover:underline underline-offset-3">{{
              username }}</span>
            <img :src="userPfp" class="h-12 rounded-full" alt="User Profile Picture" />
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<!-- Notification script -->
<script>
import NotificationBell from "./Notification.vue";


const exampleNotification = 
  {
    _id: "1",
    message: "Welcome to laWiki!",
    read: false,
    isPlaceholder: false,
  };


export default {
  components: { NotificationBell },
  data() {
    return {
      notifications: [
        {
          _id: "1",
          message: "Welcome to laWiki!",
          read: false,
          isPlaceholder: false,
        },
      ], // Inital empty list
      userId: "6744ce2eb67a4a58bf6954c0", // TODO: Cambiar esto al ID dinámico del usuario
    };
  },
  methods: {
    // Update the notifications list after deleting a notification
    removeNotification(notificationId) {
      this.notifications = this.notifications.filter((n) => n._id !== notificationId);
      
      if (this.notifications.length === 0) {
        this.notifications.push({
          _id: "placeholder",
          message: "Nothing to see here...",
          read: true,
          isPlaceholder: true,
      });
    }
    },
  },
  async mounted() {
    try {
      const path = `api/users/${this.userId}/notifications`;
      const response = await axios.get(`/api/users/${this.userId}/notifications`);
      console.log("Path:", path);
      console.log("Response:", response);
      if(Array.isArray(response.data)) {
        this.notifications = response.data;
        console.log("Notifications:", this.notifications);
      } else {
        this.notifications = [];
        console.error("Invalid response data:", response.data);
      }

      this.notifications = response.data || [];

      if (this.notifications.length === 0) { //use a placeholder if there are no notifications
        this.notifications.push({
          id: "placeholder", // Unique ID for the placeholder
          message: "Nothing to see here...",
          read: true,
          isPlaceholder: true,
        });
      }
    } catch (error) {
      console.error("Error retrieving notifications:", error);
    }
  },
};
</script>
