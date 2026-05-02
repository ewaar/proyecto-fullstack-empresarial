import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/histories';

export const getHistories = async (token, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.projectId) {
    params.append('projectId', filters.projectId);
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
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
