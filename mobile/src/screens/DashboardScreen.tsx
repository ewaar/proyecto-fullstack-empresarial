import { Pressable, Text, View } from 'react-native';
import AppBackground from '../components/AppBackground';
import { styles } from '../styles/appStyles';

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
  const getRoleLabel = () => {
    if (user?.role === 'admin') return 'Administrador';
    if (user?.role === 'user') return 'Interno';
    if (user?.role === 'client') return 'Cliente';
    return user?.role || 'Usuario';
  };

  const isAdmin = user?.role === 'admin';
  const isInternal = user?.role === 'user';
  const isClient = user?.role === 'client';

  return (
    <AppBackground>
      <View style={styles.dashboardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dashboardTitle}>Panel Principal</Text>
          <Text style={styles.dashboardSubtitle}>
            Sistema móvil empresarial
          </Text>
        </View>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{getRoleLabel()}</Text>
        </View>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          Bienvenido, {user?.name || 'Usuario'}
        </Text>

        <Text style={styles.welcomeDescription}>
          Plataforma móvil diseñada para optimizar el seguimiento y control de
          procesos empresariales.
        </Text>
      </View>

      <View style={styles.dashboardMenu}>
        <Pressable style={styles.dashboardCard} onPress={onOpenProjects}>
          <Text style={styles.dashboardIcon}>
            {isClient ? '📁' : '📂'}
          </Text>

          <Text style={styles.dashboardCardTitle}>
            {isClient ? 'Mis Proyectos' : 'Proyectos'}
          </Text>

          <Text style={styles.dashboardCardText}>
            {isClient
              ? 'Consulta de proyectos asignados'
              : 'Control de proyectos registrados'}
          </Text>
        </Pressable>

        <Pressable style={styles.dashboardCard} onPress={onOpenTasks}>
          <Text style={styles.dashboardIcon}>✅</Text>

          <Text style={styles.dashboardCardTitle}>
            {isClient ? 'Mis Tareas' : 'Tareas'}
          </Text>

          <Text style={styles.dashboardCardText}>
            Seguimiento de tareas
          </Text>
        </Pressable>

        <Pressable style={styles.dashboardCard} onPress={onOpenHistory}>
          <Text style={styles.dashboardIcon}>🕘</Text>

          <Text style={styles.dashboardCardTitle}>Historial</Text>

          <Text style={styles.dashboardCardText}>
            Bitácora automática
          </Text>
        </Pressable>

        <Pressable style={styles.dashboardCard} onPress={onOpenReports}>
          <Text style={styles.dashboardIcon}>📄</Text>

          <Text style={styles.dashboardCardTitle}>Informes</Text>

          <Text style={styles.dashboardCardText}>
            Reportes PDF generados
          </Text>
        </Pressable>

        {(isAdmin || isInternal) && (
          <Pressable style={styles.dashboardCard} onPress={onOpenClients}>
            <Text style={styles.dashboardIcon}>👥</Text>

            <Text style={styles.dashboardCardTitle}>Clientes</Text>

            <Text style={styles.dashboardCardText}>
              Administración de clientes
            </Text>
          </Pressable>
        )}

        {isAdmin && (
          <Pressable style={styles.dashboardCard} onPress={onOpenUsers}>
            <Text style={styles.dashboardIcon}>🔐</Text>

            <Text style={styles.dashboardCardTitle}>Usuarios</Text>

            <Text style={styles.dashboardCardText}>
              Control de accesos
            </Text>
          </Pressable>
        )}

        <Pressable style={styles.logoutCard} onPress={onLogout}>
          <Text style={styles.logoutCardTitle}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </AppBackground>
  );
}