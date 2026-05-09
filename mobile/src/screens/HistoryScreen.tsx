import {
  ActivityIndicator,
  Pressable,
  Text,
  View
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { styles } from '../styles/appStyles';
import { moduleLabels, typeLabels } from '../constants/labels';
import { formatDateTime } from '../constants/formatters';

type HistoryScreenProps = {
  histories: any[];
  loadingHistory: boolean;
  onBack: () => void;
};

export default function HistoryScreen({
  histories,
  loadingHistory,
  onBack
}: HistoryScreenProps) {
  return (
    <AppBackground>
      <View style={styles.projectsHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.dashboardTitle}>Historial</Text>

        <Text style={styles.dashboardSubtitle}>
          Registro de actividad del sistema
        </Text>
      </View>

      {loadingHistory ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : histories.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No hay movimientos</Text>
          <Text style={styles.emptyText}>
            Todavía no hay registros en el historial.
          </Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {histories.map((history) => (
            <View key={history._id} style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>
                    {typeLabels[history.type] || history.action}
                  </Text>
                </View>

                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>
                    {moduleLabels[history.module] ||
                      history.module ||
                      'Módulo'}
                  </Text>
                </View>
              </View>

              <Text style={styles.historyAction}>{history.action}</Text>

              <Text style={styles.historyDescription}>
                {history.description}
              </Text>

              <View style={styles.historyDetails}>
                {history.project && (
                  <Text style={styles.historyDetailText}>
                    Proyecto: {history.project?.name}
                  </Text>
                )}

                {history.task && (
                  <Text style={styles.historyDetailText}>
                    Tarea: {history.task?.title}
                  </Text>
                )}

                {history.client && (
                  <Text style={styles.historyDetailText}>
                    Cliente: {history.client?.name}
                  </Text>
                )}

                {history.affectedUser && (
                  <Text style={styles.historyDetailText}>
                    Usuario afectado:{' '}
                    {history.affectedUser?.name ||
                      history.affectedUser?.email}
                  </Text>
                )}

                <Text style={styles.historyDetailText}>
                  Realizado por:{' '}
                  {history.user?.name ||
                    history.user?.email ||
                    'No definido'}
                </Text>

                <Text style={styles.historyDetailText}>
                  Fecha: {formatDateTime(history.createdAt)}
                </Text>
              </View>

              {(history.oldValue || history.newValue) && (
                <View style={styles.changeBox}>
                  {history.oldValue ? (
                    <Text style={styles.changeText}>
                      Antes: {history.oldValue}
                    </Text>
                  ) : null}

                  {history.newValue ? (
                    <Text style={styles.changeText}>
                      Después: {history.newValue}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </AppBackground>
  );
}