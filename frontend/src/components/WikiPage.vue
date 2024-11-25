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
    let response;

    if (filters.text) {
      // Búsqueda por título
      const url = `http://localhost:7002/entries/search?text=${encodeURIComponent(filters.text)}`;
      response = await axios.get('/entries');
      entries.value = response.data;

      entries.value = response.data.filter((entry) =>
    entry.title.toLowerCase().includes(filters.text?.toLowerCase() || '')
      );
    } else if (filters.tags) {
      // Búsqueda avanzada por tags
      const url = `http://localhost:7002/entries/search?text=${encodeURIComponent(filters.tags)}`;
      response = await axios.get('/entries');

      // Filtrar por tags
      entries.value = response.data.filter((entry) =>
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      );
    } else if (filters.content) {
      // Búsqueda avanzada por contenido
      const url = `http://localhost:7002/entries/search?text=${encodeURIComponent(filters.content)}`;
      response = await axios.get('/entries');

      // Filtrar por contenido
      entries.value = response.data.filter((entry) =>
        entry.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    } else {
      entries.value = [];
    }
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
    </div>

    <!-- Resultados -->
    <div v-if="loading" class="loading">Cargando...</div>
    <ul v-if="entries.length" class="results">
      <li v-for="entry in entries" :key="entry._id">
        <h3>{{ entry.title }}</h3>
        <p>{{ entry.content }}</p>
        <small>Tags: {{ entry.tags.join(', ') }}</small>
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
