<template>
  <nav class="relative">
    <!-- Add relative position to the nav -->
    <div class="flex bg-primary py-2 px-2 items-center justify-between">
      <!-- Left Section (Logo) -->
      <a class="flex items-center hover:scale-105" href="/">
        <img src="../assets/logo.jpg" class="h-12 rounded-xl" alt="laWiki Logo" />
      </a>

      <!-- Center Section (Text) -->
      <a class="absolute left-1/2 transform -translate-x-1/2 flex items-center hover:scale-105 hover:underline"
        href="/">
        <span class="font-heading font-bold text-3xl">laWiki</span>
      </a>

      <!-- Right Section (Avatar) -->
      <div class="flex items-center space-x-1 font-body">
        <div v-if="this.authStore.token" class="relative mr-2">
          <NotificationBell :notifications="notifications" :user-id="userId"
            @notificationDeleted="removeNotification" />
        </div>
        <div v-if="this.authStore.user">
          <router-link :to="{ name: 'ProfilePage', params: { userId: userId } }">
            <oAuth :user="user" @login-success="handleLogin" />
          </router-link>
        </div>
        <div v-else>
          <oAuth :user="this.authStore.user" @login-success="handleLogin" />
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import { useAuthStore } from "../stores/auth";
import NotificationBell from "./Notification.vue";
import oAuth from "./oAuth.vue";
import axios from "axios";

export default {
  components: { NotificationBell, oAuth },

  data() {
    return {
      notifications: [], // Inital empty list
      userId: "-", // Placeholder value,
    };
  },

  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.getLoggedUser;
    },
    token() {
      return this.authStore.getLoggedUserToken;
    },
    isLoggedIn() {
      return this.authStore.isLoggedIn;
    },
  },

  methods: {
    async handleLogin(token) {
      try {
        await this.authStore.login(token); // Llamar al store para manejar el inicio de sesión
        this.userId = this.authStore.user._id; // Actualizar el ID del usuario

        // Obtener notificaciones después del inicio de sesión
        await this.fetchNotifications();
        location.reload(); // Recargar la página para actualizar componentes de las páginas
      } catch (error) {
        console.error("Error al manejar el inicio de sesión:", error);
      }
    },


    async fetchNotifications() {
      try {
        if (!this.isLoggedIn || !this.userId) return;

        const response = await axios.get(`/api/users/${this.userId}/notifications`);
        this.notifications = response.data || [];
        if (this.notifications.length === 0) {
          this.notifications.push({
            _id: "placeholder",
            message: "Nothing to see here...",
            read: true,
            isPlaceholder: true,
          });
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    },


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
      await this.authStore.verifyTokenAndRestore();
      const authToken = this.authStore.token;
      if (authToken) {
        console.log("Token encontrado en cookies. Restaurando sesión...");
        this.userId = this.authStore.user?._id || "-";

        // Configurar imagen predeterminada si falta
        if (this.authStore.user) {
          if (this.authStore.user.profilePicture) {
            this.authStore.user.picture = this.authStore.user.profilePicture;
          } else {
            this.authStore.user.picture =
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }
        }

        // Obtener notificaciones del usuario autenticado
        if (this.userId !== "-") {
          await this.fetchNotifications();
        }
      } else {
        console.log("No se encontró token. El usuario no ha iniciado sesión.");
      }
    } catch (error) {
      console.error("Error al inicializar el Navbar:", error);
    }
  },
};
</script>

<router-view :key="profilePageKey" />