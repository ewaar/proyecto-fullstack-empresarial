import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/reports`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`
  };
};

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

export const downloadGeneralProjectsReport = async () => {
  const response = await axios.get(`${API_URL}/projects/pdf`, {
    headers: getAuthHeaders(),
    responseType: 'blob'
  });

  downloadBlob(response.data, 'reporte_general_proyectos.pdf');

  return response;
};

export const downloadProjectReport = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/pdf`, {
    headers: getAuthHeaders(),
    params: {
      projectId
    },
    responseType: 'blob'
  });

  downloadBlob(response.data, `reporte_proyecto_${projectId}.pdf`);

  return response;
};

export const getGeneratedReports = async () => {
  const response = await axios.get(`${API_URL}/generated`, {
    headers: getAuthHeaders()
  });

  return response.data;
};

export const downloadGeneratedReport = async (reportId, fileName = 'informe.pdf') => {
  const response = await axios.get(`${API_URL}/generated/${reportId}/download`, {
    headers: getAuthHeaders(),
    responseType: 'blob'
  });

  downloadBlob(response.data, fileName);

  return response;
};