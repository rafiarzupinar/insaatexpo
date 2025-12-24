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
  Linking,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Header, Card, Badge, Button } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Types
interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  supplier: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  project: string;
}

// Initial data
const initialMaterials: Material[] = [
  { id: '1', name: 'Beton C30', category: 'Yapı Malzemesi', quantity: 500, unit: 'm³', status: 'inUse', supplier: 'ABC Beton' },
  { id: '2', name: 'Demir 12mm', category: 'Demir', quantity: 2500, unit: 'kg', status: 'delivered', supplier: 'Demir Ltd.' },
  { id: '3', name: 'Tuğla', category: 'Yapı Malzemesi', quantity: 10000, unit: 'adet', status: 'ordered', supplier: 'Tuğla AŞ' },
  { id: '4', name: 'Çimento', category: 'Yapı Malzemesi', quantity: 200, unit: 'ton', status: 'shipped', supplier: 'Çimento Fab.' },
  { id: '5', name: 'Elektrik Kablosu', category: 'Elektrik', quantity: 5000, unit: 'm', status: 'needed', supplier: '-' },
];

const initialSuppliers: Supplier[] = [
  { id: '1', name: 'ABC Beton', contact: 'Ahmet Yılmaz', phone: '0532 123 4567', email: 'info@abcbeton.com', category: 'Beton', rating: 4.5 },
  { id: '2', name: 'Demir Ltd.', contact: 'Mehmet Kaya', phone: '0533 234 5678', email: 'satis@demirltd.com', category: 'Demir', rating: 4.8 },
  { id: '3', name: 'Elektrik AŞ', contact: 'Ali Demir', phone: '0534 345 6789', email: 'info@elektrikas.com', category: 'Elektrik', rating: 4.2 },
];

const initialEquipment: Equipment[] = [
  { id: '1', name: 'Vinç', type: 'Ağır Ekipman', status: 'inUse', project: 'Marina Bay Tower' },
  { id: '2', name: 'Beton Mikseri', type: 'Araç', status: 'available', project: '-' },
  { id: '3', name: 'İskele Seti', type: 'Ekipman', status: 'inUse', project: 'Green Valley' },
  { id: '4', name: 'Jeneratör', type: 'Elektrik', status: 'maintenance', project: '-' },
];

const materialCategories = ['Yapı Malzemesi', 'Demir', 'Elektrik', 'Tesisat', 'Ahşap', 'Diğer'];
const materialUnits = ['m³', 'kg', 'adet', 'ton', 'm', 'lt'];
const materialStatuses = [
  { key: 'needed', label: 'Gerekli' },
  { key: 'ordered', label: 'Sipariş Edildi' },
  { key: 'shipped', label: 'Yolda' },
  { key: 'delivered', label: 'Teslim Edildi' },
  { key: 'inUse', label: 'Kullanımda' },
];

const supplierCategories = ['Beton', 'Demir', 'Elektrik', 'Tesisat', 'Ahşap', 'Genel'];
const equipmentTypes = ['Ağır Ekipman', 'Araç', 'Ekipman', 'Elektrik', 'El Aleti'];
const equipmentStatuses = [
  { key: 'available', label: 'Müsait' },
  { key: 'inUse', label: 'Kullanımda' },
  { key: 'maintenance', label: 'Bakımda' },
];

