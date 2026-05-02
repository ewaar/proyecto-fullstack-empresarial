import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';
import { roleLabels } from '../constants/labels';

type DashboardScreenProps = {
  user: any;
  onOpenProjects: () => void;
  onOpenTasks: () => void;
  onOpenHistory: () => void;
  onOpenReports: () => void;
  onOpenClients: () => void;
  onOpenUsers: () => void;
  onLogout: () => void;
};

export default function DashboardScreen({
  user,
  onOpenProjects,
  onOpenTasks,
  onOpenHistory,
  onOpenReports,
  onOpenClients,
  onOpenUsers,
  onLogout
}: DashboardScreenProps) {
  const modulePending = (moduleName: string) => {
    Alert.alert(
      'Módulo en desarrollo',
      `El módulo de ${moduleName} lo agregaremos después.`
    );
  };

  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Panel Principal</Text>
            <Text style={styles.dashboardSubtitle}>
              Sistema móvil empresarial
            </Text>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {roleLabels[user?.role] || user?.role}
            </Text>
          </View>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Bienvenido, {user?.name || 'Usuario'}
          </Text>

          <Text style={styles.welcomeText}>
            Esta app trabaja con el mismo backend de Render y la misma base de
            datos MongoDB Atlas de la página web.
          </Text>
        </View>

        <View style={styles.menuGrid}>
          <Pressable style={styles.menuCard} onPress={onOpenProjects}>
            <Text style={styles.menuIcon}>📁</Text>
            <Text style={styles.menuTitle}>
              {user?.role === 'client' ? 'Mis Proyectos' : 'Proyectos'}
            </Text>
            <Text style={styles.menuText}>Ver proyectos registrados</Text>
          </Pressable>

          <Pressable style={styles.menuCard} onPress={onOpenTasks}>
            <Text style={styles.menuIcon}>✅</Text>
            <Text style={styles.menuTitle}>
              {user?.role === 'client' ? 'Mis Tareas' : 'Tareas'}
            </Text>
            <Text style={styles.menuText}>Seguimiento de tareas</Text>
          </Pressable>

          <Pressable style={styles.menuCard} onPress={onOpenHistory}>
            <Text style={styles.menuIcon}>🕒</Text>
            <Text style={styles.menuTitle}>Historial</Text>
            <Text style={styles.menuText}>Bitácora automática</Text>
          </Pressable>

          <Pressable style={styles.menuCard} onPress={onOpenReports}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuTitle}>Reportes</Text>
            <Text style={styles.menuText}>Informes PDF</Text>
          </Pressable>

          {user?.role === 'admin' && (
            <Pressable style={styles.menuCard} onPress={onOpenUsers}>
              <Text style={styles.menuIcon}>👥</Text>
              <Text style={styles.menuTitle}>Usuarios</Text>
              <Text style={styles.menuText}>Gestión de usuarios</Text>
            </Pressable>
          )}

          {(user?.role === 'admin' || user?.role === 'user') && (
            <Pressable style={styles.menuCard} onPress={onOpenClients}>
              <Text style={styles.menuIcon}>🏢</Text>
              <Text style={styles.menuTitle}>Clientes</Text>
              <Text style={styles.menuText}>Gestión de clientes</Text>
            </Pressable>
          )}
        </View>

        <Pressable onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}