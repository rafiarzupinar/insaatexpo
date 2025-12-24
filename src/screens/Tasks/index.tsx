import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

// Mock tasks data - İnşaat görevleri
const mockTasks = [
  {
    id: '1',
    title: 'Proje Onayı',
    phase: 'Proje & İzinler',
    assignee: 'Ahmet Yılmaz',
    startDate: '2025-01-01',
    endDate: '2025-01-20',
    progress: 100,
    status: 'completed',
    priority: 'high',
    dependencies: [],
  },
  {
    id: '2',
    title: 'Hafriyat Kazısı',
    phase: 'Hafriyat',
    assignee: 'Mehmet Kaya',
    startDate: '2025-01-21',
    endDate: '2025-02-15',
    progress: 100,
    status: 'completed',
    priority: 'high',
    dependencies: ['1'],
  },
  {
    id: '3',
    title: 'Temel Betonu',
    phase: 'Temel',
    assignee: 'Ali Demir',
    startDate: '2025-02-16',
    endDate: '2025-03-15',
    progress: 85,
    status: 'inProgress',
    priority: 'high',
    dependencies: ['2'],
  },
  {
    id: '4',
    title: 'Bodrum Kalıp',
    phase: 'Bodrum Kat',
    assignee: 'Hasan Eren',
    startDate: '2025-03-16',
    endDate: '2025-04-20',
    progress: 45,
    status: 'inProgress',
    priority: 'medium',
    dependencies: ['3'],
  },
  {
    id: '5',
    title: 'Kolon & Kiriş',
    phase: 'Taşıyıcı Sistem',
    assignee: 'Fatih Bulut',
    startDate: '2025-04-21',
    endDate: '2025-06-15',
    progress: 20,
    status: 'inProgress',
    priority: 'high',
    dependencies: ['4'],
  },
  {
    id: '6',
    title: 'Duvar Örme',
    phase: 'Kaba İnşaat',
    assignee: 'Emre Sarı',
    startDate: '2025-06-16',
    endDate: '2025-08-01',
    progress: 0,
    status: 'pending',
    priority: 'medium',
    dependencies: ['5'],
  },
  {
    id: '7',
    title: 'Çatı Montajı',
    phase: 'Çatı',
    assignee: 'Can Özkan',
    startDate: '2025-08-02',
    endDate: '2025-09-15',
    progress: 0,
    status: 'pending',
    priority: 'medium',
    dependencies: ['6'],
  },
  {
    id: '8',
    title: 'Elektrik Tesisatı',
    phase: 'Elektrik',
    assignee: 'Burak Aydın',
    startDate: '2025-07-01',
    endDate: '2025-10-01',
    progress: 10,
    status: 'inProgress',
    priority: 'high',
    dependencies: ['5'],
  },
];

