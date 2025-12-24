import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Animated Progress Ring
const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color = colors.primary,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} />
          <Stop offset="100%" stopColor={colors.orange[400]} />
        </LinearGradient>
      </Defs>
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
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

// Semi-circle gauge component
const SemiCircleGauge = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = colors.primary,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  const angle = Math.PI - (progress / 100) * Math.PI;
  const dotX = center + radius * Math.cos(angle);
  const dotY = center - radius * Math.sin(angle);

  return (
    <Svg width={size} height={size / 2 + 10}>
      <Path
        d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
        stroke={colors.gray[100]}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={progressOffset}
      />
      <Circle
        cx={dotX}
        cy={dotY}
        r={strokeWidth / 2 + 2}
        fill={color}
        stroke={colors.white}
        strokeWidth={2}
      />
    </Svg>
  );
};

// Mini trend line
const TrendLine = ({ type, color }: { type: 'up' | 'down'; color: string }) => (
  <Svg width={40} height={24}>
    <Path
      d={type === 'up'
        ? "M2 20 Q 10 18, 15 14 T 25 8 T 38 2"
        : "M2 4 Q 10 6, 15 10 T 25 16 T 38 22"}
      stroke={color}
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

// Mock Data - Türkçe
const activeProject = {
  name: 'Merkez Residence',
  location: 'Kadıköy, İstanbul',
  totalProgress: 68,
  budget: { total: 45000000, spent: 30600000 },
  timeline: { start: '15 Oca 2025', end: '30 Kas 2025', daysLeft: 142 },
  phases: [
    { name: 'Temel', progress: 100, status: 'completed' },
    { name: 'Kaba İnşaat', progress: 100, status: 'completed' },
    { name: 'Çatı', progress: 85, status: 'active' },
    { name: 'Dış Cephe', progress: 40, status: 'active' },
    { name: 'Tesisat', progress: 60, status: 'active' },
    { name: 'İç Mekan', progress: 20, status: 'pending' },
  ],
};

const todayStats = {
  workers: { total: 156, onSite: 142, absent: 14 },
  tasks: { total: 24, completed: 18, inProgress: 4, delayed: 2 },
  safety: { incidents: 0, inspections: 3, score: 98 },
  weather: { temp: 24, condition: 'sunny', humidity: 45, wind: 12 },
};

const upcomingTasks = [
  { id: '1', title: 'Çatı izolasyonu tamamlama', due: 'Bugün', priority: 'high', assignee: 'Ahmet Y.' },
  { id: '2', title: 'Elektrik tesisatı 3. kat', due: 'Yarın', priority: 'medium', assignee: 'Mehmet K.' },
  { id: '3', title: 'Dış cephe boyası başlangıç', due: '2 gün', priority: 'medium', assignee: 'Ali R.' },
  { id: '4', title: 'İSG denetimi hazırlık', due: '3 gün', priority: 'high', assignee: 'Fatma S.' },
];

const recentActivities = [
  { id: '1', user: 'Ahmet Yılmaz', action: 'Görev tamamladı', target: 'Beton döküm B Blok', time: '10 dk önce', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
  { id: '2', user: 'Zeynep Kaya', action: 'Malzeme talep etti', target: '500 torba çimento', time: '25 dk önce', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
  { id: '3', user: 'Mehmet Demir', action: 'Rapor yükledi', target: 'Haftalık ilerleme raporu', time: '1 saat önce', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80' },
  { id: '4', user: 'Can Özkan', action: 'İSG kontrolü tamamladı', target: 'A Blok güvenlik denetimi', time: '2 saat önce', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' },
];

const weeklyProgress = [
  { day: 'Pzt', value: 45 },
  { day: 'Sal', value: 62 },
  { day: 'Çar', value: 58 },
  { day: 'Per', value: 71 },
  { day: 'Cum', value: 68 },
  { day: 'Cmt', value: 42 },
  { day: 'Paz', value: 0 },
];

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('genel');
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('Bu Hafta');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const tabs = [
    { key: 'genel', label: 'Genel' },
    { key: 'proje', label: 'Proje' },
    { key: 'analiz', label: 'Analiz' },
  ];

  const periodOptions = ['Bugün', 'Bu Hafta', 'Bu Ay', 'Son 3 Ay', 'Bu Yıl'];

  const handleQuickStatPress = (type: string) => {
    switch (type) {
      case 'workers':
        navigation.navigate('Workforce');
        break;
      case 'completed':
      case 'inProgress':
      case 'delayed':
        navigation.navigate('Tasks');
        break;
    }
  };

  const handleViewProjectDetails = () => {
    navigation.navigate('Projects');
  };

  const handleSeeAllTasks = () => {
    navigation.navigate('Tasks');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'sun';
      case 'cloudy': return 'cloud';
      case 'rainy': return 'cloud-rain';
      default: return 'sun';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: colors.dangerLight, color: colors.danger };
      case 'medium': return { bg: colors.warningLight, color: colors.warning };
      default: return { bg: colors.gray[100], color: colors.gray[500] };
    }
  };

  const renderGenelTab = () => (
    <>
      {/* Greeting & Weather */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingLeft}>
          <Text style={styles.greetingText}>Günaydın! 👋</Text>
          <Text style={styles.dateText}>
            {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <View style={styles.weatherCard}>
          <Icon name={getWeatherIcon(todayStats.weather.condition)} size={24} color={colors.warning} />
          <Text style={styles.weatherTemp}>{todayStats.weather.temp}°C</Text>
        </View>
      </View>

      {/* Quick Stats Row */}
      <View style={styles.quickStatsRow}>
        <TouchableOpacity
          style={[styles.quickStatCard, { backgroundColor: colors.primaryLight }]}
          onPress={() => handleQuickStatPress('workers')}
        >
          <View style={styles.quickStatIcon}>
            <Icon name="users" size={18} color={colors.primary} />
          </View>
          <Text style={styles.quickStatValue}>{todayStats.workers.onSite}</Text>
          <Text style={styles.quickStatLabel}>Sahada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickStatCard, { backgroundColor: colors.successLight }]}
          onPress={() => handleQuickStatPress('completed')}
        >
          <View style={styles.quickStatIcon}>
            <Icon name="check-circle" size={18} color={colors.success} />
          </View>
          <Text style={styles.quickStatValue}>{todayStats.tasks.completed}</Text>
          <Text style={styles.quickStatLabel}>Tamamlanan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickStatCard, { backgroundColor: colors.warningLight }]}
          onPress={() => handleQuickStatPress('inProgress')}
        >
          <View style={styles.quickStatIcon}>
            <Icon name="clock" size={18} color={colors.warning} />
          </View>
          <Text style={styles.quickStatValue}>{todayStats.tasks.inProgress}</Text>
          <Text style={styles.quickStatLabel}>Devam Eden</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickStatCard, { backgroundColor: colors.dangerLight }]}
          onPress={() => handleQuickStatPress('delayed')}
        >
          <View style={styles.quickStatIcon}>
            <Icon name="alert-triangle" size={18} color={colors.danger} />
          </View>
          <Text style={styles.quickStatValue}>{todayStats.tasks.delayed}</Text>
          <Text style={styles.quickStatLabel}>Geciken</Text>
        </TouchableOpacity>
      </View>

      {/* Project Progress Card */}
      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View>
            <Text style={styles.projectName}>{activeProject.name}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={12} color={colors.gray[400]} />
              <Text style={styles.locationText}>{activeProject.location}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewProjectDetails}>
            <Text style={styles.viewAllText}>Detaylar</Text>
            <Icon name="chevron-right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRingContainer}>
            <ProgressRing progress={activeProject.totalProgress} size={100} strokeWidth={10} />
            <View style={styles.progressRingCenter}>
              <Text style={styles.progressRingValue}>{activeProject.totalProgress}%</Text>
              <Text style={styles.progressRingLabel}>İlerleme</Text>
            </View>
          </View>

          <View style={styles.progressDetails}>
            <View style={styles.progressDetailItem}>
              <Text style={styles.progressDetailLabel}>Kalan Süre</Text>
              <Text style={styles.progressDetailValue}>{activeProject.timeline.daysLeft} gün</Text>
            </View>
            <View style={styles.progressDetailItem}>
              <Text style={styles.progressDetailLabel}>Harcanan</Text>
              <Text style={styles.progressDetailValue}>{formatCurrency(activeProject.budget.spent)}</Text>
            </View>
            <View style={styles.progressDetailItem}>
              <Text style={styles.progressDetailLabel}>Bütçe</Text>
              <Text style={styles.progressDetailValue}>{formatCurrency(activeProject.budget.total)}</Text>
            </View>
          </View>
        </View>

        {/* Phase Progress */}
        <View style={styles.phasesContainer}>
          {activeProject.phases.slice(0, 4).map((phase, index) => (
            <View key={index} style={styles.phaseItem}>
              <View style={styles.phaseHeader}>
                <Text style={styles.phaseName}>{phase.name}</Text>
                <Text style={[styles.phaseProgress, phase.progress === 100 && { color: colors.success }]}>
                  {phase.progress}%
                </Text>
              </View>
              <View style={styles.phaseBar}>
                <View style={[
                  styles.phaseFill,
                  { width: `${phase.progress}%` },
                  phase.progress === 100 && { backgroundColor: colors.success }
                ]} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Upcoming Tasks */}
      <Card style={styles.tasksCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yaklaşan Görevler</Text>
          <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllTasks}>
            <Text style={styles.seeAllText}>Tümü</Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.map((task) => (
          <TouchableOpacity key={task.id} style={styles.taskItem} onPress={() => navigation.navigate('Tasks')}>
            <View style={[styles.taskPriorityDot, { backgroundColor: getPriorityStyle(task.priority).color }]} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskAssignee}>{task.assignee}</Text>
                <View style={styles.taskDueBadge}>
                  <Icon name="clock" size={10} color={colors.gray[500]} />
                  <Text style={styles.taskDue}>{task.due}</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={colors.gray[300]} />
          </TouchableOpacity>
        ))}
      </Card>

      {/* Safety Score */}
      <View style={styles.safetyRow}>
        <Card style={styles.safetyCard}>
          <View style={styles.safetyIconContainer}>
            <Icon name="shield" size={24} color={colors.success} />
          </View>
          <Text style={styles.safetyScore}>{todayStats.safety.score}</Text>
          <Text style={styles.safetyLabel}>İSG Puanı</Text>
        </Card>

        <Card style={styles.safetyCard}>
          <View style={[styles.safetyIconContainer, { backgroundColor: colors.infoLight }]}>
            <Icon name="clipboard" size={24} color={colors.info} />
          </View>
          <Text style={styles.safetyScore}>{todayStats.safety.inspections}</Text>
          <Text style={styles.safetyLabel}>Denetim</Text>
        </Card>

        <Card style={styles.safetyCard}>
          <View style={[styles.safetyIconContainer, { backgroundColor: todayStats.safety.incidents === 0 ? colors.successLight : colors.dangerLight }]}>
            <Icon name="alert-circle" size={24} color={todayStats.safety.incidents === 0 ? colors.success : colors.danger} />
          </View>
          <Text style={styles.safetyScore}>{todayStats.safety.incidents}</Text>
          <Text style={styles.safetyLabel}>Olay</Text>
        </Card>
      </View>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <TouchableOpacity onPress={() => setShowActivityModal(true)}>
            <Icon name="more-horizontal" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {recentActivities.map((activity, index) => (
          <View key={activity.id} style={[styles.activityItem, index === recentActivities.length - 1 && styles.activityItemLast]}>
            <Image source={{ uri: activity.avatar }} style={styles.activityAvatar} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>{activity.user}</Text>
                {' '}{activity.action}
              </Text>
              <Text style={styles.activityTarget}>{activity.target}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </Card>
    </>
  );

  const renderProjeTab = () => (
    <>
      {/* Project Image */}
      <Card style={styles.imageCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80' }}
          style={styles.projectImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.expandButton}>
            <Icon name="maximize-2" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Timeline Card */}
      <Card style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <View>
            <Text style={styles.timelineTitle}>Proje Takvimi</Text>
            <Text style={styles.timelineSubtitle}>{activeProject.timeline.start} - {activeProject.timeline.end}</Text>
          </View>
          <View style={styles.daysLeftBadge}>
            <Text style={styles.daysLeftValue}>{activeProject.timeline.daysLeft}</Text>
            <Text style={styles.daysLeftLabel}>gün kaldı</Text>
          </View>
        </View>

        <View style={styles.timelineBarContainer}>
          <View style={styles.timelineBar}>
            <View style={[styles.timelineFill, { width: `${activeProject.totalProgress}%` }]} />
          </View>
          <View style={[styles.timelineMarker, { left: `${activeProject.totalProgress}%` }]}>
            <View style={styles.markerDot} />
          </View>
        </View>

        <View style={styles.milestonesContainer}>
          <Text style={styles.milestonesTitle}>Aşamalar</Text>
          {activeProject.phases.map((phase, index) => (
            <View key={index} style={styles.milestoneItem}>
              <View style={[
                styles.milestoneIcon,
                phase.status === 'completed' && styles.milestoneCompleted,
                phase.status === 'active' && styles.milestoneActive,
              ]}>
                {phase.status === 'completed' ? (
                  <Icon name="check" size={12} color={colors.white} />
                ) : (
                  <Text style={styles.milestoneNumber}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneName}>{phase.name}</Text>
                <View style={styles.milestoneProgressBar}>
                  <View style={[styles.milestoneProgressFill, { width: `${phase.progress}%` }]} />
                </View>
              </View>
              <Text style={styles.milestonePercent}>{phase.progress}%</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Team on Site */}
      <Card style={styles.teamCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sahada Bugün</Text>
          <Text style={styles.teamCount}>{todayStats.workers.onSite} kişi</Text>
        </View>

        <View style={styles.teamAvatars}>
          {recentActivities.slice(0, 4).map((person, index) => (
            <Image
              key={index}
              source={{ uri: person.avatar }}
              style={[styles.teamAvatar, { marginLeft: index > 0 ? -12 : 0, zIndex: 4 - index }]}
            />
          ))}
          <View style={styles.moreAvatars}>
            <Text style={styles.moreAvatarsText}>+{todayStats.workers.onSite - 4}</Text>
          </View>
        </View>

        <View style={styles.teamStats}>
          <View style={styles.teamStatItem}>
            <Text style={styles.teamStatValue}>{todayStats.workers.onSite}</Text>
            <Text style={styles.teamStatLabel}>Mevcut</Text>
          </View>
          <View style={styles.teamStatDivider} />
          <View style={styles.teamStatItem}>
            <Text style={[styles.teamStatValue, { color: colors.danger }]}>{todayStats.workers.absent}</Text>
            <Text style={styles.teamStatLabel}>Yok</Text>
          </View>
          <View style={styles.teamStatDivider} />
          <View style={styles.teamStatItem}>
            <Text style={styles.teamStatValue}>{todayStats.workers.total}</Text>
            <Text style={styles.teamStatLabel}>Toplam</Text>
          </View>
        </View>
      </Card>
    </>
  );

  const renderAnalizTab = () => (
    <>
      {/* Weekly Progress Chart */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Haftalık İlerleme</Text>
            <Text style={styles.chartSubtitle}>Bu hafta %{Math.round(weeklyProgress.reduce((a, b) => a + b.value, 0) / 6)} ortalama</Text>
          </View>
          <TouchableOpacity style={styles.periodSelector} onPress={() => setShowPeriodModal(true)}>
            <Text style={styles.periodText}>{selectedPeriod}</Text>
            <Icon name="chevron-down" size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.barChart}>
          {weeklyProgress.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${item.value}%`,
                      backgroundColor: index === 4 ? colors.primary : colors.orange[200],
                    }
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, index === 4 && styles.barLabelActive]}>
                {item.day}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Budget Overview */}
      <Card style={styles.budgetCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bütçe Durumu</Text>
          <View style={styles.budgetBadge}>
            <Text style={styles.budgetBadgeText}>Normal</Text>
          </View>
        </View>

        <View style={styles.budgetProgress}>
          <SemiCircleGauge
            progress={(activeProject.budget.spent / activeProject.budget.total) * 100}
            size={160}
            strokeWidth={14}
            color={colors.chart.blue}
          />
          <View style={styles.budgetCenter}>
            <Text style={styles.budgetPercent}>
              {Math.round((activeProject.budget.spent / activeProject.budget.total) * 100)}%
            </Text>
            <Text style={styles.budgetLabel}>Kullanıldı</Text>
          </View>
        </View>

        <View style={styles.budgetDetails}>
          <View style={styles.budgetItem}>
            <View style={[styles.budgetDot, { backgroundColor: colors.chart.blue }]} />
            <Text style={styles.budgetItemLabel}>Harcanan</Text>
            <Text style={styles.budgetItemValue}>{formatCurrency(activeProject.budget.spent)}</Text>
          </View>
          <View style={styles.budgetItem}>
            <View style={[styles.budgetDot, { backgroundColor: colors.gray[200] }]} />
            <Text style={styles.budgetItemLabel}>Kalan</Text>
            <Text style={styles.budgetItemValue}>
              {formatCurrency(activeProject.budget.total - activeProject.budget.spent)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Performance Metrics */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Icon name="trending-up" size={20} color={colors.success} />
          <Text style={styles.metricValue}>+12%</Text>
          <Text style={styles.metricLabel}>Verimlilik</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Icon name="clock" size={20} color={colors.warning} />
          <Text style={styles.metricValue}>-3 gün</Text>
          <Text style={styles.metricLabel}>Takvim</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Icon name="dollar-sign" size={20} color={colors.info} />
          <Text style={styles.metricValue}>%68</Text>
          <Text style={styles.metricLabel}>Bütçe</Text>
        </Card>
      </View>

      {/* Resource Usage */}
      <Card style={styles.resourceCard}>
        <Text style={styles.sectionTitle}>Kaynak Kullanımı</Text>

        <View style={styles.resourceItem}>
          <View style={styles.resourceHeader}>
            <Icon name="users" size={16} color={colors.primary} />
            <Text style={styles.resourceName}>İş Gücü</Text>
            <Text style={styles.resourcePercent}>91%</Text>
          </View>
          <View style={styles.resourceBar}>
            <View style={[styles.resourceFill, { width: '91%', backgroundColor: colors.primary }]} />
          </View>
        </View>

        <View style={styles.resourceItem}>
          <View style={styles.resourceHeader}>
            <Icon name="truck" size={16} color={colors.info} />
            <Text style={styles.resourceName}>Ekipman</Text>
            <Text style={styles.resourcePercent}>78%</Text>
          </View>
          <View style={styles.resourceBar}>
            <View style={[styles.resourceFill, { width: '78%', backgroundColor: colors.info }]} />
          </View>
        </View>

        <View style={styles.resourceItem}>
          <View style={styles.resourceHeader}>
            <Icon name="package" size={16} color={colors.warning} />
            <Text style={styles.resourceName}>Malzeme</Text>
            <Text style={styles.resourcePercent}>65%</Text>
          </View>
          <View style={styles.resourceBar}>
            <View style={[styles.resourceFill, { width: '65%', backgroundColor: colors.warning }]} />
          </View>
        </View>
      </Card>
    </>
  );

  return (
    <View style={styles.container}>
      <Header
        title="İnşaat Pro"
        userImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
      />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {activeTab === 'genel' && renderGenelTab()}
        {activeTab === 'proje' && renderProjeTab()}
        {activeTab === 'analiz' && renderAnalizTab()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Period Selection Modal */}
      <Modal
        visible={showPeriodModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View style={styles.periodModalContainer}>
            <Text style={styles.periodModalTitle}>Dönem Seçin</Text>
            {periodOptions.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodOption,
                  selectedPeriod === period && styles.periodOptionActive
                ]}
                onPress={() => {
                  setSelectedPeriod(period);
                  setShowPeriodModal(false);
                }}
              >
                <Text style={[
                  styles.periodOptionText,
                  selectedPeriod === period && styles.periodOptionTextActive
                ]}>
                  {period}
                </Text>
                {selectedPeriod === period && (
                  <Icon name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Activity Options Modal */}
      <Modal
        visible={showActivityModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowActivityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActivityModal(false)}
        >
          <View style={styles.activityModalContainer}>
            <Text style={styles.activityModalTitle}>Aktiviteler</Text>
            <TouchableOpacity
              style={styles.activityModalOption}
              onPress={() => {
                setShowActivityModal(false);
                // Tüm aktiviteleri göster
              }}
            >
              <Icon name="list" size={18} color={colors.gray[600]} />
              <Text style={styles.activityModalOptionText}>Tümünü Görüntüle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityModalOption}
              onPress={() => {
                setShowActivityModal(false);
              }}
            >
              <Icon name="filter" size={18} color={colors.gray[600]} />
              <Text style={styles.activityModalOptionText}>Filtrele</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityModalOption}
              onPress={() => {
                setShowActivityModal(false);
              }}
            >
              <Icon name="bell" size={18} color={colors.gray[600]} />
              <Text style={styles.activityModalOptionText}>Bildirimleri Yönet</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },

  // Greeting & Weather
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  greetingLeft: {},
  greetingText: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  dateText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    ...shadows.sm,
  },
  weatherTemp: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
  },

  // Quick Stats
  quickStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  quickStatIcon: {
    marginBottom: spacing.xs,
  },
  quickStatValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  quickStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    marginTop: 2,
  },

  // Project Card
  projectCard: {
    padding: spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  projectName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressRingContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  progressRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  progressRingLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  progressDetails: {
    flex: 1,
    gap: spacing.sm,
  },
  progressDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  progressDetailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  phasesContainer: {
    gap: spacing.sm,
  },
  phaseItem: {},
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  phaseName: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  phaseProgress: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  phaseBar: {
    height: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  phaseFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  // Tasks Card
  tasksCard: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  seeAllButton: {},
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  taskPriorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
    marginBottom: 2,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  taskAssignee: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  taskDueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskDue: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },

  // Safety Row
  safetyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  safetyCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  safetyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  safetyScore: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  safetyLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },

  // Activity Card
  activityCard: {
    padding: spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  activityUser: {
    fontWeight: '600',
    color: colors.gray[800],
  },
  activityTarget: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 2,
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },

  // Project Tab - Image Card
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: borderRadius['2xl'],
  },
  projectImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Timeline Card
  timelineCard: {
    padding: spacing.lg,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  timelineTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  timelineSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  daysLeftBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  daysLeftValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  daysLeftLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
  },
  timelineBarContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  timelineBar: {
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
  },
  timelineFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  timelineMarker: {
    position: 'absolute',
    top: -4,
    marginLeft: -8,
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.sm,
  },
  milestonesContainer: {
    marginTop: spacing.md,
  },
  milestonesTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  milestoneIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  milestoneCompleted: {
    backgroundColor: colors.success,
  },
  milestoneActive: {
    backgroundColor: colors.primary,
  },
  milestoneNumber: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray[600],
  },
  milestoneContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  milestoneName: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    marginBottom: 4,
  },
  milestoneProgressBar: {
    height: 4,
    backgroundColor: colors.gray[100],
    borderRadius: 2,
  },
  milestoneProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  milestonePercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[600],
    width: 40,
    textAlign: 'right',
  },

  // Team Card
  teamCard: {
    padding: spacing.lg,
  },
  teamCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  teamAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  moreAvatars: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  moreAvatarsText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[600],
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  teamStatItem: {
    alignItems: 'center',
  },
  teamStatValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  teamStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  teamStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.gray[200],
  },

  // Chart Card
  chartCard: {
    padding: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  chartSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  periodText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: spacing.sm,
  },
  barLabelActive: {
    color: colors.gray[800],
    fontWeight: '600',
  },

  // Budget Card
  budgetCard: {
    padding: spacing.lg,
  },
  budgetBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  budgetBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.success,
  },
  budgetProgress: {
    alignItems: 'center',
    marginVertical: spacing.md,
    position: 'relative',
  },
  budgetCenter: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  budgetPercent: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  budgetLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  budgetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  budgetItemLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  budgetItemValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },

  // Metrics Row
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  metricValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },

  // Resource Card
  resourceCard: {
    padding: spacing.lg,
  },
  resourceItem: {
    marginTop: spacing.md,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  resourceName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    marginLeft: spacing.sm,
  },
  resourcePercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  resourceBar: {
    height: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  resourceFill: {
    height: '100%',
    borderRadius: 3,
  },

  bottomSpacing: {
    height: 100,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodModalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  periodModalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  periodOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  periodOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
  },
  periodOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  activityModalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  activityModalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  activityModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  activityModalOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
  },
});

export default DashboardScreen;
