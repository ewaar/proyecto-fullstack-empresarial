import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';
import { priorityLabels, statusLabels } from '../constants/labels';

type TasksScreenProps = {
  user: any;
  tasks?: any[];
  projects?: any[];
  users?: any[];
  loadingTasks: boolean;
  onBack: () => void;
  onCreateTask: (taskData: any) => void;
  onUpdateTask: (taskId: string, taskData: any) => void;
  onDeleteTask: (taskId: string) => void;
  onIncreaseProgress: (task: any) => void;
  onChangeStatus: (task: any, status: string) => void;
};

export default function TasksScreen({
  user,
  tasks = [],
  projects = [],
  users = [],
  loadingTasks,
  onBack,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onIncreaseProgress,
  onChangeStatus
}: TasksScreenProps) {
  const [editingTask, setEditingTask] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    responsible: '',
    priority: 'media',
    status: 'pendiente',
    progress: '0'
  });

  const [showProjectList, setShowProjectList] = useState(false);
  const [showResponsibleList, setShowResponsibleList] = useState(false);
  const [showPriorityList, setShowPriorityList] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const priorityOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' }
  ];

  const canManageTasks = user?.role === 'admin' || user?.role === 'user';

  const internalUsers = users.filter(
    (item) => item.role === 'admin' || item.role === 'user'
  );

  const resetForm = () => {
    setEditingTask(null);

    setForm({
      title: '',
      description: '',
      project: '',
      responsible: '',
      priority: 'media',
      status: 'pendiente',
      progress: '0'
    });

    setShowProjectList(false);
    setShowResponsibleList(false);
    setShowPriorityList(false);
    setShowStatusList(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const getProjectId = (task: any) => {
    return task.project?._id || task.project || '';
  };

  const getResponsibleId = (task: any) => {
    return task.responsible?._id || task.responsible || '';
  };

  const getSelectedProjectName = () => {
    const selectedProject = projects.find((project) => project._id === form.project);
    return selectedProject?.name || 'Seleccione un proyecto';
  };

  const getSelectedResponsibleName = () => {
    const selectedUser = internalUsers.find((item) => item._id === form.responsible);

    if (!selectedUser) {
      return 'Seleccione un responsable';
    }

    return `${selectedUser.name} - ${selectedUser.role}`;
  };

  const getSelectedPriorityName = () => {
    const selectedPriority = priorityOptions.find(
      (priority) => priority.value === form.priority
    );

    return selectedPriority?.label || 'Seleccione prioridad';
  };

  const getSelectedStatusName = () => {
    const selectedStatus = statusOptions.find(
      (status) => status.value === form.status
    );

    return selectedStatus?.label || 'Seleccione estado';
  };

  const updateProgressValue = (amount: number) => {
    const currentProgress = Number(form.progress) || 0;
    const newProgress = Math.max(0, Math.min(100, currentProgress + amount));

    setForm((prev) => ({
      ...prev,
      progress: String(newProgress),
      status: newProgress >= 100 ? 'completado' : prev.status
    }));
  };

  const handleSubmit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.project ||
      !form.responsible
    ) {
      Alert.alert(
        'Campos obligatorios',
        'Complete título, descripción, proyecto y responsable'
      );
      return;
    }

    const progressNumber = Number(form.progress);

    if (Number.isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
      Alert.alert('Progreso inválido', 'El progreso debe estar entre 0 y 100');
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      project: form.project,
      responsible: form.responsible,
      priority: form.priority,
      status: form.status,
      progress: progressNumber
    };

    if (editingTask) {
      onUpdateTask(editingTask._id, taskData);
    } else {
      onCreateTask(taskData);
    }

    resetForm();
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);

    setForm({
      title: task.title || '',
      description: task.description || '',
      project: getProjectId(task),
      responsible: getResponsibleId(task),
      priority: task.priority || 'media',
      status: task.status || 'pendiente',
      progress: String(Number(task.progress) || 0)
    });

    setShowProjectList(false);
    setShowResponsibleList(false);
    setShowPriorityList(false);
    setShowStatusList(false);
  };

  const confirmDelete = (task: any) => {
    Alert.alert(
      'Eliminar tarea',
      `¿Seguro que desea eliminar la tarea "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteTask(task._id)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>
            {user?.role === 'client' ? 'Mis Tareas' : 'Tareas'}
          </Text>

          <Text style={styles.dashboardSubtitle}>
            Agregar, editar, eliminar y dar seguimiento a tareas
          </Text>
        </View>

        {canManageTasks && (
          <View style={styles.reportMainCard}>
            <Text style={styles.reportTitle}>
              {editingTask ? 'Editar tarea' : 'Agregar tarea'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                value={form.title}
                onChangeText={(value) => handleChange('title', value)}
                placeholder="Título de la tarea"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
                placeholder="Descripción de la tarea"
                multiline
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Proyecto</Text>

              <Pressable
                style={styles.selectOption}
                onPress={() => {
                  setShowProjectList(!showProjectList);
                  setShowResponsibleList(false);
                  setShowPriorityList(false);
                  setShowStatusList(false);
                }}
              >
                <Text style={styles.selectOptionText}>
                  {getSelectedProjectName()}
                </Text>
              </Pressable>

              {showProjectList && (
                <View style={styles.selectList}>
                  {projects.length === 0 ? (
                    <View style={styles.emptyMiniBox}>
                      <Text style={styles.emptyMiniText}>
                        No hay proyectos disponibles. Primero agregue un proyecto.
                      </Text>
                    </View>
                  ) : (
                    projects.map((project) => (
                      <Pressable
                        key={project._id}
                        style={[
                          styles.selectOption,
                          form.project === project._id && styles.selectOptionActive
                        ]}
                        onPress={() => {
                          handleChange('project', project._id);
                          setShowProjectList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.selectOptionText,
                            form.project === project._id &&
                              styles.selectOptionTextActive
                          ]}
                        >
                          {project.name}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Responsable</Text>

              <Pressable
                style={styles.selectOption}
                onPress={() => {
                  setShowResponsibleList(!showResponsibleList);
                  setShowProjectList(false);
                  setShowPriorityList(false);
                  setShowStatusList(false);
                }}
              >
                <Text style={styles.selectOptionText}>
                  {getSelectedResponsibleName()}
                </Text>
              </Pressable>

              {showResponsibleList && (
                <View style={styles.selectList}>
                  {internalUsers.length === 0 ? (
                    <View style={styles.emptyMiniBox}>
                      <Text style={styles.emptyMiniText}>
                        No hay usuarios internos disponibles.
                      </Text>
                    </View>
                  ) : (
                    internalUsers.map((item) => (
                      <Pressable
                        key={item._id}
                        style={[
                          styles.selectOption,
                          form.responsible === item._id &&
                            styles.selectOptionActive
                        ]}
                        onPress={() => {
                          handleChange('responsible', item._id);
                          setShowResponsibleList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.selectOptionText,
                            form.responsible === item._id &&
                              styles.selectOptionTextActive
                          ]}
                        >
                          {item.name} - {item.role}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Prioridad</Text>

              <Pressable
                style={styles.selectOption}
                onPress={() => {
                  setShowPriorityList(!showPriorityList);
                  setShowProjectList(false);
                  setShowResponsibleList(false);
                  setShowStatusList(false);
                }}
              >
                <Text style={styles.selectOptionText}>
                  {getSelectedPriorityName()}
                </Text>
              </Pressable>

              {showPriorityList && (
                <View style={styles.selectList}>
                  {priorityOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.selectOption,
                        form.priority === option.value && styles.selectOptionActive
                      ]}
                      onPress={() => {
                        handleChange('priority', option.value);
                        setShowPriorityList(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          form.priority === option.value &&
                            styles.selectOptionTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Estado</Text>

              <Pressable
                style={styles.selectOption}
                onPress={() => {
                  setShowStatusList(!showStatusList);
                  setShowProjectList(false);
                  setShowResponsibleList(false);
                  setShowPriorityList(false);
                }}
              >
                <Text style={styles.selectOptionText}>
                  {getSelectedStatusName()}
                </Text>
              </Pressable>

              {showStatusList && (
                <View style={styles.selectList}>
                  {statusOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.selectOption,
                        form.status === option.value && styles.selectOptionActive
                      ]}
                      onPress={() => {
                        handleChange('status', option.value);
                        setShowStatusList(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          form.status === option.value &&
                            styles.selectOptionTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Progreso</Text>

              <View style={styles.progressControls}>
                <Pressable
                  style={styles.progressControlButton}
                  onPress={() => updateProgressValue(-10)}
                >
                  <Text style={styles.progressControlText}>-10%</Text>
                </Pressable>

                <View style={styles.progressValueBox}>
                  <Text style={styles.progressValueText}>
                    {Number(form.progress) || 0}%
                  </Text>
                </View>

                <Pressable
                  style={styles.progressControlButton}
                  onPress={() => updateProgressValue(10)}
                >
                  <Text style={styles.progressControlText}>+10%</Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.reportButton} onPress={handleSubmit}>
              <Text style={styles.reportButtonText}>
                {editingTask ? 'Guardar cambios' : 'Agregar tarea'}
              </Text>
            </Pressable>

            {editingTask && (
              <Pressable
                style={[styles.reportButton, styles.reportButtonDisabled]}
                onPress={resetForm}
              >
                <Text style={styles.reportButtonText}>Cancelar edición</Text>
              </Pressable>
            )}
          </View>
        )}

        {loadingTasks ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.loadingText}>Cargando tareas...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hay tareas</Text>
            <Text style={styles.emptyText}>
              Todavía no hay tareas registradas para mostrar.
            </Text>
          </View>
        ) : (
          <View style={styles.projectsList}>
            {tasks.map((task) => (
              <View key={task._id} style={styles.taskCard}>
                <View style={styles.projectTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectName}>{task.title}</Text>

                    <Text style={styles.projectClient}>
                      Proyecto: {task.project?.name || 'No definido'}
                    </Text>

                    <Text style={styles.projectClient}>
                      Responsable:{' '}
                      {task.responsible?.name ||
                        task.responsible?.email ||
                        'No asignado'}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {statusLabels[task.status] || task.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.projectDescription}>
                  {task.description || 'Sin descripción'}
                </Text>

                <View style={styles.projectInfoGrid}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Prioridad</Text>
                    <Text style={styles.infoValue}>
                      {priorityLabels[task.priority] || task.priority}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Progreso</Text>
                    <Text style={styles.infoValue}>
                      {Number(task.progress) || 0}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.max(
                          0,
                          Math.min(100, Number(task.progress) || 0)
                        )}%`
                      }
                    ]}
                  />
                </View>

                {canManageTasks && (
                  <View style={styles.taskActions}>
                    <Pressable
                      style={styles.taskActionButton}
                      onPress={() => onIncreaseProgress(task)}
                    >
                      <Text style={styles.taskActionButtonText}>
                        +10% avance
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.taskActionButton}
                      onPress={() => onChangeStatus(task, 'en progreso')}
                    >
                      <Text style={styles.taskActionButtonText}>
                        En progreso
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[styles.taskActionButton, styles.completeButton]}
                      onPress={() => onChangeStatus(task, 'completado')}
                    >
                      <Text style={styles.taskActionButtonText}>
                        Completar
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.taskActionButton}
                      onPress={() => handleEdit(task)}
                    >
                      <Text style={styles.taskActionButtonText}>Editar</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.taskActionButton, styles.completeButton]}
                      onPress={() => confirmDelete(task)}
                    >
                      <Text style={styles.taskActionButtonText}>Eliminar</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}