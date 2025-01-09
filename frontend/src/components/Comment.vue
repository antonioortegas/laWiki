<template>
  <div :style="{ marginLeft: depth * 20 + 'px' }" class="comment-container">
    <div class="comment-header">
      <div v-if="author">
        <a :href="`/profile/${author._id}`"><span class="author">{{ author.name }}</span></a>
        <span class="time">{{ formatTime(content.createdAt) }}</span>
      </div>
      <div v-else>
        <span class="author">Anonymous User</span>
        <span class="time">{{ formatTime(content.createdAt) }}</span>
      </div>
    </div>
    <p class="comment-text">{{ content.content }}</p>
    <div class="comment-actions">
      <button @click="toggleReplyForm" class="reply-btn">Reply</button>
      <!-- Show only if current user is the author of the comment -->
      <button v-if="checkAuthor()" @click="deleteComment" class="delete-btn">Delete</button>
    </div>

    <!-- Reply form -->
    <form v-if="showReplyForm" @submit.prevent="submitReply" class="reply-form">
      <textarea v-model="replyText" placeholder="Write a response..." class="reply-input" required></textarea>
      <button type="submit" class="submit-reply-btn">Reply</button>
    </form>

    <!-- Replies -->
    <div v-if="content.replies.length" class="replies">
      <Comment v-for="reply in content.replies" :key="reply._id" :content="reply" :depth="depth + 1" :entryId="entryId"
        :currentUserId="this.user._id" @reply="forwardReply" @delete="forwardDelete" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from 'axios';
const VITE_ENTRIES_API_HOST = import.meta.env.VITE_ENTRIES_API_HOST;
const VITE_USERS_API_HOST = import.meta.env.VITE_USERS_API_HOST;

export default {
  name: "Comment",
  props: {
    content: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      required: true
    },
    entryId: {
      type: String,
      required: true
    },
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.getLoggedUser;
    },
  },
  data() {
    return {
      showReplyForm: false,
      replyText: "",
      author: "",
    };
  },
  async mounted() {
    console.log("Montado comentario: ", this.content);
    await this.fetchAuthor();
  },
  methods: {
    // Fetches the author's name using their ID
    async fetchAuthor() {
      try {
        const response = await axios.get(`${VITE_USERS_API_HOST}/${this.content.author}`);
        this.author = response.data;
      } catch (error) {
        console.error("Error fetching author name:", error.response?.data || error.message);
        this.author.name = "Anonymous User";
      }
    },
    // Toggles the reply form visibility
    toggleReplyForm() {
      this.showReplyForm = !this.showReplyForm;
    },
    // Submits a reply
    async submitReply() {
      if (!this.replyText.trim()) return;

      const reply = {
        content: this.replyText.trim(),
        author: this.user._id,
        responseTo: this.content._id, // Enlazamos al comentario padre
      };

      try {
        const response = await axios.put(`${VITE_ENTRIES_API_HOST}/${this.entryId}/addComment`, reply);
        const newReply = { ...response.data, replies: [] };
        this.$emit("reply", { parentId: this.content._id, reply: newReply });
        this.replyText = "";
        this.showReplyForm = false;
      } catch (error) {
        console.error("Error al enviar la respuesta:", error.response?.data || error.message);
      }
    },
    // Deletes the comment with a PUT request
    async deleteComment() {
      console.log("Deleting comment:", this.content._id);
      try {
        await axios.put(`${VITE_ENTRIES_API_HOST}/${this.entryId}/deleteComment/`, {
          commentId: this.content._id
        });
      console.log("Borrado de entry");
        // Emitir el evento para que el componente padre elimine el comentario de la lista
        this.$emit("delete", this.content._id);
      } catch (error) {
        console.error("Error deleting comment:", error.response?.data || error.message);
      }
    },
    // Forwards the reply event up the chain
    forwardReply(payload) {
      this.$emit("reply", payload);
    },
    // Forwards the delete event up the chain
    forwardDelete(commentId) {
      this.$emit("delete", commentId);
    },
    // Formats the timestamp into a readable time
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    checkAuthor() {
      if(!this.user) return false;
      else
        console.log("Usuario con sesion en comentarios: ", this.user._id);
      return this.user._id === this.content.author;
    }
  }
};
</script>


<style scoped>
.comment-container {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0;
  position: relative;
}

.comment-header {
  font-size: 0.9rem;
  color: #555;
}

.author {
  font-weight: bold;
}

.time {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #999;
}

.comment-text {
  margin: 0.5rem 0;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.reply-btn,
.delete-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.reply-btn:hover,
.delete-btn:hover {
  text-decoration: underline;
  color: #0056b3;
}

.delete-btn {
  color: #ff4d4d;
}

.delete-btn:hover {
  color: #d93636;
}

.reply-form {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
}

.reply-input {
  resize: vertical;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.submit-reply-btn {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
}

.submit-reply-btn:hover {
  background-color: #0056b3;
}

.replies {
  margin-top: 1rem;
  padding-left: 20px;
  border-left: 2px solid #ddd;
}
</style>