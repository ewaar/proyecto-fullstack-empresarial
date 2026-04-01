import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/login.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al iniciar sesión'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🔒</div>

        <h1 className="login-title">Soluciones Tecnológicas SA</h1>
        <p className="login-subtitle">SISTEMA WEB EMPRESARIAL</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>USUARIO</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">👤</span>
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
            INGRESAR
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          Acceso solo autorizado por administración
        </p>
      </div>
    </div>
  );
}

export default LoginPage;