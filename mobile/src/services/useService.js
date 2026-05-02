import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/users';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getUsers = async (token) => {
  const response = await axios.get(API_URL, getHeaders(token));
  return response.data;
};

export const createUser = async (token, userData) => {
  const response = await axios.post(API_URL, userData, getHeaders(token));
  return response.data;
};

export const updateUser = async (token, userId, userData) => {
  const response = await axios.put(
    `${API_URL}/${userId}`,
    userData,
    getHeaders(token)
  );

  return response.data;
};

export const deleteUser = async (token, userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`, getHeaders(token));
  return response.data;
};