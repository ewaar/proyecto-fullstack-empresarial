import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';
import { roleLabels } from '../constants/labels';

type UsersScreenProps = {
  users: any[];
  loadingUsers: boolean;
  onBack: () => void;
};

export default function UsersScreen({
  users,
  loadingUsers,
  onBack
}: UsersScreenProps) {
  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>Usuarios</Text>

          <Text style={styles.dashboardSubtitle}>
            Usuarios registrados con acceso al sistema
          </Text>
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
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}