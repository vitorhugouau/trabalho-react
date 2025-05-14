import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-completo.vercel.app',  
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api;
