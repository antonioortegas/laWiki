<template>
  <div>
    <div v-if="!user">
      <a href="#" @click.prevent="openSignInDialog">Login</a>
    </div>
    <div v-else>
      <img :src="user.picture" alt="User photo" style="width: 50px; height: 50px; border-radius: 50%" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  methods: {
    openSignInDialog() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt(); // Abre el cuadro de diálogo de inicio de sesión
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
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com",
        callback: this.handleCredentialResponse,
        auto_select: false,
      });
      console.log("Google Identity Services inicializado.");
    };

    document.head.appendChild(script);
  },
};
</script>