import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { styles } from '../styles/appStyles';
import { roleLabels } from '../constants/labels';

type UsersScreenProps = {
  users?: any[];
  clients?: any[];
  loadingUsers: boolean;
  onBack: () => void;
  onCreateUser: (userData: any) => void;
  onUpdateUser: (userId: string, userData: any) => void;
  onDeleteUser: (userId: string) => void;
};

export default function UsersScreen({
  users = [],
  clients = [],
  loadingUsers,
  onBack,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}: UsersScreenProps) {
  const [editingUser, setEditingUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    clientId: ''
  });

  const [showRoleList, setShowRoleList] = useState(false);
  const [showClientList, setShowClientList] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Interno' },
    { value: 'client', label: 'Cliente' }
  ];

  const resetForm = () => {
    setEditingUser(null);

    setForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      clientId: ''
    });

    setShowRoleList(false);
    setShowClientList(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const getClientId = (item: any) => {
    return item.clientId?._id || item.clientId || '';
  };

  const getSelectedRoleName = () => {
    const selectedRole = roleOptions.find((role) => role.value === form.role);
    return selectedRole?.label || 'Seleccione un rol';
  };

  const getSelectedClientName = () => {
    const selectedClient = clients.find((client) => client._id === form.clientId);

    if (!selectedClient) {
      return 'Seleccione un cliente';
    }

    return `${selectedClient.name} - ${selectedClient.company || 'Sin empresa'}`;
  };

  const handleRoleSelect = (role: string) => {
    setForm((prev) => ({
      ...prev,
      role,
      clientId: role === 'client' ? prev.clientId : ''
    }));

    setShowRoleList(false);
    setShowClientList(false);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      Alert.alert('Campos obligatorios', 'Complete nombre, correo y rol');
      return;
    }

    if (!editingUser && !form.password.trim()) {
      Alert.alert(
        'Contraseña obligatoria',
        'Ingrese una contraseña para el usuario'
      );
      return;
    }

    if (form.role === 'client' && !form.clientId) {
      Alert.alert('Cliente obligatorio', 'Seleccione el cliente asociado');
      return;
    }

    const userData: any = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      clientId: form.role === 'client' ? form.clientId : null
    };

    if (form.password.trim()) {
      userData.password = form.password.trim();
    }

    if (editingUser) {
      onUpdateUser(editingUser._id, userData);
    } else {
      onCreateUser(userData);
    }

    resetForm();
  };

  const handleEdit = (item: any) => {
    setEditingUser(item);

    setForm({
      name: item.name || '',
      email: item.email || '',
      password: '',
      role: item.role || 'user',
      clientId: getClientId(item)
    });

    setShowRoleList(false);
    setShowClientList(false);
  };

  const confirmDelete = (item: any) => {
    Alert.alert(
      'Eliminar usuario',
      `¿Seguro que desea eliminar a ${item.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteUser(item._id)
        }
      ]
    );
  };

  return (
    <AppBackground>
      <View style={styles.projectsHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.dashboardTitle}>Usuarios</Text>

        <Text style={styles.dashboardSubtitle}>
          Agregar, editar y eliminar usuarios del sistema
        </Text>
      </View>

      <View style={styles.reportMainCard}>
        <Text style={styles.reportTitle}>
          {editingUser ? 'Editar usuario' : 'Agregar usuario'}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Nombre del usuario"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {editingUser ? 'Nueva contraseña opcional' : 'Contraseña'}
          </Text>

          <TextInput
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            placeholder={
              editingUser ? 'Dejar vacío para no cambiar' : 'Contraseña'
            }
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rol</Text>

          <Pressable
            style={styles.selectOption}
            onPress={() => {
              setShowRoleList(!showRoleList);
              setShowClientList(false);
            }}
          >
            <Text style={styles.selectOptionText}>
              {getSelectedRoleName()}
            </Text>
          </Pressable>

          {showRoleList && (
            <View style={styles.selectList}>
              {roleOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.selectOption,
                    form.role === option.value && styles.selectOptionActive
                  ]}
                  onPress={() => handleRoleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      form.role === option.value &&
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

        {form.role === 'client' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cliente asociado</Text>

            <Pressable
              style={styles.selectOption}
              onPress={() => {
                setShowClientList(!showClientList);
                setShowRoleList(false);
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
                      No hay clientes disponibles.
                    </Text>
                  </View>
                ) : (
                  clients.map((client) => (
                    <Pressable
                      key={client._id}
                      style={[
                        styles.selectOption,
                        form.clientId === client._id &&
                          styles.selectOptionActive
                      ]}
                      onPress={() => {
                        handleChange('clientId', client._id);
                        setShowClientList(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          form.clientId === client._id &&
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
        )}

        <Pressable style={styles.reportButton} onPress={handleSubmit}>
          <Text style={styles.reportButtonText}>
            {editingUser ? 'Guardar cambios' : 'Agregar usuario'}
          </Text>
        </Pressable>

        {editingUser && (
          <Pressable
            style={[styles.reportButton, styles.reportButtonDisabled]}
            onPress={resetForm}
          >
            <Text style={styles.reportButtonText}>Cancelar edición</Text>
          </Pressable>
        )}
      </View>

      {loadingUsers ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No hay usuarios</Text>
          <Text style={styles.emptyText}>
            Todavía no hay usuarios registrados para mostrar.
          </Text>
        </View>
      ) : (
        <View style={styles.projectsList}>
          {users.map((item) => (
            <View key={item._id} style={styles.userCard}>
              <View style={styles.projectTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectName}>{item.name}</Text>

                  <Text style={styles.projectClient}>
                    Correo: {item.email || 'No definido'}
                  </Text>

                  <Text style={styles.projectClient}>
                    Cliente asociado:{' '}
                    {item.clientId?.name ||
                      item.clientId?.company ||
                      'No aplica'}
                  </Text>
                </View>

                <View style={styles.userRoleBadge}>
                  <Text style={styles.statusBadgeText}>
                    {roleLabels[item.role] || item.role}
                  </Text>
                </View>
              </View>

              <View style={styles.taskActions}>
                <Pressable
                  style={styles.taskActionButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.taskActionButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.taskActionButton, styles.completeButton]}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={styles.taskActionButtonText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </AppBackground>
  );
}