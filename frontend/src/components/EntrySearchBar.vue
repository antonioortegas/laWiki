<script setup>
import searchBg from '@/assets/logo.jpg'; // Import the default image

defineProps({
    placeholderText: {
        type: String,
        required: false,
        default: 'Search...',
    },
    backgroundImageUrl: {
        type: String,
        required: false,
        default: searchBg, // Set the default to the imported image
    },
});
</script>

<template>

  <div class="justify-items-center mx-auto mt-4 p-10 relative sm:h-48 md:h-64 flex items-center justify-center">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"></div>

    <!-- Contenedor de barras de búsqueda -->
    <div class="z-10 space-y-4 max-w-md w-full">
      <!-- Campo de búsqueda por título -->
      <div class="relative flex items-center h-12 rounded-md focus-within:shadow-lg overflow-hidden border-secondary border-2 bg-secondary">
        <div class="grid place-items-center h-full w-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          class="pl-4 h-full w-full outline-none text-sm placeholder-secondary"
          type="text"
          placeholder="Search for an entry by title..."
          @keydown.enter="$emit('search', { type: 'title', query: $event.target.value })"
        />
      </div>

      <!-- Campo de búsqueda por contenido -->
      <div class="relative flex items-center h-12 rounded-md focus-within:shadow-lg overflow-hidden border-secondary border-2 bg-secondary">
        <div class="grid place-items-center h-full w-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          class="pl-4 h-full w-full outline-none text-sm placeholder-secondary"
          type="text"
          placeholder="Search for an entry by content..."
          @keydown.enter="$emit('search', { type: 'content', query: $event.target.value })"
        />
      </div>

      <!-- Campo de búsqueda por etiquetas -->
      <div class="relative flex items-center h-12 rounded-md focus-within:shadow-lg overflow-hidden border-secondary border-2 bg-secondary">
        <div class="grid place-items-center h-full w-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          class="pl-4 h-full w-full outline-none text-sm placeholder-secondary"
          type="text"
          placeholder="Search for an entry by tags..."
          @keydown.enter="$emit('search', { type: 'tags', query: $event.target.value })"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholderText: {
      type: String,
      default: 'Buscar...',
    },
    type: {
      type: String,
      default: 'text', // Puede ser 'text', 'tags', o 'content'
    },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    onInput() {
      // Sin emitir búsqueda aquí; solo para actualizar el modelo si es necesario.
    },
    onKeydown(event) {
      if (event.key === 'Enter') {
        this.$emit('enter', { [this.type]: this.searchQuery });
      }
      else {
        //dont emit keydown event for now
        //this.$emit('keyDown', { [this.type]: this.searchQuery });
      }
    },
  },
};
</script>