export const formatDate = (date: string) => {
  if (!date) return 'No definida';

  return new Date(date).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (date: string) => {
  if (!date) return 'Fecha no definida';

  return new Date(date).toLocaleString('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};