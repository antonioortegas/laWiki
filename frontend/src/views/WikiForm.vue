<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // To access route params

// Form data
const formData = ref({
  title: "",
  description: "",
  src: "",
  content: "",
  tags: "",
  language: "en",
});

// Placeholder for fetched wiki data
const sampleWikiData = {
  title: "Cosmere: Mistborn",
  description: "A wiki dedicated to the Mistborn series within Brandon Sanderson's Cosmere universe.",
  src: "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg",
  content: "This wiki explores the characters, magic systems, and major events in the Mistborn series.",
  tags: ["Fantasy", "Brandon Sanderson", "Cosmere"],
  language: "en",
};

// Access route parameters
const route = useRoute();

const isEditing = ref(false); // Determines if editing an existing wiki

onMounted(() => {
  if (route.params.wikiId) {
    isEditing.value = true;

    // Simulate fetching wiki data by ID
    fetchWikiData(route.params.wikiId);
  }
});

// Fetch wiki data (simulate API call)
function fetchWikiData(id) {
  console.log(`Fetching data for Wiki ID: ${id}`); // Replace with actual API call
  const wiki = sampleWikiData; // Replace with fetched data

  // Populate form with fetched data
  formData.value = {
    ...wiki,
    tags: wiki.tags.join(", "), // Convert array to comma-separated string
  };
}

// Submit handler
function submitForm() {
  if (isEditing.value) {
    console.log("Updating wiki:", formData.value);
    // Add API call for updating the wiki
  } else {
    console.log("Creating new wiki:", formData.value);
    // Add API call for creating a new wiki
  }
}
</script>

<template>
  <div class="shadow-lg bg-accent h-auto my-16 mx-8 sm:mx-32 rounded-3xl">
    <!-- Accent Header Section -->
    <div class="h-1/6 relative">
      <div class="flex justify-center items-center p-4">
        <h1 class="text-3xl font-heading font-bold text-background">
          {{ isEditing ? "Edit Wiki" : "Create a New Wiki" }}
        </h1>
      </div>
    </div>

    <!-- Form Container -->
    <div class="h-5-6 bg-background rounded-3xl p-8 font-body">
      <!-- Description -->
      <div class="text-center mb-8">
        <p class="text-sm text-gray-600 mt-2">
          {{ isEditing
            ? "Update the fields below to edit the existing wiki."
            : "Fill out the fields below to create a new wiki."
          }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-semibold text-gray-700">Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Wiki title"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="A brief description of the wiki"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm resize-none"
            rows="3"
          ></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label for="src" class="block text-sm font-semibold text-gray-700">Image URL</label>
          <input
            id="src"
            v-model="formData.src"
            type="url"
            placeholder="Paste an image URL"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm"
          />
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-semibold text-gray-700">Tags</label>
          <input
            id="tags"
            v-model="formData.tags"
            type="text"
            placeholder="Comma-separated tags"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm"
          />
        </div>

        <!-- Content 
        <div>
          <label for="content" class="block text-sm font-semibold text-gray-700">Content</label>
          <textarea
            id="content"
            v-model="formData.content"
            placeholder="Detailed content or introduction for the wiki"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm resize-none"
            rows="6"
          ></textarea>
        </div>
        -->

        <!-- Language -->
        <div>
          <label for="language" class="block text-sm font-semibold text-gray-700">Language</label>
          <select
            id="language"
            v-model="formData.language"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <!-- Add more language options as needed -->
          </select>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <router-link to="/"> <!-- TODO: Replace with actual route -->
            <button
            type="submit"
            class="px-6 py-3 bg-primary text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent transform transition-transform hover:scale-105"
            >
            {{ isEditing ? "Update Wiki" : "Create Wiki" }}
          </button>
        </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

