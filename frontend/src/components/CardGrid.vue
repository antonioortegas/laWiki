<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    }
})
</script>

<template>
    <div class="max-w-screen-lg mx-auto">
        <div class="grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-4 p-4">
            <div v-for="item in data" class="bg-white rounded-lg shadow-md hover:-translate-y-2 duration-100">
                <a :href="item.path">
                    <div class="w-full aspect-square">
                        <img :src="item.src || 'https://placehold.co/400x400'" :alt="item.title + ' image'"
                            class="w-full h-full object-cover object-center rounded-t-lg" />
                    </div>
                    <div class="p-4 font-body">
                        <h2 class="text-sm md:text-lg font-semibold">{{ item.title }}</h2>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>

</script>