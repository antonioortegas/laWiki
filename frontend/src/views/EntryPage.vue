<script setup>
import { ref, onMounted } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';
import MapComponent from '../components/MapComponent.vue';
import 'leaflet/dist/leaflet.css';
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


    // Dividir el campo map en latitud, longitud y zoom
    if (data.map) {
      const [lat, lng, zm] = data.map.split(';');
      latitude.value = lat || '';
      longitude.value = lng || '';
      zoom.value = zm || '';
    } else {
      latitude.value = '';
      longitude.value = '';
      zoom.value = '';
    }
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
      map: `${latitude.value};${longitude.value};${zoom.value}`, // Combinar los valores en un string
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
  isEditing.value = route.query.edit === 'true';
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
  <div v-if="!isEditing" class="entry-page flex flex-col space-y-8 p-6">
    <!-- Título -->
    <div 
      class="title-container relative flex items-center justify-center bg-cover bg-center h-64 text-center"
      :style="{ backgroundImage: `url(${imageSrc})` }"
    >
      <h1 class="text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-3 rounded-lg shadow-lg">
        {{ title }}
      </h1>
    </div>
    
    <!-- Contenido Markdown -->
    <div class="markdown-content w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <MarkdownPreview :content="markdownContent" />
    </div>

    <!-- Contenedor para mapa -->
    <div v-if="latitude && longitude && zoom" class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">

      <!-- Mapa -->
      <div class="w-full md:w-1/2 max-w-lg">
        <MapComponent 
          :latitude="latitude" 
          :longitude="longitude" 
          :zoom="zoom" 
          class="w-full h-[300px] rounded-lg shadow-md"
        />
      </div>
    </div>
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


<style>
/* Ajuste responsivo */
@media (min-width: 768px) {
  .entry-page {
    max-width: 800px;
    margin: 0 auto;
  }
}

.markdown-content {
  line-height: 1.6;
}
</style>