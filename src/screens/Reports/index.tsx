import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Svg, { Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import { Header, Card, Badge, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Types
interface Report {
  id: string;
  title: string;
  type: 'progress' | 'financial' | 'safety' | 'delay' | 'weekly' | 'monthly';
  date: string;
  status: 'ready' | 'draft' | 'generating';
  project: string;
  summary?: string;
}

interface MetricData {
  label: string;
  value: number;
  color: string;
  icon: string;
}

// Initial Data
const initialReports: Report[] = [
  { id: '1', title: 'Haftalık İlerleme Raporu', type: 'progress', date: '2024-12-23', status: 'ready', project: 'Marina Bay Tower', summary: 'Bu hafta %12 ilerleme kaydedildi' },
  { id: '2', title: 'Aylık Finansal Rapor', type: 'financial', date: '2024-12-01', status: 'ready', project: 'Tüm Projeler', summary: 'Toplam harcama: ₺2.4M' },
  { id: '3', title: 'İSG Değerlendirme Raporu', type: 'safety', date: '2024-12-15', status: 'ready', project: 'Green Valley', summary: '3 risk alanı tespit edildi' },
  { id: '4', title: 'Gecikme Analiz Raporu', type: 'delay', date: '2024-12-18', status: 'draft', project: 'Marina Bay Tower', summary: '2 görevde gecikme' },
  { id: '5', title: 'Aralık Ayı Özet Raporu', type: 'monthly', date: '2024-12-20', status: 'generating', project: 'Tüm Projeler' },
];

const projectProgress = [
  { name: 'Marina Bay Tower', progress: 68, budget: 75, tasks: 45 },
  { name: 'Green Valley', progress: 42, budget: 38, tasks: 28 },
  { name: 'Sunset Heights', progress: 85, budget: 82, tasks: 52 },
  { name: 'City Center Plaza', progress: 23, budget: 20, tasks: 15 },
];

const monthlyData = [
  { month: 'Tem', value: 45 },
  { month: 'Ağu', value: 58 },
  { month: 'Eyl', value: 52 },
  { month: 'Eki', value: 68 },
  { month: 'Kas', value: 75 },
  { month: 'Ara', value: 82 },
];

const reportTypes = [
  { key: 'progress', label: 'İlerleme', icon: 'trending-up', color: colors.success },
  { key: 'financial', label: 'Finansal', icon: 'dollar-sign', color: colors.primary },
  { key: 'safety', label: 'İSG', icon: 'shield', color: colors.info },
  { key: 'delay', label: 'Gecikme', icon: 'clock', color: colors.warning },
  { key: 'weekly', label: 'Haftalık', icon: 'calendar', color: colors.success },
  { key: 'monthly', label: 'Aylık', icon: 'bar-chart-2', color: colors.primary },
];

const projectOptions = ['Tüm Projeler', 'Marina Bay Tower', 'Green Valley', 'Sunset Heights', 'City Center Plaza'];

// Simple Bar Chart Component
const SimpleBarChart = ({ data, height = 150 }: { data: { month: string; value: number }[], height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 30;
  const gap = 20;
  const chartWidth = data.length * (barWidth + gap);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={chartWidth} height={height + 30}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height;
          const x = index * (barWidth + gap) + gap / 2;
          const y = height - barHeight;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={colors.primary}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={height + 15}
                fontSize={10}
                fill={colors.gray[500]}
                textAnchor="middle"
              >
                {item.month}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                fontSize={10}
                fill={colors.gray[700]}
                textAnchor="middle"
                fontWeight="600"
              >
                {item.value}%
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

// Circular Progress Component
const CircularProgressChart = ({ progress, size = 80, color = colors.primary, label }: { progress: number; size?: number; color?: string; label: string }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
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
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2 + 5}
          fontSize={16}
          fill={colors.gray[800]}
          textAnchor="middle"
          fontWeight="700"
        >
          {progress}%
        </SvgText>
      </Svg>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
};

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState('ozet');
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Form states
  const [newReportType, setNewReportType] = useState<Report['type']>('progress');
  const [newReportProject, setNewReportProject] = useState('Tüm Projeler');

  const tabs = [
    { key: 'ozet', label: 'Özet' },
    { key: 'raporlar', label: 'Raporlar' },
    { key: 'analiz', label: 'Analiz' },
  ];

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'progress', label: 'İlerleme' },
    { id: 'financial', label: 'Finansal' },
    { id: 'safety', label: 'İSG' },
  ];

  const getTypeInfo = (type: string) => {
    return reportTypes.find(t => t.key === type) || reportTypes[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return colors.success;
      case 'draft': return colors.warning;
      case 'generating': return colors.info;
      default: return colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready': return 'Hazır';
      case 'draft': return 'Taslak';
      case 'generating': return 'Oluşturuluyor';
      default: return status;
    }
  };

  const createReport = () => {
    const typeInfo = getTypeInfo(newReportType);
    const newReport: Report = {
      id: Date.now().toString(),
      title: `${typeInfo.label} Raporu`,
      type: newReportType,
      date: new Date().toISOString().split('T')[0],
      status: 'generating',
      project: newReportProject,
    };

    setReports([newReport, ...reports]);
    setShowCreateModal(false);

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(r =>
        r.id === newReport.id ? { ...r, status: 'ready' as const, summary: 'Rapor başarıyla oluşturuldu' } : r
      ));
    }, 2000);

    Alert.alert('Bilgi', 'Rapor oluşturuluyor...');
  };

  const shareReport = async (report: Report) => {
    try {
      await Share.share({
        message: `${report.title}\nProje: ${report.project}\nTarih: ${report.date}\n\n${report.summary || 'Rapor detayları için uygulamayı açın.'}`,
        title: report.title,
      });
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım başarısız oldu');
    }
  };

  const downloadReport = (report: Report) => {
    Alert.alert('PDF İndirme', `${report.title} PDF olarak indiriliyor...`, [
      { text: 'Tamam' }
    ]);
  };

  const filteredReports = activeFilter === 'all'
    ? reports
    : reports.filter(r => r.type === activeFilter);

  // Stats
  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'ready').length;
  const overallProgress = Math.round(projectProgress.reduce((sum, p) => sum + p.progress, 0) / projectProgress.length);

  // Render Özet Tab
  const renderOzetTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Overall Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{overallProgress}%</Text>
          <Text style={styles.statLabel}>Genel İlerleme</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{readyReports}</Text>
          <Text style={styles.statLabel}>Hazır Rapor</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.infoLight }]}>
          <Text style={[styles.statValue, { color: colors.info }]}>{projectProgress.length}</Text>
          <Text style={styles.statLabel}>Aktif Proje</Text>
        </View>
      </View>

      {/* Progress Overview */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Proje İlerleme Özeti</Text>
        <View style={styles.progressCircles}>
          <CircularProgressChart progress={overallProgress} color={colors.primary} label="Genel" />
          <CircularProgressChart progress={68} color={colors.success} label="Bütçe" />
          <CircularProgressChart progress={75} color={colors.info} label="Zaman" />
        </View>
      </Card>

      {/* Monthly Progress Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Aylık İlerleme Trendi</Text>
        <SimpleBarChart data={monthlyData} height={120} />
      </Card>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Hızlı Rapor Oluştur</Text>
      <View style={styles.quickActions}>
        {reportTypes.slice(0, 4).map((type) => (
          <TouchableOpacity
            key={type.key}
            style={styles.quickActionBtn}
            onPress={() => {
              setNewReportType(type.key as Report['type']);
              setShowCreateModal(true);
            }}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: type.color + '20' }]}>
              <Icon name={type.icon as any} size={20} color={type.color} />
            </View>
            <Text style={styles.quickActionText}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Reports */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son Raporlar</Text>
        <TouchableOpacity onPress={() => setActiveTab('raporlar')}>
          <Text style={styles.seeAllText}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>

      {reports.slice(0, 3).map((report) => {
        const typeInfo = getTypeInfo(report.type);
        return (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCardCompact}
            onPress={() => {
              setSelectedReport(report);
              setShowReportDetailModal(true);
            }}
          >
            <View style={[styles.reportIconSmall, { backgroundColor: typeInfo.color + '20' }]}>
              <Icon name={typeInfo.icon as any} size={16} color={typeInfo.color} />
            </View>
            <View style={styles.reportInfoCompact}>
              <Text style={styles.reportTitleCompact}>{report.title}</Text>
              <Text style={styles.reportDateCompact}>{report.project} • {report.date}</Text>
            </View>
            <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(report.status) + '20' }]}>
              <Text style={[styles.statusTextSmall, { color: getStatusColor(report.status) }]}>
                {getStatusLabel(report.status)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Raporlar Tab
  const renderRaporlarTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterBtn, activeFilter === filter.id && styles.filterBtnActive]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[styles.filterBtnText, activeFilter === filter.id && styles.filterBtnTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      {filteredReports.map((report) => {
        const typeInfo = getTypeInfo(report.type);
        return (
          <Card key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: typeInfo.color + '20' }]}>
                <Icon name={typeInfo.icon as any} size={22} color={typeInfo.color} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportMeta}>{report.project} • {report.date}</Text>
                {report.summary && (
                  <Text style={styles.reportSummary}>{report.summary}</Text>
                )}
              </View>
            </View>

            <View style={styles.reportFooter}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                  {getStatusLabel(report.status)}
                </Text>
              </View>

              {report.status === 'ready' && (
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={styles.reportActionBtn}
                    onPress={() => {
                      setSelectedReport(report);
                      setShowReportDetailModal(true);
                    }}
                  >
                    <Icon name="eye" size={16} color={colors.gray[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportActionBtn}
                    onPress={() => downloadReport(report)}
                  >
                    <Icon name="download" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportActionBtn}
                    onPress={() => shareReport(report)}
                  >
                    <Icon name="share-2" size={16} color={colors.info} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Card>
        );
      })}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Analiz Tab
  const renderAnalizTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Project Comparison */}
      <Card style={styles.analysisCard}>
        <Text style={styles.sectionTitle}>Proje Karşılaştırması</Text>
        {projectProgress.map((project, index) => (
          <View key={index} style={styles.projectRow}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectStats}>{project.tasks} görev</Text>
            </View>
            <View style={styles.projectBars}>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${project.progress}%`, backgroundColor: colors.primary }]} />
              </View>
              <Text style={styles.progressPercent}>{project.progress}%</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Key Metrics */}
      <Text style={styles.sectionTitle}>Temel Metrikler</Text>
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.successLight }]}>
            <Icon name="check-circle" size={20} color={colors.success} />
          </View>
          <Text style={styles.metricValue}>140</Text>
          <Text style={styles.metricLabel}>Tamamlanan Görev</Text>
        </Card>
        <Card style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.warningLight }]}>
            <Icon name="clock" size={20} color={colors.warning} />
          </View>
          <Text style={styles.metricValue}>28</Text>
          <Text style={styles.metricLabel}>Devam Eden</Text>
        </Card>
        <Card style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.dangerLight }]}>
            <Icon name="alert-triangle" size={20} color={colors.danger} />
          </View>
          <Text style={styles.metricValue}>5</Text>
          <Text style={styles.metricLabel}>Geciken</Text>
        </Card>
        <Card style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.infoLight }]}>
            <Icon name="users" size={20} color={colors.info} />
          </View>
          <Text style={styles.metricValue}>42</Text>
          <Text style={styles.metricLabel}>Aktif Personel</Text>
        </Card>
      </View>

      {/* Budget Analysis */}
      <Card style={styles.analysisCard}>
        <Text style={styles.sectionTitle}>Bütçe Analizi</Text>
        <View style={styles.budgetRow}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Toplam Bütçe</Text>
            <Text style={styles.budgetValue}>₺15.000.000</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Harcanan</Text>
            <Text style={[styles.budgetValue, { color: colors.danger }]}>₺9.750.000</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Kalan</Text>
            <Text style={[styles.budgetValue, { color: colors.success }]}>₺5.250.000</Text>
          </View>
        </View>
        <View style={styles.budgetBar}>
          <View style={[styles.budgetBarFill, { width: '65%' }]} />
        </View>
        <Text style={styles.budgetPercent}>%65 kullanıldı</Text>
      </Card>

      {/* Export Options */}
      <Card style={styles.exportCard}>
        <Text style={styles.sectionTitle}>Rapor Dışa Aktar</Text>
        <View style={styles.exportButtons}>
          <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('PDF', 'Tüm raporlar PDF olarak dışa aktarılıyor...')}>
            <Icon name="file-text" size={20} color={colors.danger} />
            <Text style={styles.exportBtnText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Excel', 'Veriler Excel olarak dışa aktarılıyor...')}>
            <Icon name="grid" size={20} color={colors.success} />
            <Text style={styles.exportBtnText}>Excel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn} onPress={() => shareReport(reports[0])}>
            <Icon name="share-2" size={20} color={colors.info} />
            <Text style={styles.exportBtnText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="Raporlar & Analiz" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'ozet' && renderOzetTab()}
      {activeTab === 'raporlar' && renderRaporlarTab()}
      {activeTab === 'analiz' && renderAnalizTab()}

      {/* Create Report Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rapor Oluştur</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Rapor Türü *</Text>
                <View style={styles.typeOptions}>
                  {reportTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[styles.typeOption, newReportType === type.key && { backgroundColor: type.color + '20', borderColor: type.color }]}
                      onPress={() => setNewReportType(type.key as Report['type'])}
                    >
                      <Icon name={type.icon as any} size={20} color={newReportType === type.key ? type.color : colors.gray[500]} />
                      <Text style={[styles.typeOptionText, newReportType === type.key && { color: type.color }]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Proje *</Text>
                <View style={styles.projectOptions}>
                  {projectOptions.map((project) => (
                    <TouchableOpacity
                      key={project}
                      style={[styles.projectOption, newReportProject === project && styles.projectOptionActive]}
                      onPress={() => setNewReportProject(project)}
                    >
                      <Text style={[styles.projectOptionText, newReportProject === project && styles.projectOptionTextActive]}>
                        {project}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={createReport}>
                <Icon name="file-plus" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Rapor Oluştur</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Report Detail Modal */}
      <Modal visible={showReportDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rapor Detayı</Text>
              <TouchableOpacity onPress={() => setShowReportDetailModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {selectedReport && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <View style={[styles.detailIcon, { backgroundColor: getTypeInfo(selectedReport.type).color + '20' }]}>
                    <Icon name={getTypeInfo(selectedReport.type).icon as any} size={28} color={getTypeInfo(selectedReport.type).color} />
                  </View>
                  <Text style={styles.detailTitle}>{selectedReport.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                      {getStatusLabel(selectedReport.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Icon name="folder" size={16} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Proje</Text>
                    <Text style={styles.detailValue}>{selectedReport.project}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Tarih</Text>
                    <Text style={styles.detailValue}>{selectedReport.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="tag" size={16} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Tür</Text>
                    <Text style={styles.detailValue}>{getTypeInfo(selectedReport.type).label}</Text>
                  </View>
                </View>

                {selectedReport.summary && (
                  <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Özet</Text>
                    <Text style={styles.summaryText}>{selectedReport.summary}</Text>
                  </View>
                )}

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.detailActionBtn, { backgroundColor: colors.primaryLight }]}
                    onPress={() => downloadReport(selectedReport)}
                  >
                    <Icon name="download" size={18} color={colors.primary} />
                    <Text style={[styles.detailActionText, { color: colors.primary }]}>PDF İndir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.detailActionBtn, { backgroundColor: colors.infoLight }]}
                    onPress={() => shareReport(selectedReport)}
                  >
                    <Icon name="share-2" size={18} color={colors.info} />
                    <Text style={[styles.detailActionText, { color: colors.info }]}>Paylaş</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
        <Icon name="plus" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    flex: 1,
    padding: spacing.md,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    marginTop: 2,
  },

  // Chart Card
  chartCard: {
    marginBottom: spacing.md,
  },
  progressCircles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.sm,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[700],
    fontWeight: '500',
  },

  // Compact Report Card
  reportCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  reportIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  reportInfoCompact: {
    flex: 1,
  },
  reportTitleCompact: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  reportDateCompact: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 2,
  },
  statusBadgeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: colors.white,
  },

  // Report Card
  reportCard: {
    marginBottom: spacing.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  reportMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: 2,
  },
  reportSummary: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reportActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Analysis
  analysisCard: {
    marginBottom: spacing.md,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  projectInfo: {
    width: 120,
  },
  projectName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  projectStats: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  projectBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    width: 40,
    textAlign: 'right',
  },

  // Metrics
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
    textAlign: 'center',
  },

  // Budget
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.gray[800],
  },
  budgetBar: {
    height: 10,
    backgroundColor: colors.gray[100],
    borderRadius: 5,
    overflow: 'hidden',
  },
  budgetBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  budgetPercent: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Export
  exportCard: {
    marginBottom: spacing.md,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  exportBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  exportBtnText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    fontWeight: '600',
    marginTop: spacing.xs,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },

  // Form
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    width: '30%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  typeOptionText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  projectOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  projectOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  projectOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  projectOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  projectOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
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
  submitBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.white,
  },

  // Detail Modal
  detailHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  detailIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  detailTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[800],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  detailSection: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  detailLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginLeft: spacing.sm,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  summarySection: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  summaryText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },
  detailActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  detailActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
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
});

export default ReportsScreen;
