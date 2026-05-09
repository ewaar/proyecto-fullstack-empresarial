import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, Text } from 'react-native';

import LoginScreen from '../src/screens/LoginScreen';
import DashboardScreen from '../src/screens/DashboardScreen';
import ProjectsScreen from '../src/screens/ProjectScreen';
import TasksScreen from '../src/screens/TaskScreen';
import HistoryScreen from '../src/screens/HistoryScreen';
import ReportsScreen from '../src/screens/ReportsScreen';
import ClientsScreen from '../src/screens/ClientsScreen';
import UsersScreen from '../src/screens/UsersScreen';

import {
  loginUser,
  getStoredSession,
  logoutUser
} from '../src/services/authService';

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../src/services/projectService';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../src/services/taskService';

import { getHistories } from '../src/services/historyService';

import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from '../src/services/clientService';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../src/services/useService';

import {
  downloadGeneralProjectsReport,
  downloadProjectReport,
  getGeneratedReports,
  downloadGeneratedReport
} from '../src/services/reportService';

export default function AppScreen() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [screen, setScreen] = useState('login');

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingReport, setLoadingReport] = useState('');
  const [loadingGeneratedReports, setLoadingGeneratedReports] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getStoredSession();

        if (session?.token && session?.user) {
          setToken(session.token);
          setUser(session.user);
          setScreen('dashboard');
        } else {
          setScreen('login');
        }
      } catch (error) {
        setScreen('login');
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const clearData = () => {
    setProjects([]);
    setTasks([]);
    setHistories([]);
    setClients([]);
    setUsers([]);
    setGeneratedReports([]);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obligatorios', 'Ingrese correo y contraseña');
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email.trim(), password.trim());

      setUser(data.user);
      setToken(data.token);
      setPassword('');
      setScreen('dashboard');
    } catch (error: any) {
      Alert.alert(
        'Error al iniciar sesión',
        error.response?.data?.message ||
          error.message ||
          'No se pudo iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }

    setUser(null);
    setToken('');
    setEmail('');
    setPassword('');
    clearData();
    setScreen('login');
  };

  const refreshClients = async () => {
    if (!token) return;

    const data = await getClients(token);
    setClients(data);
  };

  const refreshProjects = async () => {
    if (!token) return;

    const data = await getProjects(token);
    setProjects(data);
  };

  const refreshTasks = async () => {
    if (!token) return;

    const data = await getTasks(token);
    setTasks(data);
  };

  const refreshUsers = async () => {
    if (!token) return;

    const data = await getUsers(token);
    setUsers(data);
  };

  const openProjects = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingProjects(true);

      if (user?.role === 'client') {
        const projectsData = await getProjects(token);

        setProjects(projectsData);
        setClients([]);
        setScreen('projects');
        return;
      }

      const [projectsData, clientsData] = await Promise.all([
        getProjects(token),
        getClients(token)
      ]);

      setProjects(projectsData);
      setClients(clientsData);
      setScreen('projects');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar proyectos',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los proyectos'
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      if (!token) return;

      setLoadingProjects(true);
      await createProject(token, projectData);
      await refreshProjects();

      Alert.alert('Proyecto creado', 'El proyecto fue agregado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al crear proyecto',
        error.response?.data?.message ||
          error.message ||
          'No se pudo crear el proyecto'
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleUpdateProject = async (projectId: string, projectData: any) => {
    try {
      if (!token) return;

      setLoadingProjects(true);
      await updateProject(token, projectId, projectData);
      await refreshProjects();

      Alert.alert('Proyecto actualizado', 'Los cambios fueron guardados correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar proyecto',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el proyecto'
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      if (!token) return;

      setLoadingProjects(true);
      await deleteProject(token, projectId);
      await refreshProjects();

      Alert.alert('Proyecto eliminado', 'El proyecto fue eliminado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al eliminar proyecto',
        error.response?.data?.message ||
          error.message ||
          'No se pudo eliminar el proyecto'
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const openTasks = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingTasks(true);

      if (user?.role === 'client') {
        const [tasksData, projectsData] = await Promise.all([
          getTasks(token),
          getProjects(token)
        ]);

        setTasks(tasksData);
        setProjects(projectsData);
        setUsers([]);
        setScreen('tasks');
        return;
      }

      if (user?.role === 'user') {
        const [tasksData, projectsData] = await Promise.all([
          getTasks(token),
          getProjects(token)
        ]);

        const currentUser = {
          ...user,
          _id: user?._id || user?.id
        };

        setTasks(tasksData);
        setProjects(projectsData);
        setUsers([currentUser]);
        setScreen('tasks');
        return;
      }

      const [tasksData, projectsData, usersData] = await Promise.all([
        getTasks(token),
        getProjects(token),
        getUsers(token)
      ]);

      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
      setScreen('tasks');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar tareas',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar las tareas'
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      if (!token) return;

      setLoadingTasks(true);
      await createTask(token, taskData);
      await refreshTasks();

      Alert.alert('Tarea creada', 'La tarea fue agregada correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al crear tarea',
        error.response?.data?.message ||
          error.message ||
          'No se pudo crear la tarea'
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      if (!token) return;

      setLoadingTasks(true);
      await updateTask(token, taskId, taskData);
      await refreshTasks();

      Alert.alert('Tarea actualizada', 'Los cambios fueron guardados correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar tarea',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar la tarea'
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!token) return;

      setLoadingTasks(true);
      await deleteTask(token, taskId);
      await refreshTasks();

      Alert.alert('Tarea eliminada', 'La tarea fue eliminada correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al eliminar tarea',
        error.response?.data?.message ||
          error.message ||
          'No se pudo eliminar la tarea'
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  const buildTaskPayload = (task: any, changes: any = {}) => {
    const projectId = task.project?._id || task.projectId || task.project;

    const responsibleId =
      task.responsible?._id ||
      task.responsible ||
      task.user?._id ||
      task.user ||
      user?._id ||
      user?.id;

    return {
      title: task.title || task.name || 'Tarea sin título',
      description: task.description || 'Sin descripción',
      project: projectId,
      responsible: responsibleId,
      priority: task.priority || 'media',
      status: changes.status ?? task.status ?? 'pendiente',
      progress: changes.progress ?? task.progress ?? 0
    };
  };

  const changeTaskStatus = async (task: any, newStatus: string) => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      const payload = buildTaskPayload(task, {
        status: newStatus,
        progress: newStatus === 'completada' ? 100 : task.progress
      });

      if (!payload.title || !payload.project || !payload.responsible) {
        Alert.alert(
          'Datos incompletos',
          'La tarea no tiene proyecto o responsable asignado. Revise esa tarea desde la web.'
        );
        return;
      }

      await updateTask(token, task._id, payload);
      await refreshTasks();

      Alert.alert('Tarea actualizada', 'El estado se actualizó correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar tarea',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar la tarea'
      );
    }
  };

  const increaseTaskProgress = async (task: any) => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      const currentProgress = Number(task.progress) || 0;
      const newProgress = Math.min(100, currentProgress + 10);

      const payload = buildTaskPayload(task, {
        progress: newProgress,
        status: newProgress >= 100 ? 'completada' : task.status
      });

      if (!payload.title || !payload.project || !payload.responsible) {
        Alert.alert(
          'Datos incompletos',
          'La tarea no tiene proyecto o responsable asignado. Revise esa tarea desde la web.'
        );
        return;
      }

      await updateTask(token, task._id, payload);
      await refreshTasks();

      Alert.alert('Progreso actualizado', `Progreso actual: ${newProgress}%`);
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar progreso',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el progreso'
      );
    }
  };

  const openHistory = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingHistory(true);
      const data = await getHistories(token);

      setHistories(data);
      setScreen('history');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar historial',
        error.response?.data?.message ||
          error.message ||
          'No se pudo cargar el historial'
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadGeneratedReports = async () => {
    if (!token) return;

    setLoadingGeneratedReports(true);

    try {
      const data = await getGeneratedReports(token);
      setGeneratedReports(data);
    } catch (error: any) {
      Alert.alert(
        'Error al cargar informes',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los informes generados'
      );
    } finally {
      setLoadingGeneratedReports(false);
    }
  };

  const openReports = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingProjects(true);
      setLoadingGeneratedReports(true);

      const [projectsData, reportsData] = await Promise.all([
        getProjects(token),
        getGeneratedReports(token)
      ]);

      setProjects(projectsData);
      setGeneratedReports(reportsData);
      setScreen('reports');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar informes',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los datos de informes'
      );
    } finally {
      setLoadingProjects(false);
      setLoadingGeneratedReports(false);
    }
  };

  const openClients = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      if (user?.role !== 'admin' && user?.role !== 'user') {
        Alert.alert('Acceso denegado', 'No tiene permiso para ver clientes');
        return;
      }

      setLoadingClients(true);

      const data = await getClients(token);

      setClients(data);
      setScreen('clients');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar clientes',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los clientes'
      );
    } finally {
      setLoadingClients(false);
    }
  };

  const handleCreateClient = async (clientData: any) => {
    try {
      if (!token) return;

      setLoadingClients(true);

      await createClient(token, clientData);
      await refreshClients();

      Alert.alert('Cliente creado', 'El cliente fue agregado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al crear cliente',
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'No se pudo crear el cliente'
      );
    } finally {
      setLoadingClients(false);
    }
  };

  const handleUpdateClient = async (clientId: string, clientData: any) => {
    try {
      if (!token) return;

      setLoadingClients(true);

      await updateClient(token, clientId, clientData);
      await refreshClients();

      Alert.alert('Cliente actualizado', 'Los cambios fueron guardados correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar cliente',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el cliente'
      );
    } finally {
      setLoadingClients(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      if (!token) return;

      setLoadingClients(true);

      await deleteClient(token, clientId);
      await refreshClients();

      Alert.alert('Cliente eliminado', 'El cliente fue eliminado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al eliminar cliente',
        error.response?.data?.message ||
          error.message ||
          'No se pudo eliminar el cliente'
      );
    } finally {
      setLoadingClients(false);
    }
  };

  const openUsers = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      if (user?.role !== 'admin') {
        Alert.alert('Acceso denegado', 'Solo el administrador puede ver usuarios');
        return;
      }

      setLoadingUsers(true);

      const [usersData, clientsData] = await Promise.all([
        getUsers(token),
        getClients(token)
      ]);

      setUsers(usersData);
      setClients(clientsData);
      setScreen('users');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar usuarios',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los usuarios'
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      if (!token) return;

      setLoadingUsers(true);
      await createUser(token, userData);
      await refreshUsers();

      Alert.alert('Usuario creado', 'El usuario fue agregado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al crear usuario',
        error.response?.data?.message ||
          error.message ||
          'No se pudo crear el usuario'
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      if (!token) return;

      setLoadingUsers(true);
      await updateUser(token, userId, userData);
      await refreshUsers();

      Alert.alert('Usuario actualizado', 'Los cambios fueron guardados correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al actualizar usuario',
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el usuario'
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!token) return;

      setLoadingUsers(true);
      await deleteUser(token, userId);
      await refreshUsers();

      Alert.alert('Usuario eliminado', 'El usuario fue eliminado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al eliminar usuario',
        error.response?.data?.message ||
          error.message ||
          'No se pudo eliminar el usuario'
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleGeneralReport = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingReport('general');

      await downloadGeneralProjectsReport(token);
      await loadGeneratedReports();

      Alert.alert('Informe generado', 'El informe general fue generado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al generar informe',
        error.message || 'No se pudo generar el informe general'
      );
    } finally {
      setLoadingReport('');
    }
  };

  const handleProjectReport = async (projectId: string) => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingReport(projectId);

      await downloadProjectReport(token, projectId);
      await loadGeneratedReports();

      Alert.alert('Informe generado', 'El informe del proyecto fue generado correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al generar informe',
        error.message || 'No se pudo generar el informe del proyecto'
      );
    } finally {
      setLoadingReport('');
    }
  };

  const handleDownloadGeneratedReport = async (report: any) => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingReport(report._id);

      await downloadGeneratedReport(token, report._id, report.fileName);

      Alert.alert('Informe descargado', 'El informe fue abierto correctamente');
    } catch (error: any) {
      Alert.alert(
        'Error al descargar informe',
        error.message || 'No se pudo descargar el informe'
      );
    } finally {
      setLoadingReport('');
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#0f172a',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color="#ffffff" size="large" />
        <Text
          style={{
            color: '#ffffff',
            marginTop: 14,
            fontWeight: '800'
          }}
        >
          Cargando sesión...
        </Text>
      </SafeAreaView>
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        setPassword={setPassword}
        onLogin={handleLogin}
      />
    );
  }

  if (screen === 'dashboard' && user) {
    return (
      <DashboardScreen
        user={user}
        onOpenProjects={openProjects}
        onOpenTasks={openTasks}
        onOpenHistory={openHistory}
        onOpenReports={openReports}
        onOpenClients={openClients}
        onOpenUsers={openUsers}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === 'projects') {
    return (
      <ProjectsScreen
        user={user}
        projects={projects}
        clients={clients}
        loadingProjects={loadingProjects}
        onBack={() => setScreen('dashboard')}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    );
  }

  if (screen === 'tasks') {
    return (
      <TasksScreen
        user={user}
        tasks={tasks}
        projects={projects}
        users={users}
        loadingTasks={loadingTasks}
        onBack={() => setScreen('dashboard')}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onIncreaseProgress={increaseTaskProgress}
        onChangeStatus={changeTaskStatus}
      />
    );
  }

  if (screen === 'history') {
    return (
      <HistoryScreen
        histories={histories}
        loadingHistory={loadingHistory}
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'reports') {
    return (
      <ReportsScreen
        user={user}
        projects={projects}
        generatedReports={generatedReports}
        loadingProjects={loadingProjects}
        loadingReport={loadingReport}
        loadingGeneratedReports={loadingGeneratedReports}
        onBack={() => setScreen('dashboard')}
        onGeneralReport={handleGeneralReport}
        onProjectReport={handleProjectReport}
        onDownloadGeneratedReport={handleDownloadGeneratedReport}
        onRefreshGeneratedReports={loadGeneratedReports}
      />
    );
  }

  if (screen === 'clients') {
    return (
      <ClientsScreen
        clients={clients}
        loadingClients={loadingClients}
        onBack={() => setScreen('dashboard')}
        onCreateClient={handleCreateClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
      />
    );
  }

  if (screen === 'users') {
    return (
      <UsersScreen
        users={users}
        clients={clients}
        loadingUsers={loadingUsers}
        onBack={() => setScreen('dashboard')}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    );
  }

  return (
    <LoginScreen
      email={email}
      password={password}
      loading={loading}
      setEmail={setEmail}
      setPassword={setPassword}
      onLogin={handleLogin}
    />
  );
}