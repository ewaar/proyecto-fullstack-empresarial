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

type ClientsScreenProps = {
  clients: any[];
  loadingClients: boolean;
  onBack: () => void;
  onCreateClient: (clientData: any) => void;
  onUpdateClient: (clientId: string, clientData: any) => void;
  onDeleteClient: (clientId: string) => void;
};

export default function ClientsScreen({
  clients,
  loadingClients,
  onBack,
  onCreateClient,
  onUpdateClient,
  onDeleteClient
}: ClientsScreenProps) {
  const [editingClient, setEditingClient] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: true
  });

  const resetForm = () => {
    setEditingClient(null);

    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: true
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusText = (status: any) => {
    if (status === true) return 'Activo';
    if (status === false) return 'Inactivo';
    if (status === 'true') return 'Activo';
    if (status === 'false') return 'Inactivo';
    return status || 'Activo';
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.company.trim()
    ) {
      Alert.alert('Campos obligatorios', 'Complete todos los campos del cliente');
      return;
    }

    const clientData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      status: form.status
    };

    if (editingClient) {
      onUpdateClient(editingClient._id, clientData);
    } else {
      onCreateClient(clientData);
    }

    resetForm();
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);

    setForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status:
        client.status === true ||
        client.status === 'true' ||
        client.status === 'Activo'
    });
  };

  const confirmDelete = (client: any) => {
    Alert.alert(
      'Eliminar cliente',
      `¿Seguro que desea eliminar a ${client.name}? También se eliminarán datos relacionados si existen.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteClient(client._id)
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

        <Text style={styles.dashboardTitle}>Clientes</Text>

        <Text style={styles.dashboardSubtitle}>
          Agregar, editar y eliminar clientes del sistema
        </Text>
      </View>

      <View style={styles.reportMainCard}>
        <Text style={styles.reportTitle}>
          {editingClient ? 'Editar cliente' : 'Agregar cliente'}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Nombre del cliente"
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
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Empresa</Text>
          <TextInput
            value={form.company}
            onChangeText={(value) => handleChange('company', value)}
            placeholder="Empresa"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Estado</Text>

          <View style={styles.statusOptions}>
            <Pressable
              style={[
                styles.statusOptionButton,
                form.status === true && styles.statusOptionActive
              ]}
              onPress={() => handleChange('status', true)}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  form.status === true && styles.statusOptionTextActive
                ]}
              >
                Activo
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.statusOptionButton,
                form.status === false && styles.statusOptionActive
              ]}
              onPress={() => handleChange('status', false)}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  form.status === false && styles.statusOptionTextActive
                ]}
              >
                Inactivo
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.reportButton} onPress={handleSubmit}>
          <Text style={styles.reportButtonText}>
            {editingClient ? 'Guardar cambios' : 'Agregar cliente'}
          </Text>
        </Pressable>

        {editingClient && (
          <Pressable
            style={[styles.reportButton, styles.reportButtonDisabled]}
            onPress={resetForm}
          >
            <Text style={styles.reportButtonText}>Cancelar edición</Text>
          </Pressable>
        )}
      </View>

      {loadingClients ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.loadingText}>Cargando clientes...</Text>
        </View>
      ) : clients.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No hay clientes</Text>
          <Text style={styles.emptyText}>
            Todavía no hay clientes registrados para mostrar.
          </Text>
        </View>
      ) : (
        <View style={styles.projectsList}>
          {clients.map((client) => (
            <View key={client._id} style={styles.clientCard}>
              <View style={styles.projectTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectName}>{client.name}</Text>

                  <Text style={styles.projectClient}>
                    Empresa: {client.company || 'No definida'}
                  </Text>

                  <Text style={styles.projectClient}>
                    Correo: {client.email || 'No definido'}
                  </Text>

                  <Text style={styles.projectClient}>
                    Teléfono: {client.phone || 'No definido'}
                  </Text>
                </View>

                <View style={styles.clientStatusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {getStatusText(client.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.taskActions}>
                <Pressable
                  style={styles.taskActionButton}
                  onPress={() => handleEdit(client)}
                >
                  <Text style={styles.taskActionButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.taskActionButton, styles.completeButton]}
                  onPress={() => confirmDelete(client)}
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