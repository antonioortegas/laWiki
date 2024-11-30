<template>
  <div class="rating-container">
    <div class="stars" @mousemove="updateHover" @mouseleave="clearHover">
      <div
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ filled: star <= hoverStars || star <= fullStars }"
        @mousemove="updatePartialHover($event, star)"
        @click="setRating(star)"
      >
        <div 
          v-if="star === Math.ceil(hoverStars) || star === fullStars + 1" 
          class="partial" 
          :style="{ width: partialHoverWidth(star) + '%' }"
        >
          ★
        </div>
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
    },
    userId: {
      type: String, // User ID passed as a prop
      required: true
    }
  },
  data() {
    return {
      hoverStars: 0, // Tracks stars filled on hover
      hoverPartial: 0 // Tracks fractional fill on hover
    };
  },
  computed: {
    // Full stars
    fullStars() {
      return Math.floor(this.value); 
    },
    // % of the last star filled
    partialWidth() {
      return (this.value - this.fullStars) * 100;
    },
    stars() {
      return [1, 2, 3, 4, 5];
    },
    // To check if the user has no ratings yet
    isText() {
      return this.value === 0;
    },
    // Returns the value, or a message if the user has no ratings yet
    displayValue() {
      return this.isText ? "No ratings yet" : this.value.toFixed(1);
    }
  },
  methods: {
    // Updates hover state when the mouse moves
    updateHover(event) {
      const starWidth = event.target.offsetWidth;
      const rect = event.target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;

      this.hoverPartial = mouseX / starWidth;
    },
    // Calculates fractional hover width for stars
    partialHoverWidth(star) {
      if (this.hoverStars < star) return 0;
      if (this.hoverStars === star) return this.hoverPartial * 100;
      return 100;
    },
    // Updates hover state for stars
    updatePartialHover(event, star) {
      this.updateHover(event);
      this.hoverStars = star - 1 + this.hoverPartial;
    },
    // Clears hover state when the mouse leaves
    clearHover() {
      this.hoverStars = 0;
      this.hoverPartial = 0;
    },
    // Sends the rating to the server
    async setRating(star) {
      const rating = this.hoverStars || star;
      try {
        await axios.post(`http://localhost:3001/ratings`, {
          rating,
          userId: this.userId
        });
        console.log("Rating submitted:", rating);
        this.$emit("update:value", rating); // Update the rating value locally
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  }
};
</script>

<style scoped>
.rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stars {
  display: flex;
  cursor: pointer; /* Indicate interactivity */
}

.star {
  font-size: 2rem;
  color: gray;
  margin-right: 5px;
  position: relative;
}

.star.filled {
  color: gold;
}

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
