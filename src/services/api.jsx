import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-completo.vercel.app',  
});

export default api;
