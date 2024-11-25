<script setup>
import { defineProps } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  content: {
    type: String,
    required: true,
  }
});

// Procesa el contenido de Markdown a HTML
const renderMarkdown = (content) => {
  marked.setOptions({
    gfm: true, // Habilita GitHub Flavored Markdown
    breaks: true, // Soporta saltos de línea de Markdown
    smartLists: true, // Mejora el manejo de listas numeradas
    smartypants: true, // Opciones adicionales para convertir comillas y otros caracteres
    headerIds: true, // Genera IDs para los encabezados
    xhtml: true, // Genera XHTML válido
  });

  return marked(content);
};
</script>

<template>
  <div class="markdown-preview" v-html="renderMarkdown(content)"></div>
</template>

<style scoped>
.markdown-preview {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
}
</style>
