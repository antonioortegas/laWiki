<script setup>
import { ref, onMounted } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';


const route = useRoute();
const isEditing = ref(false); // Controla si estamos en modo edición
const markdownContent = ref(''); // Contenido inicial del Markdown
const entryId = ref(route.params.entryId); // ID de la entrada


// Alternar entre modo de edición y vista
const toggleEditMode = () => {
  if (isEditing.value) {
    saveEntry(); // Al salir del modo edición, guarda los cambios
  }
  isEditing.value = !isEditing.value;
};

// Cargar el contenido de la entrada desde el microservicio
const loadEntry = async () => {
  try {
    // Use Axios to make the GET request to the proxied API endpoint
    const response = await axios.get(`/api/entries/${entryId.value}`);

    // Ensure the response data is assigned correctly
    markdownContent.value = response.data[0].content; // Assign content from the response
    console.log('Entrada cargada exitosamente', response.data.content);
  } catch (error) {
    console.error('Error al cargar la entrada:', error.response || error.message);
  }
};

// Guardar los cambios en el microservicio
const saveEntry = async () => {
  try {
    // Use Axios to make the PUT request to the proxied API endpoint
    const response = await axios.put(`/api/entries/${entryId.value}`, {
      content: markdownContent.value, // Send the updated content in the request body
    });

    console.log('Entrada actualizada exitosamente', response.data);
  } catch (error) {
    console.error('Error al actualizar la entrada:', error.response || error.message);
  }
};

// Cargar el contenido al montar el componente
onMounted(() => {
  loadEntry();
});
</script>

<template>
  <div class="entry-page flex flex-col space-y-8 p-6 relative ">

    <!-- Upper-right corner buttons with icons -->
    <div class="absolute top-4 right-6 flex space-x-4">
      <!-- Version history button with icon -->
      <router-link :to="{ name: 'EntryVersions', params: { entryId } }"
        class="flex items-center px-4 py-2 border-2 border-accent text-sm text-accent hover:bg-accent hover:text-background rounded-lg shadow-md transition-all space-x-2">
        
        <span>See version history</span>
      </router-link>


      <!-- Edit button (if not in edit mode) -->
      <button v-if="!isEditing" @click="toggleEditMode"
        class="px-6 py-2 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
        Edit
      </button>
    </div>

    <!-- Vista de solo lectura -->
    <div v-if="!isEditing" class="flex flex-col items-center space-y-4">
      <MarkdownPreview :content="markdownContent" class="w-full max-w-4xl mt-4" />
    </div>

    <!-- Modo edición -->
    <div v-else class="edit-mode flex flex-col items-center space-y-6">
      <!-- Flex container for editor and preview side by side -->
      <div class="flex w-full space-x-6 mt-4">
        <!-- Editor Container -->
        <div class="editor-container w-1/2 overflow-hidden">
          <MarkdownEditor v-model="markdownContent" class="" />
        </div>

        <!-- Preview Container -->
        <div
          class="preview-container w-1/2 overflow-hidden border-2 border-gray-300 rounded-lg shadow-md pl-6 p-3 mb-9 font-body">
          <div class="w-full border-b-2 border-gray-300 pb-2">
            <h2 class="text-xl font-semibold font-heading">Preview</h2>
          </div>
          <MarkdownPreview :content="markdownContent" class="mt-4" />
        </div>
      </div>

      <button @click="toggleEditMode"
        class="px-6 py-2 bg-primary md:text-2xl text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
        Save Changes
      </button>
    </div>

  </div>
</template>