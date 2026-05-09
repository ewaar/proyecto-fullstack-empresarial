import {
  ActivityIndicator,
  Pressable,
  Text,
  View
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { styles } from '../styles/appStyles';
import { statusLabels } from '../constants/labels';

type ReportsScreenProps = {
  user: any;
  projects: any[];
  generatedReports: any[];
  loadingProjects: boolean;
  loadingReport: string;
  loadingGeneratedReports: boolean;
  onBack: () => void;
  onGeneralReport: () => void;
  onProjectReport: (projectId: string) => void;
  onDownloadGeneratedReport: (report: any) => void;
  onRefreshGeneratedReports: () => void;
};

export default function ReportsScreen({
  user,
  projects,
  generatedReports,
  loadingProjects,
  loadingReport,
  loadingGeneratedReports,
  onBack,
  onGeneralReport,
  onProjectReport,
  onDownloadGeneratedReport,
  onRefreshGeneratedReports
}: ReportsScreenProps) {
  const formatDateTime = (date: string) => {
    if (!date) return 'Fecha no definida';

    return new Date(date).toLocaleString('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatSize = (size: number) => {
    if (!size) return '0 KB';

    const kb = size / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const reportTypeLabel = (type: string) => {
    if (type === 'general') return 'General';
    if (type === 'project') return 'Por proyecto';
    return type || 'No definido';
  };

  return (
    <AppBackground>
      <View style={styles.projectsHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.dashboardTitle}>Informes PDF</Text>

        <Text style={styles.dashboardSubtitle}>
          Generación y descarga de informes empresariales
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

      <View style={styles.reportsSavedHeader}>
        <Text style={styles.sectionTitle}>
          Informes generados anteriormente
        </Text>

        <Pressable
          onPress={onRefreshGeneratedReports}
          disabled={loadingGeneratedReports}
          style={[
            styles.savedReportButton,
            loadingGeneratedReports && styles.reportButtonDisabled
          ]}
        >
          <Text style={styles.savedReportButtonText}>
            {loadingGeneratedReports ? 'Actualizando...' : 'Actualizar'}
          </Text>
        </Pressable>
      </View>

      {loadingGeneratedReports ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.loadingText}>Cargando informes...</Text>
        </View>
      ) : generatedReports.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No hay informes guardados</Text>
          <Text style={styles.emptyText}>
            Cuando generes un PDF, aparecerá aquí para descargarlo otra vez.
          </Text>
        </View>
      ) : (
        <View style={styles.projectsList}>
          {generatedReports.map((report) => (
            <View key={report._id} style={styles.savedReportCard}>
              <View style={styles.historyTop}>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>
                    {reportTypeLabel(report.type)}
                  </Text>
                </View>

                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>
                    {formatSize(report.size)}
                  </Text>
                </View>
              </View>

              <Text style={styles.projectName}>{report.title}</Text>

              <Text style={styles.projectClient}>
                Archivo: {report.fileName || 'No definido'}
              </Text>

              <Text style={styles.projectClient}>
                Proyecto: {report.project?.name || 'No aplica'}
              </Text>

              <Text style={styles.projectClient}>
                Cliente:{' '}
                {report.client?.name ||
                  report.client?.company ||
                  'No aplica'}
              </Text>

              <Text style={styles.projectClient}>
                Generado por:{' '}
                {report.user?.name ||
                  report.user?.email ||
                  'No definido'}
              </Text>

              <Text style={styles.projectClient}>
                Fecha: {formatDateTime(report.createdAt)}
              </Text>

              <Pressable
                onPress={() => onDownloadGeneratedReport(report)}
                disabled={loadingReport === report._id}
                style={[
                  styles.reportButton,
                  loadingReport === report._id && styles.reportButtonDisabled
                ]}
              >
                {loadingReport === report._id ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.reportButtonText}>
                    Descargar informe
                  </Text>
                )}
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </AppBackground>
  );
}