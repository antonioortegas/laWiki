<template>
    <div class="comments-container">
      <!-- Comment Form -->
      <form @submit.prevent="submitComment" class="comment-form">
        <textarea 
          v-model="newComment" 
          placeholder="Escribe un comentario..." 
          class="comment-input"
          required
        ></textarea>
        <button type="submit" class="submit-btn">Enviar</button>
      </form>
  
      <!-- Comments List -->
      <div v-if="comments.length" class="comments-list">
        <Comment 
          v-for="comment in comments" 
          :key="comment._id" 
          :content="comment" 
          :depth="0"
          :entryId="entryId"
          :currentUserId="currentUserId"
          @reply="addReply"
          @delete="removeComment"
        />
      </div>
      <div v-else class="no-comments">Aún no hay comentarios. Sé el primero en comentar.</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Comment from './Comment.vue';
  
  export default {
    name: "Comments",
    components: { Comment },
    props: {
      entryId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        currentUserId: "674ba62aac31b52fcd5ffae9", // TODO: Replace with dynamic user ID
        newComment: "", // Stores the text of the new comment
        comments: [] // List of comments for the entry
      };
    },
    async mounted() {
      await this.fetchComments();
    },
    methods: {
      // Fetch comments from the API
      async fetchComments() {
        try {
          const response = await axios.get(`/api/entries/${this.entryId}/comments`);
          // Optional: Process data if needed
          this.comments = response.data.map(comment => ({
            ...comment,
            replies: comment.replies || [] // Ensure replies are present
          }));

          console.log('Comentarios cargados exitosamente', response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      },
  
      // Submit a new comment
      async submitComment() {
        if (!this.newComment.trim()) return;
  
        const commentData = {
          content: this.newComment.trim(),
          author: "674ba62aac31b52fcd5ffae9", // TODO: Replace with dynamic author ID
        };
  
        try {
          const response = await axios.put(`/api/entries/${this.entryId}/addComment`, commentData);
          const newComment = {
            _id: response.data._id,
            content: response.data.content,
            author: response.data.author,
            createdAt: response.data.createdAt,
            replies: []
          };
          this.comments.push(newComment);
          this.newComment = ""; // Clear input field
        } catch (error) {
          console.error("Error submitting comment:", error.response?.data || error.message);
        }
      },
  
      // Add a reply to a specific comment
      addReply({ parentId, reply }) {
        const findAndAddReply = (comments) => {
          for (let comment of comments) {
            if (comment._id === parentId) {
              comment.replies.push(reply);
              return true;
            } else if (comment.replies.length) {
              if (findAndAddReply(comment.replies)) return true;
            }
          }
          return false;
        };
        findAndAddReply(this.comments);
      },
  
      // Remove a comment by its ID (after successful deletion)
      removeComment(commentId) {
        this.comments = this.comments.filter(comment => comment._id !== commentId);
      }
    }
  };
  </script>
  
  <style scoped>
  .comments-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  .comment-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  .comment-input {
    resize: vertical;
    min-height: 50px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .submit-btn {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: #0056b3;
  }
  
  .comments-list {
    margin-top: 1rem;
  }
  
  .no-comments {
    text-align: center;
    color: #777;
  }
  </style>
  