import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Svg, { Circle, Path, Line, G } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TabBar, Card } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

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
const ProgressRing = ({ progress, size = 60, strokeWidth = 6, showLabel = true }: { progress: number; size?: number; strokeWidth?: number; showLabel?: boolean }) => {
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
      {showLabel && (
        <Text style={{ fontSize: size / 4, fontWeight: '700', color: colors.gray[900] }}>{progress}%</Text>
      )}
    </View>
  );
};

// Mini Trend Chart
const TrendChart = ({ data, width: chartWidth = 100, height: chartHeight = 40 }: { data: number[]; width?: number; height?: number }) => {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minVal) / range) * chartHeight * 0.8 - chartHeight * 0.1;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Path
        d={`M ${points.split(' ').map((p, i) => (i === 0 ? 'M ' : 'L ') + p).join(' ')}`}
        stroke={colors.primary}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
};

// Gantt Chart Component (Simplified)
const GanttChart = ({ phases }: { phases: any[] }) => {
  const chartWidth = width - spacing.lg * 2 - 100;

  return (
    <View style={styles.ganttContainer}>
      {phases.slice(0, 8).map((phase, index) => {
        const phaseInfo = constructionPhases[index];
        const barWidth = (phase.progress / 100) * chartWidth;

        return (
          <View key={phase.id} style={styles.ganttRow}>
            <View style={styles.ganttLabel}>
              <Text style={styles.ganttLabelText} numberOfLines={1}>
                {phaseInfo.name}
              </Text>
            </View>
            <View style={styles.ganttBarContainer}>
              <View
                style={[
                  styles.ganttBar,
                  {
                    width: barWidth,
                    backgroundColor: phase.progress === 100
                      ? colors.success
                      : phase.status === 'delayed'
                        ? colors.danger
                        : colors.primary
                  }
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const ProjectDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const project = (route.params as any)?.project;

  const [activeTab, setActiveTab] = useState('genel');

  const tabs = [
    { key: 'genel', label: 'Genel' },
    { key: 'asama', label: 'Aşamalar' },
    { key: 'finans', label: 'Finans' },
    { key: 'ekip', label: 'Ekip' },
  ];

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color={colors.gray[300]} />
          <Text style={styles.errorText}>Proje bulunamadı</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: colors.successLight, color: colors.success, label: 'Aktif' };
      case 'delayed': return { bg: colors.dangerLight, color: colors.danger, label: 'Geciken' };
      case 'completed': return { bg: colors.infoLight, color: colors.info, label: 'Tamamlandı' };
      default: return { bg: colors.gray[100], color: colors.gray[500], label: status };
    }
  };

  const statusStyle = getStatusStyle(project.status);
  const completedPhases = project.phases.filter((p: any) => p.progress === 100).length;
  const activePhases = project.phases.filter((p: any) => p.progress > 0 && p.progress < 100).length;
  const budgetUsage = (project.spent / project.budget) * 100;

  // Mock team members
  const teamMembers = [
    { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Müdürü', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Fatma Demir', role: 'Mimar', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: '3', name: 'Mehmet Kaya', role: 'İnşaat Mühendisi', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: '4', name: 'Ayşe Çelik', role: 'Elektrik Mühendisi', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: '5', name: 'Ali Öztürk', role: 'Şef', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  ];

  // Mock expenses
  const recentExpenses = [
    { id: '1', title: 'Beton Alımı', amount: 450000, date: '18 Ara 2025', category: 'Malzeme' },
    { id: '2', title: 'İşçi Maaşları', amount: 280000, date: '15 Ara 2025', category: 'İşçilik' },
    { id: '3', title: 'Demir Alımı', amount: 320000, date: '12 Ara 2025', category: 'Malzeme' },
    { id: '4', title: 'Vinç Kiralama', amount: 85000, date: '10 Ara 2025', category: 'Ekipman' },
  ];

  const renderGeneralTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Project Hero */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: project.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <View style={[styles.heroStatusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.heroStatusText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatCard}>
          <ProgressRing progress={project.progress} size={56} strokeWidth={5} />
          <Text style={styles.quickStatLabel}>İlerleme</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{completedPhases}/16</Text>
          <Text style={styles.quickStatLabel}>Aşama</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={[styles.quickStatValue, project.daysLeft < 0 && { color: colors.danger }]}>
            {project.daysLeft > 0 ? project.daysLeft : Math.abs(project.daysLeft)}
          </Text>
          <Text style={styles.quickStatLabel}>{project.daysLeft >= 0 ? 'Kalan Gün' : 'Gecikme'}</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{project.teamSize}</Text>
          <Text style={styles.quickStatLabel}>Ekip</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proje Bilgileri</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="map-pin" size={18} color={colors.gray[400]} />
              <View>
                <Text style={styles.infoLabel}>Konum</Text>
                <Text style={styles.infoValue}>{project.location}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="tag" size={18} color={colors.gray[400]} />
              <View>
                <Text style={styles.infoLabel}>Tür</Text>
                <Text style={styles.infoValue}>{project.type}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={18} color={colors.gray[400]} />
              <View>
                <Text style={styles.infoLabel}>Başlangıç</Text>
                <Text style={styles.infoValue}>{project.startDate}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="flag" size={18} color={colors.gray[400]} />
              <View>
                <Text style={styles.infoLabel}>Bitiş</Text>
                <Text style={styles.infoValue}>{project.endDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoRowFull}>
            <Icon name="briefcase" size={18} color={colors.gray[400]} />
            <View>
              <Text style={styles.infoLabel}>Yüklenici</Text>
              <Text style={styles.infoValue}>{project.contractor}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Budget Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bütçe Durumu</Text>
        <Card style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetLabel}>Toplam Bütçe</Text>
              <Text style={styles.budgetValue}>{formatCurrency(project.budget)}</Text>
            </View>
            <View style={styles.budgetUsageContainer}>
              <Text style={styles.budgetUsageText}>{budgetUsage.toFixed(0)}%</Text>
              <Text style={styles.budgetUsageLabel}>kullanıldı</Text>
            </View>
          </View>
          <View style={styles.budgetProgressBar}>
            <View style={[styles.budgetProgressFill, { width: `${Math.min(budgetUsage, 100)}%` }]} />
          </View>
          <View style={styles.budgetDetails}>
            <View style={styles.budgetDetailItem}>
              <View style={[styles.budgetDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.budgetDetailLabel}>Harcanan</Text>
              <Text style={styles.budgetDetailValue}>{formatCurrency(project.spent)}</Text>
            </View>
            <View style={styles.budgetDetailItem}>
              <View style={[styles.budgetDot, { backgroundColor: colors.gray[200] }]} />
              <Text style={styles.budgetDetailLabel}>Kalan</Text>
              <Text style={styles.budgetDetailValue}>{formatCurrency(project.budget - project.spent)}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Gantt Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aşama İlerlemesi</Text>
          <TouchableOpacity onPress={() => setActiveTab('asama')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.ganttCard}>
          <GanttChart phases={project.phases} />
        </Card>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderPhasesTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.phasesContainer}>
      {/* Phase Summary */}
      <View style={styles.phaseSummary}>
        <View style={styles.phaseSummaryItem}>
          <View style={[styles.phaseSummaryDot, { backgroundColor: colors.success }]} />
          <Text style={styles.phaseSummaryText}>{completedPhases} Tamamlanan</Text>
        </View>
        <View style={styles.phaseSummaryItem}>
          <View style={[styles.phaseSummaryDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.phaseSummaryText}>{activePhases} Devam Eden</Text>
        </View>
        <View style={styles.phaseSummaryItem}>
          <View style={[styles.phaseSummaryDot, { backgroundColor: colors.gray[300] }]} />
          <Text style={styles.phaseSummaryText}>{16 - completedPhases - activePhases} Bekleyen</Text>
        </View>
      </View>

      {/* Phase List */}
      {constructionPhases.map((phase, index) => {
        const projectPhase = project.phases[index];
        const isCompleted = projectPhase.progress === 100;
        const isActive = projectPhase.progress > 0 && projectPhase.progress < 100;
        const isDelayed = projectPhase.status === 'delayed';

        return (
          <Card key={phase.id} style={styles.phaseCard}>
            <View style={styles.phaseCardHeader}>
              <View style={[
                styles.phaseIconContainer,
                isCompleted && styles.phaseIconCompleted,
                isActive && styles.phaseIconActive,
                isDelayed && styles.phaseIconDelayed,
              ]}>
                {isCompleted ? (
                  <Icon name="check" size={18} color={colors.white} />
                ) : (
                  <Icon name={phase.icon as any} size={18} color={isActive ? colors.white : colors.gray[400]} />
                )}
              </View>
              <View style={styles.phaseCardInfo}>
                <Text style={styles.phaseCardTitle}>{phase.id}. {phase.name}</Text>
                <Text style={styles.phaseCardDescription}>{phase.description}</Text>
              </View>
              <View style={styles.phaseCardProgress}>
                <Text style={[
                  styles.phaseCardPercent,
                  isCompleted && { color: colors.success },
                  isDelayed && { color: colors.danger },
                ]}>{projectPhase.progress}%</Text>
              </View>
            </View>
            <View style={styles.phaseCardBar}>
              <View
                style={[
                  styles.phaseCardBarFill,
                  {
                    width: `${projectPhase.progress}%`,
                    backgroundColor: isCompleted ? colors.success : isDelayed ? colors.danger : colors.primary
                  }
                ]}
              />
            </View>
            {isDelayed && (
              <View style={styles.delayBanner}>
                <Icon name="alert-triangle" size={14} color={colors.danger} />
                <Text style={styles.delayBannerText}>Bu aşama planın gerisinde</Text>
              </View>
            )}
          </Card>
        );
      })}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderFinanceTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Budget Card */}
      <View style={styles.section}>
        <Card style={styles.financeMainCard}>
          <View style={styles.financeBudgetRow}>
            <View style={styles.financeBudgetItem}>
              <Text style={styles.financeBudgetLabel}>Toplam Bütçe</Text>
              <Text style={styles.financeBudgetValue}>{formatCurrency(project.budget)}</Text>
            </View>
            <View style={styles.financeBudgetDivider} />
            <View style={styles.financeBudgetItem}>
              <Text style={styles.financeBudgetLabel}>Harcanan</Text>
              <Text style={[styles.financeBudgetValue, { color: colors.primary }]}>{formatCurrency(project.spent)}</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.financeProgressContainer}>
            <View style={styles.financeProgressBar}>
              <View style={[styles.financeProgressFill, { width: `${budgetUsage}%` }]} />
            </View>
            <Text style={styles.financeProgressText}>{budgetUsage.toFixed(1)}% kullanıldı</Text>
          </View>

          {/* Trend */}
          <View style={styles.financeTrendRow}>
            <View style={styles.financeTrendItem}>
              <Icon name="trending-up" size={16} color={colors.success} />
              <Text style={styles.financeTrendLabel}>Bu Hafta</Text>
              <Text style={styles.financeTrendValue}>+₺2.4M</Text>
            </View>
            <View style={styles.financeTrendItem}>
              <Icon name="trending-down" size={16} color={colors.danger} />
              <Text style={styles.financeTrendLabel}>Sapma</Text>
              <Text style={[styles.financeTrendValue, { color: colors.danger }]}>-₺1.2M</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Expense Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Harcama Dağılımı</Text>
        <View style={styles.categoryGrid}>
          {[
            { name: 'Malzeme', percent: 45, color: colors.primary, icon: 'box' },
            { name: 'İşçilik', percent: 30, color: colors.success, icon: 'users' },
            { name: 'Ekipman', percent: 15, color: colors.warning, icon: 'tool' },
            { name: 'Diğer', percent: 10, color: colors.info, icon: 'more-horizontal' },
          ].map((cat, idx) => (
            <Card key={idx} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Icon name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryPercent}>{cat.percent}%</Text>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryBarFill, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Harcamalar</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Tümü</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.expensesCard}>
          {recentExpenses.map((expense, idx) => (
            <View key={expense.id} style={[styles.expenseItem, idx < recentExpenses.length - 1 && styles.expenseItemBorder]}>
              <View style={styles.expenseIcon}>
                <Icon name="credit-card" size={18} color={colors.gray[500]} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseCategory}>{expense.category} • {expense.date}</Text>
              </View>
              <Text style={styles.expenseAmount}>-{formatCurrency(expense.amount)}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderTeamTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Team Stats */}
      <View style={styles.teamStatsRow}>
        <Card style={styles.teamStatCard}>
          <Icon name="users" size={24} color={colors.primary} />
          <Text style={styles.teamStatValue}>{project.teamSize}</Text>
          <Text style={styles.teamStatLabel}>Toplam Personel</Text>
        </Card>
        <Card style={styles.teamStatCard}>
          <Icon name="hard-hat" size={24} color={colors.warning} />
          <Text style={styles.teamStatValue}>12</Text>
          <Text style={styles.teamStatLabel}>Aktif Şantiye</Text>
        </Card>
      </View>

      {/* Team Members */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kilit Personel</Text>
          <TouchableOpacity>
            <Icon name="plus" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {teamMembers.map((member) => (
          <Card key={member.id} style={styles.teamMemberCard}>
            <Image source={{ uri: member.avatar }} style={styles.teamMemberAvatar} />
            <View style={styles.teamMemberInfo}>
              <Text style={styles.teamMemberName}>{member.name}</Text>
              <Text style={styles.teamMemberRole}>{member.role}</Text>
            </View>
            <View style={styles.teamMemberActions}>
              <TouchableOpacity style={styles.teamMemberAction}>
                <Icon name="phone" size={18} color={colors.gray[500]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.teamMemberAction}>
                <Icon name="message-circle" size={18} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      {/* Department Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Departman Dağılımı</Text>
        <Card style={styles.departmentCard}>
          {[
            { name: 'İnşaat', count: 85, color: colors.primary },
            { name: 'Elektrik', count: 24, color: colors.warning },
            { name: 'Tesisat', count: 18, color: colors.info },
            { name: 'Yönetim', count: 12, color: colors.success },
            { name: 'Güvenlik', count: 17, color: colors.danger },
          ].map((dept, idx) => (
            <View key={idx} style={styles.departmentRow}>
              <View style={[styles.departmentDot, { backgroundColor: dept.color }]} />
              <Text style={styles.departmentName}>{dept.name}</Text>
              <Text style={styles.departmentCount}>{dept.count} kişi</Text>
              <View style={styles.departmentBar}>
                <View style={[styles.departmentBarFill, { width: `${(dept.count / 85) * 100}%`, backgroundColor: dept.color }]} />
              </View>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{project.name}</Text>
          <Text style={styles.headerSubtitle}>{project.location}</Text>
        </View>
        <TouchableOpacity style={styles.headerMenuButton}>
          <Icon name="more-vertical" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'genel' && renderGeneralTab()}
        {activeTab === 'asama' && renderPhasesTab()}
        {activeTab === 'finans' && renderFinanceTab()}
        {activeTab === 'ekip' && renderTeamTab()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  headerMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[500],
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '600',
  },

  // Hero
  heroContainer: {
    height: 180,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  heroStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroStatusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },

  // Quick Stats
  quickStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickStatValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  quickStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 4,
  },

  // Section
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },

  // Info Card
  infoCard: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoRowFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
    marginTop: 2,
  },

  // Budget Card
  budgetCard: {
    padding: spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  budgetLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  budgetValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: 4,
  },
  budgetUsageContainer: {
    alignItems: 'flex-end',
  },
  budgetUsageText: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  budgetUsageLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  budgetDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  budgetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  budgetDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  budgetDetailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },

  // Gantt
  ganttCard: {
    padding: spacing.md,
  },
  ganttContainer: {
    gap: spacing.xs,
  },
  ganttRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ganttLabel: {
    width: 80,
  },
  ganttLabelText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  ganttBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: colors.gray[100],
    borderRadius: 6,
    overflow: 'hidden',
  },
  ganttBar: {
    height: '100%',
    borderRadius: 6,
  },

  // Phases Tab
  phasesContainer: {
    padding: spacing.lg,
  },
  phaseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  phaseSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  phaseSummaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseSummaryText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  phaseCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  phaseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  phaseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  phaseIconCompleted: {
    backgroundColor: colors.success,
  },
  phaseIconActive: {
    backgroundColor: colors.primary,
  },
  phaseIconDelayed: {
    backgroundColor: colors.danger,
  },
  phaseCardInfo: {
    flex: 1,
  },
  phaseCardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  phaseCardDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  phaseCardProgress: {
    marginLeft: spacing.sm,
  },
  phaseCardPercent: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[600],
  },
  phaseCardBar: {
    height: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  phaseCardBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  delayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  delayBannerText: {
    fontSize: typography.fontSize.xs,
    color: colors.danger,
  },

  // Finance Tab
  financeMainCard: {
    padding: spacing.lg,
  },
  financeBudgetRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  financeBudgetItem: {
    flex: 1,
  },
  financeBudgetLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  financeBudgetValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: 4,
  },
  financeBudgetDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.lg,
  },
  financeProgressContainer: {
    marginBottom: spacing.lg,
  },
  financeProgressBar: {
    height: 10,
    backgroundColor: colors.gray[100],
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  financeProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  financeProgressText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textAlign: 'right',
  },
  financeTrendRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  financeTrendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  financeTrendLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  financeTrendValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.success,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    padding: spacing.md,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[700],
  },
  categoryPercent: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  categoryBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray[100],
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Expenses
  expensesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  expenseItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[800],
  },
  expenseCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.danger,
  },

  // Team Tab
  teamStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  teamStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  teamStatValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  teamStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },

  // Team Members
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  teamMemberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  teamMemberRole: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  teamMemberActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  teamMemberAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Department
  departmentCard: {
    padding: spacing.lg,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  departmentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  departmentName: {
    width: 70,
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  departmentCount: {
    width: 60,
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  departmentBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  departmentBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  bottomSpacing: {
    height: 120,
  },
});

export default ProjectDetailScreen;
