import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { getProjects } from '../services/projectService';
import {
  downloadGeneralProjectsReport,
  downloadProjectReport
} from '../services/reportService';
import '../styles/modules.css';

function ReportsPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const isClient = user?.role === 'client';
  const canGenerateGeneral = user?.role === 'admin' || user?.role === 'user';

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);

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

  const fetchProjects = async () => {
    try {
      setError('');
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener proyectos');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGeneralReport = async () => {
    setError('');
    setMessage('');
    setLoadingGeneral(true);

    try {
      await downloadGeneralProjectsReport();
      setMessage('Reporte general generado correctamente');
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
    } catch (err) {
      setError(err.message || 'Error al generar reporte del proyecto');
    } finally {
      setLoadingProject(false);
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
        </div>
      </div>
    </MainLayout>
  );
}

export default ReportsPage;