import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { getClients } from '../services/clientService';
import MainLayout from '../layouts/MainLayout';
import { Link, Navigate } from 'react-router-dom';
import '../styles/modules.css';

import btnAgregar from '../assets/btn-agregar.png';
import btnEditar from '../assets/btn-editar.png';
import btnEliminar from '../assets/btn-eliminar.png';

function UsersPage() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser?.role === 'admin';

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    clientId: '',
    status: true
  });

  const { name, email, password, role, clientId, status } = formData;

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener usuarios');
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
    if (isAdmin) {
      fetchUsers();
      fetchClients();
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'role' && value !== 'client' ? { clientId: '' } : {})
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editId) {
        const payload = {
          name,
          email,
          role,
          clientId: role === 'client' ? clientId : null,
          status
        };

        await updateUser(editId, payload);
        setMessage('Usuario actualizado correctamente');
        setEditId(null);
      } else {
        const payload = {
          name,
          email,
          password,
          role,
          ...(role === 'client' ? { clientId } : {})
        };

        await createUser(payload);
        setMessage('Usuario creado correctamente');
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        clientId: '',
        status: true
      });

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (userItem) => {
    setFormData({
      name: userItem.name,
      email: userItem.email,
      password: '',
      role: userItem.role,
      clientId: userItem.clientId?._id || '',
      status: userItem.status
    });

    setEditId(userItem._id);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      await deleteUser(id);
      setMessage('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      clientId: '',
      status: true
    });
    setMessage('');
    setError('');
  };

  const roleLabel = (roleValue) => {
    if (roleValue === 'admin') return 'Administrador';
    if (roleValue === 'user') return 'Interno';
    return 'Cliente';
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="module-page">
      <MainLayout>
        <div className="module-panel">
          <h1 className="module-title">Usuarios</h1>

          <Link to="/dashboard" className="module-link">
            Volver al Dashboard
          </Link>

          <div className="module-card">
            <h2>{editId ? 'Editar Usuario' : 'Crear Usuario'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="module-grid">
                <div className="module-group">
                  <label>Nombre</label>
                  <input type="text" name="name" placeholder="Ingrese el nombre" value={name} onChange={handleChange} />
                </div>

                <div className="module-group">
                  <label>Correo</label>
                  <input type="email" name="email" placeholder="Ingrese el correo" value={email} onChange={handleChange} />
                </div>

                {!editId && (
                  <div className="module-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" placeholder="Ingrese la contraseña" value={password} onChange={handleChange} />
                  </div>
                )}

                <div className="module-group">
                  <label>Rol</label>
                  <select name="role" value={role} onChange={handleChange}>
                    <option value="user">Interno</option>
                    <option value="admin">Administrador</option>
                    <option value="client">Cliente</option>
                  </select>
                </div>

                {role === 'client' && (
                  <div className="module-group">
                    <label>Cliente asociado</label>
                    <select name="clientId" value={clientId} onChange={handleChange}>
                      <option value="">Seleccione un cliente</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name} - {client.company}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="module-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={status.toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value === 'true' })
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="module-actions">
                <button className="image-btn image-btn-add" type="submit">
                  <img src={editId ? btnEditar : btnAgregar} alt={editId ? 'Editar usuario' : 'Agregar usuario'} />
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

          <div className="module-card module-table-wrap">
            {users.length === 0 ? (
              <p>No hay usuarios registrados</p>
            ) : (
              <table className="module-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Cliente asociado</th>
                    <th>Estado</th>
                    <th>Fecha de creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td>{userItem.name}</td>
                      <td>{userItem.email}</td>
                      <td>{roleLabel(userItem.role)}</td>
                      <td>
                        {userItem.clientId
                          ? `${userItem.clientId.name} - ${userItem.clientId.company}`
                          : 'No aplica'}
                      </td>
                      <td>{userItem.status ? 'Activo' : 'Inactivo'}</td>
                      <td>{userItem.createdAt?.slice(0, 10)}</td>
                      <td>
                        <div className="module-actions">
                          <button className="image-btn image-btn-edit" type="button" onClick={() => handleEdit(userItem)}>
                            <img src={btnEditar} alt="Editar usuario" />
                          </button>

                          <button className="image-btn image-btn-delete" type="button" onClick={() => handleDelete(userItem._id)}>
                            <img src={btnEliminar} alt="Eliminar usuario" />
                          </button>
                        </div>
                      </td>
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

export default UsersPage;