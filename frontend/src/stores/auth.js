// stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: null,
    }),

    getters: {
        /**
         * Devuelve el usuario autenticado.
         */
        getLoggedUser(state) {
            return state.user;
        },

        getLoggedUserToken(state) {
            return state.token;
        },

        /**
         * Comprueba si el usuario está autenticado.
         */
        isLoggedIn() {
            return this.verifyTokenAndRestore();
        },
    },

    actions: {
        /**
         * Inicia sesión con un token recibido desde el cliente de Google.
         * @param {string} googleToken - Token recibido de Google.
         */
        async login(googleToken) {
            try {
                const response = await axios.post("/api/users/login", { token: googleToken });

                // Guardar usuario y token en el estado
                this.token = response.data.customToken;
                this.user = response.data.user;

                // Almacena el token en una cookie para sesiones persistentes
                this.setAuthTokenCookie(this.token);

                console.log("Inicio de sesión exitoso. Usuario:", this.user);
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                throw new Error("No se pudo iniciar sesión. Inténtalo nuevamente.");
            }
        },

        /**
         * Verifica si el token almacenado en las cookies es válido y restaura la sesión si es posible.
         * @returns {boolean} - True si el token es válido, false si no lo es.
         */
        async verifyTokenAndRestore() {
            try {
                const token = await this.getAuthTokenFromCookie();
                const response = await axios.post("/api/users/validate-token", { token });
                if (response.data.valid) {
                    this.user = response.data.user; // Restaurar datos del usuario
                    await this.renewToken(); // Renovar el token en las cookies
                    return true;
                } else {
                    console.log("El token es inválido o ha caducado.");
                    this.logout();
                    return false;
                }
            } catch (error) {
                console.error("Error al verificar el token:", error);
                this.logout();
                return false;
            }
        },

        /**
         * Renueva el token actual si es necesario.
         */
        async renewToken() {
            const token = this.getAuthTokenFromCookie();
            if (!token) return;

            try {
                const response = await axios.post("/api/users/renew-token", { token });
                this.token = response.data.newToken;
                this.setAuthTokenCookie(this.token);
            } catch (error) {
                console.error("Error al renovar el token:", error);
                this.logout(); // Finalizar sesión si hay un error
            }
        },

        /**
         * Cierra la sesión del usuario.
         */
        logout() {
            this.deleteAuthTokenCookie();
            this.user = null;
            this.token = null;
            console.log("Sesión cerrada.");
        },

        /**
         * Configura una cookie para almacenar el token de autenticación.
         * @param {string} token - Token que se almacena en la cookie.
         */
        setAuthTokenCookie(token) {
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días
            document.cookie = `authToken=${token}; expires=${expirationTime.toUTCString()}; path=/`;
        },

        /**
         * Recupera el token de autenticación almacenado en las cookies.
         * @returns {string|null} El token o null si no existe.
         */
        getAuthTokenFromCookie() {
            const name = "authToken=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookies = decodedCookie.split(";");

            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name)) {
                    return cookie.substring(name.length);
                }
            }
            return null;
        },

        /**
         * Elimina la cookie del token de autenticación.
         */
        deleteAuthTokenCookie() {
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        },
    },
});
