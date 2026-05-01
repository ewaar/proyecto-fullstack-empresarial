import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getProjects } from '../services/projectService';
import { getHistories } from '../services/historyService';
import '../styles/modules.css';

function HistoryPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [histories, setHistories] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moduleOptions = [
    { value: '', label: 'Todos los módulos' },
    { value: 'clients', label: 'Clientes' },
    { value: 'projects', label: 'Proyectos' },
    { value: 'tasks', label: 'Tareas' },
    { value: 'users', label: 'Usuarios' },
    { value: 'reports', label: 'Informes' }
  ];

  const historyTypes = [
    { value: '', label: 'Todos los movimientos' },

    { value: 'client_created', label: 'Cliente creado' },
    { value: 'client_updated', label: 'Cliente actualizado' },
    { value: 'client_deleted', label: 'Cliente eliminado' },

    { value: 'project_created', label: 'Proyecto creado' },
    { value: 'project_updated', label: 'Proyecto actualizado' },
    { value: 'project_deleted', label: 'Proyecto eliminado' },

    { value: 'task_created', label: 'Tarea creada' },
    { value: 'task_updated', label: 'Tarea actualizada' },
    { value: 'task_deleted', label: 'Tarea eliminada' },
    { value: 'task_status_changed', label: 'Cambio de estado' },
    { value: 'task_progress_changed', label: 'Cambio de progreso' },

    { value: 'user_created', label: 'Usuario creado' },
    { value: 'user_updated', label: 'Usuario actualizado' },
    { value: 'user_deleted', label: 'Usuario eliminado' },

    { value: 'report_generated', label: 'Informe generado' }
  ];

  const typeLabels = {
    client_created: 'Cliente creado',
    client_updated: 'Cliente actualizado',
    client_deleted: 'Cliente eliminado',

    project_created: 'Proyecto creado',
    project_updated: 'Proyecto actualizado',
    project_deleted: 'Proyecto eliminado',

    task_created: 'Tarea creada',
    task_updated: 'Tarea actualizada',
    task_deleted: 'Tarea eliminada',
    task_status_changed: 'Cambio de estado',
    task_progress_changed: 'Cambio de progreso',

    user_created: 'Usuario creado',
    user_updated: 'Usuario actualizado',
    user_deleted: 'Usuario eliminado',

    report_generated: 'Informe generado'
  };

  const moduleLabels = {
    clients: 'Clientes',
    projects: 'Proyectos',
    tasks: 'Tareas',
    users: 'Usuarios',
    reports: 'Informes'
  };

  const roleLabels = {
    admin: 'Administrador',
    user: 'Interno',
    client: 'Cliente'
  };

  const typeColors = {
    client_created: '#16a34a',
    client_updated: '#2563eb',
    client_deleted: '#dc2626',

    project_created: '#16a34a',
    project_updated: '#2563eb',
    project_deleted: '#dc2626',

    task_created: '#0f766e',
    task_updated: '#7c3aed',
    task_deleted: '#dc2626',
    task_status_changed: '#ea580c',
    task_progress_changed: '#0891b2',

    user_created: '#16a34a',
    user_updated: '#2563eb',
    user_deleted: '#dc2626',

    report_generated: '#475569'
  };

  const formatDateTime = (date) => {
    if (!date) return 'Fecha no definida';

    return new Date(date).toLocaleString('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar proyectos');
    }
  };

  const loadHistories = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getHistories({
        projectId: selectedProject,
        module: selectedModule,
        type: selectedType
      });

      setHistories(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadHistories();
  }, [selectedProject, selectedModule, selectedType]);

  return (
    <MainLayout>
      <div className="module-page">
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            width: '100%',
            padding: '30px'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              borderRadius: '22px',
              padding: '28px',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '18px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    color: '#182235',
                    fontSize: '34px',
                    fontWeight: '900'
                  }}
                >
                  Historial automático
                </h1>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: '#475569',
                    fontSize: '16px',
                    maxWidth: '760px'
                  }}
                >
                  Bitácora automática de movimientos realizados en clientes,
                  proyectos, tareas, usuarios e informes.
                </p>
              </div>

              <div
                style={{
                  background: '#182235',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '11px 18px',
                  fontWeight: '800',
                  fontSize: '14px'
                }}
              >
                {user?.name} · {roleLabels[user?.role] || user?.role}
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '22px',
              padding: '26px',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h2
              style={{
                margin: '0 0 18px',
                color: '#182235',
                fontSize: '22px',
                fontWeight: '900'
              }}
            >
              Filtros
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px'
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '800',
                    marginBottom: '8px',
                    color: '#334155'
                  }}
                >
                  Proyecto
                </label>

                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    background: 'white',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Todos los proyectos</option>

                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '800',
                    marginBottom: '8px',
                    color: '#334155'
                  }}
                >
                  Módulo
                </label>

                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    background: 'white',
                    fontSize: '15px'
                  }}
                >
                  {moduleOptions.map((moduleItem) => (
                    <option key={moduleItem.value} value={moduleItem.value}>
                      {moduleItem.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '800',
                    marginBottom: '8px',
                    color: '#334155'
                  }}
                >
                  Tipo de movimiento
                </label>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    background: 'white',
                    fontSize: '15px'
                  }}
                >
                  {historyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '14px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                marginBottom: '24px'
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '22px',
              padding: '28px',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '24px'
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: '#182235',
                  fontSize: '24px',
                  fontWeight: '900'
                }}
              >
                Línea de tiempo automática
              </h2>

              <span
                style={{
                  background: '#e0f2fe',
                  color: '#075985',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  fontWeight: '900',
                  fontSize: '14px'
                }}
              >
                {histories.length} movimiento(s)
              </span>
            </div>

            {loading ? (
              <p style={{ color: '#64748b', fontWeight: '700' }}>
                Cargando historial...
              </p>
            ) : histories.length === 0 ? (
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '18px',
                  padding: '36px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontWeight: '800',
                  background: 'rgba(255,255,255,0.65)'
                }}
              >
                No hay movimientos registrados todavía.
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  paddingLeft: '34px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '10px',
                    width: '4px',
                    height: '100%',
                    background: '#dbeafe',
                    borderRadius: '999px'
                  }}
                />

                {histories.map((history) => {
                  const color = typeColors[history.type] || '#334155';

                  return (
                    <div
                      key={history._id}
                      style={{
                        position: 'relative',
                        marginBottom: '20px',
                        background: 'rgba(248, 250, 252, 0.96)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '18px',
                        padding: '20px 20px 20px 24px'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '-35px',
                          top: '24px',
                          width: '19px',
                          height: '19px',
                          borderRadius: '50%',
                          background: color,
                          border: '4px solid white',
                          boxShadow: '0 0 0 2px #dbeafe'
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                          marginBottom: '10px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <span
                            style={{
                              background: color,
                              color: 'white',
                              padding: '6px 11px',
                              borderRadius: '999px',
                              fontWeight: '900',
                              fontSize: '12px'
                            }}
                          >
                            {typeLabels[history.type] || history.action}
                          </span>

                          <span
                            style={{
                              background: '#e2e8f0',
                              color: '#334155',
                              padding: '6px 11px',
                              borderRadius: '999px',
                              fontWeight: '900',
                              fontSize: '12px'
                            }}
                          >
                            {moduleLabels[history.module] ||
                              history.module ||
                              'Módulo'}
                          </span>
                        </div>

                        <span
                          style={{
                            color: '#64748b',
                            fontWeight: '800',
                            fontSize: '13px'
                          }}
                        >
                          {formatDateTime(history.createdAt)}
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: '0 0 8px',
                          color: '#182235',
                          fontSize: '18px',
                          fontWeight: '900'
                        }}
                      >
                        {history.action}
                      </h3>

                      <p
                        style={{
                          margin: '0 0 14px',
                          color: '#334155',
                          lineHeight: '1.5'
                        }}
                      >
                        {history.description}
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '10px',
                          color: '#475569',
                          fontSize: '13px'
                        }}
                      >
                        {history.project && (
                          <div>
                            <strong>Proyecto:</strong>{' '}
                            {history.project?.name}
                          </div>
                        )}

                        {history.task && (
                          <div>
                            <strong>Tarea:</strong> {history.task?.title}
                          </div>
                        )}

                        {(history.client || history.project?.client) && (
                          <div>
                            <strong>Cliente:</strong>{' '}
                            {history.client?.name ||
                              history.project?.client?.name ||
                              'No aplica'}
                          </div>
                        )}

                        {history.affectedUser && (
                          <div>
                            <strong>Usuario afectado:</strong>{' '}
                            {history.affectedUser?.name ||
                              history.affectedUser?.email}
                          </div>
                        )}

                        <div>
                          <strong>Realizado por:</strong>{' '}
                          {history.user?.name ||
                            history.user?.email ||
                            'No definido'}
                        </div>

                        <div>
                          <strong>Rol:</strong>{' '}
                          {roleLabels[history.user?.role] ||
                            history.user?.role ||
                            'No definido'}
                        </div>
                      </div>

                      {(history.oldValue || history.newValue) && (
                        <div
                          style={{
                            marginTop: '14px',
                            background: 'white',
                            borderRadius: '14px',
                            padding: '12px',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            fontSize: '13px'
                          }}
                        >
                          {history.oldValue && (
                            <div>
                              <strong>Antes:</strong> {history.oldValue}
                            </div>
                          )}

                          {history.newValue && (
                            <div>
                              <strong>Después:</strong> {history.newValue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HistoryPage;