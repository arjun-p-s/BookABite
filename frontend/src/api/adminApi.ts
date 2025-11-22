import axios from "axios";

const API_BASE_URL = "http://localhost:3002";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const restaurantApi = {
  getAll: async () => {
    const response = await api.get("/restaurants/list");
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post("/restaurants/add", data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },
};

export const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    
    return response.data.url;
  },
};

export default api;