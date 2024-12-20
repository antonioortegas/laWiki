<script setup>
import searchBg from '@/assets/logo.jpg'; // Import the default image

import { ref } from 'vue';

// Define the emit event
const emit = defineEmits();

// Define props
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

const query = ref({
    title: '',
    content: '',
    editor: '',
    tags: '',
});
const showAdvancedFilters = ref(false);

const onKeydown = (event) => {
    if (event.key === 'Enter') {
        // if enter is pressed, close the advanced filters if open
        if (showAdvancedFilters.value) {
          applyAdvancedFilters();
        } else {
          emit('updateQuery', { ...query.value });
        }
    }
};

const toggleAdvancedFilters = () => {
    showAdvancedFilters.value = !showAdvancedFilters.value;
};

const applyAdvancedFilters = () => {
    emit('updateQuery', { ...query.value });
    showAdvancedFilters.value = false;
};
</script>

<template>
  <div class="justify-items-center mx-auto mt-4 p-10 relative sm:h-48 md:h-64 flex flex-col items-center">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-center bg-no-repeat z-0"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"></div>

    <!-- Search Bar with Advanced Filters Button -->
    <div class="max-w-md relative flex items-center w-full h-12 rounded-md focus-within:shadow-lg overflow-hidden border-secondary border-2 bg-secondary z-10">
      <div class="grid place-items-center h-full w-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        class="pl-4 h-full w-full outline-none text-sm placeholder-secondary"
        type="text"
        v-model="query.title"
        :placeholder="placeholderText"
        @keydown="onKeydown"
      />
      <button @click="toggleAdvancedFilters" class="px-4 h-full bg-primary text-white rounded-r-md hover:bg-primary-dark z-10">
        Advanced
      </button>
    </div>

    <!-- Advanced Filters Dropdown -->
    <div v-if="showAdvancedFilters" class="absolute mt-16 max-w-md w-full bg-white shadow-lg rounded-md p-4 z-20">
      <h3 class="text-lg font-semibold mb-4">Advanced Filters</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Content</label>
        <input
          type="text"
          v-model="query.content"
          class="w-full p-2 border rounded-md"
          placeholder="Contains words..."
          @keydown="onKeydown"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Created By / Editors</label>
        <input
          type="text"
          v-model="query.editor"
          class="w-full p-2 border rounded-md"
          placeholder="Username or name..."
          @keydown="onKeydown"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          v-model="query.tags"
          class="w-full p-2 border rounded-md"
          placeholder="Comma-separated tags..."
          @keydown="onKeydown"
        />
      </div>

      <div class="flex justify-end space-x-4">
        <button @click="toggleAdvancedFilters" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button @click="applyAdvancedFilters" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #1e90ff;
}
.bg-primary-dark {
  background-color: #1c86ee;
}
.placeholder-secondary {
  color: #a1a1aa;
}
.bg-secondary {
  background-color: #f3f4f6;
}
.border-secondary {
  border-color: #d1d5db;
}
</style>
