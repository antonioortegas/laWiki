<script setup>
import searchBg from '@/assets/logo.jpg'; // Import the default image

defineProps({
    placeholderText: {
        type: String,
        required: false,
        default: 'Search...',
    },
    backgroundImageUrl: {
        type: String,
        required: false,
        default: searchBg, // Set the default to the imported image
    },
});
</script>

<template>
    <div class="justify-items-center mx-auto p-10 relative sm:h-48 md:h-64 flex items-center justify-center">
        <!-- Background Image -->
        <div
            class="absolute inset-0 w-full h-full bg-cover bg-center"
            :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
        ></div>

        <!-- Search Bar -->
        <div
            class="max-w-md relative flex items-center w-full h-12 rounded-md focus-within:shadow-lg overflow-hidden border-secondary border-2 bg-secondary">
            <div class="grid place-items-center h-full w-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input class="pl-4 h-full w-full outline-none text-sm placeholder-secondary" type="text" id="search"
                :placeholder="placeholderText" />
        </div>
    </div>
</template>
