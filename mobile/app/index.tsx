import { useState } from 'react';
import { Alert } from 'react-native';

import LoginScreen from '../src/screens/LoginScreen';
import DashboardScreen from '../src/screens/DashboardScreen';
import ProjectsScreen from '../src/screens/ProjectScreen';
import TasksScreen from '../src/screens/TaskScreen';
import HistoryScreen from '../src/screens/HistoryScreen';
import ReportsScreen from '../src/screens/ReportsScreen';
import ClientsScreen from '../src/screens/ClientsScreen';
import UsersScreen from '../src/screens/UsersScreen';

import { loginUser } from '../src/services/authService';
import { getProjects } from '../src/services/projectService';
import { getTasks, updateTask } from '../src/services/taskService';
import { getHistories } from '../src/services/historyService';
import { getClients } from '../src/services/clientService';
import { getUsers } from '../src/services/useService';

import {
  downloadGeneralProjectsReport,
  downloadProjectReport
} from '../src/services/reportService';

export default function AppScreen() {
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

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

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

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setEmail('');
    setPassword('');

    setProjects([]);
    setTasks([]);
    setHistories([]);
    setClients([]);
    setUsers([]);

    setScreen('login');
  };

  const openProjects = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingProjects(true);

      const data = await getProjects(token);

      setProjects(data);
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

  const openTasks = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingTasks(true);

      const data = await getTasks(token);

      setTasks(data);
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

  const refreshTasks = async () => {
    if (!token) return;

    const data = await getTasks(token);
    setTasks(data);
  };

  const buildTaskPayload = (task: any, changes: any = {}) => {
    const projectId =
      task.project?._id ||
      task.projectId ||
      task.project;

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
        progress: newStatus === 'completado' ? 100 : task.progress
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
        status: newProgress >= 100 ? 'completado' : task.status
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

  const openReports = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingProjects(true);

      const data = await getProjects(token);

      setProjects(data);
      setScreen('reports');
    } catch (error: any) {
      Alert.alert(
        'Error al cargar informes',
        error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los proyectos para informes'
      );
    } finally {
      setLoadingProjects(false);
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

      const data = await getUsers(token);

      setUsers(data);
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

  const handleGeneralReport = async () => {
    try {
      if (!token) {
        Alert.alert('Sesión no válida', 'Inicie sesión nuevamente');
        return;
      }

      setLoadingReport('general');

      await downloadGeneralProjectsReport(token);
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
    } catch (error: any) {
      Alert.alert(
        'Error al generar informe',
        error.message || 'No se pudo generar el informe del proyecto'
      );
    } finally {
      setLoadingReport('');
    }
  };

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
        loadingProjects={loadingProjects}
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'tasks') {
    return (
      <TasksScreen
        user={user}
        tasks={tasks}
        loadingTasks={loadingTasks}
        onBack={() => setScreen('dashboard')}
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
        loadingProjects={loadingProjects}
        loadingReport={loadingReport}
        onBack={() => setScreen('dashboard')}
        onGeneralReport={handleGeneralReport}
        onProjectReport={handleProjectReport}
      />
    );
  }

  if (screen === 'clients') {
    return (
      <ClientsScreen
        clients={clients}
        loadingClients={loadingClients}
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'users') {
    return (
      <UsersScreen
        users={users}
        loadingUsers={loadingUsers}
        onBack={() => setScreen('dashboard')}
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