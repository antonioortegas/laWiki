<script setup>
import { ref, onMounted } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const markdownContent = ref(''); // Contenido inicial del editor
let easyMDEInstance = null;

onMounted(() => {
  easyMDEInstance = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    initialValue: markdownContent.value,
    placeholder: 'Escribe aquí tu contenido en Markdown...',
    spellChecker: false,
  });

  easyMDEInstance.codemirror.on('change', () => {
    markdownContent.value = easyMDEInstance.value();
  });
});
</script>

<template>
  <div class="app-container">
    <div class="editor-container">
      <textarea id="markdown-editor"></textarea>
    </div>
    <div class="preview-container">
      <h2>Vista previa</h2>
      <div class="preview-content" v-html="markdownContent"></div>
    </div>
  </div>
</template>

<style scoped>
/* Establecer fondo blanco para toda la página */
:root {
  --background-color: #ffffff; /* Fondo blanco */
  --text-color: #000000;      /* Texto negro */
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  font-family: Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: row; /* Elementos uno al lado del otro */
  height: 100vh; /* Usar toda la altura de la ventana */
  box-sizing: border-box;
  padding: 1rem;
  background-color: var(--background-color);
}

.editor-container,
.preview-container {
  flex: 1; /* Cada sección ocupa el mismo espacio */
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
}

textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.preview-content {
  padding: 1rem;
  border: 1px solid #ccc;
  background-color: var(--background-color);
  color: var(--text-color);
  overflow-y: auto; /* Scroll si el contenido es demasiado grande */
  height: 100%;
}
</style>
