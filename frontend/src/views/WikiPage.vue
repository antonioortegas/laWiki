<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import axios from 'axios';
import EntrySearchBar from '@/components/EntrySearchBar.vue';
import CardGrid from '@/components/CardGrid.vue';

import { computed, watch } from 'vue';

const VITE_ENTRIES_API_HOST = import.meta.env.VITE_ENTRIES_API_HOST;
const VITE_WIKIS_API_HOST = import.meta.env.VITE_WIKIS_API_HOST;

// Reactive data
const wikiInfo = ref({});
const entryData = ref([]);
const entries = ref([]); // Entries filtered by search
const loading = ref(false); // Loading state for search
const showAdvancedSearch = ref(false); // Toggle for advanced search view

const filters = ref({
  text: '',
  tags: '',
  content: '',
  createdBy: '',
  editors: '',
});

const $route = useRoute();
const authStore = useAuthStore();
const user = computed(() => authStore.getLoggedUser);  // Computada
const userRole = ref(authStore.user?.role);
const canEditEntries = ref(userRole.value === 'admin' || userRole.value === 'writer' || userRole.value === 'editor');
const canEditWiki = ref(userRole.value === 'admin' || userRole.value === 'editor');
const warningEntryMessage = ref('');
const warningWikiMessage = ref('');
const showEntryAlert = ref(false);
const showWikiAlert = ref(false);

// Observamos el cambio de `user` desde el authStore
watch(() => authStore.user, (newUser, oldUser) => {
  if (newUser !== oldUser) {
    console.log("El usuario cambió de:", oldUser, "a:", newUser);
    console.log("Usuario:", user.value);
    console.log("Puede editar:", canEditEntries.value);
  }
  if (newUser) {
    console.log("Nuevo usuario autenticado:", newUser);
    // Realiza acciones cuando el usuario cambia
  } else {
    console.log("Usuario desconectado");
  }
});

if (!canEditEntries.value) {
  console.log('User does not have the necessary permissions to create an entry.', canEditEntries.value);
  console.log('authStore:', authStore);
  console.log('User:', user.value);
  console.log('User Role:', userRole.value);
  warningEntryMessage.value = "You must be a writer or an editor to create an entry.";
}

if (!canEditWiki.value) {
  console.log('User does not have the necessary permissions to edit the wiki.', canEditWiki.value);
  warningWikiMessage.value = "You must be an editor to edit the wiki.";
}

const showEntryWarning = () => {
  showEntryAlert.value = true;
  setTimeout(() => {
    showEntryAlert.value = false;
  }, 3000);
};

const showWikiWarning = () => {
  showWikiAlert.value = true;
  setTimeout(() => {
    showWikiAlert.value = false;
  }, 3000);
};

// Normalize filters
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

// Normalize entries
const normalizeEntries = (entries) =>
  entries.map((entry) => ({
    ...entry,
    title: entry.title?.toLowerCase() || '',
    content: entry.content?.toLowerCase() || '',
    createdBy: entry.createdBy?.toLowerCase() || '',
    tags: entry.tags?.map((tag) => tag.toLowerCase()) || [],
    editors: entry.editors?.map((editor) => editor.toLowerCase()) || [],
  }));

// Search entries
const searchEntries = async () => {
  loading.value = true;

  try {
    // Fetch entries from the API (mocking with local entry data for now)
    const normalizedEntries = normalizeEntries(entryData.value);
    const normalizedFilters = normalizeFilters();

    // Filter entries
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
    console.error('Error searching entries:', error);
    entries.value = [];
  } finally {
    loading.value = false;
  }
};

// Update filter and trigger search
const updateFilter = (field, value) => {
  filters.value[field] = value || '';
  searchEntries(); // Perform search with updated filters
};

// Toggle advanced search
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};

function filter(searchQuery) {
  con
  const key = Object.keys(searchQuery)[0];
  const text = searchQuery[key].toLowerCase();
  console.log('Filtering by:', text);

  // Filter the original entry data
  entries.value = entryData.value.filter((entry) =>
    entry.title.toLowerCase().includes(text)
  );
}

