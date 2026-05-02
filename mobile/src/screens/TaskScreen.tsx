import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';
import { priorityLabels, statusLabels } from '../constants/labels';

type TasksScreenProps = {
  user: any;
  tasks: any[];
  loadingTasks: boolean;
  onBack: () => void;
  onIncreaseProgress: (task: any) => void;
  onChangeStatus: (task: any, status: string) => void;
};

export default function TasksScreen({
  user,
  tasks,
  loadingTasks,
  onBack,
  onIncreaseProgress,
  onChangeStatus
}: TasksScreenProps) {
  return (
    <SafeAreaView style={styles.dashboardPage}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <View style={styles.projectsHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.dashboardTitle}>
            {user?.role === 'client' ? 'Mis Tareas' : 'Tareas'}
          </Text>

          <Text style={styles.dashboardSubtitle}>
            Seguimiento de tareas conectadas al sistema web empresarial
          </Text>
        </View>

        {loadingTasks ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.loadingText}>Cargando tareas...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hay tareas</Text>
            <Text style={styles.emptyText}>
              Todavía no hay tareas registradas para mostrar.
            </Text>
          </View>
        ) : (
          <View style={styles.projectsList}>
            {tasks.map((task) => (
              <View key={task._id} style={styles.taskCard}>
                <View style={styles.projectTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectName}>{task.title}</Text>

                    <Text style={styles.projectClient}>
                      Proyecto: {task.project?.name || 'No definido'}
                    </Text>

                    <Text style={styles.projectClient}>
                      Responsable:{' '}
                      {task.responsible?.name ||
                        task.responsible?.email ||
                        'No asignado'}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {statusLabels[task.status] || task.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.projectDescription}>
                  {task.description || 'Sin descripción'}
                </Text>

                <View style={styles.projectInfoGrid}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Prioridad</Text>
                    <Text style={styles.infoValue}>
                      {priorityLabels[task.priority] || task.priority}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Progreso</Text>
                    <Text style={styles.infoValue}>
                      {Number(task.progress) || 0}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.max(
                          0,
                          Math.min(100, Number(task.progress) || 0)
                        )}%`
                      }
                    ]}
                  />
                </View>

                {user?.role !== 'client' && (
                  <View style={styles.taskActions}>
                    <Pressable
                      style={styles.taskActionButton}
                      onPress={() => onIncreaseProgress(task)}
                    >
                      <Text style={styles.taskActionButtonText}>
                        +10% avance
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.taskActionButton}
                      onPress={() => onChangeStatus(task, 'en progreso')}
                    >
                      <Text style={styles.taskActionButtonText}>
                        En progreso
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[styles.taskActionButton, styles.completeButton]}
                      onPress={() => onChangeStatus(task, 'completado')}
                    >
                      <Text style={styles.taskActionButtonText}>
                        Completar
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}