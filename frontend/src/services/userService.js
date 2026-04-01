import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export const getUsers = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const createUser = async (userData) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(API_URL, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};