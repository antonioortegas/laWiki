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
      default: 'text', // 'text', 'tags', 'content'
    },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    onSearch() {
      const filter = {};
      filter[this.type] = this.searchQuery; // Dinámicamente envía el filtro adecuado
      this.$emit('search', filter);
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
