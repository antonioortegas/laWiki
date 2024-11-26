<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Para acceder a los parámetros de la ruta
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';

// Simula las entradas en un arreglo local
const entrySampleData = [
  {
    id: "63e8e9d8f86d4e25c9a1b222",
    content: "Detailed content about Allomancy in the Mistborn universe.",
  },
  {
    id: "63e8e9d8f86d4e25c9a1b223",
    content: "A deep dive into Feruchemy and its applications.",
  },
  {
    id: "63e8e9d8f86d4e25c9a1b224",
    content: "The science of Hemalurgy and its ethical implications.",
  },
  {
    id: "63e8e9d8f86d4e25c9a1b225",
    content: "The heralds of the Stormlight Archive and their powers.",
  },
];

const route = useRoute(); // Accede a la información de la ruta
const entryId = ref(route.params.entryId); // ID de la entrada desde la ruta
const isEditing = ref(false); // Controla si estamos en modo edición
const markdownContent = ref(''); // Contenido inicial del Markdown

// Alternar entre modo de edición y vista
const toggleEditMode = () => {
  if (isEditing.value) {
    saveEntry(); // Al salir del modo edición, guarda los cambios
  }
  isEditing.value = !isEditing.value;
};

// Cargar el contenido de la entrada desde los datos locales
const loadEntry = () => {
  const entry = entrySampleData.find((e) => e.id === entryId.value);
  if (entry) {
    markdownContent.value = entry.content; // Asignar el contenido de la entrada
  } else {
    console.error('Entrada no encontrada');
  }
};

// Guardar los cambios en los datos locales
const saveEntry = () => {
  const entryIndex = entrySampleData.findIndex((e) => e.id === entryId.value);
  if (entryIndex > -1) {
    entrySampleData[entryIndex].content = markdownContent.value;
    console.log('Entrada actualizada exitosamente');
  } else {
    console.error('Error al guardar los cambios: entrada no encontrada.');
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
</style>
