import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/users';

export const getUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};