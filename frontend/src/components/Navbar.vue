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
        <div class="relative mr-2">
          <NotificationBell :notifications="notifications" :user-id="userId"
            @notificationDeleted="removeNotification" />
        </div>
          <router-link :to="{ name: 'ProfilePage', params: { userId: userId } }">
            <oAuth :user="user" @login-success="handleLogin" />
          </router-link>
        </div>
    </div>
  </nav>
</template>

<!-- Notification script -->
<script>
import NotificationBell from "./Notification.vue";
import oAuth from "./oAuth.vue";
import axios from "axios";

// Función para manejar cookies
const setAuthTokenCookie = (token) => {
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + 7 * 24 * 60 * 60 * 1000);
  document.cookie = `authToken=${token}; expires=${expirationTime.toUTCString()}; path=/`;
};

// Función para obtener el token de las cookies
const getAuthTokenFromCookie = () => {
  const name = "authToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null; // Si no se encuentra la cookie
};

// Función para eliminar la cookie
const deleteAuthTokenCookie = () => {
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};


export default {
  components: { NotificationBell, oAuth },
  data() {
    return {
      user: null,
      notifications: [], // Inital empty list
      userId: "123456789012345678901234", // TODO: Cambiar esto al ID dinámico del usuario
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
    async verifyTokenLocally() {
      const authToken = getAuthTokenFromCookie();
      if (authToken) {
        axios
          .post("/api/users/validate-token", { token: authToken })
          .then((response) => {
            if (response.data.valid) {
              this.user = response.data.user; // Establecer datos del usuario
              this.userId = this.user._id; // Establecer el ID del usuario
              console.log("Sesión válida. Nuevo userId:", this.userId);
              this.renewToken(); // Se renueva el token para alargar la sesión

              // Al recuperar del backend la imagen no funcionaba, con esto se corrige
              if (this.user.profilePicture) {
                this.user.picture = this.user.profilePicture;
              } else {
                console.log("No se ha encontrado una imagen de perfil. Usando imagen predeterminada. Usuario:", this.user);
                this.user.picture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
              }
            } else {
              console.warn("Token inválido o caducado. Se ha cerrado la sesión");
              this.signOut(); // Limpiar estado y redirigir
            }
          })
          .catch((error) => {
            console.error("Error al validar el token:", error);
            this.signOut();
          });
      } else {
        console.log("No hay token almacenado.");
        //google.accounts.id.prompt();
      }
    },
    async renewToken() {
      const authToken = getAuthTokenFromCookie();
      if (authToken) {
        try {
          const response = await axios.post("/api/users/renew-token", { token: authToken });
          setAuthTokenCookie(response.data.newToken);
        } catch {
          this.signOut();
        }
      }
    },
    async handleLogin(token) {
      try {
        const response = await axios.post("/api/users/login", { token });
        if (response.data.customToken) {
          setAuthTokenCookie(response.data.customToken);
          this.user = response.data.user;
          this.userId = this.user._id; // Establecer el ID del usuario para el router

          if (this.user.profilePicture) {
            this.user.picture = this.user.profilePicture;
          } else {
            console.log("No se ha encontrado una imagen de perfil. Usando imagen predeterminada. Usuario:", this.user);
            this.user.picture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }
        }
      } catch (error) {
        console.error("Error al manejar el login:", error);
      }
    },
    signOut() {
      deleteAuthTokenCookie();
      this.user = null;
    },
  },
  async mounted() {
    try {
      this.verifyTokenLocally();

      const path = `api/users/${this.userId}/notifications`;
      const response = await axios.get(`/api/users/${this.userId}/notifications`);
      console.log("Path:", path);
      console.log("Notifications Response:", response);
      if (Array.isArray(response.data)) {
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
