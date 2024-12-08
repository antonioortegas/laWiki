<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    }
});
</script>

<template>
    <div class="max-w-screen-lg mx-auto">
        <!-- Grid container with fixed card sizes -->
        <div class="grid gap-4 p-4"
            :class="{ 'grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))]': data.length > 2, 'grid-cols-3': data.length <= 2 }">
            <div v-for="item in data" :key="item.title"
                class="bg-white rounded-lg shadow-md hover:-translate-y-2 duration-100 flex flex-col"
                style="min-width: 10rem; max-width: 14rem; height: auto;">
                <a :href="item.path">
                    <!-- Image Section -->
                    <div class="w-full aspect-square">
                        <img :src="item.src || 'https://placehold.co/400x400'" :alt="item.title + ' image'"
                            class="w-full h-full object-cover object-center rounded-t-lg" />
                    </div>
                    <!-- Content Section -->
                    <div class="p-4 font-body">
                        <h2 class="text-sm md:text-lg font-semibold">{{ item.title }}</h2>
                    </div>
                </a>
            </div>
        </div>

    </div>
</template>
