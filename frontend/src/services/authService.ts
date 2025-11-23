import axios from "axios";

const API_URL = "http://localhost:3000/auth"; 

export const signup = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}) => {
  const response = await axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const login = async (userData: {
  email: string;
  password: string;
  role?: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};
