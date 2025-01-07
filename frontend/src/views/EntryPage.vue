<script setup>
import { ref, onMounted } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';
import MapComponent from '../components/Map.vue';
import 'leaflet/dist/leaflet.css';
import { useRoute } from 'vue-router';
import router from '../router';
import axios from 'axios';
import { uploadFileToCloudinary } from '@/services/uploadService';
import { v4 as uuidv4 } from 'uuid';

const VITE_ENTRIES_API_HOST = import.meta.env.VITE_ENTRIES_API_HOST;
const VITE_VERSIONS_API_HOST = import.meta.env.VITE_VERSIONS_API_HOST;
const VITE_USERS_API_HOST = import.meta.env.VITE_USERS_API_HOST;

// Obtener parámetros de la ruta
const route = useRoute();
const entryId = ref(route.params.entryId);

// Estados para la entrada
const isEditing = ref(false); // Controla si estamos en modo edición
const title = ref(''); // Título de la entrada
const imageSrc = ref(''); // URL de la imagen
const markdownContent = ref(''); // Contenido Markdown
const tags = ref(''); // Etiquetas de la entrada

const wikiId = ref(' ');//wiki de la entrada

const language = ref(''); // Idioma de la entrada

const entryCreator = ref(''); //Creador de la entrada

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
    const response = await axios.get(`${VITE_ENTRIES_API_HOST}/${entryId.value}`);
    const data = response.data[0];

    // Asignar datos obtenidos
   
    title.value = data.title || '';
    imageSrc.value = data.imageSrc || '';
    markdownContent.value = data.content || '';
    latitude.value = data.latitude || '';
    longitude.value = data.longitude || '';
    zoom.value = data.zoom || '';
    wikiId.value= data.wiki || '';
    language.value = data.language || '';
    tags.value = data.tags ? data.tags.join(', ') : '';
    entryCreator.value = data.createdBy || '';
    //Delete later
    console.log(title.value);
  } catch (error) {
    console.error('Error al cargar la entrada:', error.response || error.message);
  }
};

// Guardar los cambios en el microservicio
const saveEntry = async () => {
  const text = (markdownContent.value == undefined) ? " " : markdownContent.value;
  try {
    const updatedData = {
      title: title.value,
      imageSrc: imageSrc.value,
      content: text,
      latitude: latitude.value,
      longitude: longitude.value,
      zoom: zoom.value,
      language: language.value,
      tags: tags.value.split(',').map(tag => tag.trim())
    };

    const entry = await axios.put(`${VITE_ENTRIES_API_HOST}/${entryId.value}`, updatedData);

    const versionData =
    {
      entry: entryId.value,
      content: text,
      imageSrc: imageSrc.value,
      latitude: latitude.value,
      longitude: longitude.value,
      zoom: zoom.value,
      createdBy: "60d0fe4f5311236168a109ca"
    };
    console.log(entry);
    
    await axios.post(`${VITE_VERSIONS_API_HOST}/`, versionData);
    
    // Notificar al creador de la entrada
    sendNotification(entryCreator.value, title.value, "updated");

    console.log('Entrada actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la entrada:', error.response || error.message);
  }
};

