import axios from 'axios';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/projects';

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getProjects = async (token) => {
  const response = await axios.get(API_URL, getHeaders(token));
  return response.data;
};

export const createProject = async (token, projectData) => {
  const response = await axios.post(API_URL, projectData, getHeaders(token));
  return response.data;
};

export const updateProject = async (token, projectId, projectData) => {
  const response = await axios.put(
    `${API_URL}/${projectId}`,
    projectData,
    getHeaders(token)
  );

  return response.data;
};

export const deleteProject = async (token, projectId) => {
  const response = await axios.delete(`${API_URL}/${projectId}`, getHeaders(token));
  return response.data;
};