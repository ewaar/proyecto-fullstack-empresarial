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

type ReportsScreenProps = {
  user: any;
  projects: any[];
  loadingProjects: boolean;
  loadingReport: string;
  onBack: () => void;
  onGeneralReport: () => void;
  onProjectReport: (projectId: string) => void;
};

export default function ReportsScreen({
  user,
  projects,
  loadingProjects,
  loadingReport,
  onBack,
  onGeneralReport,
  onProjectReport
}: ReportsScreenProps) {
  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>Informes PDF</Text>

          <Text style={styles.dashboardSubtitle}>
            Generación de reportes desde el mismo backend de la web
          </Text>
        </View>

        {(user?.role === 'admin' || user?.role === 'user') && (
          <View style={styles.reportMainCard}>
            <Text style={styles.reportTitle}>Reporte general</Text>

            <Text style={styles.reportText}>
              Genera un PDF con todos los proyectos registrados y sus tareas.
            </Text>

            <Pressable
              onPress={onGeneralReport}
              disabled={loadingReport === 'general'}
              style={[
                styles.reportButton,
                loadingReport === 'general' && styles.reportButtonDisabled
              ]}
            >
              {loadingReport === 'general' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.reportButtonText}>
                  Generar PDF general
                </Text>
              )}
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Reportes por proyecto</Text>

        {loadingProjects ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.loadingText}>Cargando proyectos...</Text>
          </View>
        ) : projects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hay proyectos</Text>
            <Text style={styles.emptyText}>
              No hay proyectos disponibles para generar informes.
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

                <Pressable
                  onPress={() => onProjectReport(project._id)}
                  disabled={loadingReport === project._id}
                  style={[
                    styles.reportButton,
                    loadingReport === project._id && styles.reportButtonDisabled
                  ]}
                >
                  {loadingReport === project._id ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.reportButtonText}>
                      Generar PDF del proyecto
                    </Text>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}