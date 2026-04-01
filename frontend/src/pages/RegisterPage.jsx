import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import '../styles/login.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { name, email, password } = formData;

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
      await registerUser(formData);
      setMessage('Usuario registrado correctamente');

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al registrar usuario'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📝</div>

        <h1 className="login-title">Soluciones Tecnológicas SA</h1>
        <p className="login-subtitle">REGISTRO DE USUARIO</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>NOMBRE</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">👤</span>
              <input
                className="login-input"
                type="text"
                name="name"
                placeholder="Ingrese su nombre"
                value={name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>CORREO</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">📧</span>
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>CONTRASEÑA</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔑</span>
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            REGISTRARSE
          </button>
        </form>

        {message && <p className="login-success">{message}</p>}
        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          ¿Ya tienes cuenta? <Link to="/" className="login-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;