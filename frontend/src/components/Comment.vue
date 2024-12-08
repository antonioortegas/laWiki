<template>
    <div :style="{ marginLeft: depth * 20 + 'px' }" class="comment-container">
      <div class="comment-header">
        <span class="author">{{ authorName }}</span>
        <span class="time">{{ formatTime(content.createdAt) }}</span>
      </div>
      <p class="comment-text">{{ content.content }}</p>
      <div class="comment-actions">
        <button @click="toggleReplyForm" class="reply-btn">Reply</button>
        <!-- Show only if current user is the author of the comment -->
        <button v-if="currentUserId === content.author" @click="deleteComment" class="delete-btn">Delete</button>
      </div>
  
      <!-- Reply form -->
      <form v-if="showReplyForm" @submit.prevent="submitReply" class="reply-form">
        <textarea 
          v-model="replyText" 
          placeholder="Write a response..." 
          class="reply-input"
          required
        ></textarea>
        <button type="submit" class="submit-reply-btn">Reply</button>
      </form>
  
      <!-- Replies -->
      <div v-if="content.replies.length" class="replies">
        <Comment 
          v-for="reply in content.replies" 
          :key="reply._id" 
          :content="reply" 
          :depth="depth + 1"
          :entryId="entryId"
          :currentUserId="currentUserId" 
          @reply="forwardReply"
          @delete="forwardDelete"
        />
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  
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
      currentUserId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showReplyForm: false,
        replyText: "",
        authorName: "",
      };
    },
    async mounted() {
      await this.fetchAuthorName();
    },
    methods: {
      // Fetches the author's name using their ID
      async fetchAuthorName() {
        try {
          console.log("Buscando autor: ", this.content.author);
          const response = await axios.get(`/api/users/${this.content.author}`);
          this.authorName = response.data.name || "Anonymous User";
        } catch (error) {
          console.error("Error fetching author name:", error.response?.data || error.message);
          this.authorName = "Anonymous User";
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
          author: this.currentUserId,
          responseTo: this.content._id, // Enlazamos al comentario padre
        };

        try {
          const response = await axios.put(`/api/entries/${this.entryId}/addComment`, reply);
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
        try {
            console.log("Eliminando comentario: ", this.content._id);
            console.log("De la entrada: ", this.entryId);

            await axios.put(`/api/entries/${this.entryId}/deleteComment/${this.content._id}`);
            
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