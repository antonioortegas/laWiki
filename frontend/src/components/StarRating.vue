<template>
  <div class="rating-container">
    <div class="stars" @mouseleave="clearHover">
      <div v-for="star in stars" :key="star" class="star"
        :class="{ filled: isHovering ? star <= hoverStars : star <= fullStars }" @mouseenter="updateHover(star)"
        @click="setRating(star)">
        ★
      </div>
    </div>
    <div class="rating-number" :class="{ 'is-text': isText, 'is-number': !isText }">
      {{ displayValue }}
    </div>
  </div>
</template>


<script>
import axios from "axios";
const VITE_USERS_API_HOST = import.meta.env.VITE_USERS_API_HOST;

export default {
  props: {
    value: {
      type: Number,
      default: 0,
      validator(value) {
        return value === 0 || (value >= 1 && value <= 5);
      }
    },
    profileUserId: {
      type: String,
      default: null,
      required: true
    },
    loggedUser: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      hoverStars: 0, // Tracks the number of hovered stars
      isHovering: false // Indicates if the mouse is over the stars
    };
  },
  computed: {
    fullStars() {
      return Math.floor(this.value); // Fully filled stars based on value
    },
    stars() {
      return [1, 2, 3, 4, 5]; // Star array for rendering
    },
    isText() {
      return this.value === 0; // No ratings check
    },
    displayValue() {
      return this.isText ? "No ratings yet" : this.value.toFixed(1); // Show rating or message
    }
  },
  methods: {
    // Updates the number of stars to fill when hovering
    updateHover(star) {
      this.isHovering = true; // Indicate that hovering is active
      this.hoverStars = Math.max(1, star); // Ensure at least the first star is filled
    },
    // Clears the hover state when the mouse leaves
    clearHover() {
      this.isHovering = false; // Indicate that hovering is inactive
      this.hoverStars = 0;
    },
    // Sends the selected rating to the server, if the user is a writer
    async setRating(star) {
      console.log("loggedUser:", this.loggedUser);
      if(this.loggedUser === null) {
        alert("You must be logged in to rate users.");
        return;
      }

      if (this.loggedUser.role === 'writer' || this.loggedUser.role === 'admin') {
        if (this.loggedUser._id === this.profileUserId) {
          alert("You can't rate yourself!");
          return;
        } else {
          try {
            await axios.post(`${VITE_USERS_API_HOST}/${this.profileUserId}/addRating`, {
              ratedBy: this.loggedUser._id,
              score: star,
            });

            location.reload(); // Refresh the page to update the rating
          } catch (error) {
            console.error("Error submitting rating:", error.response?.data || error.message);
            if(error.response?.data.message === "Already rated by this user") {
              alert("You have already rated this user.");
            }
          }
        }
      } else {
        alert("You must be a writer to rate users.");
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
  cursor: pointer;
  /* Indicate interactivity */
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
