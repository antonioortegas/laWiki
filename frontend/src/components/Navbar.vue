<script setup>
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700 m-1 rounded-md" fill="none"
            viewBox="0 0 24 24" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div
            class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
            11
          </div>
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