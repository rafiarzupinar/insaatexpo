import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Types
interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  title: string;
  date: string;
  status: 'pass' | 'partialPass' | 'fail' | 'pending';
  items: ChecklistItem[];
  inspector: string;
  project: string;
}

interface Incident {
  id: string;
  type: 'nearMiss' | 'hazard' | 'accident' | 'injury';
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  location: string;
  reporter: string;
}

interface RiskArea {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  project: string;
  actions: string[];
  resolved: boolean;
}

// Initial Data
const initialChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Günlük İSG Kontrolü',
    date: '2024-12-23',
    status: 'pass',
    inspector: 'Ahmet Yılmaz',
    project: 'Marina Bay Tower',
    items: [
      { id: '1', text: 'Koruyucu ekipman kontrolü', checked: true },
      { id: '2', text: 'İskele güvenliği', checked: true },
      { id: '3', text: 'Elektrik tesisatı', checked: true },
      { id: '4', text: 'Yangın söndürücüler', checked: true },
      { id: '5', text: 'İlk yardım malzemeleri', checked: true },
    ],
  },
  {
    id: '2',
    title: 'İskele Güvenlik Kontrolü',
    date: '2024-12-22',
    status: 'partialPass',
    inspector: 'Mehmet Kaya',
    project: 'Green Valley',
    items: [
      { id: '1', text: 'İskele bağlantıları', checked: true },
      { id: '2', text: 'Korkuluklar', checked: false },
      { id: '3', text: 'Platform sağlamlığı', checked: true },
      { id: '4', text: 'Güvenlik ağları', checked: true },
    ],
  },
  {
    id: '3',
    title: 'Elektrik Güvenlik Kontrolü',
    date: '2024-12-21',
    status: 'fail',
    inspector: 'Ali Demir',
    project: 'Marina Bay Tower',
    items: [
      { id: '1', text: 'Kablo izolasyonu', checked: false },
      { id: '2', text: 'Topraklama', checked: true },
      { id: '3', text: 'Sigorta kutusu', checked: false },
      { id: '4', text: 'Açık kablo yok', checked: false },
    ],
  },
];

const initialIncidents: Incident[] = [
  {
    id: '1',
    type: 'nearMiss',
    description: 'İskele üzerinden malzeme düşmesi',
    date: '2024-12-20',
    severity: 'medium',
    status: 'resolved',
    location: 'A Blok 5. Kat',
    reporter: 'Hasan Eren',
  },
  {
    id: '2',
    type: 'hazard',
    description: 'Elektrik kablosu açıkta',
    date: '2024-12-19',
    severity: 'high',
    status: 'investigating',
    location: 'B Blok Giriş',
    reporter: 'Fatih Öz',
  },
  {
    id: '3',
    type: 'injury',
    description: 'Küçük kesik yaralanma',
    date: '2024-12-18',
    severity: 'low',
    status: 'resolved',
    location: 'Malzeme Deposu',
    reporter: 'Mehmet Kaya',
  },
];

const initialRiskAreas: RiskArea[] = [
  {
    id: '1',
    name: 'A Blok 5. Kat',
    level: 'high',
    description: 'Korkuluk eksik, düşme riski mevcut',
    project: 'Marina Bay Tower',
    actions: ['Geçici korkuluk kur', 'Uyarı levhası koy'],
    resolved: false,
  },
  {
    id: '2',
    name: 'B Blok Giriş',
    level: 'medium',
    description: 'Kaygan zemin, kayma riski',
    project: 'Marina Bay Tower',
    actions: ['Kaymaz paspas koy', 'Uyarı levhası koy'],
    resolved: false,
  },
  {
    id: '3',
    name: 'Malzeme Deposu',
    level: 'low',
    description: 'Aydınlatma yetersiz',
    project: 'Green Valley',
    actions: ['Ek aydınlatma ekle'],
    resolved: true,
  },
];

const checklistTemplates = [
  'Günlük İSG Kontrolü',
  'İskele Güvenlik Kontrolü',
  'Elektrik Güvenlik Kontrolü',
  'Yangın Güvenliği Kontrolü',
  'KKD Kontrolü',
  'Makine Güvenliği Kontrolü',
];

