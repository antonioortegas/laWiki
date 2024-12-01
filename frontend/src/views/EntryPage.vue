<script setup>
import { ref, onMounted } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { uploadFileToCloudinary } from '@/services/uploadService';

// Obtener parámetros de la ruta
const route = useRoute();
const entryId = ref(route.params.entryId);

// Estados para la entrada
const isEditing = ref(false); // Controla si estamos en modo edición
const title = ref(''); // Título de la entrada
const imageSrc = ref(''); // URL de la imagen
const markdownContent = ref(''); // Contenido Markdown

// Estados para los campos del mapa
const latitude = ref('');
const longitude = ref('');
const zoom = ref('');

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
    const response = await axios.get(`/api/entries/${entryId.value}`);
    const data = response.data[0];

    // Asignar datos obtenidos
    title.value = data.title || '';
    imageSrc.value = data.imageSrc || '';
    markdownContent.value = data.content || '';
    latitude.value = data.latitude || '';
    longitude.value = data.longitude || '';
    zoom.value = data.zoom || '';
  } catch (error) {
    console.error('Error al cargar la entrada:', error.response || error.message);
  }
};

// Guardar los cambios en el microservicio
const saveEntry = async () => {
  try {
    const updatedData = {
      title: title.value,
      imageSrc: imageSrc.value,
      content: markdownContent.value,
      latitude: latitude.value,
      longitude: longitude.value,
      zoom: zoom.value,
    };

    await axios.put(`/api/entries/${entryId.value}`, updatedData);
    console.log('Entrada actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la entrada:', error.response || error.message);
  }
};

// Manejar la subida de imagen
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      console.log('Subiendo archivo:', file);

      // Utilizar la función de utilidad para subir y obtener la URL
      const imageUrl = await uploadFileToCloudinary(file);

      // Actualizar la URL de la imagen
      imageSrc.value = imageUrl;
      console.log('Archivo subido exitosamente, URL de la imagen:', imageUrl);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadEntry();
});
</script>

<template>
  <div class="entry-page flex flex-col space-y-8 p-6 relative">
    <!-- Botones en la esquina superior derecha -->
    <div class="absolute top-4 right-6 flex space-x-4">
      <router-link :to="{ name: 'EntryVersions', params: { entryId } }"
        class="flex items-center px-4 py-2 border-2 border-accent text-sm text-accent hover:bg-accent hover:text-background rounded-lg shadow-md transition-all space-x-2">
        <span>See version history</span>
      </router-link>

      <button v-if="!isEditing" @click="toggleEditMode"
        class="px-6 py-2 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
        Edit
      </button>
    </div>

    <!-- Vista de solo lectura -->
    <div v-if="!isEditing" class="flex flex-col items-center space-y-4">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <img :src="imageSrc" alt="Entry image" class="max-w-full rounded-lg shadow-md" />
      <MarkdownPreview :content="markdownContent" class="w-full max-w-4xl mt-4" />
    </div>

    <!-- Modo edición -->
    <div v-else class="edit-mode flex flex-col items-center space-y-6">
      <!-- Campo de título -->
      <div class="w-full max-w-4xl">
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="title" type="text" class="w-full border-2 border-gray-300 rounded-lg p-3" />
      </div>

      <!-- Subida de imagen -->
      <div class="w-full max-w-4xl">
        <label class="block text-sm font-medium text-gray-700">Image</label>
        <div class="flex items-center space-x-4">
          <input v-model="imageSrc" type="text" readonly class="flex-1 border-2 border-gray-300 rounded-lg p-3" />
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" />
          <button @click="$refs.fileInput.click()"
            class="px-6 py-2 bg-primary text-background rounded-lg shadow-md">Upload</button>
        </div>
      </div>

      <!-- Editor de Markdown -->
      <div class="w-full max-w-4xl">
        <MarkdownEditor v-model="markdownContent" />
      </div>

      <!-- Campos de mapa -->
      <div class="w-full max-w-4xl grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Latitude</label>
          <input v-model="latitude" type="text" class="w-full border-2 border-gray-300 rounded-lg p-3" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Longitude</label>
          <input v-model="longitude" type="text" class="w-full border-2 border-gray-300 rounded-lg p-3" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Zoom</label>
          <input v-model="zoom" type="number" class="w-full border-2 border-gray-300 rounded-lg p-3" />
        </div>
      </div>

      <button @click="toggleEditMode"
        class="px-6 py-2 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
        Save Changes
      </button>
    </div>
  </div>
</template>
