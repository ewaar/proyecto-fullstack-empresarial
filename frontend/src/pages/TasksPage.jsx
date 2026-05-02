import { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getUsers } from '../services/userService';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/modules.css';

import btnAgregar from '../assets/btn-agregar.png';
import btnEditar from '../assets/btn-editar.png';
import btnEliminar from '../assets/btn-eliminar.png';

function TasksPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const isAdmin = user?.role === 'admin';
  const isInternal = user?.role === 'user';
  const isClient = user?.role === 'client';
  const canManage = isAdmin || isInternal;

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible: '',
    priority: 'media',
    status: 'pendiente',
    progress: 0,
    project: ''
  });

  const {
    title,
    description,
    responsible,
    priority,
    status,
    progress,
    project
  } = formData;

  const getCurrentUserId = () => {
    return user?._id || user?.id || '';
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tareas');
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener proyectos');
    }
  };

  const fetchUsers = async () => {
    try {
      if (isAdmin) {
        const data = await getUsers();

        const internalUsers = data.filter(
          (userItem) => userItem.role === 'admin' || userItem.role === 'user'
        );

        setUsers(internalUsers);
        return;
      }

      if (isInternal) {
        setUsers([
          {
            ...user,
            _id: getCurrentUserId()
          }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener usuarios');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();

    if (canManage) {
      fetchUsers();
    }
  }, []);

  const resetForm = () => {
    setEditId(null);

    setFormData({
      title: '',
      description: '',
      responsible: '',
      priority: 'media',
      status: 'pendiente',
      progress: 0,
      project: ''
    });
  };

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
      const payload = {
        ...formData,
        progress: Number(formData.progress),
        responsible: isInternal ? getCurrentUserId() : formData.responsible
      };

      if (!payload.title || !payload.description || !payload.project || !payload.responsible) {
        setError('Todos los campos son obligatorios');
        return;
      }

      if (editId) {
        await updateTask(editId, payload);
        setMessage('Tarea actualizada correctamente');
      } else {
        await createTask(payload);
        setMessage('Tarea creada correctamente');
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar tarea');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title || '',
      description: task.description || '',
      responsible:
        task.responsible?._id ||
        task.responsible ||
        (isInternal ? getCurrentUserId() : ''),
      priority: task.priority || 'media',
      status: task.status || 'pendiente',
      progress: task.progress || 0,
      project: task.project?._id || task.project || ''
    });

    setEditId(task._id);
    setError('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      await deleteTask(id);
      setMessage('Tarea eliminada correctamente');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setError('');
    setMessage('');
  };

  return (
    <div className="module-page">
      <MainLayout>
        <div className="module-panel">
          <h1 className="module-title">{isClient ? 'Mis Tareas' : 'Tareas'}</h1>

          <Link to="/dashboard" className="module-link">
            Volver al Dashboard
          </Link>

          {canManage && (
            <div className="module-card">
              <h2>{editId ? 'Editar Tarea' : 'Crear Tarea'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="module-grid">
                  <div className="module-group">
                    <label>Título</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Ingrese el título"
                      value={title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="module-group">
                    <label>Descripción</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Ingrese la descripción"
                      value={description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="module-group">
                    <label>Responsable</label>

                    {isInternal ? (
                      <input
                        type="text"
                        value={`${user?.name || 'Usuario interno'} - ${user?.email || ''}`}
                        disabled
                      />
                    ) : (
                      <select
                        name="responsible"
                        value={responsible}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un usuario</option>

                        {users.map((userItem) => (
                          <option key={userItem._id} value={userItem._id}>
                            {userItem.name} - {userItem.email}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="module-group">
                    <label>Prioridad</label>
                    <select name="priority" value={priority} onChange={handleChange}>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div className="module-group">
                    <label>Estado</label>
                    <select name="status" value={status} onChange={handleChange}>
                      <option value="pendiente">Pendiente</option>
                      <option value="en progreso">En progreso</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="module-group">
                    <label>Progreso</label>
                    <input
                      type="number"
                      name="progress"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="module-group">
                    <label>Proyecto</label>
                    <select name="project" value={project} onChange={handleChange}>
                      <option value="">Seleccione un proyecto</option>

                      {projects.map((projectItem) => (
                        <option key={projectItem._id} value={projectItem._id}>
                          {projectItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="module-actions">
                  <button className="image-btn image-btn-add" type="submit">
                    <img
                      src={editId ? btnEditar : btnAgregar}
                      alt={editId ? 'Editar' : 'Agregar'}
                    />
                  </button>

                  {editId && (
                    <button
                      className="module-btn module-btn-secondary"
                      type="button"
                      onClick={handleCancelEdit}
                    >
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
            {tasks.length === 0 ? (
              <p>No hay tareas registradas</p>
            ) : (
              <table className="module-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Responsable</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                    <th>Proyecto</th>
                    {canManage && <th>Acciones</th>}
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.responsible?.name || 'Sin responsable'}</td>
                      <td>{task.priority}</td>
                      <td>{task.status}</td>
                      <td>{task.progress}%</td>
                      <td>{task.project?.name || 'Sin proyecto'}</td>

                      {canManage && (
                        <td>
                          <div className="module-actions">
                            <button
                              className="image-btn image-btn-edit"
                              type="button"
                              onClick={() => handleEdit(task)}
                            >
                              <img src={btnEditar} alt="Editar" />
                            </button>

                            <button
                              className="image-btn image-btn-delete"
                              type="button"
                              onClick={() => handleDelete(task._id)}
                            >
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

export default TasksPage;