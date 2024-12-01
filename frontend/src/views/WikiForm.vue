<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // To access route params
import axios from 'axios'; // For API calls
import router from '../router';
import { uploadFileToCloudinary } from '@/services/uploadService'; // Utility function for file upload

// Form data
const formData = ref({
  title: "",
  description: "",
  content: "",
  src: "",
  tags: "",
  language: "en",
});
const fileInput = ref(null);

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
    console.log("Editing wiki with ID:", route.params.wikiId);
    // Simulate fetching wiki data by ID
    fetchWikiData(route.params.wikiId);
  }
});

// Handle file upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      console.log('Uploading file:', file);

      // Use the utility function to upload and get the URL
      const imageUrl = await uploadFileToCloudinary(file);

      // Update the src with the returned image URL
      formData.value.src = imageUrl;
      console.log('File uploaded successfully, image URL:', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
}

// Trigger file input click via ref
function triggerFileInput() {
  fileInput.value.click();
}

// Fetch wiki data (simulate API call)
async function fetchWikiData(id) {
  const wiki = await axios.get(`/api/wikis/${id}`).then((res) => res.data[0]);
  console.log("Fetched wiki data:", wiki);

  // Populate form with fetched data
  formData.value = {
    ...wiki,

  };
}

// Submit handler
function submitForm() {
  if (isEditing.value) {
    console.log("Updating wiki:", formData.value);
    // Add API call for updating the wiki (e.g., PUT request)
    axios.put(`/api/wikis/${route.params.wikiId}`, formData.value)
      .then(response => {
        console.log("Wiki updated successfully", response);
        // Handle success (e.g., redirect or show success message)
      })
      .catch(error => {
        console.error("Error updating wiki:", error);
        // Handle error (e.g., show error message)
      });
  } else {
    // createdBy is required for creating a new wiki
    // simulate it for now, since user authentication is not implemented
    formData.value.createdBy = "63e8e9d8f86d4e25c9a1b116";
    console.log("Creating new wiki:", formData.value);
    // Add API call for creating a new wiki (e.g., POST request)
    axios.post("/api/wikis", formData.value)
      .then(response => {
        console.log("Wiki created successfully", response);
        // Handle success (e.g., redirect or show success message)
      })
      .catch(error => {
        console.error("Error creating wiki:", error);
        // Handle error (e.g., show error message)
      });
  }
  // go to the wiki page after creating or updating the wiki
  // if creating a new wiki, the wikiId will be the title of the wiki
  router.push(`/wiki/${formData.value.title}`);
}

// Delete handler
function deleteWiki() {
  if (confirm("Are you sure you want to delete this wiki?")) {
    axios.delete(`/api/wikis/${route.params.wikiId}`)
      .then(response => {
        console.log("Wiki deleted successfully", response);
        // Redirect to home or other appropriate page after deletion
        router.push('/');
      })
      .catch(error => {
        console.error("Error deleting wiki:", error);
        // Handle error (e.g., show error message)
      });
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
          <input id="title" v-model="formData.title" type="text" placeholder="Wiki title"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm" :disabled="isEditing" required />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea id="description" v-model="formData.description" placeholder="A brief description of the wiki"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm resize-none" rows="3"></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label for="src" class="block text-sm font-semibold text-gray-700">Image URL</label>
          <div class="flex items-center">
            <input id="src" v-model="formData.src" type="text" placeholder="Paste an image URL"
              class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm" readonly />
            <button type="button" @click="triggerFileInput"
              class="ml-4 px-6 py-3 bg-primary text-background font-bold rounded-lg shadow-md">
              Upload
            </button>
          </div>
          <input id="fileInput" type="file" class="hidden" accept="image/*" ref="fileInput"
            @change="handleFileUpload" />
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-semibold text-gray-700">Tags</label>
          <input id="tags" v-model="formData.tags" type="text" placeholder="Comma-separated tags"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm" />
        </div>

        <!-- Content (optional) -->
        <div>
          <label for="content" class="block text-sm font-semibold text-gray-700">Content</label>
          <textarea id="content" v-model="formData.content" placeholder="Detailed content or introduction for the wiki"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm resize-none" rows="6"></textarea>
        </div>

        <!-- Language -->
        <div>
          <label for="language" class="block text-sm font-semibold text-gray-700">Language</label>
          <select id="language" v-model="formData.language"
            class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <!-- Add more language options as needed -->
          </select>
        </div>

        <div class="flex justify-center gap-8">

          <!-- Submit Button -->
          <div class="text-center">
            <button type="submit"
              class="px-6 py-3 bg-primary text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent transform transition-transform hover:scale-105">
              {{ isEditing ? "Update Wiki" : "Create Wiki" }}
            </button>
          </div>

          <!-- Delete Button (only visible when editing) -->
          <div v-if="isEditing" class="text-center">
            <button type="button" @click="deleteWiki"
              class="px-6 py-3 bg-red-500 text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 transform transition-transform hover:scale-105">
              Delete Wiki
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
