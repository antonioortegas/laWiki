<script setup>
import { ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import CardGrid from '@/components/CardGrid.vue';
import axios from 'axios';
const VITE_WIKIS_API_HOST = import.meta.env.VITE_WIKIS_API_HOST;

// Reactive original and filtered data
const originalWikiData = ref([]);
const filteredWikiData = ref([]);

// Fetch function
async function fetchWikiData() {
    try {
        const response = await axios.get('${VITE_WIKIS_API_HOST}');
        originalWikiData.value = response.data.map((wiki) => {
            const { title } = wiki;
            wiki.path = `/wiki/${title}`;
            return wiki;
        });
        // Initialize filtered data to show all results initially
        filteredWikiData.value = [...originalWikiData.value];
    } catch (error) {
        console.error('Error fetching wiki data:', error);
    }
}

// Fetch data on load
fetchWikiData();

// Dynamic filter
function filter(searchQuery) {
    const key = Object.keys(searchQuery)[0];
    const text = searchQuery[key].toLowerCase();
    console.log('Filtering by:', text);

    // Filter the original data
    filteredWikiData.value = originalWikiData.value.filter((wiki) =>
        wiki.title.toLowerCase().includes(text)
    );
}
</script>

<template>
    <SearchBar placeholderText="Search for a wiki..." @enter="filter" @keyDown="filter" />
    <div class="w-full flex justify-center">
        <div
            class="bg-secondary mx-8 sm:mx-32 my-4 p-6 rounded-3xl shadow-lg font-heading overflow-hidden max-w-screen-lg w-full">
            <div class="text-center">
                <p class="text-white text-lg font-heading mb-4">
                    Want to share something? Build your own!
                </p>
                <router-link :to="{ name: 'CreateWiki' }">
                    <button
                        class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent hover:bg-opacity-70 border-2 hover:scale-105 hover:border-text transform transition-transform">
                        + Create a Wiki
                    </button>
                </router-link>
            </div>
        </div>
    </div>
    <!-- Pass filtered data to CardGrid -->
    <CardGrid :data="filteredWikiData" />
</template>
