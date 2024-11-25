<script setup>
import { ref } from 'vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue'; // Importamos el componente de vista previa
import { marked } from 'marked'; // Importar la librería para procesar Markdown

const isEditing = ref(false); // Controla si estamos en modo edición
const markdownContent = ref('1. una cosa\n2. dos cosas\n3. tres cosas'); // Contenido inicial del Markdown

// Alternar entre modo de edición y vista
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};
</script>

<template>
  <div class="entry-page">
    <h1>ENTRY: {{ $route.params.entryId }}</h1>

    <!-- Vista de solo lectura -->
    <div v-if="!isEditing">
      <!-- Renderizamos la vista previa con un key dinámico -->
      <MarkdownPreview :content="markdownContent" :key="markdownContent" />
      <button @click="toggleEditMode">Editar entrada</button>
    </div>

    <!-- Modo edición -->
    <div v-else class="edit-mode">
      <div class="editor-container">
        <MarkdownEditor v-model="markdownContent" />
      </div>
      <div class="preview-container">
        <h2>Vista previa</h2>
        <!-- Renderizamos la vista previa con un key dinámico -->
        <MarkdownPreview :content="markdownContent" :key="markdownContent" />
      </div>
      <button @click="toggleEditMode">Terminar edición</button>
    </div>

    <!-- Enlace para ver versiones -->
    <router-link
      :to="{ name: 'EntryVersions', params: { entryId: $route.params.entryId } }"
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
