import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/clients`;

export const getClients = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const createClient = async (clientData) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(API_URL, clientData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const deleteClient = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const updateClient = async (id, clientData) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/${id}`, clientData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};