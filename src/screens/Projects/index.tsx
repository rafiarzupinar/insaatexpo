import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// 16 İnşaat Aşaması
const constructionPhases = [
  { id: 1, name: 'Proje & İzinler', icon: 'file-text', description: 'Mimari proje, ruhsat ve izinler' },
  { id: 2, name: 'Hafriyat', icon: 'truck', description: 'Kazı ve temel hazırlığı' },
  { id: 3, name: 'Temel', icon: 'layers', description: 'Temel betonu ve kalıp işleri' },
  { id: 4, name: 'Bodrum Kat', icon: 'home', description: 'Bodrum kat inşaatı' },
  { id: 5, name: 'Taşıyıcı Sistem', icon: 'grid', description: 'Kolon, kiriş ve perde beton' },
  { id: 6, name: 'Kaba İnşaat', icon: 'box', description: 'Duvar örme ve sıva işleri' },
  { id: 7, name: 'Çatı', icon: 'triangle', description: 'Çatı konstrüksiyon ve kaplama' },
  { id: 8, name: 'Dış Cephe', icon: 'sidebar', description: 'Mantolama ve cephe kaplaması' },
  { id: 9, name: 'Pencere & Kapı', icon: 'square', description: 'Doğrama montajı' },
  { id: 10, name: 'Elektrik', icon: 'zap', description: 'Elektrik tesisatı' },
  { id: 11, name: 'Sıhhi Tesisat', icon: 'droplet', description: 'Su ve kanalizasyon' },
  { id: 12, name: 'Mekanik', icon: 'wind', description: 'Isıtma, soğutma, havalandırma' },
  { id: 13, name: 'İç Mekan', icon: 'layout', description: 'Alçı, boya ve dekorasyon' },
  { id: 14, name: 'Zemin Kaplama', icon: 'copy', description: 'Seramik, parke, halı' },
  { id: 15, name: 'Peyzaj', icon: 'sun', description: 'Bahçe düzenleme' },
  { id: 16, name: 'Teslim', icon: 'check-circle', description: 'Son kontrol ve teslim' },
];

// Progress Ring Component
const ProgressRing = ({ progress, size = 60, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gray[100]}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{ fontSize: size / 4, fontWeight: '700', color: colors.gray[900] }}>{progress}%</Text>
    </View>
  );
};

