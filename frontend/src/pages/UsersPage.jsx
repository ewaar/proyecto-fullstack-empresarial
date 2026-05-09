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

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      clientId: '',
      status: true
    });
  };

  const handleChange = (e) => {
    setError('');
    setMessage('');

    const { name: fieldName, value } = e.target;

    setFormData({
      ...formData,
      [fieldName]: value,
      ...(fieldName === 'role' && value !== 'client' ? { clientId: '' } : {})
    });
  };

  const validateEmail = (emailValue) => {
    return /^\S+@\S+\.\S+$/.test(emailValue);
  };

  const validateForm = (payload) => {
    if (!payload.name.trim()) {
      return 'El nombre es obligatorio';
    }

    if (payload.name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    if (!payload.email.trim()) {
      return 'El correo es obligatorio';
    }

    if (!validateEmail(payload.email.trim())) {
      return 'Correo electrónico inválido';
    }

    if (!editId && !payload.password.trim()) {
      return 'La contraseña es obligatoria';
    }

    if (payload.password && payload.password.trim().length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!['admin', 'user', 'client'].includes(payload.role)) {
      return 'Rol inválido';
    }

    if (payload.role === 'client' && !payload.clientId) {
      return 'Debe seleccionar un cliente para el usuario cliente';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      clientId: role === 'client' ? clientId : null,
      status: Boolean(status)
    };

    const validationError = validateForm(payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (editId) {
        const updatePayload = {
          name: payload.name,
          email: payload.email,
          role: payload.role,
          clientId: payload.clientId,
          status: payload.status
        };

        if (payload.password.trim()) {
          updatePayload.password = payload.password;
        }

        await updateUser(editId, updatePayload);
        setMessage('Usuario actualizado correctamente');
      } else {
        await createUser(payload);
        setMessage('Usuario creado correctamente');
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (userItem) => {
    setFormData({
      name: userItem.name || '',
      email: userItem.email || '',
      password: '',
      role: userItem.role || 'user',
      clientId: userItem.clientId?._id || '',
      status: userItem.status !== false
    });

    setEditId(userItem._id);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    const confirmDelete = window.confirm('¿Seguro que desea eliminar este usuario?');

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUser(id);
      setMessage('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
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
                  <input
                    type="text"
                    name="name"
                    placeholder="Ingrese el nombre"
                    value={name}
                    onChange={handleChange}
                  />
                </div>

                <div className="module-group">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ingrese el correo"
                    value={email}
                    onChange={handleChange}
                  />
                </div>

                <div className="module-group">
                  <label>
                    Contraseña {editId ? '(opcional)' : ''}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={
                      editId
                        ? 'Dejar vacío para no cambiar'
                        : 'Ingrese la contraseña'
                    }
                    value={password}
                    onChange={handleChange}
                  />
                </div>

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

                      {clients.map((clientItem) => (
                        <option key={clientItem._id} value={clientItem._id}>
                          {clientItem.name} - {clientItem.company}
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
                    onChange={(e) => {
                      setError('');
                      setMessage('');
                      setFormData({
                        ...formData,
                        status: e.target.value === 'true'
                      });
                    }}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="module-actions">
                <button className="image-btn image-btn-add" type="submit">
                  <img
                    src={editId ? btnEditar : btnAgregar}
                    alt={editId ? 'Editar usuario' : 'Agregar usuario'}
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
                          <button
                            className="image-btn image-btn-edit"
                            type="button"
                            onClick={() => handleEdit(userItem)}
                          >
                            <img src={btnEditar} alt="Editar usuario" />
                          </button>

                          <button
                            className="image-btn image-btn-delete"
                            type="button"
                            onClick={() => handleDelete(userItem._id)}
                          >
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