// Eliminar la entrada
async function deleteEntry() {
  if (confirm('Are you sure you want to delete this entry?')) {
    try {
      // Obtener los datos de la entrada
      const response = await axios.get(`${VITE_ENTRIES_API_HOST}/${route.params.entryId}`);
      const entry = response.data[0]; // Asumiendo que `entry` está en el primer índice del array
      const title = response.data[3];
      const createdBy = response.data[7];
      const wikiUrl = entry.wiki || '/'; // Redirigir a '/' si no existe el atributo 'wiki'

      // Proceder a eliminar la entrada
      await axios.delete(`${VITE_ENTRIES_API_HOST}/${route.params.entryId}`);
      console.log('Entry deleted successfully');

      // Notificar al creador de la entrada
      sendNotification(entryCreator.value, title, "deleted");


      // Redirigir a la URL de la wiki
      router.push("/wiki/" + wikiUrl);
    } catch (error) {
      console.error('Error deleting entry:', error);
      // Manejar el error (por ejemplo, mostrar un mensaje de error)
    }
  }
}


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
// Función para traducir la entrada
const translateEntryTo = async () => {
  const target = prompt('Enter the language code to translate to (e.g., "en" for English, "es" for Spanish):');
  if (target) {
    // Lógica para traducir la entrada
    console.log(`Translating entry to ${language.value}`);
    console.log(target);
    if(language.value != target){
    const response = await axios.post(`/api/translation/translate`, { text: title.value, fromLanguage: language.value, targetLanguage: target });
    const translatedTitle = response.data[0].translations[0].text;
  
    const textResponse= await axios.post(`/api/translation/translate`, { text: markdownContent.value, fromLanguage: language.value, targetLanguage: target });
    const translatedText = textResponse.data[0].translations[0].text;

    

    const entryUUID = ref(uuidv4());
    try {
      const newEntryData = {
      title: translatedTitle,
      entryId: entryUUID.value,
      imageSrc: imageSrc.value,
      content: translatedText,
      latitude: latitude.value,
      longitude: longitude.value,
      zoom: zoom.value,
      language: target,
      tags: tags.value.split(',').map(tag => tag.trim()),
      wiki: wikiId.value,
      createdBy: entryCreator.value
      };

      const response = await axios.post('/api/entries', newEntryData);
      console.log('Translated entry created successfully:', response.data);
      console.log('Redirecting to new entry page...');
      console.log({ name: 'EntryPage', params: { entryId: entryUUID.value }, query: { edit: false } });
      router.push({ name: 'EntryPage', params: { entryId: entryUUID.value } }).then(() => {
        location.reload();
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
   
      // Optionally, navigate to the new entry page
      
    } catch (error) {
      console.error('Error creating translated entry:', error.response || error.message);
    }
    
  }else{
    alert('The language is the same as the original');
  }
    // Aquí puedes agregar la lógica para traducir la entrada
  }
};
// Enviar la notificación al creador de la entrada
async function sendNotification(entryCreator, title, editType) {
  try {
    // Enviar la notificación al creador de la entrada
    await axios.post(`${VITE_USERS_API_HOST}/${entryCreator}/newNotification`, {
      message: "Your entry " + entryId.value + " has been " + editType,
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

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
      <router-link :to="{ name: 'WikiPage' ,params:{wikiId}}" 
        class="flex items-center px-4 py-2 border-2 border-accent text-sm text-accent hover:bg-accent hover:text-background rounded-lg shadow-md transition-all space-x-2">
        <span>Home</span>
      </router-link>
      <router-link :to="{ name: 'EntryVersions', params: { entryId } }"
        class="flex items-center px-4 py-2 border-2 border-accent text-sm text-accent hover:bg-accent hover:text-background rounded-lg shadow-md transition-all space-x-2">
        <span>See version history</span>
      </router-link>
      <button @click="translateEntryTo"
        class="px-6 py-2 bg-green-500 text-background font-semibold rounded-lg shadow-md hover:bg-green-600 transform transition-transform hover:scale-105">
        Translate
      </button>
      <button v-if="!isEditing" @click="toggleEditMode"
        class="px-6 py-2 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
        Edit
      </button>
    </div>

    <!-- Vista de solo lectura -->
    <div v-if="!isEditing" class="entry-page flex flex-col space-y-8 p-6">

      <!-- If there is a map, show it along the tile, if there is not, make the title cover the whole page -->
      <div v-if="latitude && longitude && zoom" class="flex gap-4 md:flex-row flex-col">
        <!-- Título -->
        <div
          class="title-container relative flex items-center justify-center bg-cover bg-center h-64 text-center md:w-2/3 w-full"
          :style="{ backgroundImage: `url(${imageSrc})` }">
          <h1 class="text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-3 rounded-lg shadow-lg">
            {{ title }}
          </h1>

        </div>
        <!-- Contenedor para mapa -->
        <div class="flex  items-center space-y-4 md:w-1/3 w-full">
          <!-- Mapa -->
          <div class="w-full max-w-4xl"> <!-- Centrado y limitación de ancho en pantallas grandes -->
            <MapComponent :latitude="latitude" :longitude="longitude" :zoom="zoom"
              class="w-full h-[300px] rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      <div v-else class="flex gap-4">
        <!-- Título -->
        <div
          class="title-container relative flex items-center justify-center bg-cover bg-center h-64 text-center w-full"
          :style="{ backgroundImage: `url(${imageSrc})` }">
          <h1 class="text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-3 rounded-lg shadow-lg">
            {{ title }}
          </h1>
        </div>
      </div>



      <!-- Contenido Markdown -->
      <div class="markdown-content w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <MarkdownPreview :content="markdownContent" />
      </div>


      <!-- Etiquetas -->
      <div v-if="tags" class="w-full max-w-4xl">
        <!-- Título -->
        <p class="text-lg font-semibold text-gray-700 mb-2">Tags</p>

        <!-- Lista de etiquetas -->
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in tags.split(',')" :key="tag" class="px-2 py-1 bg-gray-200 text-sm rounded-full">
            {{ tag.trim() }}
          </span>
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

      <!-- Campo de tags, separados por comas -->
      <div class="w-full max-w-4xl">
        <label class="block text-sm font-medium text-gray-700">Tags</label>
        <input type="text" v-model="tags" class="w-full border-2 border-gray-300 rounded-lg p-3"
          placeholder="Comma-sepparated tags" />
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

      <!-- Language -->
      <div class="w-full max-w-4xl">
        <label for="language" class="block text-sm font-semibold text-gray-700">Language</label>
        <select id="language" v-model="language" class="w-full border-2 border-gray-300 rounded-lg p-3 text-sm">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <!-- Add more language options as needed -->
        </select>
      </div>

      <!-- Responsive Flex container for editor and preview -->
      <div class="flex flex-col lg:flex-row w-full lg:space-x-6 space-y-6 lg:space-y-0 mt-4">
        <!-- Editor Container -->
        <div class="editor-container lg:w-1/2 w-full overflow-hidden">
          <MarkdownEditor v-model="markdownContent" />
        </div>

        <!-- Preview Container -->
        <div
          class="preview-container lg:w-1/2 w-full overflow-hidden border-2 border-gray-300 rounded-lg shadow-md pl-6 p-3 mb-9 font-body">
          <div class="w-full border-b-2 border-gray-300 pb-2">
            <h2 class="text-xl font-semibold font-heading">Preview</h2>
          </div>
          <MarkdownPreview :content="markdownContent" class="mt-4" />
        </div>
      </div>
      
      <div class="flex justify-center gap-8">
        <button @click="toggleEditMode"
          class="px-6 py-2 bg-primary text-background font-semibold rounded-lg shadow-md hover:bg-accent transform transition-transform hover:scale-105">
          Save Changes
        </button>
        <button type="button" @click="deleteEntry"
          class="px-6 py-3 bg-red-500 text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 transform transition-transform hover:scale-105">
          Delete Entry
        </button>
      </div>
    </div>

    <!-- Comments Section -->
    <Comments :entryId="entryId" v-if="!isEditing" />

  </div>
</template>

<script>
import Comments from '../components/Comments.vue';
import axios from 'axios';

export default {
  components: {
    Comments // Register Comments component
  }
};
</script>


<style>
/* Ajuste responsivo */
.markdown-content {
  line-height: 1.6;
}
</style>
