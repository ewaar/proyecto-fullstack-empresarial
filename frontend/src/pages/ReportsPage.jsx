import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { getProjects } from '../services/projectService';
import {
  downloadGeneralProjectsReport,
  downloadProjectReport,
  getGeneratedReports,
  downloadGeneratedReport
} from '../services/reportService';
import '../styles/modules.css';

function ReportsPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const isClient = user?.role === 'client';
  const canGenerateGeneral = user?.role === 'admin' || user?.role === 'user';

  const [projects, setProjects] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);

  const [selectedProject, setSelectedProject] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [downloadingReportId, setDownloadingReportId] = useState('');

  const primaryButtonStyle = {
    border: 'none',
    background: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
    color: '#ffffff',
    borderRadius: '999px',
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '15px',
    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.28)',
    opacity: 1
  };

  const disabledButtonStyle = {
    border: 'none',
    background: '#dbe2ea',
    color: '#4b5563',
    borderRadius: '999px',
    padding: '12px 22px',
    cursor: 'not-allowed',
    fontWeight: '800',
    fontSize: '15px',
    boxShadow: 'none',
    opacity: 1
  };

  const smallButtonStyle = {
    border: 'none',
    background: '#2563eb',
    color: '#ffffff',
    borderRadius: '999px',
    padding: '9px 15px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '13px'
  };

  const smallDisabledButtonStyle = {
    border: 'none',
    background: '#cbd5e1',
    color: '#475569',
    borderRadius: '999px',
    padding: '9px 15px',
    cursor: 'not-allowed',
    fontWeight: '800',
    fontSize: '13px'
  };

  const formatDateTime = (date) => {
    if (!date) return 'Fecha no definida';

    return new Date(date).toLocaleString('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatSize = (size) => {
    if (!size) return '0 KB';

    const kb = size / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const reportTypeLabel = (type) => {
    if (type === 'general') return 'General';
    if (type === 'project') return 'Por proyecto';
    return type || 'No definido';
  };

  const fetchProjects = async () => {
    try {
      setError('');
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener proyectos');
    }
  };

  const fetchGeneratedReports = async () => {
    try {
      setLoadingReports(true);
      setError('');

      const data = await getGeneratedReports();
      setGeneratedReports(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Error al obtener informes generados anteriormente'
      );
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchGeneratedReports();
  }, []);

  const handleGeneralReport = async () => {
    setError('');
    setMessage('');
    setLoadingGeneral(true);

    try {
      await downloadGeneralProjectsReport();
      setMessage('Reporte general generado correctamente');
      await fetchGeneratedReports();
    } catch (err) {
      setError(err.message || 'Error al generar reporte general');
    } finally {
      setLoadingGeneral(false);
    }
  };

  const handleProjectReport = async () => {
    setError('');
    setMessage('');

    if (!selectedProject) {
      setError('Seleccione un proyecto');
      return;
    }

    setLoadingProject(true);

    try {
      await downloadProjectReport(selectedProject);
      setMessage('Reporte del proyecto generado correctamente');
      await fetchGeneratedReports();
    } catch (err) {
      setError(err.message || 'Error al generar reporte del proyecto');
    } finally {
      setLoadingProject(false);
    }
  };

  const handleDownloadSavedReport = async (report) => {
    setError('');
    setMessage('');
    setDownloadingReportId(report._id);

    try {
      await downloadGeneratedReport(report._id, report.fileName);
      setMessage('Informe descargado correctamente');
    } catch (err) {
      setError(err.message || 'Error al descargar informe guardado');
    } finally {
      setDownloadingReportId('');
    }
  };

  return (
    <MainLayout>
      <div className="module-page">
        <div className="module-panel">
          <h1 className="module-title">
            {isClient ? 'Mis Reportes PDF' : 'Reportes PDF'}
          </h1>

          <Link to="/dashboard" className="module-link">
            Volver al Dashboard
          </Link>

          {message && <p className="module-success">{message}</p>}
          {error && <p className="module-error">{error}</p>}

          {canGenerateGeneral && (
            <div className="module-card">
              <h2>Reporte general de proyectos</h2>

              <p>
                Genera un PDF con todos los proyectos registrados y sus tareas o
                seguimientos.
              </p>

              <button
                type="button"
                onClick={handleGeneralReport}
                disabled={loadingGeneral}
                style={loadingGeneral ? disabledButtonStyle : primaryButtonStyle}
              >
                {loadingGeneral ? 'Generando PDF...' : 'Generar PDF general'}
              </button>
            </div>
          )}

          <div className="module-card">
            <h2>Reporte por proyecto</h2>

            <p>
              {isClient
                ? 'Genera un PDF de uno de tus proyectos con sus tareas o seguimientos.'
                : 'Selecciona un proyecto para generar un PDF con sus tareas o seguimientos.'}
            </p>

            <div className="module-group">
              <label>Proyecto</label>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Seleccione un proyecto</option>

                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleProjectReport}
              disabled={!selectedProject || loadingProject}
              style={
                !selectedProject || loadingProject
                  ? disabledButtonStyle
                  : primaryButtonStyle
              }
            >
              {loadingProject ? 'Generando PDF...' : 'Generar PDF del proyecto'}
            </button>
          </div>

          <div className="module-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}
            >
              <div>
                <h2 style={{ marginBottom: '6px' }}>
                  Informes generados anteriormente
                </h2>

                <p style={{ margin: 0 }}>
                  Aquí podés ver y descargar nuevamente los informes PDF que ya
                  fueron generados.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchGeneratedReports}
                disabled={loadingReports}
                style={loadingReports ? smallDisabledButtonStyle : smallButtonStyle}
              >
                {loadingReports ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>

            {loadingReports ? (
              <p>Cargando informes generados...</p>
            ) : generatedReports.length === 0 ? (
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '26px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontWeight: '800',
                  background: 'rgba(255,255,255,0.65)'
                }}
              >
                Todavía no hay informes generados.
              </div>
            ) : (
              <div
                style={{
                  overflowX: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px'
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '850px',
                    background: '#ffffff'
                  }}
                >
                  <thead>
                    <tr style={{ background: '#eff6ff' }}>
                      <th style={thStyle}>Título</th>
                      <th style={thStyle}>Tipo</th>
                      <th style={thStyle}>Proyecto</th>
                      <th style={thStyle}>Cliente</th>
                      <th style={thStyle}>Generado por</th>
                      <th style={thStyle}>Fecha</th>
                      <th style={thStyle}>Tamaño</th>
                      <th style={thStyle}>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {generatedReports.map((report) => (
                      <tr key={report._id}>
                        <td style={tdStyle}>
                          <strong>{report.title}</strong>
                          <br />
                          <span style={{ color: '#64748b', fontSize: '12px' }}>
                            {report.fileName}
                          </span>
                        </td>

                        <td style={tdStyle}>{reportTypeLabel(report.type)}</td>

                        <td style={tdStyle}>
                          {report.project?.name || 'No aplica'}
                        </td>

                        <td style={tdStyle}>
                          {report.client?.name ||
                            report.client?.company ||
                            'No aplica'}
                        </td>

                        <td style={tdStyle}>
                          {report.user?.name ||
                            report.user?.email ||
                            'No definido'}
                        </td>

                        <td style={tdStyle}>
                          {formatDateTime(report.createdAt)}
                        </td>

                        <td style={tdStyle}>{formatSize(report.size)}</td>

                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => handleDownloadSavedReport(report)}
                            disabled={downloadingReportId === report._id}
                            style={
                              downloadingReportId === report._id
                                ? smallDisabledButtonStyle
                                : smallButtonStyle
                            }
                          >
                            {downloadingReportId === report._id
                              ? 'Descargando...'
                              : 'Descargar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const thStyle = {
  padding: '13px 12px',
  textAlign: 'left',
  color: '#1e3a8a',
  fontSize: '13px',
  fontWeight: '900',
  borderBottom: '1px solid #dbeafe'
};

const tdStyle = {
  padding: '13px 12px',
  color: '#334155',
  fontSize: '13px',
  borderBottom: '1px solid #e2e8f0',
  verticalAlign: 'top'
};

export default ReportsPage;