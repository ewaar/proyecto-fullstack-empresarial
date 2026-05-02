import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';

type ClientsScreenProps = {
  clients: any[];
  loadingClients: boolean;
  onBack: () => void;
};

export default function ClientsScreen({
  clients,
  loadingClients,
  onBack
}: ClientsScreenProps) {
  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>Clientes</Text>

          <Text style={styles.dashboardSubtitle}>
            Clientes registrados en el sistema empresarial
          </Text>
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
                      {client.status || 'Activo'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}