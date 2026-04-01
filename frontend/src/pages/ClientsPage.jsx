import { useEffect, useState } from 'react';
import {
  getClients,
  createClient,
  deleteClient,
  updateClient
} from '../services/clientService';
import { Link, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/modules.css';

import btnAgregar from '../assets/btn-agregar.png';
import btnEditar from '../assets/btn-editar.png';
import btnEliminar from '../assets/btn-eliminar.png';

function ClientsPage() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'user';

  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: true
  });

  const { name, email, phone, company, status } = formData;

  useEffect(() => {
    if (canManage) {
      fetchClients();
    }
  }, [canManage]);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener clientes');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editId) {
        await updateClient(editId, formData);
        setMessage('Cliente actualizado correctamente');
        setEditId(null);
      } else {
        await createClient(formData);
        setMessage('Cliente creado correctamente');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: true
      });

      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar cliente');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      await deleteClient(id);
      setMessage('Cliente eliminado correctamente');
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar cliente');
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status
    });

    setEditId(client._id);
    setMessage('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: true
    });
    setMessage('');
    setError('');
  };

  if (!canManage) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="module-page">
      <MainLayout>
        <div className="module-panel">
          <h1 className="module-title">Clientes</h1>

          <Link to="/dashboard" className="module-link">
            Volver al Dashboard
          </Link>

          <div className="module-card">
            <h2>{editId ? 'Editar Cliente' : 'Crear Cliente'}</h2>

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

                <div className="module-group">
                  <label>Teléfono</label>
                  <input type="text" name="phone" placeholder="Ingrese el teléfono" value={phone} onChange={handleChange} />
                </div>

                <div className="module-group">
                  <label>Empresa</label>
                  <input type="text" name="company" placeholder="Ingrese la empresa" value={company} onChange={handleChange} />
                </div>
              </div>

              <div style={{ marginTop: '14px', color: '#4b5563', fontWeight: '700' }}>
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={status}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Activo
                </label>
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

          <div className="module-card module-table-wrap">
            {clients.length === 0 ? (
              <p>No hay clientes registrados</p>
            ) : (
              <table className="module-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>{client.company}</td>
                      <td>{client.status ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="module-actions">
                          <button className="image-btn image-btn-edit" type="button" onClick={() => handleEdit(client)}>
                            <img src={btnEditar} alt="Editar" />
                          </button>

                          <button className="image-btn image-btn-delete" type="button" onClick={() => handleDelete(client._id)}>
                            <img src={btnEliminar} alt="Eliminar" />
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

export default ClientsPage;