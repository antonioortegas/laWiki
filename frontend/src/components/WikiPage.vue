<script setup>
import { ref } from 'vue';
import axios from 'axios';
import SearchBar from './SearchBar.vue';
//dotenv


// Estado reactivo
const entries = ref([]);
const loading = ref(false);
const showAdvancedSearch = ref(false);

// Filtros iniciales vacíos
const filters = ref({
  text: '',
  tags: '',
  content: '',
  createdBy: '',
  editors: '',
});



// Función para ejecutar la búsqueda
const searchEntries = async () => {
  loading.value = true;

  try {
    // Obtener datos de la API
    const response = await axios.get(`/entries`);
    const allEntries = response.data;

    // Convertir los tags del filtro en una lista
    const filterTags = filters.value.tags
      ? filters.value.tags.split(',').map((tag) => tag.trim().toLowerCase())
      : [];

    // Filtrado local
    entries.value = allEntries.filter((entry) => {
      const matchesTitle = filters.value.text
        ? entry.title.toLowerCase().includes(filters.value.text.toLowerCase())
        : true;

      const matchesTags = filterTags.length
        ? filterTags.every((tag) =>
            entry.tags.some((entryTag) =>
              entryTag.toLowerCase().includes(tag)
            )
          )
        : true;

      const matchesContent = filters.value.content
        ? entry.content.toLowerCase().includes(filters.value.content.toLowerCase())
        : true;

      const matchesCreatedBy = filters.value.createdBy
        ? entry.createdBy.toLowerCase().includes(filters.value.createdBy.toLowerCase())
        : true;

      const matchesEditors = filters.value.editors
        ? entry.editors.some((editor) =>
            editor.toLowerCase().includes(filters.value.editors.toLowerCase())
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

// Actualizar filtro al presionar Enter
const handleEnter = (field, value) => {
  filters.value[field] = value;
  searchEntries(); // Realiza la búsqueda al actualizar el filtro
};


// Alternar la búsqueda avanzada
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};
</script>

<template>
  <section class="wiki-page">
    <h2>Buscar en la Wiki</h2>

    <!-- Barra de búsqueda básica -->
    <SearchBar
  :placeholder="'Buscar por título...'"
  type="text"
  @enter="(value) => handleEnter('text', value.text)"
/>

    
    <!-- Botón para mostrar/ocultar búsqueda avanzada -->
    <button @click="toggleAdvancedSearch">
      {{ showAdvancedSearch ? 'Ocultar búsqueda avanzada' : 'Mostrar búsqueda avanzada' }}
    </button>
    
    <!-- Barras de búsqueda avanzada -->
    <div v-if="showAdvancedSearch" class="advanced-search">
      <SearchBar
  :placeholder="'Buscar por tags (separados por comas)...'"
  type="tags"
  @enter="(value) => handleEnter('tags', value.tags)"
/>
<SearchBar
  :placeholder="'Buscar por contenido...'"
  type="content"
  @enter="(value) => handleEnter('content', value.content)"
/>
      <SearchBar
        :value="filters.createdBy"
        @update:value="(value) => (filters.createdBy = value)"
        @enter="(value) => handleEnter('createdBy', value)"
        placeholder="Buscar por creador..."
      />
      <SearchBar
        :value="filters.editors"
        @update:value="(value) => (filters.editors = value)"
        @enter="(value) => handleEnter('editors', value)"
        placeholder="Buscar por editores..."
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
</style>
