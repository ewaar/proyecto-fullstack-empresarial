import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const API_URL = 'https://proyecto-fullstack-empresarial.onrender.com/api/reports';

const downloadAndSharePDF = async (url, token, fileName) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (downloadResult.status !== 200) {
    throw new Error('No se pudo generar el informe PDF');
  }

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error('No se puede abrir o compartir el PDF en este dispositivo');
  }

  await Sharing.shareAsync(downloadResult.uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Abrir informe PDF',
    UTI: 'com.adobe.pdf'
  });

  return downloadResult.uri;
};

export const downloadGeneralProjectsReport = async (token) => {
  return downloadAndSharePDF(
    `${API_URL}/projects/pdf`,
    token,
    'reporte_general_proyectos.pdf'
  );
};

export const downloadProjectReport = async (token, projectId) => {
  return downloadAndSharePDF(
    `${API_URL}/projects/pdf?projectId=${projectId}`,
    token,
    `reporte_proyecto_${projectId}.pdf`
  );
};