// Fetch entry data from the backend
const fetchEntryData = async (entryId) => {
  try {
    const response = await axios.get(`${VITE_ENTRIES_API_HOST}/${entryId}`);
    const entry = response.data[0];
    entry.path = `/entry/${entry.entryId}`;
    entry.src = entry.imageSrc;
    entryData.value.push(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
  }
};

// Fetch the wiki info from the backend
const fetchWikiInfo = async () => {
  try {
    const response = await axios.get(`${VITE_WIKIS_API_HOST}/${$route.params.wikiId}`);
    wikiInfo.value = response.data[0];
    console.log('Wiki Info:', wikiInfo.value);

    const promises = wikiInfo.value.entryUUIDs.map(async (entryId) => {
      await fetchEntryData(entryId);
    });

    await Promise.all(promises);
    entries.value = entryData.value; // Initial entries
  } catch (error) {
    console.error('Error fetching wiki info:', error);
  }
};

fetchWikiInfo();

const advancedFilter = (searchQuery) => {
  console.log('Advanced filter:', searchQuery);

  // Extrae los campos del objeto de búsqueda
  const { title, content, editor, tags } = searchQuery;

  // Normaliza los valores de búsqueda para que no sea sensible a mayúsculas/minúsculas
  const searchTitle = title?.toLowerCase() || '';
  const searchContent = content?.toLowerCase() || '';
  const searchEditor = editor?.toLowerCase() || '';
  const searchTags = tags
    ? tags.split(',').map((tag) => tag.trim().toLowerCase())
    : [];

  // Filtra las entradas originales según los criterios de búsqueda avanzada
  entries.value = entryData.value.filter((entry) => {
    const matchesTitle = searchTitle
      ? entry.title.toLowerCase().includes(searchTitle)
      : true;

    const matchesContent = searchContent
      ? entry.content.toLowerCase().includes(searchContent)
      : true;

    const matchesEditor = searchEditor
      ? entry.editors.some((ed) => ed.toLowerCase().includes(searchEditor)) ||
      entry.createdBy.toLowerCase().includes(searchEditor)
      : true;

    const matchesTags = searchTags.length
      ? searchTags.every((tag) =>
        entry.tags.some((entryTag) => entryTag.toLowerCase().includes(tag))
      )
      : true;

    return matchesTitle && matchesContent && matchesEditor && matchesTags;
  });
};

</script>

<template>
  <div class="bg-background text-center flex flex-col">
    <!-- Wiki Header -->
    <div class="text-center mx-auto px-8 sm:px-16 w-full bg-gray-100 py-4">
      <h1 v-if="wikiInfo.title" class="text-3xl font-heading text-text font-bold">{{ wikiInfo.title }}</h1>
      <p v-if="wikiInfo.description" class="text-gray-700 mt-2 text-sm sm:text-base">
        {{ wikiInfo.description }}
      </p>
      <p v-if="wikiInfo.numberOfEntries" class="text-gray-600 text-sm sm:text-base mt-1">
        Containing <span class="font-semibold text-primary">{{ wikiInfo.numberOfEntries }}</span> entries and growing!
      </p>
      <router-link v-if="canEditWiki" :to="{ name: 'EditWiki', params: { wikiId: $route.params.wikiId } }">
        <button type="submit" :disabled="!canEditWiki"
          class="px-6 py-3 my-2 bg-primary text-background font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent transform transition-transform hover:scale-105">
          Edit Wiki
        </button>
      </router-link>
      <div v-else>
        <button @click="showWikiWarning"
          class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md"
          style="background-color: gray!important; cursor: not-allowed;">
          Edit Wiki
        </button>
        <!-- Show warning if the user cannot edit the wiki -->
        <div v-if="showWikiAlert" class="bg-red-500 text-white p-4 rounded-lg my-4">
          {{ warningWikiMessage }}
        </div>
      </div>
    </div>
  </div>

  <!-- enter and keydown are not being used for now, refactored to put everything on "updateQuery" -->
  <EntrySearchBar placeholderText="Search for an entry..." :backgroundImageUrl="wikiInfo.src" @enter="filter"
    @keyDown="filter" @updateQuery="advancedFilter" />


  <!-- Call-to-Action Section -->
  <div class="bg-secondary mx-8 sm:mx-32 my-4 p-6 rounded-3xl shadow-lg font-heading overflow-hidden">
    <div class="text-center">
      <p class="text-white text-lg font-heading mb-4">
        Don't see what you're looking for? Add it!
      </p>
      <router-link v-if="canEditEntries" :to="{ name: 'CreateEntry', params: { wikiId: $route.params.wikiId } }">
        <button
          class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-accent hover:bg-opacity-70 border-2 hover:scale-105 hover:border-text transform transition-transform">
          + Create an Entry
        </button>
      </router-link>
      <div v-else>
        <button @click="showEntryWarning"
          class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md"
          style="background-color: gray!important; cursor: not-allowed;">
          + Create an Entry
        </button>
        <!-- Show warning if the user cannot create an entry -->
        <div v-if="showEntryAlert" class="bg-red-500 text-white p-4 rounded-lg my-4">
          {{ warningEntryMessage }}
        </div>
      </div>
    </div>
  </div>

  <!-- Search Bar -->

  <!-- <SearchBar placeholder="Search for an entry..." @enter="(value) => updateFilter('text', value.text)" /> -->

  <!-- Toggle Advanced Search -->
  <!-- <button @click="toggleAdvancedSearch">
    {{ showAdvancedSearch ? 'Hide Advanced Search' : 'Show Advanced Search' }}
  </button> -->

  <!-- Advanced Search Options -->
  <!-- <div v-if="showAdvancedSearch" class="advanced-search">
    <SearchBar placeholder="Search by tags (comma-separated)..." @enter="(value) => updateFilter('tags', value.tags)" />
    <SearchBar placeholder="Search by content..." @enter="(value) => updateFilter('content', value.content)" />
    <SearchBar placeholder="Search by creator..." @enter="(value) => updateFilter('createdBy', value.createdBy)" />
    <SearchBar placeholder="Search by editors (comma-separated)..."
      @enter="(value) => updateFilter('editors', value.editors)" />
  </div> -->

  <!-- Results Section -->
  <div v-if="loading" class="loading">Loading...</div>
  <CardGrid v-else :data="entries" />
</template>

<!--script>
export default {
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.getLoggedUser;
    },
    token() {
      return this.authStore.getLoggedUserToken;
    },
  },

  watch: {
    // Observar el cambio de la variable 'user' en el authStore
    user(newUser, oldUser) {
      if (newUser) {
        // El usuario ha cambiado (o ha sido restaurado)
        console.log("Nuevo usuario autenticado:", newUser);
        // Realiza acciones adicionales si es necesario
      } else {
        // El usuario ha sido desconectado
        console.log("Usuario desconectado");
      }
    },

    // Observar el cambio del 'token' en el authStore
    token(newToken, oldToken) {
      if (newToken) {
        console.log("Nuevo token:", newToken);
        // Realiza cualquier acción adicional cuando el token cambie
      } else {
        console.log("Token no válido o expirado.");
      }
    },
  },
};
</script-->


<style scoped>
.advanced-search {
  margin-top: 20px;
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
