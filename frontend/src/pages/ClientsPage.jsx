import { useEffect, useState } from 'react';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from '../services/clientService';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/modules.css';

import btnAgregar from '../assets/btn-agregar.png';
import btnEditar from '../assets/btn-editar.png';
import btnEliminar from '../assets/btn-eliminar.png';

function ClientsPage() {
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

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener clientes');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: true
    });
  };

  const handleChange = (e) => {
    setError('');
    setMessage('');

    const { name: fieldName, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [fieldName]: type === 'checkbox' ? checked : value
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

    if (!payload.phone.trim()) {
      return 'El teléfono es obligatorio';
    }

    if (payload.phone.trim().length < 8) {
      return 'El teléfono debe tener al menos 8 números';
    }

    if (!payload.company.trim()) {
      return 'La empresa es obligatoria';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      status: Boolean(formData.status)
    };

    const validationError = validateForm(payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (editId) {
        await updateClient(editId, payload);
        setMessage('Cliente actualizado correctamente');
      } else {
        await createClient(payload);
        setMessage('Cliente creado correctamente');
      }

      resetForm();
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar cliente');
    }
  };

  const handleEdit = (clientItem) => {
    setFormData({
      name: clientItem.name || '',
      email: clientItem.email || '',
      phone: clientItem.phone || '',
      company: clientItem.company || '',
      status: clientItem.status !== false
    });

    setEditId(clientItem._id);
    setError('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    const confirmDelete = window.confirm(
      '¿Seguro que desea eliminar este cliente? También se eliminarán sus proyectos y tareas relacionadas.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteClient(id);
      setMessage('Cliente eliminado correctamente');
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar cliente');
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
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Ingrese el teléfono"
                    value={phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="module-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Ingrese la empresa"
                    value={company}
                    onChange={handleChange}
                  />
                </div>

                <div className="module-group">
                  <label>Estado</label>
                  <select name="status" value={status} onChange={handleChange}>
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
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
                  {clients.map((clientItem) => (
                    <tr key={clientItem._id}>
                      <td>{clientItem.name}</td>
                      <td>{clientItem.email}</td>
                      <td>{clientItem.phone}</td>
                      <td>{clientItem.company}</td>
                      <td>{clientItem.status ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="module-actions">
                          <button
                            className="image-btn image-btn-edit"
                            type="button"
                            onClick={() => handleEdit(clientItem)}
                          >
                            <img src={btnEditar} alt="Editar" />
                          </button>

                          <button
                            className="image-btn image-btn-delete"
                            type="button"
                            onClick={() => handleDelete(clientItem._id)}
                          >
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