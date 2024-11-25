<script setup>
import { ref } from 'vue';
import axios from 'axios';
import SearchBar from './SearchBar.vue';

const entries = ref([]);
const loading = ref(false);
const showAdvancedSearch = ref(false); // Mostrar u ocultar búsqueda avanzada

const searchEntries = async (filters) => {
  loading.value = true;

  try {
    const url = `http://localhost:7002/entries`; // Endpoint general para obtener todas las entradas
    const response = await axios.get('/entries');

    // Filtrado local para todos los criterios
    entries.value = response.data.filter((entry) => {
      const matchesTitle = filters.text
        ? entry.title.toLowerCase().includes(filters.text.toLowerCase())
        : true;

      const matchesTags = filters.tags
        ? entry.tags.some((tag) =>
            tag.toLowerCase().includes(filters.tags.toLowerCase())
          )
        : true;

      const matchesContent = filters.content
        ? entry.content.toLowerCase().includes(filters.content.toLowerCase())
        : true;

      const matchesCreatedBy = filters.createdBy
        ? entry.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())
        : true;

      const matchesEditors = filters.editors
        ? entry.editors.some((editor) =>
            editor.toLowerCase().includes(filters.editors.toLowerCase())
          )
        : true;

      // Incluir solo las entradas que coincidan con todos los criterios activos
      return (
        matchesTitle &&
        matchesTags &&
        matchesContent &&
        matchesCreatedBy &&
        matchesEditors
      );
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    entries.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};
</script>

<template>
  <section class="wiki-page">
    <h2>Buscar en la Wiki</h2>

    <!-- Barra de búsqueda básica -->
    <SearchBar @search="searchEntries" placeholder="Buscar por título..." />

    <!-- Botón para mostrar/ocultar búsqueda avanzada -->
    <button @click="toggleAdvancedSearch">
      {{ showAdvancedSearch ? 'Ocultar búsqueda avanzada' : 'Mostrar búsqueda avanzada' }}
    </button>

    <!-- Barras de búsqueda avanzada -->
    <div v-if="showAdvancedSearch" class="advanced-search">
      <SearchBar @search="searchEntries" type="tags" placeholder="Buscar por tags..." />
      <SearchBar @search="searchEntries" type="content" placeholder="Buscar por contenido..." />
      <SearchBar @search="searchEntries" type="createdBy" placeholder="Buscar por creador..." />
      <SearchBar @search="searchEntries" type="editors" placeholder="Buscar por editores..." />
    </div>

    <!-- Resultados -->
    <div v-if="loading" class="loading">Cargando...</div>
    <ul v-if="entries.length" class="results">
      <li v-for="entry in entries" :key="entry._id">
        <h3>{{ entry.title }}</h3>
        <p>{{ entry.content }}</p>
        <small>Tags: {{ entry.tags.join(', ') }}</small>
        <br />
        <small>Creado por: {{ entry.createdBy }}</small>
        <br />
        <small>Editores: {{ entry.editors.join(', ') }}</small>
      </li>
    </ul>
    <p v-else>No se encontraron entradas.</p>
  </section>
</template>

<style scoped>
.results {
  list-style: none;
  padding: 0;
}
.results li {
  margin-bottom: 1rem;
}
.loading {
  font-weight: bold;
  color: gray;
}
button {
  margin: 10px 0;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #0056b3;
}
.advanced-search {
  margin-top: 20px;
}
</style>
