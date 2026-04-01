import { Link, useNavigate } from 'react-router-dom';

function MainLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const isInternal = user?.role === 'user';

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrador'
      : user?.role === 'user'
      ? 'Interno'
      : 'Cliente';

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav
        style={{
          backgroundColor: '#182235',
          color: 'white',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}
      >
        <div
          style={{
            fontWeight: '800',
            fontSize: '18px',
            lineHeight: '1.2',
            letterSpacing: '0.3px'
          }}
        >
          TechSolutions S.A.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <Link
            to="/dashboard"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)'
            }}
          >
            Panel
          </Link>

          {(isAdmin || isInternal) && (
            <Link
              to="/clients"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)'
              }}
            >
              Clientes
            </Link>
          )}

          {(isAdmin || isInternal || isClient) && (
            <Link
              to="/projects"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)'
              }}
            >
              Proyectos
            </Link>
          )}

          {(isAdmin || isInternal || isClient) && (
            <Link
              to="/tasks"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)'
              }}
            >
              Tareas
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/users"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)'
              }}
            >
              Usuarios
            </Link>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <span
            style={{
              fontWeight: '700',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.92)'
            }}
          >
            {user?.name} ({roleLabel})
          </span>

          <button
            onClick={handleLogout}
            style={{
              border: 'none',
              background: 'linear-gradient(180deg, #ff6b6b, #e63946)',
              color: 'white',
              borderRadius: '999px',
              padding: '9px 16px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div>{children}</div>
    </div>
  );
}

export default MainLayout;