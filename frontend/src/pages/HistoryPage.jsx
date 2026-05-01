import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getProjects } from '../services/projectService';
import { getHistories } from '../services/historyService';

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
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          background: '#eef3f8',
          padding: '30px'
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)',
              marginBottom: '22px'
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
                    fontSize: '30px',
                    fontWeight: '800'
                  }}
                >
                  Historial automático
                </h1>

                <p
                  style={{
                    margin: '8px 0 0',
                    color: '#64748b',
                    fontSize: '15px'
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
                  padding: '10px 16px',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                {user?.name} · {roleLabels[user?.role] || user?.role}
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)',
              marginBottom: '22px'
            }}
          >
            <h2
              style={{
                margin: '0 0 16px',
                color: '#182235',
                fontSize: '20px'
              }}
            >
              Filtros
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '700',
                    marginBottom: '7px',
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
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    outline: 'none'
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
                    fontWeight: '700',
                    marginBottom: '7px',
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
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    outline: 'none'
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
                    fontWeight: '700',
                    marginBottom: '7px',
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
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    outline: 'none'
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
                padding: '13px 16px',
                borderRadius: '12px',
                fontWeight: '700',
                marginBottom: '22px'
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: '#182235',
                  fontSize: '22px'
                }}
              >
                Línea de tiempo automática
              </h2>

              <span
                style={{
                  background: '#e0f2fe',
                  color: '#075985',
                  padding: '7px 12px',
                  borderRadius: '999px',
                  fontWeight: '800',
                  fontSize: '13px'
                }}
              >
                {histories.length} movimiento(s)
              </span>
            </div>

            {loading ? (
              <p style={{ color: '#64748b' }}>Cargando historial...</p>
            ) : histories.length === 0 ? (
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '30px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontWeight: '700'
                }}
              >
                No hay movimientos registrados todavía.
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  paddingLeft: '28px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '8px',
                    width: '3px',
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
                        marginBottom: '18px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 18px 18px 22px'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '-27px',
                          top: '22px',
                          width: '17px',
                          height: '17px',
                          borderRadius: '50%',
                          background: color,
                          border: '3px solid white',
                          boxShadow: '0 0 0 2px #dbeafe'
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                          marginBottom: '8px'
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
                              padding: '5px 10px',
                              borderRadius: '999px',
                              fontWeight: '800',
                              fontSize: '12px'
                            }}
                          >
                            {typeLabels[history.type] || history.action}
                          </span>

                          <span
                            style={{
                              background: '#e2e8f0',
                              color: '#334155',
                              padding: '5px 10px',
                              borderRadius: '999px',
                              fontWeight: '800',
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
                            fontWeight: '700',
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
                          fontSize: '17px'
                        }}
                      >
                        {history.action}
                      </h3>

                      <p
                        style={{
                          margin: '0 0 12px',
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
                            marginTop: '12px',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '10px',
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