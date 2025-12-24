import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Header, Card } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Types
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  avatar: string;
}

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  taskUpdates: boolean;
  projectAlerts: boolean;
  safetyAlerts: boolean;
  weeklyReport: boolean;
}

const SettingsScreen = () => {
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@insaat.com',
    phone: '0532 123 4567',
    role: 'Proje Müdürü',
    company: 'ABC İnşaat A.Ş.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
    taskUpdates: true,
    projectAlerts: true,
    safetyAlerts: true,
    weeklyReport: true,
  });

  // App settings
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [language, setLanguage] = useState('Türkçe');

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editCompany, setEditCompany] = useState(profile.company);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const languages = ['Türkçe', 'English', 'Deutsch', 'العربية'];

  const updateProfile = () => {
    if (!editName || !editEmail) {
      Alert.alert('Hata', 'Ad ve e-posta zorunludur');
      return;
    }

    setProfile({
      ...profile,
      name: editName,
      email: editEmail,
      phone: editPhone,
      company: editCompany,
    });

    setShowProfileModal(false);
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
    Alert.alert('Başarılı', 'Şifreniz değiştirildi');
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => Alert.alert('Bilgi', 'Çıkış yapıldı'),
        },
      ]
    );
  };

  const clearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Önbellek temizlenecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          onPress: () => Alert.alert('Başarılı', 'Önbellek temizlendi (50 MB boşaltıldı)'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Ayarlar" showBack />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Card */}
        <TouchableOpacity onPress={() => {
          setEditName(profile.name);
          setEditEmail(profile.email);
          setEditPhone(profile.phone);
          setEditCompany(profile.company);
          setShowProfileModal(true);
        }}>
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: profile.avatar }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileRole}>{profile.role}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
              <View style={styles.editButton}>
                <Icon name="edit-2" size={18} color={colors.primary} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          <Card padding="none">
            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => {
              setEditName(profile.name);
              setEditEmail(profile.email);
              setEditPhone(profile.phone);
              setEditCompany(profile.company);
              setShowProfileModal(true);
            }}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
                  <Icon name="user" size={18} color={colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Profil Bilgileri</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => setShowPasswordModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.warningLight }]}>
                  <Icon name="lock" size={18} color={colors.warning} />
                </View>
                <Text style={styles.settingLabel}>Şifre Değiştir</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.infoLight }]}>
                  <Icon name="smartphone" size={18} color={colors.info} />
                </View>
                <Text style={styles.settingLabel}>Biyometrik Giriş</Text>
              </View>
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          <Card padding="none">
            <View style={[styles.settingItem, styles.settingItemBorder]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.dangerLight }]}>
                  <Icon name="bell" size={18} color={colors.danger} />
                </View>
                <Text style={styles.settingLabel}>Push Bildirimleri</Text>
              </View>
              <Switch
                value={notifications.push}
                onValueChange={(val) => setNotifications({ ...notifications, push: val })}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => setShowNotificationModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.successLight }]}>
                  <Icon name="settings" size={18} color={colors.success} />
                </View>
                <Text style={styles.settingLabel}>Bildirim Tercihleri</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {Object.values(notifications).filter(v => v).length} aktif
                </Text>
                <Icon name="chevron-right" size={18} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.infoLight }]}>
                  <Icon name="mail" size={18} color={colors.info} />
                </View>
                <Text style={styles.settingLabel}>E-posta Bildirimleri</Text>
              </View>
              <Switch
                value={notifications.email}
                onValueChange={(val) => setNotifications({ ...notifications, email: val })}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Görünüm</Text>
          <Card padding="none">
            <View style={[styles.settingItem, styles.settingItemBorder]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.gray[800] }]}>
                  <Icon name="moon" size={18} color={colors.white} />
                </View>
                <Text style={styles.settingLabel}>Karanlık Mod</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
                  <Icon name="globe" size={18} color={colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Dil</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{language}</Text>
                <Icon name="chevron-right" size={18} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Data & Storage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri ve Depolama</Text>
          <Card padding="none">
            <View style={[styles.settingItem, styles.settingItemBorder]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.successLight }]}>
                  <Icon name="refresh-cw" size={18} color={colors.success} />
                </View>
                <Text style={styles.settingLabel}>Otomatik Senkronizasyon</Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <View style={[styles.settingItem, styles.settingItemBorder]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.warningLight }]}>
                  <Icon name="wifi-off" size={18} color={colors.warning} />
                </View>
                <Text style={styles.settingLabel}>Çevrimdışı Mod</Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: colors.gray[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={clearCache}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.dangerLight }]}>
                  <Icon name="trash-2" size={18} color={colors.danger} />
                </View>
                <Text style={styles.settingLabel}>Önbelleği Temizle</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>50 MB</Text>
                <Icon name="chevron-right" size={18} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <Card padding="none">
            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => setShowAboutModal(true)}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.infoLight }]}>
                  <Icon name="info" size={18} color={colors.info} />
                </View>
                <Text style={styles.settingLabel}>Hakkında</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>v2.0.0</Text>
                <Icon name="chevron-right" size={18} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => Alert.alert('Yardım Merkezi', 'Yardım merkezi açılıyor...')}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.successLight }]}>
                  <Icon name="help-circle" size={18} color={colors.success} />
                </View>
                <Text style={styles.settingLabel}>Yardım Merkezi</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]} onPress={() => Alert.alert('Gizlilik Politikası', 'Gizlilik politikası açılıyor...')}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.gray[100] }]}>
                  <Icon name="file-text" size={18} color={colors.gray[600]} />
                </View>
                <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Bize Ulaşın', 'E-posta: destek@insaatapp.com\nTelefon: 0850 123 4567')}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
                  <Icon name="message-circle" size={18} color={colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Bize Ulaşın</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>İnşaat Takip v2.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 ABC İnşaat. Tüm hakları saklıdır.</Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profil Düzenle</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.avatarSection}>
                <Image source={{ uri: profile.avatar }} style={styles.modalAvatar} />
                <TouchableOpacity style={styles.changeAvatarBtn}>
                  <Icon name="camera" size={16} color={colors.primary} />
                  <Text style={styles.changeAvatarText}>Fotoğraf Değiştir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ad Soyad</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Adınızı girin"
                  placeholderTextColor={colors.gray[400]}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>E-posta</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="email-address"
                  value={editEmail}
                  onChangeText={setEditEmail}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefon</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Telefon numaranız"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="phone-pad"
                  value={editPhone}
                  onChangeText={setEditPhone}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Şirket</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Şirket adı"
                  placeholderTextColor={colors.gray[400]}
                  value={editCompany}
                  onChangeText={setEditCompany}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={updateProfile}>
                <Icon name="check" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Kaydet</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mevcut Şifre</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Mevcut şifrenizi girin"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Yeni Şifre</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Yeni şifrenizi girin"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Yeni Şifre (Tekrar)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Yeni şifrenizi tekrar girin"
                  placeholderTextColor={colors.gray[400]}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <View style={styles.passwordHints}>
                <Text style={styles.passwordHint}>• En az 6 karakter</Text>
                <Text style={styles.passwordHint}>• Büyük ve küçük harf içermeli</Text>
                <Text style={styles.passwordHint}>• En az 1 rakam içermeli</Text>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={changePassword}>
                <Icon name="lock" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>Şifreyi Değiştir</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notification Preferences Modal */}
      <Modal visible={showNotificationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bildirim Tercihleri</Text>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>Görev Güncellemeleri</Text>
                  <Text style={styles.notificationDesc}>Görev durumu değişikliklerinde bildirim al</Text>
                </View>
                <Switch
                  value={notifications.taskUpdates}
                  onValueChange={(val) => setNotifications({ ...notifications, taskUpdates: val })}
                  trackColor={{ false: colors.gray[200], true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>Proje Uyarıları</Text>
                  <Text style={styles.notificationDesc}>Proje ilerleme ve gecikme uyarıları</Text>
                </View>
                <Switch
                  value={notifications.projectAlerts}
                  onValueChange={(val) => setNotifications({ ...notifications, projectAlerts: val })}
                  trackColor={{ false: colors.gray[200], true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>İSG Uyarıları</Text>
                  <Text style={styles.notificationDesc}>Güvenlik olayları ve risk bildirimleri</Text>
                </View>
                <Switch
                  value={notifications.safetyAlerts}
                  onValueChange={(val) => setNotifications({ ...notifications, safetyAlerts: val })}
                  trackColor={{ false: colors.gray[200], true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>Haftalık Rapor</Text>
                  <Text style={styles.notificationDesc}>Haftalık özet e-postası al</Text>
                </View>
                <Switch
                  value={notifications.weeklyReport}
                  onValueChange={(val) => setNotifications({ ...notifications, weeklyReport: val })}
                  trackColor={{ false: colors.gray[200], true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>SMS Bildirimleri</Text>
                  <Text style={styles.notificationDesc}>Acil durumlar için SMS al</Text>
                </View>
                <Switch
                  value={notifications.sms}
                  onValueChange={(val) => setNotifications({ ...notifications, sms: val })}
                  trackColor={{ false: colors.gray[200], true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dil Seçin</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.languageOption, language === lang && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage(lang);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={[styles.languageOptionText, language === lang && styles.languageOptionTextActive]}>
                  {lang}
                </Text>
                {language === lang && <Icon name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAboutModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hakkında</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Icon name="x" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.aboutContent}>
              <View style={styles.aboutLogo}>
                <Icon name="hard-hat" size={48} color={colors.primary} />
              </View>
              <Text style={styles.aboutAppName}>İnşaat Takip</Text>
              <Text style={styles.aboutVersion}>Versiyon 2.0.0</Text>

              <View style={styles.aboutInfo}>
                <View style={styles.aboutInfoRow}>
                  <Text style={styles.aboutInfoLabel}>Geliştirici</Text>
                  <Text style={styles.aboutInfoValue}>ABC Yazılım</Text>
                </View>
                <View style={styles.aboutInfoRow}>
                  <Text style={styles.aboutInfoLabel}>Lisans</Text>
                  <Text style={styles.aboutInfoValue}>Kurumsal</Text>
                </View>
                <View style={styles.aboutInfoRow}>
                  <Text style={styles.aboutInfoLabel}>Son Güncelleme</Text>
                  <Text style={styles.aboutInfoValue}>23 Aralık 2024</Text>
                </View>
              </View>

              <Text style={styles.aboutCopyright}>
                © 2024 ABC İnşaat A.Ş.{'\n'}Tüm hakları saklıdır.
              </Text>
            </View>
          </View>
        </View>
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
  },
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  profileRole: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    color: colors.gray[800],
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.danger,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  copyrightText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  bottomSpacing: {
    height: 40,
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
  modalContentSmall: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '60%',
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

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },
  changeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  changeAvatarText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
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

  // Password hints
  passwordHints: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  passwordHint: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: 4,
  },

  // Notification Items
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  notificationInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  notificationTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  notificationDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 2,
  },

  // Language Options
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  languageOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  languageOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[800],
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // About
  aboutContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  aboutAppName: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  aboutVersion: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: 4,
  },
  aboutInfo: {
    width: '100%',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  aboutInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  aboutInfoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  aboutInfoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
  aboutCopyright: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default SettingsScreen;