// Gantt Chart SVG Component
const GanttChart = ({ tasks, onTaskPress }: { tasks: typeof mockTasks; onTaskPress: (task: typeof mockTasks[0]) => void }) => {
  const chartWidth = screenWidth - spacing.sm * 2;
  const rowHeight = 44;
  const headerHeight = 50;
  const labelWidth = 100;
  const barAreaWidth = chartWidth - labelWidth;

  // Calculate date range
  const projectStart = new Date('2025-01-01');
  const projectEnd = new Date('2025-10-01');
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));

  const months = [
    { name: 'Oca', start: 0 },
    { name: 'Şub', start: 31 },
    { name: 'Mar', start: 59 },
    { name: 'Nis', start: 90 },
    { name: 'May', start: 120 },
    { name: 'Haz', start: 151 },
    { name: 'Tem', start: 181 },
    { name: 'Ağu', start: 212 },
    { name: 'Eyl', start: 243 },
    { name: 'Eki', start: 273 },
  ];

  const getStatusColor = (status: string, opacity = 1) => {
    const baseColors: { [key: string]: string } = {
      completed: colors.success,
      inProgress: colors.primary,
      delayed: colors.danger,
      pending: colors.gray[300],
    };
    return baseColors[status] || colors.gray[300];
  };

  const chartHeight = headerHeight + tasks.length * rowHeight + 20;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Background grid */}
        {months.map((month, i) => {
          const x = labelWidth + (month.start / totalDays) * barAreaWidth;
          return (
            <G key={i}>
              <Line
                x1={x}
                y1={headerHeight}
                x2={x}
                y2={chartHeight}
                stroke={colors.gray[100]}
                strokeWidth={1}
              />
              <SvgText
                x={x + 15}
                y={30}
                fontSize={11}
                fill={colors.gray[500]}
                fontWeight="500"
              >
                {month.name}
              </SvgText>
            </G>
          );
        })}

        {/* Today line */}
        {(() => {
          const today = new Date();
          const todayOffset = Math.ceil((today.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
          const todayX = labelWidth + (todayOffset / totalDays) * barAreaWidth;
          if (todayX > labelWidth && todayX < chartWidth) {
            return (
              <Line
                x1={todayX}
                y1={headerHeight}
                x2={todayX}
                y2={chartHeight}
                stroke={colors.danger}
                strokeWidth={2}
                strokeDasharray="4,4"
              />
            );
          }
          return null;
        })()}

        {/* Task rows */}
        {tasks.map((task, index) => {
          const y = headerHeight + index * rowHeight;
          const taskStart = new Date(task.startDate);
          const taskEnd = new Date(task.endDate);
          const startOffset = Math.max(0, Math.ceil((taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)));
          const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));

          const barX = labelWidth + (startOffset / totalDays) * barAreaWidth;
          const barWidth = Math.max(20, (duration / totalDays) * barAreaWidth);
          const progressWidth = (task.progress / 100) * barWidth;

          return (
            <G key={task.id} onPress={() => onTaskPress(task)}>
              {/* Row background */}
              <Rect
                x={0}
                y={y}
                width={chartWidth}
                height={rowHeight}
                fill={index % 2 === 0 ? colors.white : colors.gray[50]}
              />

              {/* Task label */}
              <SvgText
                x={8}
                y={y + rowHeight / 2 + 4}
                fontSize={11}
                fill={colors.gray[700]}
                fontWeight="500"
              >
                {task.title.length > 12 ? task.title.substring(0, 12) + '...' : task.title}
              </SvgText>

              {/* Task bar background */}
              <Rect
                x={barX}
                y={y + 10}
                width={barWidth}
                height={rowHeight - 20}
                rx={4}
                fill={getStatusColor(task.status)}
                opacity={0.2}
              />

              {/* Task bar progress */}
              <Rect
                x={barX}
                y={y + 10}
                width={progressWidth}
                height={rowHeight - 20}
                rx={4}
                fill={getStatusColor(task.status)}
              />

              {/* Progress text */}
              {barWidth > 40 && (
                <SvgText
                  x={barX + barWidth / 2}
                  y={y + rowHeight / 2 + 4}
                  fontSize={10}
                  fill={task.progress > 50 ? colors.white : colors.gray[700]}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {task.progress}%
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </ScrollView>
  );
};

const TasksScreen = () => {
  const [activeTab, setActiveTab] = useState('gantt');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskEndDate, setNewTaskEndDate] = useState('');

  // Additional modal states
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'start' | 'end'>('start');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{ id: string; text: string; author: string; date: string }[]>([]);

  const handleEditTask = () => {
    setShowTaskModal(false);
    Alert.alert('Düzenleme', 'Görev düzenleme sayfası açılıyor...', [{ text: 'Tamam' }]);
  };

  const handleAddComment = () => {
    setShowCommentModal(true);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Kullanıcı',
      date: new Date().toLocaleDateString('tr-TR'),
    };
    setComments([...comments, newComment]);
    setComment('');
    Alert.alert('Başarılı', 'Yorum eklendi');
    setShowCommentModal(false);
  };

  const handleAddFile = () => {
    Alert.alert('Dosya Ekle', 'Dosya seçici açılıyor...', [
      { text: 'Kamera', onPress: () => Alert.alert('Kamera açılıyor') },
      { text: 'Galeri', onPress: () => Alert.alert('Galeri açılıyor') },
      { text: 'Dosya', onPress: () => Alert.alert('Dosya seçici açılıyor') },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  const openDatePicker = (type: 'start' | 'end') => {
    setDatePickerType(type);
    setShowDatePickerModal(true);
  };

  const selectDate = (date: string) => {
    if (datePickerType === 'start') {
      setNewTaskStartDate(date);
    } else {
      setNewTaskEndDate(date);
    }
    setShowDatePickerModal(false);
  };

  const tabs = [
    { key: 'gantt', label: 'Gantt' },
    { key: 'liste', label: 'Liste' },
    { key: 'kanban', label: 'Kanban' },
  ];

  const filters = [
    { id: 'all', label: 'Tümü', count: mockTasks.length },
    { id: 'inProgress', label: 'Devam', count: mockTasks.filter(t => t.status === 'inProgress').length },
    { id: 'pending', label: 'Bekleyen', count: mockTasks.filter(t => t.status === 'pending').length },
    { id: 'completed', label: 'Biten', count: mockTasks.filter(t => t.status === 'completed').length },
  ];

  const filteredTasks = activeFilter === 'all'
    ? mockTasks
    : mockTasks.filter(t => t.status === activeFilter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: colors.successLight, color: colors.success, label: 'Tamamlandı' };
      case 'inProgress': return { bg: colors.primaryLight, color: colors.primary, label: 'Devam Ediyor' };
      case 'pending': return { bg: colors.gray[100], color: colors.gray[500], label: 'Bekliyor' };
      case 'delayed': return { bg: colors.dangerLight, color: colors.danger, label: 'Gecikmiş' };
      default: return { bg: colors.gray[100], color: colors.gray[500], label: status };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return { color: colors.danger, label: 'Yüksek' };
      case 'medium': return { color: colors.warning, label: 'Orta' };
      case 'low': return { color: colors.success, label: 'Düşük' };
      default: return { color: colors.gray[400], label: priority };
    }
  };

  const openTaskDetail = (task: typeof mockTasks[0]) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Task stats
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'inProgress').length;
  const overallProgress = Math.round(mockTasks.reduce((acc, t) => acc + t.progress, 0) / totalTasks);

  const renderGanttView = () => (
    <View style={styles.ganttWrapper}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Biten</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{inProgressTasks}</Text>
          <Text style={styles.statLabel}>Devam</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{overallProgress}%</Text>
          <Text style={styles.statLabel}>İlerleme</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Tamamlanan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Devam Eden</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.gray[300] }]} />
          <Text style={styles.legendText}>Bekleyen</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDotLine, { borderColor: colors.danger }]} />
          <Text style={styles.legendText}>Bugün</Text>
        </View>
      </View>

      {/* Gantt Chart */}
      <Card style={styles.ganttCard}>
        <GanttChart tasks={filteredTasks} onTaskPress={openTaskDetail} />
      </Card>
    </View>
  );

  const renderListView = () => (
    <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
      {filteredTasks.map((task) => {
        const statusStyle = getStatusStyle(task.status);
        const priorityStyle = getPriorityStyle(task.priority);

        return (
          <TouchableOpacity key={task.id} onPress={() => openTaskDetail(task)}>
            <Card style={styles.taskCard}>
              <View style={styles.taskCardHeader}>
                <View style={styles.taskTitleRow}>
                  <View style={[styles.priorityIndicator, { backgroundColor: priorityStyle.color }]} />
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
                </View>
              </View>

              <Text style={styles.taskPhase}>{task.phase}</Text>

              <View style={styles.taskMeta}>
                <View style={styles.metaItem}>
                  <Icon name="user" size={12} color={colors.gray[400]} />
                  <Text style={styles.metaText}>{task.assignee}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={12} color={colors.gray[400]} />
                  <Text style={styles.metaText}>{task.startDate} - {task.endDate}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{task.progress}%</Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderKanbanView = () => {
    const columns = [
      { id: 'pending', title: 'Bekleyen', tasks: mockTasks.filter(t => t.status === 'pending') },
      { id: 'inProgress', title: 'Devam Eden', tasks: mockTasks.filter(t => t.status === 'inProgress') },
      { id: 'completed', title: 'Tamamlanan', tasks: mockTasks.filter(t => t.status === 'completed') },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kanbanContainer}>
        {columns.map((column) => (
          <View key={column.id} style={styles.kanbanColumn}>
            <View style={styles.kanbanHeader}>
              <Text style={styles.kanbanTitle}>{column.title}</Text>
              <View style={styles.kanbanCount}>
                <Text style={styles.kanbanCountText}>{column.tasks.length}</Text>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {column.tasks.map((task) => {
                const priorityStyle = getPriorityStyle(task.priority);
                return (
                  <TouchableOpacity key={task.id} onPress={() => openTaskDetail(task)}>
                    <Card style={styles.kanbanCard}>
                      <View style={styles.kanbanCardHeader}>
                        <View style={[styles.priorityDot, { backgroundColor: priorityStyle.color }]} />
                        <Text style={styles.kanbanCardTitle}>{task.title}</Text>
                      </View>
                      <Text style={styles.kanbanCardPhase}>{task.phase}</Text>
                      <View style={styles.kanbanCardFooter}>
                        <View style={styles.kanbanAvatar}>
                          <Text style={styles.kanbanAvatarText}>{task.assignee.charAt(0)}</Text>
                        </View>
                        <View style={styles.kanbanProgress}>
                          <View style={[styles.kanbanProgressFill, { width: `${task.progress}%` }]} />
                        </View>
                        <Text style={styles.kanbanProgressText}>{task.progress}%</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderTaskModal = () => {
    if (!selectedTask) return null;
    const statusStyle = getStatusStyle(selectedTask.status);
    const priorityStyle = getPriorityStyle(selectedTask.priority);

    return (
      <Modal
        visible={showTaskModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={[styles.priorityIndicator, { backgroundColor: priorityStyle.color }]} />
              <View>
                <Text style={styles.modalTitle}>{selectedTask.title}</Text>
                <Text style={styles.modalSubtitle}>{selectedTask.phase}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTaskModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Status & Priority */}
            <View style={styles.modalSection}>
              <View style={styles.modalRow}>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Durum</Text>
                  <View style={[styles.statusBadgeLarge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusTextLarge, { color: statusStyle.color }]}>{statusStyle.label}</Text>
                  </View>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Öncelik</Text>
                  <View style={styles.priorityBadge}>
                    <View style={[styles.priorityDotLarge, { backgroundColor: priorityStyle.color }]} />
                    <Text style={styles.priorityText}>{priorityStyle.label}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>İlerleme</Text>
              <View style={styles.progressLarge}>
                <View style={styles.progressBarLarge}>
                  <View style={[styles.progressFillLarge, { width: `${selectedTask.progress}%` }]} />
                </View>
                <Text style={styles.progressTextLarge}>{selectedTask.progress}%</Text>
              </View>
            </View>

            {/* Dates */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Tarihler</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Icon name="play" size={16} color={colors.success} />
                  <View>
                    <Text style={styles.dateLabel}>Başlangıç</Text>
                    <Text style={styles.dateValue}>{selectedTask.startDate}</Text>
                  </View>
                </View>
                <View style={styles.dateItem}>
                  <Icon name="flag" size={16} color={colors.danger} />
                  <View>
                    <Text style={styles.dateLabel}>Bitiş</Text>
                    <Text style={styles.dateValue}>{selectedTask.endDate}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Assignee */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Atanan Kişi</Text>
              <View style={styles.assigneeRow}>
                <View style={styles.assigneeAvatar}>
                  <Text style={styles.assigneeAvatarText}>{selectedTask.assignee.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.assigneeName}>{selectedTask.assignee}</Text>
                  <Text style={styles.assigneeRole}>Proje Sorumlusu</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditTask}>
                <Icon name="edit-2" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddComment}>
                <Icon name="message-circle" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Yorum</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddFile}>
                <Icon name="paperclip" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Dosya</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            {comments.length > 0 && (
              <View style={styles.commentsSection}>
                <Text style={styles.modalSectionTitle}>Yorumlar ({comments.length})</Text>
                {comments.map((c) => (
                  <View key={c.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{c.author}</Text>
                      <Text style={styles.commentDate}>{c.date}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Görevler" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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

      {/* Content */}
      {activeTab === 'gantt' && renderGanttView()}
      {activeTab === 'liste' && renderListView()}
      {activeTab === 'kanban' && renderKanbanView()}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Icon name="plus" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Task Detail Modal */}
      {renderTaskModal()}

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Görev</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Task Title */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Görev Adı *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Görev adını girin"
                placeholderTextColor={colors.gray[400]}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
            </View>

            {/* Phase Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Aşama *</Text>
              <View style={styles.selectGrid}>
                {['Proje & İzinler', 'Hafriyat', 'Temel', 'Bodrum Kat', 'Taşıyıcı Sistem', 'Kaba İnşaat'].map((phase) => (
                  <TouchableOpacity
                    key={phase}
                    style={[styles.selectOption, newTaskPhase === phase && styles.selectOptionActive]}
                    onPress={() => setNewTaskPhase(phase)}
                  >
                    <Text style={[styles.selectOptionText, newTaskPhase === phase && styles.selectOptionTextActive]}>
                      {phase}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Priority */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Öncelik</Text>
              <View style={styles.priorityOptions}>
                <TouchableOpacity
                  style={[styles.priorityOption, newTaskPriority === 'high' && styles.priorityOptionActive]}
                  onPress={() => setNewTaskPriority('high')}
                >
                  <View style={[styles.priorityDotForm, { backgroundColor: colors.danger }]} />
                  <Text style={[styles.priorityOptionText, newTaskPriority === 'high' && styles.priorityOptionTextActive]}>
                    Yüksek
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.priorityOption, newTaskPriority === 'medium' && styles.priorityOptionActive]}
                  onPress={() => setNewTaskPriority('medium')}
                >
                  <View style={[styles.priorityDotForm, { backgroundColor: colors.warning }]} />
                  <Text style={[styles.priorityOptionText, newTaskPriority === 'medium' && styles.priorityOptionTextActive]}>
                    Orta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.priorityOption, newTaskPriority === 'low' && styles.priorityOptionActive]}
                  onPress={() => setNewTaskPriority('low')}
                >
                  <View style={[styles.priorityDotForm, { backgroundColor: colors.success }]} />
                  <Text style={[styles.priorityOptionText, newTaskPriority === 'low' && styles.priorityOptionTextActive]}>
                    Düşük
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dates */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.formLabel}>Başlangıç Tarihi</Text>
                <TouchableOpacity style={styles.dateInputBtn} onPress={() => openDatePicker('start')}>
                  <Icon name="calendar" size={16} color={colors.gray[400]} />
                  <Text style={styles.dateInputText}>
                    {newTaskStartDate || 'Tarih Seçin'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Bitiş Tarihi</Text>
                <TouchableOpacity style={styles.dateInputBtn} onPress={() => openDatePicker('end')}>
                  <Icon name="calendar" size={16} color={colors.gray[400]} />
                  <Text style={styles.dateInputText}>
                    {newTaskEndDate || 'Tarih Seçin'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Assignee */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Sorumlu Kişi</Text>
              <View style={styles.assigneeOptions}>
                {[
                  { name: 'Ahmet Yılmaz', short: 'Ahmet Y.', avatar: 'A' },
                  { name: 'Mehmet Kaya', short: 'Mehmet K.', avatar: 'M' },
                  { name: 'Ali Demir', short: 'Ali D.', avatar: 'A' },
                  { name: 'Hasan Eren', short: 'Hasan E.', avatar: 'H' },
                ].map((person) => (
                  <TouchableOpacity
                    key={person.name}
                    style={[styles.assigneeOption, newTaskAssignee === person.name && styles.assigneeOptionActive]}
                    onPress={() => setNewTaskAssignee(person.name)}
                  >
                    <View style={[styles.assigneeAvatarSmall, newTaskAssignee === person.name && styles.assigneeAvatarSmallActive]}>
                      <Text style={[styles.assigneeAvatarTextSmall, newTaskAssignee === person.name && styles.assigneeAvatarTextSmallActive]}>
                        {person.avatar}
                      </Text>
                    </View>
                    <Text style={[styles.assigneeOptionText, newTaskAssignee === person.name && styles.assigneeOptionTextActive]}>
                      {person.short}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Açıklama</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Görev açıklaması..."
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (!newTaskTitle || !newTaskPhase) && styles.submitButtonDisabled]}
              onPress={() => {
                // Form validation
                if (!newTaskTitle || !newTaskPhase) return;

                // Reset form
                setNewTaskTitle('');
                setNewTaskPhase('');
                setNewTaskPriority('medium');
                setNewTaskAssignee('');
                setNewTaskDescription('');
                setNewTaskStartDate('');
                setNewTaskEndDate('');
                setShowAddModal(false);
              }}
              disabled={!newTaskTitle || !newTaskPhase}
            >
              <Icon name="plus" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Görev Oluştur</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCommentModal(false)}
      >
        <TouchableOpacity
          style={styles.overlayModal}
          activeOpacity={1}
          onPress={() => setShowCommentModal(false)}
        >
          <View style={styles.commentModalContent}>
            <Text style={styles.commentModalTitle}>Yorum Ekle</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorumunuzu yazın..."
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.commentModalActions}>
              <TouchableOpacity
                style={styles.commentCancelBtn}
                onPress={() => setShowCommentModal(false)}
              >
                <Text style={styles.commentCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.commentSubmitBtn, !comment.trim() && styles.commentSubmitBtnDisabled]}
                onPress={submitComment}
                disabled={!comment.trim()}
              >
                <Text style={styles.commentSubmitText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePickerModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDatePickerModal(false)}
      >
        <TouchableOpacity
          style={styles.overlayModal}
          activeOpacity={1}
          onPress={() => setShowDatePickerModal(false)}
        >
          <View style={styles.datePickerContent}>
            <Text style={styles.datePickerTitle}>
              {datePickerType === 'start' ? 'Başlangıç Tarihi Seçin' : 'Bitiş Tarihi Seçin'}
            </Text>
            <ScrollView style={styles.datePickerScroll}>
              {[
                '2025-01-15', '2025-01-30', '2025-02-15', '2025-02-28',
                '2025-03-15', '2025-03-31', '2025-04-15', '2025-04-30',
                '2025-05-15', '2025-05-31', '2025-06-15', '2025-06-30',
              ].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={styles.dateOption}
                  onPress={() => selectDate(date)}
                >
                  <Icon name="calendar" size={16} color={colors.gray[400]} />
                  <Text style={styles.dateOptionText}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
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

  // Gantt View
  ganttWrapper: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
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
  legendRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendDotLine: {
    width: 12,
    height: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  legendText: {
    fontSize: 10,
    color: colors.gray[500],
  },
  ganttCard: {
    marginHorizontal: spacing.sm,
    marginTop: spacing.xs,
    padding: 0,
    overflow: 'hidden',
  },

  // List View
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  taskCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  priorityIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  taskTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskPhase: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginLeft: spacing.md + 4,
    marginBottom: spacing.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginLeft: spacing.md + 4,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md + 4,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray[600],
    width: 35,
  },

  // Kanban View
  kanbanContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  kanbanColumn: {
    width: 260,
    marginRight: spacing.sm,
  },
  kanbanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  kanbanTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  kanbanCount: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  kanbanCountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray[600],
  },
  kanbanCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  kanbanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  kanbanCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
    flex: 1,
  },
  kanbanCardPhase: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  kanbanCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  kanbanAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kanbanAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  kanbanProgress: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray[100],
    borderRadius: 2,
    overflow: 'hidden',
  },
  kanbanProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  kanbanProgressText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray[500],
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
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
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
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  modalRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  modalField: {
    flex: 1,
  },
  modalLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  statusBadgeLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusTextLarge: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  priorityDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[700],
  },
  progressLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBarLarge: {
    flex: 1,
    height: 10,
    backgroundColor: colors.gray[100],
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressTextLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[800],
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  dateItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  dateLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  dateValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  assigneeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeAvatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.white,
  },
  assigneeName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  assigneeRole: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: spacing.md,
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
    height: 120,
  },

  // Add Task Form Styles
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  formInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.gray[800],
  },
  formTextArea: {
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  selectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  selectOption: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  selectOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  selectOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  selectOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  priorityOptionActive: {
    backgroundColor: colors.white,
    borderColor: colors.gray[300],
    ...shadows.sm,
  },
  priorityDotForm: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  priorityOptionTextActive: {
    color: colors.gray[800],
    fontWeight: '600',
  },
  dateInputBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateInputText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  assigneeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  assigneeOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    minWidth: 70,
    borderWidth: 1,
    borderColor: colors.gray[50],
  },
  assigneeOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  assigneeAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  assigneeAvatarSmallActive: {
    backgroundColor: colors.primary,
  },
  assigneeAvatarTextSmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.white,
  },
  assigneeAvatarTextSmallActive: {
    color: colors.white,
  },
  assigneeOptionText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  assigneeOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    ...shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.white,
  },

  // Comments Section
  commentsSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  commentItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  commentAuthor: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  commentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  commentText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },

  // Overlay Modal
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  commentModalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  commentModalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  commentInput: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.gray[800],
    minHeight: 100,
    marginBottom: spacing.md,
  },
  commentModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  commentCancelBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  commentCancelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[600],
  },
  commentSubmitBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  commentSubmitBtnDisabled: {
    backgroundColor: colors.gray[300],
  },
  commentSubmitText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.white,
  },

  // Date Picker Modal
  datePickerContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    maxHeight: 400,
  },
  datePickerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  datePickerScroll: {
    maxHeight: 300,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  dateOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
  },
});

export default TasksScreen;
