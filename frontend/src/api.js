import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5173', // Backend URL
});

export default api;
