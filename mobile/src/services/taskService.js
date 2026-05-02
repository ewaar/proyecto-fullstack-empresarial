import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/tasks';

export const getTasks = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const updateTask = async (token, taskId, taskData) => {
  const response = await axios.put(`${API_URL}/${taskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};