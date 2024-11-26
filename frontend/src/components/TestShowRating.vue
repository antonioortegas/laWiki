<template>
  <div>
    <h2>Valoraciones</h2>
    <StarRating :value="averageRating" />
    <!--StarRating :value="3" /-->
  </div>
</template>

<script>
import StarRating from './StarRating.vue';
import axios from 'axios';

export default {
  components: { StarRating },
  data() {
    return {
      averageRating: 0, // Valor inicial
      userId: '67436f7619b522e08f511bff' // Cambia esto al ID dinámico del usuario
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`http://localhost:3001/users/${this.userId}/averageRating`);

      console.log("Respuesta del backend:", response.data); // Depuración
      this.averageRating = response.data.average || 0;
    } catch (error) {
      console.error('Error al obtener el promedio de valoraciones:', error);
    }
  }
};

</script>
