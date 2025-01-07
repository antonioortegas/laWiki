<template>
    <div v-if="isDataReady">
        <div v-if="user">

            <div class="">
                <div class="shadow-lg bg-accent h-[72.5vh] my-16 mx-8 sm:mx-32 rounded-3xl">
                    <div class="h-1/6 relative">
                        <div class="absolute inset-0 flex justify-center items-end -bottom-10">
                            <img class="object-cover h-20 w-20 rounded-full border-4 border-background"
                                :src="user.profilePicture" alt="User profile picture" />
                        </div>
                    </div>
                    <div class="h-5/6 bg-background rounded-3xl p-8 font-body">
                        <!-- User Info -->
                        <div class="text-center my-6">
                            <h2 class="text-xl font-bold">{{ user.name }}</h2>
                            <p class="text-sm text-gray-600">{{ user.email }}</p>
                        </div>

                        <!-- Stats Section -->
                        <div class="grid grid-cols-2 gap-4 text-center mb-6">
                            <!-- Number of Comments -->
                            <div>
                                <h3 class="text-lg font-semibold ">Comments</h3>
                                <p class="text-sm text-gray-600 mt-2">{{ userComments }}</p>
                                <!-- TODO: Obtener comentarios creados por el usuario -->
                            </div>
                            <!-- Number of Entries -->
                            <div>
                                <h3 class="text-lg font-semibold ">Entries</h3>
                                <p class="text-sm text-gray-600 mt-2">{{ userEntries }}</p>
                                <!-- TODO: Obtener entradas creadas por el usuario -->
                            </div>
                            <!-- Average Rating -->
                            <div>
                                <h3 class="text-lg font-semibold">Average Rating</h3>
                                <div class="flex justify-center items-center mt-2">
                                    <!-- Component StarRating -->
                                    <StarRating :value="averageRating" :profileUserId="profileUserId"
                                        :loggedUser="loggedUser" />
                                </div>
                            </div>
                            <!-- Additional Info -->
                            <!--
                            <div>
                                <h3 class="text-lg font-semibold ">Additional Info</h3>
                                <p class="text-sm text-gray-600 mt-2">{{ exampleUser.additionalInfo }}</p>
                            </div>
                            -->
                        </div>

                        <!-- Email Notifications Toggle (Only visible if logged user email matches profile owner email) -->
                        <div v-if="loggedUser && (loggedUser.email === user.email)" class="mt-4">
                            <h3 class="text-center font-semibold">Get notifications by email?:
                                <input type="checkbox" v-model="notificationsEnabled"
                                    @change="changeNotificationConsent" class="mt-2" /><br />
                            </h3>
                            <div class="text-center text-sm text-gray-600 mt-2">
                                <button @click="signOut"
                                    class="mt-5 bg-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 transform transition-transform hover:scale-105 px-6 py-3">
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <!-- User Bio/Info -->
                        <!--
                        <div class="text-gray-700 mx-4 text-center mt-12">
                            <h3 class="text-lg font-bold mb-2">About</h3>
                            <p class="text-sm leading-relaxed text-left">
                                {{ exampleUser.bio }}
                            </p>
                        </div>
                        -->
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-gray-700 mx-4 text-center mt-12" style="height: 10vh; color: gray;">
            <p>No user found.</p>
        </div>
    </div>
    <div v-else class="text-gray-700 mx-4 text-center mt-12" style="height: 10vh; color: gray;">
        <p>Loading...</p>
    </div>
</template>

<script>
import StarRating from '../components/StarRating.vue';
import { useAuthStore } from "../stores/auth"; // Asume que usas Pinia o Vuex
import axios from 'axios';
const VITE_USERS_API_HOST = import.meta.env.VITE_USERS_API_HOST;

export default {
    components: { StarRating },
    props: {
        userId: String
    },
    data() {
        return {
            user: null,
            profileUserId: null,
            averageRating: 0,       // Se obtiene en el created
            notificationsEnabled: null,
            isDataReady: false,
            userComments: 0,
            userEntries: 0,
        };
    },
    computed: {
        authStore() {
            return useAuthStore();
        },
        loggedUser() {
            return this.authStore.getLoggedUser;
        },
    },

    async created() {
        try {
            this.profileUserId = this.userId;

            await this.fetchProfileUserData();

            console.log('Profile user:', this.user);
            console.log('Logged User:', this.authStore.getLoggedUser);
            console.log('Profile UserId:', this.userId);
            this.isDataReady = true;
        } catch (error) {
            console.error('Error getting user data: ', error);
        }
    },

    watch: {
        // Observa cambios en el parámetro de la ruta (userId). Evita que cambie la url sin que se recarguen los datos
        "$route.params.userId": {
            immediate: true,
            handler(newUserId) {
                this.profileUserId = newUserId; // Actualiza el ID del usuario
                this.fetchProfileUserData(); // Vuelve a cargar los datos del usuario
            },
        },
    },

    methods: {
        async changeNotificationConsent() {
            try {
                await axios.put(`${VITE_USERS_API_HOST}/${this.userId}/`, {
                    getNotificationsByEmail: this.notificationsEnabled
                });
            } catch (error) {
                console.error('Error updating notification consent: ', error);
            }
        },

        async fetchProfileUserData() {
            try {
                const userResponse = await axios.get(`${VITE_USERS_API_HOST}/${this.profileUserId}`);
                const responseAv = await axios.get(`${VITE_USERS_API_HOST}/${this.userId}/averageRating`);


                this.averageRating = responseAv.data.average || 0;
                this.user = userResponse.data;

                this.notificationsEnabled = this.user.getNotificationsByEmail;

                if (!this.user.profilePicture) {
                    this.user.profilePicture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                }

                this.countUserComments();
                this.countUserEntries();
            } catch (error) {
                console.error('Error getting user data: ', error);
            }
        },
        async countUserComments() {
            try {
                const response = await axios.get(`${VITE_USERS_API_HOST}/${this.profileUserId}/countUserComments`);
                this.userComments = response.data.count;
            } catch (error) {
                console.error('Error counting user comments:', error);
            }
        },
        async countUserEntries() {
            try {
                const response = await axios.get(`${VITE_USERS_API_HOST}/${this.profileUserId}/countUserEntries`);
                this.userEntries = response.data.count;
            } catch (error) {
                console.error('Error counting user entries:', error);
            }
        },
        signOut() {
            this.authStore.logout();
            location.reload();
        },
    }
};

</script>