const incidentTypes: { key: string; label: string; icon: 'alert-triangle' | 'alert-octagon' | 'x-circle' | 'activity'; color: string }[] = [
  { key: 'nearMiss', label: 'Ramak Kala', icon: 'alert-triangle', color: colors.warning },
  { key: 'hazard', label: 'Tehlike', icon: 'alert-octagon', color: colors.danger },
  { key: 'accident', label: 'Kaza', icon: 'x-circle', color: colors.danger },
  { key: 'injury', label: 'Yaralanma', icon: 'activity', color: colors.danger },
];

const severityOptions = [
  { key: 'low', label: 'Düşük', color: colors.success },
  { key: 'medium', label: 'Orta', color: colors.warning },
  { key: 'high', label: 'Yüksek', color: colors.danger },
  { key: 'critical', label: 'Kritik', color: '#8B0000' },
];

const projectOptions = ['Marina Bay Tower', 'Green Valley', 'Sunset Heights', 'City Center Plaza'];

const SafetyScreen = () => {
  const [activeTab, setActiveTab] = useState('kontrol');
  const [checklists, setChecklists] = useState<Checklist[]>(initialChecklists);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>(initialRiskAreas);

  // Modal states
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showChecklistDetailModal, setShowChecklistDetailModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);

  // Form states
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistProject, setNewChecklistProject] = useState('');
  const [newIncidentType, setNewIncidentType] = useState<Incident['type']>('nearMiss');
  const [newIncidentDescription, setNewIncidentDescription] = useState('');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<Incident['severity']>('medium');
  const [newIncidentLocation, setNewIncidentLocation] = useState('');
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskDescription, setNewRiskDescription] = useState('');
  const [newRiskLevel, setNewRiskLevel] = useState<RiskArea['level']>('medium');
  const [newRiskProject, setNewRiskProject] = useState('');

  const tabs = [
    { key: 'kontrol', label: 'Kontroller' },
    { key: 'olay', label: 'Olaylar' },
    { key: 'risk', label: 'Riskler' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return colors.success;
      case 'partialPass': return colors.warning;
      case 'fail': return colors.danger;
      case 'pending': return colors.gray[400];
      case 'resolved': return colors.success;
      case 'investigating': return colors.warning;
      case 'open': return colors.danger;
      default: return colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pass': return 'Başarılı';
      case 'partialPass': return 'Kısmi';
      case 'fail': return 'Başarısız';
      case 'pending': return 'Bekliyor';
      case 'resolved': return 'Çözüldü';
      case 'investigating': return 'İnceleniyor';
      case 'open': return 'Açık';
      default: return status;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return '#8B0000';
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray[500];
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return level;
    }
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        const updatedItems = cl.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        const checkedCount = updatedItems.filter(i => i.checked).length;
        const totalCount = updatedItems.length;
        let newStatus: Checklist['status'] = 'pending';
        if (checkedCount === totalCount) newStatus = 'pass';
        else if (checkedCount > 0) newStatus = 'partialPass';
        else newStatus = 'fail';

        return { ...cl, items: updatedItems, status: newStatus };
      }
      return cl;
    }));

    if (selectedChecklist?.id === checklistId) {
      const updated = checklists.find(cl => cl.id === checklistId);
      if (updated) {
        const updatedItems = updated.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        setSelectedChecklist({ ...updated, items: updatedItems });
      }
    }
  };

  const createChecklist = () => {
    if (!newChecklistTitle || !newChecklistProject) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const defaultItems: ChecklistItem[] = [
      { id: '1', text: 'Koruyucu ekipman kontrolü', checked: false },
      { id: '2', text: 'İş alanı güvenliği', checked: false },
      { id: '3', text: 'Elektrik tesisatı', checked: false },
      { id: '4', text: 'Yangın söndürücüler', checked: false },
      { id: '5', text: 'İlk yardım malzemeleri', checked: false },
    ];

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: newChecklistTitle,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: defaultItems,
      inspector: 'Kullanıcı',
      project: newChecklistProject,
    };

    setChecklists([newChecklist, ...checklists]);
    setNewChecklistTitle('');
    setNewChecklistProject('');
    setShowChecklistModal(false);
  };

  const reportIncident = () => {
    if (!newIncidentDescription || !newIncidentLocation) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newIncident: Incident = {
      id: Date.now().toString(),
      type: newIncidentType,
      description: newIncidentDescription,
      date: new Date().toISOString().split('T')[0],
      severity: newIncidentSeverity,
      status: 'open',
      location: newIncidentLocation,
      reporter: 'Kullanıcı',
    };

    setIncidents([newIncident, ...incidents]);
    setNewIncidentType('nearMiss');
    setNewIncidentDescription('');
    setNewIncidentSeverity('medium');
    setNewIncidentLocation('');
    setShowIncidentModal(false);
  };

  const addRiskArea = () => {
    if (!newRiskName || !newRiskDescription || !newRiskProject) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newRisk: RiskArea = {
      id: Date.now().toString(),
      name: newRiskName,
      level: newRiskLevel,
      description: newRiskDescription,
      project: newRiskProject,
      actions: [],
      resolved: false,
    };

    setRiskAreas([newRisk, ...riskAreas]);
    setNewRiskName('');
    setNewRiskDescription('');
    setNewRiskLevel('medium');
    setNewRiskProject('');
    setShowRiskModal(false);
  };

  const toggleRiskResolved = (riskId: string) => {
    setRiskAreas(riskAreas.map(r =>
      r.id === riskId ? { ...r, resolved: !r.resolved } : r
    ));
  };

  const updateIncidentStatus = (incidentId: string, status: Incident['status']) => {
    setIncidents(incidents.map(i =>
      i.id === incidentId ? { ...i, status } : i
    ));
  };

  // Stats
  const passedChecklists = checklists.filter(c => c.status === 'pass').length;
  const activeRisks = riskAreas.filter(r => !r.resolved).length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;

  // Render Kontrol Tab
  const renderKontrolTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Icon name="check-circle" size={20} color={colors.success} />
          <Text style={[styles.statValue, { color: colors.success }]}>{passedChecklists}</Text>
          <Text style={styles.statLabel}>Başarılı</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{checklists.filter(c => c.status === 'partialPass').length}</Text>
          <Text style={styles.statLabel}>Kısmi</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.dangerLight }]}>
          <Text style={[styles.statValue, { color: colors.danger }]}>{checklists.filter(c => c.status === 'fail').length}</Text>
          <Text style={styles.statLabel}>Başarısız</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <TouchableOpacity style={styles.quickActionCard} onPress={() => setShowChecklistModal(true)}>
        <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
          <Icon name="plus" size={20} color={colors.white} />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>Yeni Kontrol Başlat</Text>
          <Text style={styles.quickActionDesc}>Günlük güvenlik kontrolü yapın</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.gray[400]} />
      </TouchableOpacity>

      {/* Checklist List */}
      <Text style={styles.sectionTitle}>Son Kontroller</Text>
      {checklists.map((checklist) => {
        const checkedCount = checklist.items.filter(i => i.checked).length;
        const totalCount = checklist.items.length;

        return (
          <TouchableOpacity
            key={checklist.id}
            style={styles.checklistCard}
            onPress={() => {
              setSelectedChecklist(checklist);
              setShowChecklistDetailModal(true);
            }}
          >
            <View style={styles.checklistHeader}>
              <View>
                <Text style={styles.checklistTitle}>{checklist.title}</Text>
                <Text style={styles.checklistMeta}>{checklist.project} • {checklist.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(checklist.status) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(checklist.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(checklist.status) }]}>
                  {getStatusLabel(checklist.status)}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(checkedCount / totalCount) * 100}%`,
                      backgroundColor: getStatusColor(checklist.status),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{checkedCount}/{totalCount}</Text>
            </View>

            <View style={styles.checklistFooter}>
              <View style={styles.inspectorInfo}>
                <Icon name="user" size={12} color={colors.gray[400]} />
                <Text style={styles.inspectorText}>{checklist.inspector}</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Olay Tab
  const renderOlayTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.dangerLight }]}>
          <Icon name="alert-circle" size={20} color={colors.danger} />
          <Text style={[styles.statValue, { color: colors.danger }]}>{openIncidents}</Text>
          <Text style={styles.statLabel}>Açık</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{incidents.filter(i => i.status === 'investigating').length}</Text>
          <Text style={styles.statLabel}>İnceleniyor</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{incidents.filter(i => i.status === 'resolved').length}</Text>
          <Text style={styles.statLabel}>Çözüldü</Text>
        </View>
      </View>

      {/* Quick Report */}
      <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.dangerLight }]} onPress={() => setShowIncidentModal(true)}>
        <View style={[styles.quickActionIcon, { backgroundColor: colors.danger }]}>
          <Icon name="alert-triangle" size={20} color={colors.white} />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>Olay Bildir</Text>
          <Text style={styles.quickActionDesc}>Tehlike veya kaza bildirin</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.danger} />
      </TouchableOpacity>

      {/* Incident List */}
      <Text style={styles.sectionTitle}>Son Olaylar</Text>
      {incidents.map((incident) => {
        const typeInfo = incidentTypes.find(t => t.key === incident.type);

        return (
          <Card key={incident.id} style={styles.incidentCard}>
            <View style={styles.incidentHeader}>
              <View style={[styles.incidentIcon, { backgroundColor: typeInfo?.color + '20' }]}>
                <Icon name={typeInfo?.icon as any} size={20} color={typeInfo?.color} />
              </View>
              <View style={styles.incidentInfo}>
                <View style={styles.incidentTypeRow}>
                  <Text style={styles.incidentType}>{typeInfo?.label}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getRiskColor(incident.severity) }]}>
                    <Text style={styles.severityText}>{getRiskLabel(incident.severity)}</Text>
                  </View>
                </View>
                <Text style={styles.incidentDescription}>{incident.description}</Text>
                <View style={styles.incidentMeta}>
                  <Icon name="map-pin" size={12} color={colors.gray[400]} />
                  <Text style={styles.incidentMetaText}>{incident.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.incidentFooter}>
              <Text style={styles.incidentDate}>{incident.date} • {incident.reporter}</Text>
              <View style={styles.incidentActions}>
                {incident.status !== 'resolved' && (
                  <>
                    <TouchableOpacity
                      style={[styles.incidentActionBtn, { backgroundColor: colors.warningLight }]}
                      onPress={() => updateIncidentStatus(incident.id, 'investigating')}
                    >
                      <Icon name="search" size={14} color={colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.incidentActionBtn, { backgroundColor: colors.successLight }]}
                      onPress={() => updateIncidentStatus(incident.id, 'resolved')}
                    >
                      <Icon name="check" size={14} color={colors.success} />
                    </TouchableOpacity>
                  </>
                )}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(incident.status) }]}>
                    {getStatusLabel(incident.status)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        );
      })}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Risk Tab
  const renderRiskTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.dangerLight }]}>
          <Text style={[styles.statValue, { color: colors.danger }]}>{riskAreas.filter(r => r.level === 'high' || r.level === 'critical').length}</Text>
          <Text style={styles.statLabel}>Yüksek Risk</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{activeRisks}</Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{riskAreas.filter(r => r.resolved).length}</Text>
          <Text style={styles.statLabel}>Çözüldü</Text>
        </View>
      </View>

      {/* Add Risk */}
      <TouchableOpacity style={styles.quickActionCard} onPress={() => setShowRiskModal(true)}>
        <View style={[styles.quickActionIcon, { backgroundColor: colors.warning }]}>
          <Icon name="map-pin" size={20} color={colors.white} />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>Risk Alanı Ekle</Text>
          <Text style={styles.quickActionDesc}>Yeni risk bölgesi tanımlayın</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.gray[400]} />
      </TouchableOpacity>

      {/* Risk List */}
      <Text style={styles.sectionTitle}>Risk Alanları</Text>
      {riskAreas.map((risk) => (
        <Card key={risk.id} style={[styles.riskCard, risk.resolved && styles.riskCardResolved]}>
          <View style={styles.riskHeader}>
            <View style={[styles.riskLevel, { backgroundColor: getRiskColor(risk.level) }]}>
              <Text style={styles.riskLevelText}>{getRiskLabel(risk.level)}</Text>
            </View>
            {risk.resolved && (
              <View style={[styles.resolvedBadge]}>
                <Icon name="check" size={12} color={colors.success} />
                <Text style={styles.resolvedText}>Çözüldü</Text>
              </View>
            )}
          </View>

          <Text style={styles.riskName}>{risk.name}</Text>
          <Text style={styles.riskDescription}>{risk.description}</Text>
          <Text style={styles.riskProject}>{risk.project}</Text>

          {risk.actions.length > 0 && (
            <View style={styles.riskActionsList}>
              {risk.actions.map((action, index) => (
                <View key={index} style={styles.riskActionItem}>
                  <Icon name="check-square" size={14} color={colors.gray[400]} />
                  <Text style={styles.riskActionItemText}>{action}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.riskButtons}>
            <TouchableOpacity style={styles.riskBtn}>
              <Icon name="camera" size={16} color={colors.gray[600]} />
              <Text style={styles.riskBtnText}>Fotoğraf</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.riskBtn, risk.resolved && styles.riskBtnActive]}
              onPress={() => toggleRiskResolved(risk.id)}
            >
              <Icon name="check-circle" size={16} color={risk.resolved ? colors.success : colors.gray[600]} />
              <Text style={[styles.riskBtnText, risk.resolved && { color: colors.success }]}>
                {risk.resolved ? 'Çözüldü' : 'Çözüldü Olarak İşaretle'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="İSG & Güvenlik" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'kontrol' && renderKontrolTab()}
      {activeTab === 'olay' && renderOlayTab()}
      {activeTab === 'risk' && renderRiskTab()}

      {/* Checklist Modal */}
      <Modal visible={showChecklistModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Kontrol</Text>
              <TouchableOpacity onPress={() => setShowChecklistModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kontrol Türü *</Text>
                <View style={styles.templateOptions}>
                  {checklistTemplates.map((template) => (
                    <TouchableOpacity
                      key={template}
                      style={[styles.templateOption, newChecklistTitle === template && styles.templateOptionActive]}
                      onPress={() => setNewChecklistTitle(template)}
                    >
                      <Text style={[styles.templateOptionText, newChecklistTitle === template && styles.templateOptionTextActive]}>
                        {template}
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
                      style={[styles.projectOption, newChecklistProject === project && styles.projectOptionActive]}
                      onPress={() => setNewChecklistProject(project)}
                    >
                      <Text style={[styles.projectOptionText, newChecklistProject === project && styles.projectOptionTextActive]}>
                        {project}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={createChecklist}>
                <Icon name="clipboard" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Kontrolü Başlat</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Checklist Detail Modal */}
      <Modal visible={showChecklistDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedChecklist?.title}</Text>
              <TouchableOpacity onPress={() => setShowChecklistDetailModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {selectedChecklist && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.checklistDetailHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedChecklist.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(selectedChecklist.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(selectedChecklist.status) }]}>
                      {getStatusLabel(selectedChecklist.status)}
                    </Text>
                  </View>
                  <Text style={styles.checklistDetailMeta}>
                    {selectedChecklist.project} • {selectedChecklist.date}
                  </Text>
                </View>

                <Text style={styles.checklistItemsTitle}>Kontrol Maddeleri</Text>
                {selectedChecklist.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checklistItem}
                    onPress={() => toggleChecklistItem(selectedChecklist.id, item.id)}
                  >
                    <View style={[styles.checklistItemCheck, item.checked && styles.checklistItemCheckActive]}>
                      {item.checked && <Icon name="check" size={14} color={colors.white} />}
                    </View>
                    <Text style={[styles.checklistItemText, item.checked && styles.checklistItemTextChecked]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Incident Modal */}
      <Modal visible={showIncidentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Olay Bildir</Text>
              <TouchableOpacity onPress={() => setShowIncidentModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Olay Türü *</Text>
                <View style={styles.incidentTypeOptions}>
                  {incidentTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[styles.incidentTypeOption, newIncidentType === type.key && { backgroundColor: type.color + '20', borderColor: type.color }]}
                      onPress={() => setNewIncidentType(type.key as Incident['type'])}
                    >
                      <Icon name={type.icon as any} size={20} color={newIncidentType === type.key ? type.color : colors.gray[500]} />
                      <Text style={[styles.incidentTypeOptionText, newIncidentType === type.key && { color: type.color }]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ciddiyet *</Text>
                <View style={styles.severityOptions}>
                  {severityOptions.map((sev) => (
                    <TouchableOpacity
                      key={sev.key}
                      style={[styles.severityOption, newIncidentSeverity === sev.key && { backgroundColor: sev.color }]}
                      onPress={() => setNewIncidentSeverity(sev.key as Incident['severity'])}
                    >
                      <Text style={[styles.severityOptionText, newIncidentSeverity === sev.key && { color: colors.white }]}>
                        {sev.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Konum *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Örn: A Blok 3. Kat"
                  placeholderTextColor={colors.gray[400]}
                  value={newIncidentLocation}
                  onChangeText={setNewIncidentLocation}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Açıklama *</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Olayı detaylı açıklayın..."
                  placeholderTextColor={colors.gray[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={newIncidentDescription}
                  onChangeText={setNewIncidentDescription}
                />
              </View>

              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.danger }]} onPress={reportIncident}>
                <Icon name="alert-triangle" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Olayı Bildir</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Risk Modal */}
      <Modal visible={showRiskModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Risk Alanı Ekle</Text>
              <TouchableOpacity onPress={() => setShowRiskModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Konum/Alan Adı *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Örn: A Blok 5. Kat Koridor"
                  placeholderTextColor={colors.gray[400]}
                  value={newRiskName}
                  onChangeText={setNewRiskName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Risk Seviyesi *</Text>
                <View style={styles.severityOptions}>
                  {severityOptions.map((sev) => (
                    <TouchableOpacity
                      key={sev.key}
                      style={[styles.severityOption, newRiskLevel === sev.key && { backgroundColor: sev.color }]}
                      onPress={() => setNewRiskLevel(sev.key as RiskArea['level'])}
                    >
                      <Text style={[styles.severityOptionText, newRiskLevel === sev.key && { color: colors.white }]}>
                        {sev.label}
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
                      style={[styles.projectOption, newRiskProject === project && styles.projectOptionActive]}
                      onPress={() => setNewRiskProject(project)}
                    >
                      <Text style={[styles.projectOptionText, newRiskProject === project && styles.projectOptionTextActive]}>
                        {project}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Açıklama *</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Risk detaylarını açıklayın..."
                  placeholderTextColor={colors.gray[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={newRiskDescription}
                  onChangeText={setNewRiskDescription}
                />
              </View>

              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.warning }]} onPress={addRiskArea}>
                <Icon name="map-pin" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Risk Alanı Ekle</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: activeTab === 'olay' ? colors.danger : colors.primary }]}
        onPress={() => {
          if (activeTab === 'kontrol') setShowChecklistModal(true);
          else if (activeTab === 'olay') setShowIncidentModal(true);
          else setShowRiskModal(true);
        }}
      >
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
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    marginTop: 2,
  },

  // Quick Action
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  quickActionDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },

  // Checklist Card
  checklistCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  checklistTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  checklistMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
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
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    fontWeight: '600',
  },
  checklistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inspectorText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },

  // Incident Card
  incidentCard: {
    marginBottom: spacing.sm,
  },
  incidentHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  incidentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  incidentType: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  incidentDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    marginBottom: 4,
  },
  incidentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  incidentMetaText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  incidentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  incidentActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Risk Card
  riskCard: {
    marginBottom: spacing.sm,
  },
  riskCardResolved: {
    opacity: 0.7,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  riskLevel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  riskLevelText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  resolvedText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.success,
  },
  riskName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  riskDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  riskProject: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginBottom: spacing.md,
  },
  riskActionsList: {
    marginBottom: spacing.md,
  },
  riskActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  riskActionItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  riskButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  riskBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
  },
  riskBtnActive: {
    backgroundColor: colors.successLight,
  },
  riskBtnText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
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

  // Checklist Detail
  checklistDetailHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checklistDetailMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.sm,
  },
  checklistItemsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  checklistItemCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checklistItemCheckActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checklistItemText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.gray[800],
  },
  checklistItemTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.gray[400],
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
  formInput: {
    backgroundColor: colors.gray[50],
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
  templateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  templateOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  templateOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  templateOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  templateOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
    backgroundColor: colors.infoLight,
    borderColor: colors.info,
  },
  projectOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  projectOptionTextActive: {
    color: colors.info,
    fontWeight: '600',
  },
  incidentTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  incidentTypeOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  incidentTypeOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  severityOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
  },
  severityOptionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[600],
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

export default SafetyScreen;
