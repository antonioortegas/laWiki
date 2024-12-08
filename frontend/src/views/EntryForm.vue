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
import { v4 as uuidv4 } from 'uuid';

const entryUUID = ref(uuidv4());
onMounted(() => {
    const w = route.params.wikiId;
console.log("Creating empty entry with ID:");
    axios.post('/api/entries', {
        wiki: w,
        title: "Entrada de "+w,
        createdBy: "63e8e9d8f86d4e25c9a1b112",
        entryId: entryUUID.value
        
    })
    .then(response => {
        console.log("Empty entry created with ID:", entryUUID.value);
    })
    .catch(error => {
        console.error("Error creating empty entry:", error);
    });

    
    router.push({ name: 'EntryPage', params: { entryId: entryUUID.value},query: {edit: true } });

});


</script>

<template>
    <!-- intentionally left blank -->
</template>