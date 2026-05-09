import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppBackground from '../components/AppBackground';
import { styles } from '../styles/appStyles';
import { statusLabels } from '../constants/labels';
import { formatDate } from '../constants/formatters';

type ProjectsScreenProps = {
  user: any;
  projects?: any[];
  clients?: any[];
  loadingProjects: boolean;
  onBack: () => void;
  onCreateProject: (projectData: any) => void;
  onUpdateProject: (projectId: string, projectData: any) => void;
  onDeleteProject: (projectId: string) => void;
};

export default function ProjectsScreen({
  user,
  projects = [],
  clients = [],
  loadingProjects,
  onBack,
  onCreateProject,
  onUpdateProject,
  onDeleteProject
}: ProjectsScreenProps) {
  const [editingProject, setEditingProject] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pendiente',
    client: ''
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);

  const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En progreso' },
  { value: 'finalizado', label: 'Finalizado' }
];

  const resetForm = () => {
    setEditingProject(null);

    setForm({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'pendiente',
      client: ''
    });

    setShowClientList(false);
    setShowStatusList(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const toInputDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateObject = (value: string) => {
    if (!value) return new Date();

    const parsedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date();
    }

    return parsedDate;
  };

  const getClientId = (project: any) => {
    return project.client?._id || project.client || '';
  };

  const getSelectedClientName = () => {
    const selectedClient = clients.find((client) => client._id === form.client);

    if (!selectedClient) {
      return 'Seleccione un cliente';
    }

    return `${selectedClient.name} - ${selectedClient.company || 'Sin empresa'}`;
  };

  const getSelectedStatusName = () => {
    const selectedStatus = statusOptions.find(
      (status) => status.value === form.status
    );

    return selectedStatus?.label || 'Seleccione un estado';
  };

  const handleStartDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowStartPicker(false);
    }

    if (selectedDate) {
      handleChange('startDate', toInputDate(selectedDate));
    }
  };

  const handleEndDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowEndPicker(false);
    }

    if (selectedDate) {
      handleChange('endDate', toInputDate(selectedDate));
    }
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim() ||
      !form.client
    ) {
      Alert.alert(
        'Campos obligatorios',
        'Complete nombre, descripción, fecha inicio, fecha fin y cliente'
      );
      return;
    }

    const start = new Date(`${form.startDate}T00:00:00`);
    const end = new Date(`${form.endDate}T00:00:00`);

    if (end < start) {
      Alert.alert(
        'Fechas inválidas',
        'La fecha de fin no puede ser menor que la fecha de inicio'
      );
      return;
    }

    const projectData = {
      name: form.name.trim(),
      description: form.description.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      status: form.status,
      client: form.client
    };

    if (editingProject) {
      onUpdateProject(editingProject._id, projectData);
    } else {
      onCreateProject(projectData);
    }

    resetForm();
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);

    setForm({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate
        ? String(project.startDate).substring(0, 10)
        : '',
      endDate: project.endDate ? String(project.endDate).substring(0, 10) : '',
      status: project.status || 'pendiente',
      client: getClientId(project)
    });

    setShowClientList(false);
    setShowStatusList(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const confirmDelete = (project: any) => {
    Alert.alert(
      'Eliminar proyecto',
      `¿Seguro que desea eliminar el proyecto "${project.name}"? También se eliminarán sus tareas relacionadas.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteProject(project._id)
        }
      ]
    );
  };

  const canManageProjects = user?.role === 'admin' || user?.role === 'user';

  return (
    <AppBackground>
      <View style={styles.projectsHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.dashboardTitle}>
          {user?.role === 'client' ? 'Mis Proyectos' : 'Proyectos'}
        </Text>

        <Text style={styles.dashboardSubtitle}>
          Agregar, editar, eliminar y consultar proyectos
        </Text>
      </View>

      {canManageProjects && (
        <View style={styles.reportMainCard}>
          <Text style={styles.reportTitle}>
            {editingProject ? 'Editar proyecto' : 'Agregar proyecto'}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={form.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Nombre del proyecto"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={form.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Descripción del proyecto"
              multiline
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha inicio</Text>

            <Pressable
              style={styles.selectOption}
              onPress={() => {
                setShowStartPicker(true);
                setShowEndPicker(false);
              }}
            >
              <Text style={styles.selectOptionText}>
                {form.startDate || 'Seleccionar fecha inicio'}
              </Text>
            </Pressable>

            {showStartPicker && (
              <View style={styles.datePickerBox}>
                <DateTimePicker
                  value={getDateObject(form.startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartDateChange}
                  themeVariant="light"
                  textColor="#182235"
                />
              </View>
            )}

            {Platform.OS === 'ios' && showStartPicker && (
              <Pressable
                style={styles.savedReportButton}
                onPress={() => setShowStartPicker(false)}
              >
                <Text style={styles.savedReportButtonText}>Listo</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha fin</Text>

            <Pressable
              style={styles.selectOption}
              onPress={() => {
                setShowEndPicker(true);
                setShowStartPicker(false);
              }}
            >
              <Text style={styles.selectOptionText}>
                {form.endDate || 'Seleccionar fecha fin'}
              </Text>
            </Pressable>

            {showEndPicker && (
              <View style={styles.datePickerBox}>
                <DateTimePicker
                  value={getDateObject(form.endDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEndDateChange}
                  themeVariant="light"
                  textColor="#182235"
                />
              </View>
            )}

            {Platform.OS === 'ios' && showEndPicker && (
              <Pressable
                style={styles.savedReportButton}
                onPress={() => setShowEndPicker(false)}
              >
                <Text style={styles.savedReportButtonText}>Listo</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cliente</Text>

            <Pressable
              style={styles.selectOption}
              onPress={() => {
                setShowClientList(!showClientList);
                setShowStatusList(false);
              }}
            >
              <Text style={styles.selectOptionText}>
                {getSelectedClientName()}
              </Text>
            </Pressable>

            {showClientList && (
              <View style={styles.selectList}>
                {clients.length === 0 ? (
                  <View style={styles.emptyMiniBox}>
                    <Text style={styles.emptyMiniText}>
                      No hay clientes disponibles. Primero agregue un cliente.
                    </Text>
                  </View>
                ) : (
                  clients.map((client) => (
                    <Pressable
                      key={client._id}
                      style={[
                        styles.selectOption,
                        form.client === client._id && styles.selectOptionActive
                      ]}
                      onPress={() => {
                        handleChange('client', client._id);
                        setShowClientList(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          form.client === client._id &&
                            styles.selectOptionTextActive
                        ]}
                      >
                        {client.name} - {client.company || 'Sin empresa'}
                      </Text>
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estado</Text>

            <Pressable
              style={styles.selectOption}
              onPress={() => {
                setShowStatusList(!showStatusList);
                setShowClientList(false);
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

          <Pressable style={styles.reportButton} onPress={handleSubmit}>
            <Text style={styles.reportButtonText}>
              {editingProject ? 'Guardar cambios' : 'Agregar proyecto'}
            </Text>
          </Pressable>

          {editingProject && (
            <Pressable
              style={[styles.reportButton, styles.reportButtonDisabled]}
              onPress={resetForm}
            >
              <Text style={styles.reportButtonText}>Cancelar edición</Text>
            </Pressable>
          )}
        </View>
      )}

      {loadingProjects ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      ) : projects.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No hay proyectos</Text>
          <Text style={styles.emptyText}>
            Todavía no hay proyectos registrados para mostrar.
          </Text>
        </View>
      ) : (
        <View style={styles.projectsList}>
          {projects.map((project) => (
            <View key={project._id} style={styles.projectCard}>
              <View style={styles.projectTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectName}>{project.name}</Text>

                  <Text style={styles.projectClient}>
                    Cliente:{' '}
                    {project.client?.name ||
                      project.client?.company ||
                      'No definido'}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {statusLabels[project.status] || project.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.projectDescription}>
                {project.description || 'Sin descripción'}
              </Text>

              <View style={styles.projectInfoGrid}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Inicio</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(project.startDate)}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Fin</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(project.endDate)}
                  </Text>
                </View>
              </View>

              {canManageProjects && (
                <View style={styles.taskActions}>
                  <Pressable
                    style={styles.taskActionButton}
                    onPress={() => handleEdit(project)}
                  >
                    <Text style={styles.taskActionButtonText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.taskActionButton, styles.completeButton]}
                    onPress={() => confirmDelete(project)}
                  >
                    <Text style={styles.taskActionButtonText}>Eliminar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </AppBackground>
  );
}