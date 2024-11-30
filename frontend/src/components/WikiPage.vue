<script setup>
import { ref } from 'vue';
import axios from 'axios';
import SearchBar from './SearchBar.vue';

// Estado reactivo
const entries = ref([]);
const loading = ref(false);
const showAdvancedSearch = ref(false);

// Filtros iniciales
const filters = ref({
  text: '',
  tags: '',
  content: '',
  createdBy: '',
  editors: '',
});

// Normalizar filtros
const normalizeFilters = () => ({
  text: filters.value.text?.toLowerCase() || '',
  tags: filters.value.tags
    ? filters.value.tags.split(',').map((tag) => tag.trim().toLowerCase())
    : [],
  content: filters.value.content?.toLowerCase() || '',
  createdBy: filters.value.createdBy?.toLowerCase() || '',
  editors: filters.value.editors
    ? filters.value.editors.split(',').map((editor) => editor.trim().toLowerCase())
    : [],
});

// Normalizar entradas
const normalizeEntries = (entries) =>
  entries.map((entry) => ({
    ...entry,
    title: entry.title?.toLowerCase() || '',
    content: entry.content?.toLowerCase() || '',
    createdBy: entry.createdBy?.toLowerCase() || '',
    tags: entry.tags?.map((tag) => tag.toLowerCase()) || [],
    editors: entry.editors?.map((editor) => editor.toLowerCase()) || [],
  }));

// Buscar entradas
const searchEntries = async () => {
  loading.value = true;

  try {
    // Obtener datos de la API
    const response = await axios.get(`/entries`);
    const normalizedEntries = normalizeEntries(response.data);
    const normalizedFilters = normalizeFilters();

    // Filtrar entradas
    entries.value = normalizedEntries.filter((entry) => {
      const matchesTitle = normalizedFilters.text
        ? entry.title.includes(normalizedFilters.text)
        : true;

      const matchesTags = normalizedFilters.tags.length
        ? normalizedFilters.tags.every((tag) =>
            entry.tags.some((entryTag) => entryTag.includes(tag))
          )
        : true;

      const matchesContent = normalizedFilters.content
        ? entry.content.includes(normalizedFilters.content)
        : true;

      const matchesCreatedBy = normalizedFilters.createdBy
        ? entry.createdBy.includes(normalizedFilters.createdBy)
        : true;

      const matchesEditors = normalizedFilters.editors.length
        ? normalizedFilters.editors.every((editor) =>
            entry.editors.some((entryEditor) => entryEditor.includes(editor))
          )
        : true;

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

// Actualizar filtro y ejecutar búsqueda
const updateFilter = (field, value) => {
  filters.value[field] = value || '';
  searchEntries(); // Ejecuta la búsqueda con los filtros actualizados
};

// Alternar búsqueda avanzada
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};
</script>

<template>
  <section class="wiki-page">
    <h2>Buscar en la Wiki</h2>

    <!-- Barra de búsqueda básica -->
    <SearchBar
      placeholder="Buscar por título..."
      type="text"
      @enter="(value) => updateFilter('text', value.text)"
    />

    <!-- Botón para mostrar/ocultar búsqueda avanzada -->
    <button @click="toggleAdvancedSearch">
      {{ showAdvancedSearch ? 'Ocultar búsqueda avanzada' : 'Mostrar búsqueda avanzada' }}
    </button>

    <!-- Barras de búsqueda avanzada -->
    <div v-if="showAdvancedSearch" class="advanced-search">
      <SearchBar
        placeholder="Buscar por tags (separados por comas)..."
        type="tags"
        @enter="(value) => updateFilter('tags', value.tags)"
      />
      <SearchBar
        placeholder="Buscar por contenido..."
        type="content"
        @enter="(value) => updateFilter('content', value.content)"
      />
      <SearchBar
        placeholder="Buscar por creador..."
        type="createdBy"
        @enter="(value) => updateFilter('createdBy', value.createdBy)"
      />
      <SearchBar
        placeholder="Buscar por editores (separados por comas)..."
        type="editors"
        @enter="(value) => updateFilter('editors', value.editors)"
      />
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
.advanced-search {
  margin-top: 20px;
}
.results {
  display: grid;
  gap: 1rem;
}
.loading {
  font-size: 1.25rem;
  color: #6b7280;
}
button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #00ff26a5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #00b339;
}
</style>
