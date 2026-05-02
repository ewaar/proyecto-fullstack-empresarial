import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/tasks';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getTasks = async (token) => {
  const response = await axios.get(API_URL, getHeaders(token));
  return response.data;
};

export const createTask = async (token, taskData) => {
  const response = await axios.post(API_URL, taskData, getHeaders(token));
  return response.data;
};

export const updateTask = async (token, taskId, taskData) => {
  const response = await axios.put(
    `${API_URL}/${taskId}`,
    taskData,
    getHeaders(token)
  );

  return response.data;
};

export const deleteTask = async (token, taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`, getHeaders(token));
  return response.data;
};