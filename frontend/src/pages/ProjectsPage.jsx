import { useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../services/projectService';
import { getClients } from '../services/clientService';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/modules.css';

import btnAgregar from '../assets/btn-agregar.png';
import btnEditar from '../assets/btn-editar.png';
import btnEliminar from '../assets/btn-eliminar.png';

function ProjectsPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isClient = user?.role === 'client';
  const canManage = user?.role === 'admin' || user?.role === 'user';

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pendiente',
    client: ''
  });

  const { name, description, startDate, endDate, status, client } = formData;

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener proyectos');
    }
  };

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener clientes');
    }
  };

  useEffect(() => {
    fetchProjects();
    if (canManage) {
      fetchClients();
    }
  }, [canManage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editId) {
        await updateProject(editId, formData);
        setMessage('Proyecto actualizado correctamente');
        setEditId(null);
      } else {
        await createProject(formData);
        setMessage('Proyecto creado correctamente');
      }

      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'pendiente',
        client: ''
      });

      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar proyecto');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate?.slice(0, 10) || '',
      endDate: project.endDate?.slice(0, 10) || '',
      status: project.status,
      client: project.client?._id || ''
    });

    setEditId(project._id);
    setError('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      await deleteProject(id);
      setMessage('Proyecto eliminado correctamente');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar proyecto');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'pendiente',
      client: ''
    });
    setError('');
    setMessage('');
  };

  return (
    <div className="module-page">
      <MainLayout>
        <div className="module-panel">
          <h1 className="module-title">{isClient ? 'Mis Proyectos' : 'Proyectos'}</h1>

          <Link to="/dashboard" className="module-link">
            Volver al Dashboard
          </Link>

          {canManage && (
            <div className="module-card">
              <h2>{editId ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="module-grid">
                  <div className="module-group">
                    <label>Nombre</label>
                    <input type="text" name="name" placeholder="Ingrese el nombre" value={name} onChange={handleChange} />
                  </div>

                  <div className="module-group">
                    <label>Descripción</label>
                    <input type="text" name="description" placeholder="Ingrese la descripción" value={description} onChange={handleChange} />
                  </div>

                  <div className="module-group">
                    <label>Fecha Inicio</label>
                    <input type="date" name="startDate" value={startDate} onChange={handleChange} />
                  </div>

                  <div className="module-group">
                    <label>Fecha Fin</label>
                    <input type="date" name="endDate" value={endDate} onChange={handleChange} />
                  </div>

                  <div className="module-group">
                    <label>Estado</label>
                    <select name="status" value={status} onChange={handleChange}>
                      <option value="pendiente">Pendiente</option>
                      <option value="en progreso">En progreso</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>

                  <div className="module-group">
                    <label>Cliente</label>
                    <select name="client" value={client} onChange={handleChange}>
                      <option value="">Seleccione un cliente</option>
                      {clients.map((clientItem) => (
                        <option key={clientItem._id} value={clientItem._id}>
                          {clientItem.name} - {clientItem.company}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="module-actions">
                  <button className="image-btn image-btn-add" type="submit">
                    <img src={editId ? btnEditar : btnAgregar} alt={editId ? 'Editar' : 'Agregar'} />
                  </button>

                  {editId && (
                    <button className="module-btn module-btn-secondary" type="button" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {message && <p className="module-success">{message}</p>}
              {error && <p className="module-error">{error}</p>}
            </div>
          )}

          <div className="module-card module-table-wrap">
            {projects.length === 0 ? (
              <p>No hay proyectos registrados</p>
            ) : (
              <table className="module-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Cliente</th>
                    {canManage && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>{project.description}</td>
                      <td>{project.startDate?.slice(0, 10)}</td>
                      <td>{project.endDate?.slice(0, 10)}</td>
                      <td>{project.status}</td>
                      <td>{project.client?.name || 'Sin cliente'}</td>
                      {canManage && (
                        <td>
                          <div className="module-actions">
                            <button className="image-btn image-btn-edit" type="button" onClick={() => handleEdit(project)}>
                              <img src={btnEditar} alt="Editar" />
                            </button>

                            <button className="image-btn image-btn-delete" type="button" onClick={() => handleDelete(project._id)}>
                              <img src={btnEliminar} alt="Eliminar" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}

export default ProjectsPage;