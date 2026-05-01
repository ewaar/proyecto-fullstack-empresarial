import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/histories`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getHistories = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.projectId) {
    params.append('projectId', filters.projectId);
  }

  if (filters.clientId) {
    params.append('clientId', filters.clientId);
  }

  if (filters.module) {
    params.append('module', filters.module);
  }

  if (filters.type) {
    params.append('type', filters.type);
  }

  const queryString = params.toString();

  const response = await axios.get(
    queryString ? `${API_URL}?${queryString}` : API_URL,
    getAuthHeaders()
  );

  return response.data;
};