// Mock Projects with 16 phases
const mockProjects = [
  {
    id: '1',
    name: 'Merkez Residence',
    location: 'Kadıköy, İstanbul',
    type: 'Konut',
    status: 'active',
    progress: 68,
    budget: 45000000,
    spent: 30600000,
    startDate: '15 Oca 2025',
    endDate: '30 Kas 2025',
    daysLeft: 142,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80',
    teamSize: 156,
    contractor: 'ABC İnşaat A.Ş.',
    phases: [
      { id: 1, progress: 100, status: 'completed' },
      { id: 2, progress: 100, status: 'completed' },
      { id: 3, progress: 100, status: 'completed' },
      { id: 4, progress: 100, status: 'completed' },
      { id: 5, progress: 100, status: 'completed' },
      { id: 6, progress: 100, status: 'completed' },
      { id: 7, progress: 85, status: 'active' },
      { id: 8, progress: 40, status: 'active' },
      { id: 9, progress: 30, status: 'active' },
      { id: 10, progress: 60, status: 'active' },
      { id: 11, progress: 55, status: 'active' },
      { id: 12, progress: 20, status: 'pending' },
      { id: 13, progress: 15, status: 'pending' },
      { id: 14, progress: 0, status: 'pending' },
      { id: 15, progress: 0, status: 'pending' },
      { id: 16, progress: 0, status: 'pending' },
    ],
  },
  {
    id: '2',
    name: 'Green Valley AVM',
    location: 'Çankaya, Ankara',
    type: 'Ticari',
    status: 'active',
    progress: 45,
    budget: 85000000,
    spent: 38250000,
    startDate: '01 Mar 2025',
    endDate: '28 Şub 2026',
    daysLeft: 280,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    teamSize: 210,
    contractor: 'XYZ Yapı Ltd.',
    phases: [
      { id: 1, progress: 100, status: 'completed' },
      { id: 2, progress: 100, status: 'completed' },
      { id: 3, progress: 100, status: 'completed' },
      { id: 4, progress: 80, status: 'active' },
      { id: 5, progress: 65, status: 'active' },
      { id: 6, progress: 30, status: 'active' },
      { id: 7, progress: 0, status: 'pending' },
      { id: 8, progress: 0, status: 'pending' },
      { id: 9, progress: 0, status: 'pending' },
      { id: 10, progress: 15, status: 'active' },
      { id: 11, progress: 10, status: 'active' },
      { id: 12, progress: 0, status: 'pending' },
      { id: 13, progress: 0, status: 'pending' },
      { id: 14, progress: 0, status: 'pending' },
      { id: 15, progress: 0, status: 'pending' },
      { id: 16, progress: 0, status: 'pending' },
    ],
  },
  {
    id: '3',
    name: 'Business Tower',
    location: 'Bayraklı, İzmir',
    type: 'Ofis',
    status: 'delayed',
    progress: 52,
    budget: 120000000,
    spent: 72000000,
    startDate: '01 Haz 2024',
    endDate: '15 Mar 2025',
    daysLeft: -10,
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
    teamSize: 185,
    contractor: 'Mega İnşaat',
    phases: [
      { id: 1, progress: 100, status: 'completed' },
      { id: 2, progress: 100, status: 'completed' },
      { id: 3, progress: 100, status: 'completed' },
      { id: 4, progress: 100, status: 'completed' },
      { id: 5, progress: 100, status: 'completed' },
      { id: 6, progress: 75, status: 'delayed' },
      { id: 7, progress: 60, status: 'delayed' },
      { id: 8, progress: 20, status: 'active' },
      { id: 9, progress: 0, status: 'pending' },
      { id: 10, progress: 40, status: 'active' },
      { id: 11, progress: 35, status: 'active' },
      { id: 12, progress: 10, status: 'active' },
      { id: 13, progress: 0, status: 'pending' },
      { id: 14, progress: 0, status: 'pending' },
      { id: 15, progress: 0, status: 'pending' },
      { id: 16, progress: 0, status: 'pending' },
    ],
  },
  {
    id: '4',
    name: 'Sahil Villaları',
    location: 'Bodrum, Muğla',
    type: 'Villa',
    status: 'completed',
    progress: 100,
    budget: 35000000,
    spent: 33500000,
    startDate: '01 Oca 2024',
    endDate: '30 Kas 2024',
    daysLeft: 0,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    teamSize: 0,
    contractor: 'Sahil Yapı',
    phases: constructionPhases.map((_, i) => ({ id: i + 1, progress: 100, status: 'completed' as const })),
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const ProjectsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('liste');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  const tabs = [
    { key: 'liste', label: 'Liste' },
    { key: 'takvim', label: 'Takvim' },
    { key: 'harita', label: 'Harita' },
  ];

  const filters = [
    { id: 'all', label: 'Tümü', count: mockProjects.length },
    { id: 'active', label: 'Aktif', count: mockProjects.filter(p => p.status === 'active').length },
    { id: 'delayed', label: 'Geciken', count: mockProjects.filter(p => p.status === 'delayed').length },
    { id: 'completed', label: 'Tamamlanan', count: mockProjects.filter(p => p.status === 'completed').length },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: colors.successLight, color: colors.success, label: 'Aktif' };
      case 'delayed': return { bg: colors.dangerLight, color: colors.danger, label: 'Geciken' };
      case 'completed': return { bg: colors.infoLight, color: colors.info, label: 'Tamamlandı' };
      default: return { bg: colors.gray[100], color: colors.gray[500], label: status };
    }
  };

  const getPhaseStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: colors.success, border: colors.success };
      case 'active': return { bg: colors.primary, border: colors.primary };
      case 'delayed': return { bg: colors.danger, border: colors.danger };
      default: return { bg: colors.gray[200], border: colors.gray[300] };
    }
  };

  const filteredProjects = activeFilter === 'all'
    ? mockProjects
    : mockProjects.filter(p => p.status === activeFilter);

  const openProjectDetail = (project: typeof mockProjects[0]) => {
    navigation.navigate('ProjectDetail', { project });
  };

  const openPhaseModal = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setShowPhaseModal(true);
  };

  const renderProjectCard = (project: typeof mockProjects[0]) => {
    const statusStyle = getStatusStyle(project.status);
    const completedPhases = project.phases.filter(p => p.progress === 100).length;

    return (
      <TouchableOpacity key={project.id} onPress={() => openProjectDetail(project)}>
        <Card style={styles.projectCard}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Image source={{ uri: project.image }} style={styles.projectImage} />
            <View style={styles.projectInfo}>
              <View style={styles.projectTitleRow}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Icon name="map-pin" size={12} color={colors.gray[400]} />
                <Text style={styles.locationText}>{project.location}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{project.type}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <ProgressRing progress={project.progress} size={70} strokeWidth={7} />
            <View style={styles.progressInfo}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Aşama</Text>
                <Text style={styles.progressValue}>{completedPhases}/16 tamamlandı</Text>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Bütçe</Text>
                <Text style={styles.progressValue}>{formatCurrency(project.budget)}</Text>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Kalan</Text>
                <Text style={[styles.progressValue, project.daysLeft < 0 && { color: colors.danger }]}>
                  {project.daysLeft > 0 ? `${project.daysLeft} gün` : project.daysLeft === 0 ? 'Tamamlandı' : `${Math.abs(project.daysLeft)} gün gecikme`}
                </Text>
              </View>
            </View>
          </View>

          {/* Phase Progress Bar */}
          <View style={styles.phaseProgressContainer}>
            <Text style={styles.phaseProgressTitle}>Aşama İlerlemesi</Text>
            <View style={styles.phaseProgressBar}>
              {project.phases.map((phase, index) => (
                <View
                  key={index}
                  style={[
                    styles.phaseSegment,
                    {
                      backgroundColor: phase.progress === 100
                        ? colors.success
                        : phase.progress > 0
                          ? colors.primary
                          : colors.gray[200],
                    }
                  ]}
                />
              ))}
            </View>
            <View style={styles.phaseLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                <Text style={styles.legendText}>Tamamlanan</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Devam Eden</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.gray[200] }]} />
                <Text style={styles.legendText}>Bekleyen</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Icon name="users" size={14} color={colors.gray[400]} />
              <Text style={styles.footerText}>{project.teamSize} kişi</Text>
            </View>
            <View style={styles.footerItem}>
              <Icon name="briefcase" size={14} color={colors.gray[400]} />
              <Text style={styles.footerText}>{project.contractor}</Text>
            </View>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Detaylar</Text>
              <Icon name="chevron-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderPhaseModal = () => {
    if (!selectedProject) return null;

    return (
      <Modal
        visible={showPhaseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPhaseModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{selectedProject.name}</Text>
              <Text style={styles.modalSubtitle}>16 Aşamalı İnşaat Takibi</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPhaseModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* Overall Progress */}
          <View style={styles.overallProgress}>
            <ProgressRing progress={selectedProject.progress} size={100} strokeWidth={10} />
            <View style={styles.overallInfo}>
              <Text style={styles.overallLabel}>Genel İlerleme</Text>
              <Text style={styles.overallStats}>
                {selectedProject.phases.filter(p => p.progress === 100).length} / 16 aşama tamamlandı
              </Text>
            </View>
          </View>

          {/* Phase List */}
          <ScrollView style={styles.phaseList} showsVerticalScrollIndicator={false}>
            {constructionPhases.map((phase, index) => {
              const projectPhase = selectedProject.phases[index];
              const statusStyle = getPhaseStatusStyle(projectPhase.status);

              return (
                <View key={phase.id} style={styles.phaseItem}>
                  <View style={[styles.phaseNumber, { backgroundColor: statusStyle.bg }]}>
                    {projectPhase.progress === 100 ? (
                      <Icon name="check" size={14} color={colors.white} />
                    ) : (
                      <Text style={styles.phaseNumberText}>{phase.id}</Text>
                    )}
                  </View>

                  <View style={styles.phaseContent}>
                    <View style={styles.phaseHeader}>
                      <View style={styles.phaseTitleRow}>
                        <Icon name={phase.icon as any} size={16} color={colors.gray[600]} />
                        <Text style={styles.phaseName}>{phase.name}</Text>
                      </View>
                      <Text style={[
                        styles.phasePercent,
                        projectPhase.progress === 100 && { color: colors.success }
                      ]}>
                        {projectPhase.progress}%
                      </Text>
                    </View>

                    <Text style={styles.phaseDescription}>{phase.description}</Text>

                    <View style={styles.modalPhaseProgressBar}>
                      <View
                        style={[
                          styles.modalPhaseProgressFill,
                          {
                            width: `${projectPhase.progress}%`,
                            backgroundColor: projectPhase.progress === 100
                              ? colors.success
                              : projectPhase.status === 'delayed'
                                ? colors.danger
                                : colors.primary
                          }
                        ]}
                      />
                    </View>

                    {projectPhase.status === 'delayed' && (
                      <View style={styles.delayWarning}>
                        <Icon name="alert-triangle" size={12} color={colors.danger} />
                        <Text style={styles.delayText}>Bu aşama gecikmiş durumda</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <Card style={styles.calendarCard}>
        <Icon name="calendar" size={48} color={colors.gray[300]} />
        <Text style={styles.comingSoonText}>Takvim Görünümü</Text>
        <Text style={styles.comingSoonSubtext}>Yakında eklenecek</Text>
      </Card>
    </View>
  );

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <Card style={styles.mapCard}>
        <Icon name="map" size={48} color={colors.gray[300]} />
        <Text style={styles.comingSoonText}>Harita Görünümü</Text>
        <Text style={styles.comingSoonSubtext}>Yakında eklenecek</Text>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Projeler" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'liste' && (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Summary */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockProjects.length}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {mockProjects.filter(p => p.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.danger }]}>
                {mockProjects.filter(p => p.status === 'delayed').length}
              </Text>
              <Text style={styles.statLabel}>Geciken</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.info }]}>
                {mockProjects.filter(p => p.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Biten</Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterButton, activeFilter === filter.id && styles.filterButtonActive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                  {filter.label}
                </Text>
                <View style={[styles.filterCount, activeFilter === filter.id && styles.filterCountActive]}>
                  <Text style={[styles.filterCountText, activeFilter === filter.id && styles.filterCountTextActive]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Project List */}
          {filteredProjects.map(renderProjectCard)}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      {activeTab === 'takvim' && renderCalendarView()}
      {activeTab === 'harita' && renderMapView()}

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Phase Modal */}
      {renderPhaseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 10,
    color: colors.gray[500],
    marginTop: 1,
  },

  // Filters - Chip style for mobile
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  filterCount: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 6,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterCountText: {
    fontSize: 11,
    color: colors.gray[700],
    fontWeight: '700',
  },
  filterCountTextActive: {
    color: colors.white,
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.md,
  },

  // Project Card
  projectCard: {
    padding: spacing.md,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  projectImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  projectName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    flex: 1,
  },
  typeBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },

  // Progress Section
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    marginBottom: spacing.md,
  },
  progressInfo: {
    flex: 1,
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  progressValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },

  // Phase Progress
  phaseProgressContainer: {
    marginBottom: spacing.md,
  },
  phaseProgressTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  phaseProgressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  phaseSegment: {
    flex: 1,
    borderRadius: 2,
  },
  phaseLegend: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  detailButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  modalSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Overall Progress
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  overallInfo: {
    marginLeft: spacing.lg,
  },
  overallLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  overallStats: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginTop: 4,
  },

  // Phase List
  phaseList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  phaseItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  phaseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  phaseNumberText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.white,
  },
  phaseContent: {
    flex: 1,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phaseName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  phasePercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.gray[600],
  },
  phaseDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  modalPhaseProgressBar: {
    height: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  modalPhaseProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  delayWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  delayText: {
    fontSize: typography.fontSize.xs,
    color: colors.danger,
  },

  // Coming Soon
  calendarContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  calendarCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  mapCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[600],
    marginTop: spacing.md,
  },
  comingSoonSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },

  bottomSpacing: {
    height: 100,
  },
});

export default ProjectsScreen;
