<script setup>
const exampleUser = {
    username: "SprenBonded",
    email: "example@gmail.com",
    userPfp: "https://avatars.githubusercontent.com/u/100814779?v=4",
    comments: 42,
    entries: 15,
    additionalInfo: "Lorem ipsum dolor sit amet...",
    averageRating: 3.5,
    bio: "This is a short bio or description about the user. Include interesting details here!"
}
</script>

<template>
    <div class="">
        <div class="shadow-lg bg-accent h-[72.5vh] my-16 mx-8 sm:mx-32 rounded-3xl">
            <div class="h-1/6 relative">
                <div class="absolute inset-0 flex justify-center items-end -bottom-10">
                    <img class="object-cover h-20 w-20 rounded-full border-4 border-background" :src="exampleUser.userPfp" alt="" />
                </div>
            </div>
            <div class="h-5/6 bg-background rounded-3xl p-8 font-body">
                <!-- User Info -->
                <div class="text-center my-6">
                    <h2 class="text-xl font-bold">{{ exampleUser.username }}</h2>
                    <p class="text-sm text-gray-600">{{ exampleUser.email }}</p>
                </div>

                <!-- Stats Section -->
                <div class="grid grid-cols-2 gap-4 text-center mb-6">
                    <!-- Number of Comments -->
                    <div>
                        <h3 class="text-lg font-semibold ">Comments</h3>
                        <p class="text-sm text-gray-600 mt-2">{{ exampleUser.comments }}</p>
                    </div>
                    <!-- Number of Entries -->
                    <div>
                        <h3 class="text-lg font-semibold ">Entries</h3>
                        <p class="text-sm text-gray-600 mt-2">{{ exampleUser.entries }}</p>
                    </div>
                    <!-- Average Rating -->
                    <div>
                        <h3 class="text-lg font-semibold">Average Rating</h3>
                        <div class="flex justify-center items-center mt-2">
                            <!-- Component StarRating -->
                            <StarRating
                                :value="averageRating"
                                :profileUserId="profileUserId"
                                :loggedUserEmail="loggedUserEmail"
                             />
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
                
                <!-- Email Notifications Toggle (Only visible if loggedUserEmail matches exampleUser.email) -->
                <div v-if="loggedUserEmail === exampleUser.email" class="mt-4">
                    <h3 class="text-lg font-semibold">Get notifications by email?:</h3>
                    <input
                        type="checkbox"
                        v-model="notificationsEnabled"
                        @change="changeNotificationConsent"
                        class="mt-2"
                    />
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
</template>

<script>
import StarRating from '../components/StarRating.vue';
import axios from 'axios';
const VITE_USERS_API_HOST = import.meta.env.VITE_USERS_API_HOST;

export default {
  components: { StarRating },
  data() {
    return {
      averageRating: 0,
      profileUserId: '123456789012345678901234', // TODO: Cambiar a ID dinámico del usuario
      loggedUserEmail: 'example@gmail.com', // TODO: Cambiar a email del usuario logueado
      notificationsEnabled: null
    };
  },
  async mounted() {
    try {
      const responseAv = await axios.get(`${VITE_USERS_API_HOST}${this.profileUserId}/averageRating`);
      const responseUser = await axios.get(`${VITE_USERS_API_HOST}${this.profileUserId}`);

      this.averageRating = responseAv.data.average || 0;
      this.notificationsEnabled = responseUser.data.getNotificationsByEmail;
    } catch (error) {
      console.error('Error getting user rating: ', error);
    }
  },
  methods: {
    async changeNotificationConsent() {
        try {
            await axios.put(`${VITE_USERS_API_HOST}${this.profileUserId}/`, {
                getNotificationsByEmail: this.notificationsEnabled
            });
            console.log('Enviado cambiar consentimiento a', this.notificationsEnabled);
        } catch (error) {
            console.error('Error updating notification consent: ', error);
        }
    }
  }
};

</script>