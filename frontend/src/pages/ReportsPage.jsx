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

  const fetchProjects = async () => {
    try {
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

    try {
      await downloadGeneralProjectsReport();
      setMessage('Reporte general generado correctamente');
    } catch (err) {
      setError(err.message || 'Error al generar reporte general');
    }
  };

  const handleProjectReport = async () => {
    setError('');
    setMessage('');

    if (!selectedProject) {
      setError('Seleccione un proyecto');
      return;
    }

    try {
      await downloadProjectReport(selectedProject);
      setMessage('Reporte del proyecto generado correctamente');
    } catch (err) {
      setError(err.message || 'Error al generar reporte del proyecto');
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
                Genera un PDF con todos los proyectos registrados y sus tareas o seguimientos.
              </p>

              <button className="module-btn" onClick={handleGeneralReport}>
                Generar PDF general
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

            <button className="module-btn" onClick={handleProjectReport}>
              Generar PDF del proyecto
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ReportsPage;