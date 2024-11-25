<script setup>
import SearchBar from '@/components/SearchBar.vue';
import CardGrid from '@/components/CardGrid.vue';

const entrySampleData = [
    {
        "entryId": "63e8e9d8f86d4e25c9a1b222",
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
const entryData = entrySampleData.map((entry) => {
    const { entryId } = entry;
    entry.path = `/entry/${entryId}`;
    return entry;
});

const wikiInfo = {
    wikiId: "Cosmere:_Mistborn",
    title: "Cosmere: Mistborn",
    description: "A wiki dedicated to the Mistborn series within Brandon Sanderson's Cosmere universe.",
    entriesCount: 120, // Example number of entries
};

import backgroundImageUrl from '@/assets/search-bg.png'; // Import the default image, remove this line
const image = "https://pokemonletsgo.pokemon.com/assets/img/how-to-play/hero-img.png";
</script>

<template>
    <!-- "You are entering this wiki" Section (common to all wikis) -->
    <div class="bg-background text-center  flex flex-col">
        <p class="text-lg font-medium text-gray-800 py-4">
            You are now entering:
        </p>
        <!-- Wiki Header -->
        <div class="text-center mx-auto px-8 sm:px-16 w-full bg-gray-100 py-4">
            <h1 class="text-3xl font-heading text-text font-bold">{{ wikiInfo.title }}</h1>
            <p class="text-gray-700 mt-2 text-sm sm:text-base">
                {{ wikiInfo.description }}
            </p>
            <p class="text-gray-600 text-sm sm:text-base mt-1">
                Containing <span class="font-semibold text-primary">{{ wikiInfo.entriesCount }}</span> entries and
                growing!
            </p>
        </div>
    </div>
    <SearchBar placeholderText="Search for an entry..." :backgroundImageUrl="image" />
    <!-- Call-to-Action Section -->
    <div class="bg-secondary mx-8 sm:mx-32 my-4 p-6 rounded-3xl shadow-lg font-heading overflow-hidden">
        <div class="text-center">
            <p class="text-white text-lg font-heading mb-4">
                Don't see what you're looking for? Add it!
            </p>
            <button
                class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent hover:bg-opacity-70 border-2 hover:scale-105 hover:border-text transform transition-transform">
                + Create an Entry
            </button>
        </div>
    </div>
    <CardGrid :data="entryData" />
</template>
