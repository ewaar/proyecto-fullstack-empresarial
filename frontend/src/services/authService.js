import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/auth`;

export const loginUser = async (emailOrData, passwordValue) => {
  let email = '';
  let password = '';

  if (typeof emailOrData === 'object' && emailOrData !== null) {
    email = emailOrData.email || emailOrData.username || '';
    password = emailOrData.password || '';
  } else {
    email = emailOrData || '';
    password = passwordValue || '';
  }

  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = loginUser;
export const register = registerUser;