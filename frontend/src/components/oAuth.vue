<template>
  <div>
    <div v-if="!user">
      <a href="#" @click.prevent="openSignInDialog">Login</a>
    </div>
    <div v-else>
      <img v-if="this.authStore.user.profilePicture" :src="this.authStore.user.profilePicture" alt="User photo"
        style="width: 50px; height: 50px; border-radius: 50%" />
      <img v-else src="../assets/blank-profile-picture-973460_1280.webp" alt="User photo"
        style="width: 50px; height: 50px; border-radius: 50%" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";

export default {
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.getLoggedUser;
    },
  },
  methods: {
    openSignInDialog() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // Abre el cuadro de diálogo de inicio de sesión
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {    // Si por cualquier motivo no se muestra el cuadro de inicio de sesión
            console.log("El cuadro de inicio de sesión no se mostró.");
            alert("Google login services are unavailable or in cooldown at this moment. Please try again later.");
            document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";    // Elimina la cookie de cooldown
          }
        });
      } else {
        console.error("Google Identity Services no está disponible.");
      }
    },
    handleCredentialResponse(response) {
      if (response.credential) {
        console.log("Credencial recibida:", response.credential);
        this.$emit("login-success", response.credential); // Emitir evento con el token
      } else {
        console.error("No se recibió credencial.");
      }
    },
  },
  mounted() {
    if (!document.querySelector("script[src='https://accounts.google.com/gsi/client']")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.initialize({
            client_id: "182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com",
            callback: this.handleCredentialResponse,
            auto_select: false,
          });
          console.log("Google Identity Services inicializado.");
        } else {
          console.error("Google Identity Services no está disponible.");
        }
      };

      document.head.appendChild(script);
    } else {
      console.log("Google Identity Services ya está cargado.");
    }
  },
};
</script>