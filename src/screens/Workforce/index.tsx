import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Types
interface Worker {
  id: string;
  name: string;
  role: 'foreman' | 'skilled' | 'unskilled' | 'contractor' | 'engineer';
  specialization: string;
  phone: string;
  status: 'active' | 'onLeave' | 'inactive';
  currentProject: string;
  avatar: string;
  dailyWage: number;
  startDate: string;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  workers: string[];
  project: string;
  date: string;
}

interface Attendance {
  workerId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'halfDay';
  checkIn?: string;
  checkOut?: string;
}

// Initial Data
const initialWorkers: Worker[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    role: 'foreman',
    specialization: 'Kaba İnşaat',
    phone: '0532 123 4567',
    status: 'active',
    currentProject: 'Marina Bay Tower',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    dailyWage: 1500,
    startDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    role: 'skilled',
    specialization: 'Elektrik',
    phone: '0533 234 5678',
    status: 'active',
    currentProject: 'Marina Bay Tower',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    dailyWage: 1200,
    startDate: '2024-02-01',
  },
  {
    id: '3',
    name: 'Ali Demir',
    role: 'skilled',
    specialization: 'Tesisat',
    phone: '0534 345 6789',
    status: 'onLeave',
    currentProject: '-',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    dailyWage: 1100,
    startDate: '2024-01-20',
  },
  {
    id: '4',
    name: 'Fatih Öz',
    role: 'engineer',
    specialization: 'Proje Mühendisi',
    phone: '0535 456 7890',
    status: 'active',
    currentProject: 'Green Valley',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    dailyWage: 2500,
    startDate: '2023-12-01',
  },
  {
    id: '5',
    name: 'Hasan Eren',
    role: 'unskilled',
    specialization: 'Genel İşçi',
    phone: '0536 567 8901',
    status: 'active',
    currentProject: 'Marina Bay Tower',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    dailyWage: 800,
    startDate: '2024-03-01',
  },
];

const initialShifts: Shift[] = [
  {
    id: '1',
    name: 'Sabah Vardiyası',
    startTime: '07:00',
    endTime: '15:00',
    workers: ['1', '2', '5'],
    project: 'Marina Bay Tower',
    date: '2024-12-23',
  },
  {
    id: '2',
    name: 'Akşam Vardiyası',
    startTime: '15:00',
    endTime: '23:00',
    workers: ['4'],
    project: 'Green Valley',
    date: '2024-12-23',
  },
];

const initialAttendance: Attendance[] = [
  { workerId: '1', date: '2024-12-23', status: 'present', checkIn: '06:55', checkOut: '15:05' },
  { workerId: '2', date: '2024-12-23', status: 'present', checkIn: '07:10', checkOut: '15:00' },
  { workerId: '4', date: '2024-12-23', status: 'late', checkIn: '07:30' },
  { workerId: '5', date: '2024-12-23', status: 'present', checkIn: '06:50', checkOut: '15:00' },
  { workerId: '3', date: '2024-12-23', status: 'absent' },
];

const roleOptions = [
  { key: 'foreman', label: 'Usta Başı', icon: 'award' },
  { key: 'engineer', label: 'Mühendis', icon: 'tool' },
  { key: 'skilled', label: 'Kalifiye', icon: 'user-check' },
  { key: 'unskilled', label: 'İşçi', icon: 'user' },
  { key: 'contractor', label: 'Taşeron', icon: 'briefcase' },
];

const specializationOptions = [
  'Kaba İnşaat', 'İnce İnşaat', 'Elektrik', 'Tesisat', 'Boya',
  'Seramik', 'Alçı', 'Demir', 'Kalıp', 'Genel İşçi', 'Proje Mühendisi'
];

const projectOptions = ['Marina Bay Tower', 'Green Valley', 'Sunset Heights', 'City Center Plaza'];

