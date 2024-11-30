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
                            <StarRating :value="averageRating" />
                        </div>
                    </div>
                    <!-- Additional Info -->
                    <div>
                        <h3 class="text-lg font-semibold ">Additional Info</h3>
                        <p class="text-sm text-gray-600 mt-2">{{ exampleUser.additionalInfo }}</p>
                    </div>
                </div>
                
                <!-- User Bio/Info -->
                <div class="text-gray-700 mx-4 text-center mt-12">
                    <h3 class="text-lg font-bold mb-2">About</h3>
                    <p class="text-sm leading-relaxed text-left">
                        {{ exampleUser.bio }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StarRating from '../components/StarRating.vue';
import axios from 'axios';

export default {
  components: { StarRating },
  data() {
    return {
      averageRating: 0, // Initial value
      userId: '67436f7619b522e08f511bff' // TODO: Cambia esto al ID dinámico del usuario
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`http://localhost:3001/users/${this.userId}/averageRating`);

      this.averageRating = response.data.average || 0;
    } catch (error) {
      console.error('Error getting user rating: ', error);
    }
  }
};

</script>