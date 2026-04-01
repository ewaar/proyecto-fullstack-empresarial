import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const getTasks = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const createTask = async (taskData) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(API_URL, taskData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const updateTask = async (id, taskData) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/${id}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const deleteTask = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};