const ResourcesScreen = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'suppliers' | 'equipment'>('materials');
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);

  // Modal states
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Material form
  const [materialName, setMaterialName] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialUnit, setMaterialUnit] = useState('');
  const [materialStatus, setMaterialStatus] = useState('needed');
  const [materialSupplier, setMaterialSupplier] = useState('');

  // Supplier form
  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('');

  // Equipment form
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [equipmentStatus, setEquipmentStatus] = useState('available');
  const [equipmentProject, setEquipmentProject] = useState('');

  // Order form
  const [orderMaterial, setOrderMaterial] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inUse': return colors.info;
      case 'delivered': return colors.success;
      case 'ordered': return colors.warning;
      case 'shipped': return colors.primary;
      case 'needed': return colors.danger;
      case 'available': return colors.success;
      case 'maintenance': return colors.warning;
      default: return colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inUse': return 'Kullanımda';
      case 'delivered': return 'Teslim Edildi';
      case 'ordered': return 'Sipariş Edildi';
      case 'shipped': return 'Yolda';
      case 'needed': return 'Gerekli';
      case 'available': return 'Müsait';
      case 'maintenance': return 'Bakımda';
      default: return status;
    }
  };

  const handleCallSupplier = (phone: string) => {
    const phoneNumber = phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Hata', 'Arama yapılamadı');
    });
  };

  const handleEmailSupplier = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Hata', 'E-posta açılamadı');
    });
  };

  const handleOrderFromSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowOrderModal(true);
  };

  const addMaterial = () => {
    if (!materialName || !materialCategory || !materialQuantity || !materialUnit) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: materialName,
      category: materialCategory,
      quantity: parseInt(materialQuantity),
      unit: materialUnit,
      status: materialStatus,
      supplier: materialSupplier || '-',
    };

    setMaterials([...materials, newMaterial]);
    resetMaterialForm();
    setShowMaterialModal(false);
    Alert.alert('Başarılı', 'Malzeme eklendi');
  };

  const addSupplier = () => {
    if (!supplierName || !supplierContact || !supplierPhone || !supplierCategory) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: supplierName,
      contact: supplierContact,
      phone: supplierPhone,
      email: supplierEmail || '',
      category: supplierCategory,
      rating: 0,
    };

    setSuppliers([...suppliers, newSupplier]);
    resetSupplierForm();
    setShowSupplierModal(false);
    Alert.alert('Başarılı', 'Tedarikçi eklendi');
  };

  const addEquipment = () => {
    if (!equipmentName || !equipmentType) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name: equipmentName,
      type: equipmentType,
      status: equipmentStatus,
      project: equipmentProject || '-',
    };

    setEquipment([...equipment, newEquipment]);
    resetEquipmentForm();
    setShowEquipmentModal(false);
    Alert.alert('Başarılı', 'Ekipman eklendi');
  };

  const submitOrder = () => {
    if (!orderMaterial || !orderQuantity) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    Alert.alert(
      'Sipariş Gönderildi',
      `${selectedSupplier?.name} firmasına ${orderQuantity} adet ${orderMaterial} siparişi gönderildi.`,
      [{ text: 'Tamam' }]
    );

    setOrderMaterial('');
    setOrderQuantity('');
    setOrderNotes('');
    setSelectedSupplier(null);
    setShowOrderModal(false);
  };

  const resetMaterialForm = () => {
    setMaterialName('');
    setMaterialCategory('');
    setMaterialQuantity('');
    setMaterialUnit('');
    setMaterialStatus('needed');
    setMaterialSupplier('');
  };

  const resetSupplierForm = () => {
    setSupplierName('');
    setSupplierContact('');
    setSupplierPhone('');
    setSupplierEmail('');
    setSupplierCategory('');
  };

  const resetEquipmentForm = () => {
    setEquipmentName('');
    setEquipmentType('');
    setEquipmentStatus('available');
    setEquipmentProject('');
  };

  return (
    <View style={styles.container}>
      <Header title="Kaynaklar" showSearch showNotification showBack />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { id: 'materials', label: 'Malzemeler', icon: 'package' },
          { id: 'suppliers', label: 'Tedarikçiler', icon: 'truck' },
          { id: 'equipment', label: 'Ekipman', icon: 'tool' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Icon
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.id ? colors.white : colors.gray[500]}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'materials' && (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <Card style={styles.summaryCard}>
                <Icon name="package" size={20} color={colors.primary} />
                <Text style={styles.summaryValue}>{materials.length}</Text>
                <Text style={styles.summaryLabel}>Toplam Malzeme</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Icon name="alert-circle" size={20} color={colors.danger} />
                <Text style={[styles.summaryValue, { color: colors.danger }]}>
                  {materials.filter(m => m.status === 'needed').length}
                </Text>
                <Text style={styles.summaryLabel}>Gerekli</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Icon name="truck" size={20} color={colors.warning} />
                <Text style={[styles.summaryValue, { color: colors.warning }]}>
                  {materials.filter(m => m.status === 'ordered' || m.status === 'shipped').length}
                </Text>
                <Text style={styles.summaryLabel}>Yolda</Text>
              </Card>
            </View>

            {/* Materials List */}
            {materials.map((material) => (
              <Card key={material.id} style={styles.materialCard}>
                <View style={styles.materialHeader}>
                  <View style={[styles.materialIcon, { backgroundColor: colors.orange[50] }]}>
                    <Icon name="box" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>{material.name}</Text>
                    <Text style={styles.materialCategory}>{material.category}</Text>
                  </View>
                  <Badge
                    label={getStatusLabel(material.status)}
                    variant={
                      material.status === 'delivered' || material.status === 'inUse' ? 'success' :
                      material.status === 'needed' ? 'danger' : 'warning'
                    }
                  />
                </View>
                <View style={styles.materialDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Miktar</Text>
                    <Text style={styles.detailValue}>{material.quantity} {material.unit}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tedarikçi</Text>
                    <Text style={styles.detailValue}>{material.supplier}</Text>
                  </View>
                </View>
              </Card>
            ))}

            <Button title="Malzeme Ekle" icon="plus" onPress={() => setShowMaterialModal(true)} fullWidth />
          </>
        )}

        {activeTab === 'suppliers' && (
          <>
            {suppliers.map((supplier) => (
              <Card key={supplier.id} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierAvatar}>
                    <Text style={styles.supplierInitial}>{supplier.name[0]}</Text>
                  </View>
                  <View style={styles.supplierInfo}>
                    <Text style={styles.supplierName}>{supplier.name}</Text>
                    <Text style={styles.supplierCategory}>{supplier.category}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color={colors.warning} />
                    <Text style={styles.ratingText}>{supplier.rating}</Text>
                  </View>
                </View>
                <View style={styles.supplierDetails}>
                  <View style={styles.contactItem}>
                    <Icon name="user" size={14} color={colors.gray[400]} />
                    <Text style={styles.contactText}>{supplier.contact}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Icon name="phone" size={14} color={colors.gray[400]} />
                    <Text style={styles.contactText}>{supplier.phone}</Text>
                  </View>
                </View>
                <View style={styles.supplierActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleCallSupplier(supplier.phone)}>
                    <Icon name="phone" size={16} color={colors.primary} />
                    <Text style={styles.actionText}>Ara</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEmailSupplier(supplier.email)}>
                    <Icon name="mail" size={16} color={colors.primary} />
                    <Text style={styles.actionText}>E-posta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleOrderFromSupplier(supplier)}>
                    <Icon name="shopping-cart" size={16} color={colors.primary} />
                    <Text style={styles.actionText}>Sipariş</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}

            <Button title="Tedarikçi Ekle" icon="plus" onPress={() => setShowSupplierModal(true)} fullWidth />
          </>
        )}

        {activeTab === 'equipment' && (
          <>
            {equipment.map((item) => (
              <Card key={item.id} style={styles.equipmentCard}>
                <View style={styles.equipmentHeader}>
                  <View style={[styles.equipmentIcon, { backgroundColor: colors.infoLight }]}>
                    <Icon name="tool" size={20} color={colors.info} />
                  </View>
                  <View style={styles.equipmentInfo}>
                    <Text style={styles.equipmentName}>{item.name}</Text>
                    <Text style={styles.equipmentType}>{item.type}</Text>
                  </View>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                </View>
                <View style={styles.equipmentDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Durum</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(item.status) }]}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Proje</Text>
                    <Text style={styles.detailValue}>{item.project}</Text>
                  </View>
                </View>
              </Card>
            ))}

            <Button title="Ekipman Ekle" icon="plus" onPress={() => setShowEquipmentModal(true)} fullWidth />
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Material Modal */}
      <Modal visible={showMaterialModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowMaterialModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Malzeme Ekle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMaterialModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Malzeme Adı *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Malzeme adını girin"
                placeholderTextColor={colors.gray[400]}
                value={materialName}
                onChangeText={setMaterialName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Kategori *</Text>
              <View style={styles.optionsGrid}>
                {materialCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.optionItem, materialCategory === cat && styles.optionItemActive]}
                    onPress={() => setMaterialCategory(cat)}
                  >
                    <Text style={[styles.optionText, materialCategory === cat && styles.optionTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.formLabel}>Miktar *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  value={materialQuantity}
                  onChangeText={setMaterialQuantity}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Birim *</Text>
                <View style={styles.unitOptions}>
                  {materialUnits.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[styles.unitItem, materialUnit === unit && styles.unitItemActive]}
                      onPress={() => setMaterialUnit(unit)}
                    >
                      <Text style={[styles.unitText, materialUnit === unit && styles.unitTextActive]}>{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Durum</Text>
              <View style={styles.optionsGrid}>
                {materialStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.key}
                    style={[styles.optionItem, materialStatus === status.key && styles.optionItemActive]}
                    onPress={() => setMaterialStatus(status.key)}
                  >
                    <Text style={[styles.optionText, materialStatus === status.key && styles.optionTextActive]}>{status.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tedarikçi</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Tedarikçi adı"
                placeholderTextColor={colors.gray[400]}
                value={materialSupplier}
                onChangeText={setMaterialSupplier}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!materialName || !materialCategory || !materialQuantity || !materialUnit) && styles.submitButtonDisabled]}
              onPress={addMaterial}
              disabled={!materialName || !materialCategory || !materialQuantity || !materialUnit}
            >
              <Icon name="plus" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Malzeme Ekle</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Supplier Modal */}
      <Modal visible={showSupplierModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSupplierModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tedarikçi Ekle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSupplierModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Firma Adı *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Firma adını girin"
                placeholderTextColor={colors.gray[400]}
                value={supplierName}
                onChangeText={setSupplierName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Yetkili Kişi *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Yetkili kişi adı"
                placeholderTextColor={colors.gray[400]}
                value={supplierContact}
                onChangeText={setSupplierContact}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Telefon *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0532 123 4567"
                placeholderTextColor={colors.gray[400]}
                keyboardType="phone-pad"
                value={supplierPhone}
                onChangeText={setSupplierPhone}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>E-posta</Text>
              <TextInput
                style={styles.formInput}
                placeholder="info@firma.com"
                placeholderTextColor={colors.gray[400]}
                keyboardType="email-address"
                value={supplierEmail}
                onChangeText={setSupplierEmail}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Kategori *</Text>
              <View style={styles.optionsGrid}>
                {supplierCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.optionItem, supplierCategory === cat && styles.optionItemActive]}
                    onPress={() => setSupplierCategory(cat)}
                  >
                    <Text style={[styles.optionText, supplierCategory === cat && styles.optionTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!supplierName || !supplierContact || !supplierPhone || !supplierCategory) && styles.submitButtonDisabled]}
              onPress={addSupplier}
              disabled={!supplierName || !supplierContact || !supplierPhone || !supplierCategory}
            >
              <Icon name="plus" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Tedarikçi Ekle</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Equipment Modal */}
      <Modal visible={showEquipmentModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEquipmentModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ekipman Ekle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowEquipmentModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ekipman Adı *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ekipman adını girin"
                placeholderTextColor={colors.gray[400]}
                value={equipmentName}
                onChangeText={setEquipmentName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tür *</Text>
              <View style={styles.optionsGrid}>
                {equipmentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.optionItem, equipmentType === type && styles.optionItemActive]}
                    onPress={() => setEquipmentType(type)}
                  >
                    <Text style={[styles.optionText, equipmentType === type && styles.optionTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Durum</Text>
              <View style={styles.optionsGrid}>
                {equipmentStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.key}
                    style={[styles.optionItem, equipmentStatus === status.key && styles.optionItemActive]}
                    onPress={() => setEquipmentStatus(status.key)}
                  >
                    <Text style={[styles.optionText, equipmentStatus === status.key && styles.optionTextActive]}>{status.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Proje</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Atanacak proje"
                placeholderTextColor={colors.gray[400]}
                value={equipmentProject}
                onChangeText={setEquipmentProject}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!equipmentName || !equipmentType) && styles.submitButtonDisabled]}
              onPress={addEquipment}
              disabled={!equipmentName || !equipmentType}
            >
              <Icon name="plus" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Ekipman Ekle</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Order Modal */}
      <Modal visible={showOrderModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowOrderModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sipariş Ver</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowOrderModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedSupplier && (
              <View style={styles.selectedSupplierCard}>
                <View style={styles.supplierAvatar}>
                  <Text style={styles.supplierInitial}>{selectedSupplier.name[0]}</Text>
                </View>
                <View>
                  <Text style={styles.selectedSupplierName}>{selectedSupplier.name}</Text>
                  <Text style={styles.selectedSupplierCategory}>{selectedSupplier.category}</Text>
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Malzeme *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Sipariş edilecek malzeme"
                placeholderTextColor={colors.gray[400]}
                value={orderMaterial}
                onChangeText={setOrderMaterial}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Miktar *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Miktar girin"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                value={orderQuantity}
                onChangeText={setOrderQuantity}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notlar</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Sipariş notları..."
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={orderNotes}
                onChangeText={setOrderNotes}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!orderMaterial || !orderQuantity) && styles.submitButtonDisabled]}
              onPress={submitOrder}
              disabled={!orderMaterial || !orderQuantity}
            >
              <Icon name="send" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Sipariş Gönder</Text>
            </TouchableOpacity>
          </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  materialCard: {
    marginBottom: spacing.sm,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  materialIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  materialCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: 2,
  },
  materialDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[800],
  },
  supplierCard: {
    marginBottom: spacing.sm,
  },
  supplierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  supplierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  supplierInitial: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.white,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  supplierCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  supplierDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  supplierActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.orange[50],
    borderRadius: borderRadius.lg,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  equipmentCard: {
    marginBottom: spacing.sm,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  equipmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  equipmentType: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  equipmentDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  bottomSpacing: {
    height: 100,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
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
  formGroup: {
    marginBottom: spacing.lg,
  },
  formLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
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
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  optionItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  unitOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  unitItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[100],
  },
  unitItemActive: {
    backgroundColor: colors.primary,
  },
  unitText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  unitTextActive: {
    color: colors.white,
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
  selectedSupplierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  selectedSupplierName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  selectedSupplierCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
});

export default ResourcesScreen;
