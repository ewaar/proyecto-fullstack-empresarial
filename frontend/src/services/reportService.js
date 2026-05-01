import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/reports`;

const descargarBlobComoPDF = (data, fileName) => {
  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/pdf' })
  );

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

const obtenerMensajeError = async (error) => {
  if (error.response?.data instanceof Blob) {
    const text = await error.response.data.text();

    try {
      const json = JSON.parse(text);
      return json.message || json.error || 'Error al generar el PDF';
    } catch {
      return text || 'Error al generar el PDF';
    }
  }

  return error.response?.data?.message || error.message || 'Error al generar el PDF';
};

export const downloadGeneralProjectsReport = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No hay token guardado. Cerrá sesión e iniciá sesión otra vez.');
    }

    const response = await axios.get(`${API_URL}/projects/pdf`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    descargarBlobComoPDF(response.data, 'reporte_general_proyectos.pdf');
  } catch (error) {
    const message = await obtenerMensajeError(error);
    throw new Error(message);
  }
};

export const downloadProjectReport = async (projectId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No hay token guardado. Cerrá sesión e iniciá sesión otra vez.');
    }

    const response = await axios.get(`${API_URL}/projects/pdf?projectId=${projectId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    descargarBlobComoPDF(response.data, `reporte_proyecto_${projectId}.pdf`);
  } catch (error) {
    const message = await obtenerMensajeError(error);
    throw new Error(message);
  }
};