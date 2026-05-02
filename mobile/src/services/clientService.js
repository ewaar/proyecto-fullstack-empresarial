import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/clients';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getClients = async (token) => {
  const response = await axios.get(API_URL, getHeaders(token));
  return response.data;
};

export const createClient = async (token, clientData) => {
  const response = await axios.post(API_URL, clientData, getHeaders(token));
  return response.data;
};

export const updateClient = async (token, clientId, clientData) => {
  const response = await axios.put(`${API_URL}/${clientId}`, clientData, getHeaders(token));
  return response.data;
};

export const deleteClient = async (token, clientId) => {
  const response = await axios.delete(`${API_URL}/${clientId}`, getHeaders(token));
  return response.data;
};