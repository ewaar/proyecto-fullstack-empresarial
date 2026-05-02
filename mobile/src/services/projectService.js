import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/projects';

export const getProjects = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};