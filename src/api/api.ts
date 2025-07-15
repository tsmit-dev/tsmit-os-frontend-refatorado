import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tsmit-os-backend-node.netlify.app',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
