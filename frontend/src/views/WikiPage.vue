<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import SearchBar from '@/components/SearchBar.vue';
import CardGrid from '@/components/CardGrid.vue';

// Reactive data
const wikiInfo = ref({});
const entryData = ref([]);
const $route = useRoute();

// Sample data for entries
const entrySampleData = [
    {
        "entryId": "674ba62aac31b52fcd5ffb1a",
        "title": "Cosmere: Mistborn",
        "src": "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg"
    },
    {
        "entryId": "63e8e9d8f86d4e25c9a1b223",
        "title": "Cosmere: Mistborn",
        "src": "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg"
    },
    {
        "entryId": "63e8e9d8f86d4e25c9a1b224",
        "title": "Cosmere: Mistborn",
        "src": "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg"
    },
    {
        "entryId": "63e8e9d8f86d4e25c9a1b225",
        "title": "Cosmere: Stormlight Archive",
        "src": "https://upload.wikimedia.org/wikipedia/en/3/30/Stormlight_Logo.jpg"
    },
    {
        "entryId": "63e8e9d8f86d4e25c9a1b226",
        "title": "Cosmere: Stormlight Archive",
        "src": "https://upload.wikimedia.org/wikipedia/en/3/30/Stormlight_Logo.jpg"
    },
    {
        "entryId": "63e8e9d8f86d4e25c9a1b227",
        "title": "Cosmere: Stormlight Archive",
        "src": "https://upload.wikimedia.org/wikipedia/en/3/30/Stormlight_Logo.jpg"
    },
];



// Fetch entry data from the backend
const fetchEntryData = async (entryId) => {
    try {
        const response = await axios.get(`/api/entries/${entryId}`);
        const entry = response.data[0];
        // add a path to entry, that will be /entry/:entryId for frontend routing
        entry.path = `/entry/${entry.entryId}`;
        entry.src = entry.imageSrc;
        entryData.value.push(entry);  // Push fetched entry into entryData
    } catch (error) {
        console.error('Error fetching entry:', error);
    }
};

// Fetch the wiki info from the backend
const fetchWikiInfo = async () => {
    try {
        const response = await axios.get(`/api/wikis/${$route.params.wikiId}`);
        wikiInfo.value = response.data[0];  // Assign the fetched data to the reactive object
        console.log('Fetched wiki info:', wikiInfo.value);

        // Ensure entry data is populated after fetching wiki info
        const promises = wikiInfo.value.entryUUIDs.map(async (entryId) => {
            await fetchEntryData(entryId);  // Fetch each entry asynchronously
        });

        // Wait for all entries to be fetched
        await Promise.all(promises);

        console.log('Fetched entry data:', entryData.value);  // Ensure entryData is populated properly
    } catch (error) {
        console.error('Error fetching wiki info:', error);
    }
};

// Call the function to fetch wiki info when the component is mounted
fetchWikiInfo();
</script>

<template>
    <!-- "You are entering this wiki" Section -->
    <div class="bg-background text-center flex flex-col">
        <!-- Wiki Header -->
        <div class="text-center mx-auto px-8 sm:px-16 w-full bg-gray-100 py-4">
            <h1 v-if="wikiInfo.title" class="text-3xl font-heading text-text font-bold">{{ wikiInfo.title }}</h1>
            <p v-if="wikiInfo.description" class="text-gray-700 mt-2 text-sm sm:text-base">
                {{ wikiInfo.description }}
            </p>
            <p v-if="wikiInfo.numberOfEntries" class="text-gray-600 text-sm sm:text-base mt-1">
                Containing <span class="font-semibold text-primary">{{ wikiInfo.numberOfEntries }}</span> entries and growing!
            </p>
            <router-link :to="{ name: 'EditWiki', params: { wikiId: $route.params.wikiId } }">
                <button type="submit"
                    class="px-6 py-3 my-2 bg-primary text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent transform transition-transform hover:scale-105">
                    Edit Wiki
                </button>
            </router-link>
        </div>
    </div>

    <SearchBar placeholderText="Search for an entry..." :backgroundImageUrl="wikiInfo.src" />

    <!-- Call-to-Action Section -->
    <div class="bg-secondary mx-8 sm:mx-32 my-4 p-6 rounded-3xl shadow-lg font-heading overflow-hidden">
        <div class="text-center">
            <p class="text-white text-lg font-heading mb-4">
                Don't see what you're looking for? Add it!
            </p>
            <router-link :to="{ name: 'CreateEntry' }">
            <button
                class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent hover:bg-opacity-70 border-2 hover:scale-105 hover:border-text transform transition-transform">
                + Create an Entry
            </button>
            </router-link>
        </div>
    </div>

    <!-- Pass entry data to CardGrid -->
    <CardGrid :data="entryData" />
</template>