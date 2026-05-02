import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 28,
    padding: 26,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8
  },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#2563eb',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18
  },
  icon: {
    fontSize: 32
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#182235'
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 26,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 7,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 16,
    color: '#182235'
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 15,
    marginTop: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase'
  },
  footer: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 18,
    fontSize: 13
  },

  dashboardPage: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  dashboardContainer: {
    padding: 20,
    paddingBottom: 40
  },
  dashboardHeader: {
    marginTop: 10,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  dashboardTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900'
  },
  dashboardSubtitle: {
    color: '#cbd5e1',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700'
  },
  roleBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999
  },
  roleBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18
  },
  welcomeTitle: {
    color: '#182235',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8
  },
  welcomeText: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22
  },
  menuGrid: {
    gap: 14
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20
  },
  menuIcon: {
    fontSize: 30,
    marginBottom: 8
  },
  menuTitle: {
    color: '#182235',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4
  },
  menuText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600'
  },
  logoutButton: {
    marginTop: 22,
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16
  },

  projectsHeader: {
    marginTop: 10,
    marginBottom: 18
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginBottom: 16
  },
  backButtonText: {
    color: '#182235',
    fontWeight: '900'
  },
  loadingBox: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    gap: 10
  },
  loadingText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center'
  },
  emptyTitle: {
    color: '#182235',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center'
  },
  projectsList: {
    gap: 14
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20
  },
  clientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20
  },
  projectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 10
  },
  projectName: {
    color: '#182235',
    fontSize: 20,
    fontWeight: '900'
  },
  projectClient: {
    color: '#64748b',
    marginTop: 4,
    fontWeight: '700'
  },
  statusBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  statusBadgeText: {
    color: '#1d4ed8',
    fontWeight: '900',
    fontSize: 11
  },
  clientStatusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  userRoleBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  projectDescription: {
    color: '#334155',
    lineHeight: 21,
    marginBottom: 14
  },
  projectInfoGrid: {
    flexDirection: 'row',
    gap: 10
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12
  },
  infoLabel: {
    color: '#64748b',
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 4
  },
  infoValue: {
    color: '#182235',
    fontWeight: '900'
  },
  progressTrack: {
    marginTop: 14,
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 999
  },

  historyList: {
    gap: 14
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18
  },
  historyTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  historyBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  historyBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11
  },
  moduleBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  moduleBadgeText: {
    color: '#334155',
    fontWeight: '900',
    fontSize: 11
  },
  historyAction: {
    color: '#182235',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 6
  },
  historyDescription: {
    color: '#334155',
    lineHeight: 21,
    marginBottom: 12
  },
  historyDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    gap: 5
  },
  historyDetailText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13
  },
  changeBox: {
    marginTop: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 10,
    gap: 4
  },
  changeText: {
    color: '#1e3a8a',
    fontWeight: '800',
    fontSize: 13
  },

  reportMainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18
  },
  reportTitle: {
    color: '#182235',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6
  },
  reportText: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14
  },
  reportButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  reportButtonDisabled: {
    backgroundColor: '#94a3b8'
  },
  reportButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 14
  },
  taskActions: {
  marginTop: 14,
  gap: 8
},
taskActionButton: {
  backgroundColor: '#2563eb',
  borderRadius: 999,
  paddingVertical: 11,
  alignItems: 'center'
},
completeButton: {
  backgroundColor: '#16a34a'
},
taskActionButtonText: {
  color: '#ffffff',
  fontWeight: '900',
  fontSize: 13
}

});