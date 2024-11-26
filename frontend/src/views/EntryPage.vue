<script setup>
import { ref, onMounted } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';

const isEditing = ref(false); // Controla si estamos en modo edición
const markdownContent = ref(''); // Contenido inicial del Markdown
const entryId = ref($route.params.entryId); // ID de la entrada desde las rutas

// URL base para la API
const apiBaseUrl = import.meta.env.ENTRIES_API_HOST; 

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
    const response = await fetch(`${apiBaseUrl}/${entryId.value}`);
    if (!response.ok) {
      throw new Error('Error al cargar la entrada');
    }
    const data = await response.json();
    markdownContent.value = data.content; // Asignar el contenido de la respuesta
  } catch (error) {
    console.error('Error al cargar la entrada:', error);
  }
};

// Guardar los cambios en el microservicio
const saveEntry = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/${entryId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: markdownContent.value }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la entrada');
    }

    console.log('Entrada actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la entrada:', error);
  }
};

// Cargar el contenido al montar el componente
onMounted(() => {
  loadEntry();
});
</script>

<template>
  <div class="entry-page">
    <h1>ENTRY: {{ entryId }}</h1>

    <!-- Vista de solo lectura -->
    <div v-if="!isEditing">
      <MarkdownPreview :content="markdownContent" />
      <button @click="toggleEditMode">Editar entrada</button>
    </div>

    <!-- Modo edición -->
    <div v-else class="edit-mode">
      <div class="editor-container">
        <MarkdownEditor v-model="markdownContent" />
      </div>
      <div class="preview-container">
        <h2>Vista previa</h2>
        <MarkdownPreview :content="markdownContent" />
      </div>
      <button @click="toggleEditMode">Terminar edición</button>
    </div>

    <!-- Enlace para ver versiones -->
    <router-link
      :to="{ name: 'EntryVersions', params: { entryId } }"
      class="view-versions-link"
    >
      Ver versiones
    </router-link>
  </div>
</template>

<style scoped>
.entry-page {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.edit-mode {
  display: flex;
  flex-direction: row;
}

.editor-container {
  flex: 1;
  margin-right: 1rem;
}

.preview-container {
  flex: 1;
  border: 1px solid #ccc;
  padding: 1rem;
  background-color: #f9f9f9;
  color: #333;
  border-radius: 5px;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.view-versions-link {
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
}

.view-versions-link:hover {
  text-decoration: underline;
}
</style>
