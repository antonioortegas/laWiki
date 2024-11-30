<template>
  <div class="rating-container">
    <div class="stars">
      <div
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ filled: star <= fullStars }"
        @click="setRating(star)"
      >
        <div v-if="star === fullStars + 1" class="partial" :style="{ width: partialWidth + '%' }">★</div>
        ★
      </div>
    </div>
    <div 
      class="rating-number" 
      :class="{'is-text': isText, 'is-number': !isText}">
      {{ displayValue }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
      validator(value) {
        return value == 0 || (value >= 1 && value <= 5);
      }
    }
  },
  computed: {
    fullStars() {
      return Math.floor(this.value); // Número entero de estrellas llenas
    },
    partialWidth() {
      return (this.value - this.fullStars) * 100; // Porcentaje de la última estrella llena
    },
    stars() {
      return [1, 2, 3, 4, 5]; // Generar 5 estrellas
    },
    isText() {
      // Verifica si el valor es texto ("Sin valoraciones")
      return this.value === 0;
    },
    displayValue() {
      // Devuelve el texto o el número dependiendo del valor
      return this.isText ? "Sin valoraciones" : this.value.toFixed(1);
    }
  },
  methods: {
    setRating(star) {
      this.$emit("update:value", star); // Emitir el nuevo valor del rating
    }
  }
};
</script>

<style scoped>
.rating-container {
  display: flex;
  flex-direction: column; /* Organiza los elementos en columna */
  align-items: center; /* Centra las estrellas y el número horizontalmente */
}

.stars {
  display: flex; /* Asegura que las estrellas se muestren en una fila horizontal */
}

.star {
  font-size: 1.4rem;
  color: gray;
  cursor: pointer;
  margin-right: 5px; /* Espaciado entre las estrellas */
  position: relative;
}

.star.filled {
  color: gold;
}
/*  TODO: PENDIENTE DE REVISAR REQUISITOS
.star:hover,
.star.filled:hover {
  color: gold;
}
*/
.partial {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  color: gold;
  overflow: hidden;
}

.rating-number.is-text {
  font-size: 0.9rem;
}

.rating-number.is-number {
  font-size: 1.2rem;
}
</style>