const WorkforceScreen = () => {
  const [activeTab, setActiveTab] = useState('personel');
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);

  // Modal states
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showWorkerDetailModal, setShowWorkerDetailModal] = useState(false);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Form states
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState<Worker['role']>('skilled');
  const [newWorkerSpecialization, setNewWorkerSpecialization] = useState('');
  const [newWorkerProject, setNewWorkerProject] = useState('');
  const [newWorkerWage, setNewWorkerWage] = useState('');

  // Shift form states
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftStart, setNewShiftStart] = useState('07:00');
  const [newShiftEnd, setNewShiftEnd] = useState('15:00');
  const [newShiftProject, setNewShiftProject] = useState('');
  const [selectedShiftWorkers, setSelectedShiftWorkers] = useState<string[]>([]);

  const tabs = [
    { key: 'personel', label: 'Personel' },
    { key: 'vardiya', label: 'Vardiyalar' },
    { key: 'devam', label: 'Devam' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
  };

  const getRoleLabel = (role: string) => {
    const found = roleOptions.find(r => r.key === role);
    return found ? found.label : role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'foreman': return colors.primary;
      case 'engineer': return colors.info;
      case 'skilled': return colors.success;
      case 'unskilled': return colors.gray[500];
      case 'contractor': return colors.warning;
      default: return colors.gray[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'onLeave': return colors.warning;
      case 'inactive': return colors.gray[400];
      default: return colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'onLeave': return 'İzinli';
      case 'inactive': return 'Pasif';
      default: return status;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.danger;
      case 'late': return colors.warning;
      case 'halfDay': return colors.info;
      default: return colors.gray[500];
    }
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Geldi';
      case 'absent': return 'Gelmedi';
      case 'late': return 'Geç Kaldı';
      case 'halfDay': return 'Yarım Gün';
      default: return status;
    }
  };

  const addWorker = () => {
    if (!newWorkerName || !newWorkerPhone || !newWorkerSpecialization) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newWorker: Worker = {
      id: Date.now().toString(),
      name: newWorkerName,
      phone: newWorkerPhone,
      role: newWorkerRole,
      specialization: newWorkerSpecialization,
      status: 'active',
      currentProject: newWorkerProject || '-',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?auto=format&fit=crop&w=100&q=80',
      dailyWage: parseInt(newWorkerWage) || 1000,
      startDate: new Date().toISOString().split('T')[0],
    };

    setWorkers([...workers, newWorker]);
    resetWorkerForm();
    setShowAddWorkerModal(false);
  };

  const resetWorkerForm = () => {
    setNewWorkerName('');
    setNewWorkerPhone('');
    setNewWorkerRole('skilled');
    setNewWorkerSpecialization('');
    setNewWorkerProject('');
    setNewWorkerWage('');
  };

  const addShift = () => {
    if (!newShiftName || !newShiftProject || selectedShiftWorkers.length === 0) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newShift: Shift = {
      id: Date.now().toString(),
      name: newShiftName,
      startTime: newShiftStart,
      endTime: newShiftEnd,
      workers: selectedShiftWorkers,
      project: newShiftProject,
      date: new Date().toISOString().split('T')[0],
    };

    setShifts([...shifts, newShift]);
    resetShiftForm();
    setShowAddShiftModal(false);
  };

  const resetShiftForm = () => {
    setNewShiftName('');
    setNewShiftStart('07:00');
    setNewShiftEnd('15:00');
    setNewShiftProject('');
    setSelectedShiftWorkers([]);
  };

  const toggleWorkerStatus = (workerId: string) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        const newStatus = w.status === 'active' ? 'onLeave' : 'active';
        return { ...w, status: newStatus };
      }
      return w;
    }));
  };

  const updateAttendance = (workerId: string, status: Attendance['status']) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.workerId === workerId && a.date === today);

    if (existing) {
      setAttendance(attendance.map(a =>
        a.workerId === workerId && a.date === today
          ? { ...a, status, checkIn: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : undefined }
          : a
      ));
    } else {
      setAttendance([...attendance, {
        workerId,
        date: today,
        status,
        checkIn: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      }]);
    }
  };

  const toggleShiftWorker = (workerId: string) => {
    if (selectedShiftWorkers.includes(workerId)) {
      setSelectedShiftWorkers(selectedShiftWorkers.filter(id => id !== workerId));
    } else {
      setSelectedShiftWorkers([...selectedShiftWorkers, workerId]);
    }
  };

  // Stats
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const onLeaveWorkers = workers.filter(w => w.status === 'onLeave').length;
  const totalWages = workers.filter(w => w.status === 'active').reduce((sum, w) => sum + w.dailyWage, 0);
  const todayPresent = attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'present').length;

  // Render Personel Tab
  const renderPersonelTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{activeWorkers}</Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warningLight }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{onLeaveWorkers}</Text>
          <Text style={styles.statLabel}>İzinli</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.infoLight }]}>
          <Text style={[styles.statValue, { color: colors.info }]}>{shifts.length}</Text>
          <Text style={styles.statLabel}>Vardiya</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.orange[50] }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{workers.length}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => setShowAddWorkerModal(true)}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
            <Icon name="user-plus" size={18} color={colors.white} />
          </View>
          <Text style={styles.quickActionText}>Personel Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => setShowAddShiftModal(true)}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.info }]}>
            <Icon name="clock" size={18} color={colors.white} />
          </View>
          <Text style={styles.quickActionText}>Vardiya Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => setShowAttendanceModal(true)}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.success }]}>
            <Icon name="check-circle" size={18} color={colors.white} />
          </View>
          <Text style={styles.quickActionText}>Devam Al</Text>
        </TouchableOpacity>
      </View>

      {/* Worker List */}
      <Text style={styles.sectionTitle}>Personel Listesi</Text>
      {workers.map((worker) => (
        <TouchableOpacity
          key={worker.id}
          style={styles.workerCard}
          onPress={() => {
            setSelectedWorker(worker);
            setShowWorkerDetailModal(true);
          }}
        >
          <Image source={{ uri: worker.avatar }} style={styles.avatar} />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <View style={styles.roleRow}>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(worker.role) + '20' }]}>
                <Text style={[styles.roleText, { color: getRoleColor(worker.role) }]}>{getRoleLabel(worker.role)}</Text>
              </View>
              <Text style={styles.specialization}>{worker.specialization}</Text>
            </View>
          </View>
          <View style={styles.workerRight}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(worker.status) }]} />
            <Text style={styles.wageText}>{formatCurrency(worker.dailyWage)}/gün</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Vardiya Tab
  const renderVardiyaTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Today's Summary */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Icon name="calendar" size={20} color={colors.primary} />
          <Text style={styles.summaryTitle}>Bugünün Vardiyaları</Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{shifts.length}</Text>
            <Text style={styles.summaryStatLabel}>Vardiya</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{shifts.reduce((sum, s) => sum + s.workers.length, 0)}</Text>
            <Text style={styles.summaryStatLabel}>Kişi</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{formatCurrency(totalWages)}</Text>
            <Text style={styles.summaryStatLabel}>Günlük Maliyet</Text>
          </View>
        </View>
      </Card>

      {/* Shifts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vardiyalar</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddShiftModal(true)}>
          <Icon name="plus" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      {shifts.map((shift) => (
        <Card key={shift.id} style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <View style={styles.shiftTime}>
              <Icon name="clock" size={16} color={colors.primary} />
              <Text style={styles.shiftTimeText}>{shift.startTime} - {shift.endTime}</Text>
            </View>
            <View style={styles.shiftBadge}>
              <Text style={styles.shiftBadgeText}>{shift.workers.length} kişi</Text>
            </View>
          </View>
          <Text style={styles.shiftName}>{shift.name}</Text>
          <View style={styles.shiftProject}>
            <Icon name="map-pin" size={14} color={colors.gray[400]} />
            <Text style={styles.shiftProjectText}>{shift.project}</Text>
          </View>
          <View style={styles.shiftWorkers}>
            {shift.workers.slice(0, 4).map((workerId, index) => {
              const worker = workers.find(w => w.id === workerId);
              return worker ? (
                <Image
                  key={workerId}
                  source={{ uri: worker.avatar }}
                  style={[styles.shiftWorkerAvatar, { marginLeft: index > 0 ? -10 : 0 }]}
                />
              ) : null;
            })}
            {shift.workers.length > 4 && (
              <View style={[styles.shiftWorkerMore, { marginLeft: -10 }]}>
                <Text style={styles.shiftWorkerMoreText}>+{shift.workers.length - 4}</Text>
              </View>
            )}
          </View>
        </Card>
      ))}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Render Devam Tab
  const renderDevamTab = () => {
    const today = new Date().toISOString().split('T')[0];

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Today's Attendance Summary */}
        <Card style={styles.attendanceSummary}>
          <Text style={styles.attendanceDate}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <View style={styles.attendanceStats}>
            <View style={styles.attendanceStat}>
              <View style={[styles.attendanceStatIcon, { backgroundColor: colors.successLight }]}>
                <Icon name="check" size={16} color={colors.success} />
              </View>
              <Text style={styles.attendanceStatValue}>{attendance.filter(a => a.date === today && a.status === 'present').length}</Text>
              <Text style={styles.attendanceStatLabel}>Geldi</Text>
            </View>
            <View style={styles.attendanceStat}>
              <View style={[styles.attendanceStatIcon, { backgroundColor: colors.dangerLight }]}>
                <Icon name="x" size={16} color={colors.danger} />
              </View>
              <Text style={styles.attendanceStatValue}>{attendance.filter(a => a.date === today && a.status === 'absent').length}</Text>
              <Text style={styles.attendanceStatLabel}>Gelmedi</Text>
            </View>
            <View style={styles.attendanceStat}>
              <View style={[styles.attendanceStatIcon, { backgroundColor: colors.warningLight }]}>
                <Icon name="clock" size={16} color={colors.warning} />
              </View>
              <Text style={styles.attendanceStatValue}>{attendance.filter(a => a.date === today && a.status === 'late').length}</Text>
              <Text style={styles.attendanceStatLabel}>Geç</Text>
            </View>
          </View>
        </Card>

        {/* Attendance List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Devam Durumu</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAttendanceModal(true)}>
            <Icon name="edit-2" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {workers.filter(w => w.status === 'active').map((worker) => {
          const workerAttendance = attendance.find(a => a.workerId === worker.id && a.date === today);

          return (
            <Card key={worker.id} style={styles.attendanceCard}>
              <View style={styles.attendanceWorker}>
                <Image source={{ uri: worker.avatar }} style={styles.attendanceAvatar} />
                <View style={styles.attendanceWorkerInfo}>
                  <Text style={styles.attendanceWorkerName}>{worker.name}</Text>
                  <Text style={styles.attendanceWorkerRole}>{worker.specialization}</Text>
                </View>
              </View>
              <View style={styles.attendanceStatus}>
                {workerAttendance ? (
                  <>
                    <View style={[styles.attendanceStatusBadge, { backgroundColor: getAttendanceColor(workerAttendance.status) + '20' }]}>
                      <Text style={[styles.attendanceStatusText, { color: getAttendanceColor(workerAttendance.status) }]}>
                        {getAttendanceLabel(workerAttendance.status)}
                      </Text>
                    </View>
                    {workerAttendance.checkIn && (
                      <Text style={styles.attendanceTime}>Giriş: {workerAttendance.checkIn}</Text>
                    )}
                  </>
                ) : (
                  <View style={styles.attendanceButtons}>
                    <TouchableOpacity
                      style={[styles.attendanceBtn, styles.attendanceBtnPresent]}
                      onPress={() => updateAttendance(worker.id, 'present')}
                    >
                      <Icon name="check" size={14} color={colors.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attendanceBtn, styles.attendanceBtnAbsent]}
                      onPress={() => updateAttendance(worker.id, 'absent')}
                    >
                      <Icon name="x" size={14} color={colors.danger} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.attendanceBtn, styles.attendanceBtnLate]}
                      onPress={() => updateAttendance(worker.id, 'late')}
                    >
                      <Icon name="clock" size={14} color={colors.warning} />
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
  };

  return (
    <View style={styles.container}>
      <Header title="İş Gücü" showBack />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'personel' && renderPersonelTab()}
      {activeTab === 'vardiya' && renderVardiyaTab()}
      {activeTab === 'devam' && renderDevamTab()}

      {/* Add Worker Modal */}
      <Modal visible={showAddWorkerModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personel Ekle</Text>
              <TouchableOpacity onPress={() => setShowAddWorkerModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ad Soyad *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Personel adı"
                  placeholderTextColor={colors.gray[400]}
                  value={newWorkerName}
                  onChangeText={setNewWorkerName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefon *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0532 123 4567"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="phone-pad"
                  value={newWorkerPhone}
                  onChangeText={setNewWorkerPhone}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pozisyon *</Text>
                <View style={styles.roleOptions}>
                  {roleOptions.map((role) => (
                    <TouchableOpacity
                      key={role.key}
                      style={[styles.roleOption, newWorkerRole === role.key && styles.roleOptionActive]}
                      onPress={() => setNewWorkerRole(role.key as Worker['role'])}
                    >
                      <Icon name={role.icon as any} size={16} color={newWorkerRole === role.key ? colors.white : colors.gray[600]} />
                      <Text style={[styles.roleOptionText, newWorkerRole === role.key && styles.roleOptionTextActive]}>
                        {role.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Uzmanlık *</Text>
                <View style={styles.specOptions}>
                  {specializationOptions.map((spec) => (
                    <TouchableOpacity
                      key={spec}
                      style={[styles.specOption, newWorkerSpecialization === spec && styles.specOptionActive]}
                      onPress={() => setNewWorkerSpecialization(spec)}
                    >
                      <Text style={[styles.specOptionText, newWorkerSpecialization === spec && styles.specOptionTextActive]}>
                        {spec}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Proje</Text>
                <View style={styles.projectOptions}>
                  {projectOptions.map((project) => (
                    <TouchableOpacity
                      key={project}
                      style={[styles.projectOption, newWorkerProject === project && styles.projectOptionActive]}
                      onPress={() => setNewWorkerProject(project)}
                    >
                      <Text style={[styles.projectOptionText, newWorkerProject === project && styles.projectOptionTextActive]}>
                        {project}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Günlük Ücret (₺)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="1000"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  value={newWorkerWage}
                  onChangeText={setNewWorkerWage}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={addWorker}>
                <Icon name="user-plus" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Personel Ekle</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Worker Detail Modal */}
      <Modal visible={showWorkerDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personel Detayı</Text>
              <TouchableOpacity onPress={() => setShowWorkerDetailModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {selectedWorker && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <Image source={{ uri: selectedWorker.avatar }} style={styles.detailAvatar} />
                  <Text style={styles.detailName}>{selectedWorker.name}</Text>
                  <View style={[styles.detailStatusBadge, { backgroundColor: getStatusColor(selectedWorker.status) + '20' }]}>
                    <Text style={[styles.detailStatusText, { color: getStatusColor(selectedWorker.status) }]}>
                      {getStatusLabel(selectedWorker.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Icon name="briefcase" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Pozisyon</Text>
                    <Text style={styles.detailValue}>{getRoleLabel(selectedWorker.role)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="tool" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Uzmanlık</Text>
                    <Text style={styles.detailValue}>{selectedWorker.specialization}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="phone" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Telefon</Text>
                    <Text style={styles.detailValue}>{selectedWorker.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="map-pin" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Proje</Text>
                    <Text style={styles.detailValue}>{selectedWorker.currentProject}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="dollar-sign" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Günlük Ücret</Text>
                    <Text style={styles.detailValue}>{formatCurrency(selectedWorker.dailyWage)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={18} color={colors.gray[400]} />
                    <Text style={styles.detailLabel}>Başlangıç</Text>
                    <Text style={styles.detailValue}>{new Date(selectedWorker.startDate).toLocaleDateString('tr-TR')}</Text>
                  </View>
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity style={[styles.detailActionBtn, { backgroundColor: colors.successLight }]}>
                    <Icon name="phone" size={18} color={colors.success} />
                    <Text style={[styles.detailActionText, { color: colors.success }]}>Ara</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.detailActionBtn, { backgroundColor: colors.infoLight }]}>
                    <Icon name="message-circle" size={18} color={colors.info} />
                    <Text style={[styles.detailActionText, { color: colors.info }]}>Mesaj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.detailActionBtn, { backgroundColor: colors.warningLight }]}
                    onPress={() => {
                      toggleWorkerStatus(selectedWorker.id);
                      setShowWorkerDetailModal(false);
                    }}
                  >
                    <Icon name={selectedWorker.status === 'active' ? 'pause' : 'play'} size={18} color={colors.warning} />
                    <Text style={[styles.detailActionText, { color: colors.warning }]}>
                      {selectedWorker.status === 'active' ? 'İzne Çıkar' : 'Aktif Et'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Shift Modal */}
      <Modal visible={showAddShiftModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vardiya Ekle</Text>
              <TouchableOpacity onPress={() => setShowAddShiftModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Vardiya Adı *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Sabah Vardiyası"
                  placeholderTextColor={colors.gray[400]}
                  value={newShiftName}
                  onChangeText={setNewShiftName}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={styles.formLabel}>Başlangıç</Text>
                  <View style={styles.timeInputs}>
                    {['06:00', '07:00', '08:00', '15:00'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[styles.timeOption, newShiftStart === time && styles.timeOptionActive]}
                        onPress={() => setNewShiftStart(time)}
                      >
                        <Text style={[styles.timeOptionText, newShiftStart === time && styles.timeOptionTextActive]}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Bitiş</Text>
                  <View style={styles.timeInputs}>
                    {['15:00', '17:00', '23:00', '07:00'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[styles.timeOption, newShiftEnd === time && styles.timeOptionActive]}
                        onPress={() => setNewShiftEnd(time)}
                      >
                        <Text style={[styles.timeOptionText, newShiftEnd === time && styles.timeOptionTextActive]}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Proje *</Text>
                <View style={styles.projectOptions}>
                  {projectOptions.map((project) => (
                    <TouchableOpacity
                      key={project}
                      style={[styles.projectOption, newShiftProject === project && styles.projectOptionActive]}
                      onPress={() => setNewShiftProject(project)}
                    >
                      <Text style={[styles.projectOptionText, newShiftProject === project && styles.projectOptionTextActive]}>
                        {project}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Personel Seç *</Text>
                <View style={styles.workerSelectList}>
                  {workers.filter(w => w.status === 'active').map((worker) => (
                    <TouchableOpacity
                      key={worker.id}
                      style={[styles.workerSelectItem, selectedShiftWorkers.includes(worker.id) && styles.workerSelectItemActive]}
                      onPress={() => toggleShiftWorker(worker.id)}
                    >
                      <Image source={{ uri: worker.avatar }} style={styles.workerSelectAvatar} />
                      <View style={styles.workerSelectInfo}>
                        <Text style={styles.workerSelectName}>{worker.name}</Text>
                        <Text style={styles.workerSelectRole}>{worker.specialization}</Text>
                      </View>
                      <View style={[styles.workerSelectCheck, selectedShiftWorkers.includes(worker.id) && styles.workerSelectCheckActive]}>
                        {selectedShiftWorkers.includes(worker.id) && (
                          <Icon name="check" size={14} color={colors.white} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={addShift}>
                <Icon name="clock" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Vardiya Oluştur</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Attendance Modal */}
      <Modal visible={showAttendanceModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hızlı Devam Al</Text>
              <TouchableOpacity onPress={() => setShowAttendanceModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.attendanceModalDate}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>

              {workers.filter(w => w.status === 'active').map((worker) => {
                const today = new Date().toISOString().split('T')[0];
                const workerAttendance = attendance.find(a => a.workerId === worker.id && a.date === today);

                return (
                  <View key={worker.id} style={styles.attendanceModalItem}>
                    <Image source={{ uri: worker.avatar }} style={styles.attendanceModalAvatar} />
                    <Text style={styles.attendanceModalName}>{worker.name}</Text>
                    <View style={styles.attendanceModalButtons}>
                      <TouchableOpacity
                        style={[
                          styles.attendanceModalBtn,
                          workerAttendance?.status === 'present' && styles.attendanceModalBtnActiveGreen
                        ]}
                        onPress={() => updateAttendance(worker.id, 'present')}
                      >
                        <Icon name="check" size={16} color={workerAttendance?.status === 'present' ? colors.white : colors.success} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.attendanceModalBtn,
                          workerAttendance?.status === 'absent' && styles.attendanceModalBtnActiveRed
                        ]}
                        onPress={() => updateAttendance(worker.id, 'absent')}
                      >
                        <Icon name="x" size={16} color={workerAttendance?.status === 'absent' ? colors.white : colors.danger} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.attendanceModalBtn,
                          workerAttendance?.status === 'late' && styles.attendanceModalBtnActiveYellow
                        ]}
                        onPress={() => updateAttendance(worker.id, 'late')}
                      >
                        <Icon name="clock" size={16} color={workerAttendance?.status === 'late' ? colors.white : colors.warning} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.submitBtn} onPress={() => setShowAttendanceModal(false)}>
                <Icon name="check-circle" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Kaydet</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddWorkerModal(true)}>
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
    padding: spacing.sm,
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

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[700],
    fontWeight: '500',
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
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Worker Card
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 4,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  specialization: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  workerRight: {
    alignItems: 'flex-end',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  wageText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },

  // Summary Card
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  summaryStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },

  // Shift Card
  shiftCard: {
    marginBottom: spacing.sm,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  shiftTimeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  shiftBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  shiftBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  shiftName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 4,
  },
  shiftProject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  shiftProjectText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  shiftWorkers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftWorkerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.white,
  },
  shiftWorkerMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  shiftWorkerMoreText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray[600],
  },

  // Attendance
  attendanceSummary: {
    marginBottom: spacing.lg,
  },
  attendanceDate: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  attendanceStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[800],
  },
  attendanceStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  attendanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  attendanceWorker: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendanceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  attendanceWorkerInfo: {
    flex: 1,
  },
  attendanceWorkerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  attendanceWorkerRole: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  attendanceStatus: {
    alignItems: 'flex-end',
  },
  attendanceStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  attendanceStatusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
  attendanceTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  attendanceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  attendanceBtnPresent: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  attendanceBtnAbsent: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  attendanceBtnLate: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
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
  formRow: {
    flexDirection: 'row',
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  roleOptionTextActive: {
    color: colors.white,
  },
  specOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  specOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  specOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  specOptionTextActive: {
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
  timeInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  timeOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
  },
  timeOptionActive: {
    backgroundColor: colors.primary,
  },
  timeOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  timeOptionTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  workerSelectList: {
    gap: spacing.xs,
  },
  workerSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  workerSelectItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  workerSelectAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  workerSelectInfo: {
    flex: 1,
  },
  workerSelectName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  workerSelectRole: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  workerSelectCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerSelectCheckActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
  detailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.sm,
  },
  detailName: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  detailStatusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  detailStatusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  detailSection: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
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

  // Attendance Modal
  attendanceModalDate: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  attendanceModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  attendanceModalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  attendanceModalName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
  },
  attendanceModalButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  attendanceModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  attendanceModalBtnActiveGreen: {
    backgroundColor: colors.success,
  },
  attendanceModalBtnActiveRed: {
    backgroundColor: colors.danger,
  },
  attendanceModalBtnActiveYellow: {
    backgroundColor: colors.warning,
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

export default WorkforceScreen;
