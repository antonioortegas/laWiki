<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      :placeholder="placeholder"
      @keydown="onKeydown"
      @input="onInput"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
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
        this.$emit('enter', { [this.type]: this.searchQuery }); // Envía el filtro al presionar Enter
      }
    },
  },
};
</script>

<style scoped>
.search-bar {
  margin: 10px 0;
}
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}
</style>
