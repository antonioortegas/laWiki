<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      :placeholder="placeholder"
      @input="onSearch"
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
    onSearch() {
      this.$emit('search', { [this.type]: this.searchQuery }); // Envía el filtro correcto
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
