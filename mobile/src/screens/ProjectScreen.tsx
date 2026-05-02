import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';
import { statusLabels } from '../constants/labels';
import { formatDate } from '../constants/formatters';

type ProjectsScreenProps = {
  user: any;
  projects: any[];
  loadingProjects: boolean;
  onBack: () => void;
};

export default function ProjectsScreen({
  user,
  projects,
  loadingProjects,
  onBack
}: ProjectsScreenProps) {
  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>
            {user?.role === 'client' ? 'Mis Proyectos' : 'Proyectos'}
          </Text>

          <Text style={styles.dashboardSubtitle}>
            Proyectos conectados al sistema web empresarial
          </Text>
        </View>

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
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}