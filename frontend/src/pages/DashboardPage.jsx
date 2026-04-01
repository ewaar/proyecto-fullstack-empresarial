import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClients } from '../services/clientService';
import { getProjects } from '../services/projectService';
import { getTasks } from '../services/taskService';
import { getUsers } from '../services/userService';
import '../styles/dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    tasks: 0,
    users: 0
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isClient) {
          const [projectsData, tasksData] = await Promise.all([
            getProjects(),
            getTasks()
          ]);

          setStats({
            clients: 0,
            projects: projectsData.length,
            tasks: tasksData.length,
            users: 0
          });
          return;
        }

        const requests = [getClients(), getProjects(), getTasks()];
        if (isAdmin) {
          requests.push(getUsers());
        }

        const results = await Promise.all(requests);

        setStats({
          clients: results[0]?.length || 0,
          projects: results[1]?.length || 0,
          tasks: results[2]?.length || 0,
          users: isAdmin ? results[3]?.length || 0 : 0
        });
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError(err.response?.data?.message || 'Error al cargar estadísticas');
      }
    };

    fetchStats();
  }, [isAdmin, isClient]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-panel">
        <div className="dashboard-topbar">
          <div className="dashboard-brand">
            <h1>{isClient ? 'Mi Panel' : 'Panel Principal'}</h1>
            <p>
              {isClient
                ? 'Consulta tus proyectos y tareas asignadas'
                : 'Resumen general del sistema empresarial'}
            </p>
          </div>

          <div className="dashboard-user">
            <span>{user?.name} ({user?.role})</span>
            <button className="dashboard-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="dashboard-menu">
          <Link to="/dashboard">Panel</Link>
          {!isClient && <Link to="/clients">Clientes</Link>}
          <Link to="/projects">{isClient ? 'Mis Proyectos' : 'Proyectos'}</Link>
          <Link to="/tasks">{isClient ? 'Mis Tareas' : 'Tareas'}</Link>
          {isAdmin && <Link to="/users">Usuarios</Link>}
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-cards">
          {!isClient && (
            <div className="dashboard-card">
              <h3>Clientes</h3>
              <p>Registros activos en el sistema</p>
              <strong>{stats.clients}</strong>
            </div>
          )}

          <div className="dashboard-card">
            <h3>Proyectos</h3>
            <p>{isClient ? 'Tus proyectos asignados' : 'Proyectos empresariales creados'}</p>
            <strong>{stats.projects}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Tareas</h3>
            <p>{isClient ? 'Tus tareas visibles' : 'Tareas registradas y en seguimiento'}</p>
            <strong>{stats.tasks}</strong>
          </div>

          {isAdmin && (
            <div className="dashboard-card">
              <h3>Usuarios</h3>
              <p>Usuarios con acceso al sistema</p>
              <strong>{stats.users}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;