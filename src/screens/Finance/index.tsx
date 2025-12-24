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
import Svg, { Circle } from 'react-native-svg';
import { Header, Card, TabBar } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

// Budget Categories with default ratios
const budgetCategories = [
  { id: '1', name: 'Kaba Yapı', icon: 'home', ratio: 19.2, color: '#FF6B6B' },
  { id: '2', name: 'Elektrik', icon: 'zap', ratio: 9.1, color: '#4ECDC4' },
  { id: '3', name: 'Tesisat', icon: 'droplet', ratio: 9.2, color: '#45B7D1' },
  { id: '4', name: 'Pencere/Cam', icon: 'square', ratio: 7.1, color: '#96CEB4' },
  { id: '5', name: 'Ahşap İşler', icon: 'layers', ratio: 6.1, color: '#FFEAA7' },
  { id: '6', name: 'Kapı', icon: 'log-in', ratio: 4.7, color: '#DDA0DD' },
  { id: '7', name: 'Dış Cephe', icon: 'grid', ratio: 4.3, color: '#98D8C8' },
  { id: '8', name: 'Asansör', icon: 'arrow-up', ratio: 2.9, color: '#F7DC6F' },
  { id: '9', name: 'İşçilik', icon: 'users', ratio: 25.0, color: '#BB8FCE' },
  { id: '10', name: 'Diğer', icon: 'more-horizontal', ratio: 12.4, color: '#85C1E9' },
];

// Mock data
const initialBudget = {
  total: 15000000,
  categories: budgetCategories.map(cat => ({
    ...cat,
    budget: Math.round(15000000 * cat.ratio / 100),
    spent: Math.round(15000000 * cat.ratio / 100 * (Math.random() * 0.7 + 0.1)),
  })),
};

const initialTransactions = [
  { id: '1', description: 'Beton Siparişi', amount: -125000, date: '2025-07-15', category: 'Kaba Yapı', vendor: 'ABC Beton' },
  { id: '2', description: 'Demir Malzeme', amount: -89000, date: '2025-07-14', category: 'Kaba Yapı', vendor: 'Demir Ltd.' },
  { id: '3', description: 'Müşteri Ödemesi', amount: 500000, date: '2025-07-12', category: 'Gelir', vendor: 'Proje A' },
  { id: '4', description: 'Elektrik Kablo', amount: -45000, date: '2025-07-10', category: 'Elektrik', vendor: 'Elektrik AŞ' },
  { id: '5', description: 'Su Tesisatı', amount: -67000, date: '2025-07-08', category: 'Tesisat', vendor: 'Tesisat Ltd.' },
  { id: '6', description: 'PVC Pencere', amount: -234000, date: '2025-07-05', category: 'Pencere/Cam', vendor: 'Cam AŞ' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Donut Chart Component
const DonutChart = ({ data, size = 160, strokeWidth = 24 }: { data: { name: string; value: number; color: string }[]; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;

  return (
    <Svg width={size} height={size}>
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
        const rotation = (cumulativePercentage * 360) / 100 - 90;
        cumulativePercentage += percentage;

        return (
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${center} ${center})`}
          />
        );
      })}
      <Circle
        cx={center}
        cy={center}
        r={radius - strokeWidth / 2 - 10}
        fill={colors.white}
      />
    </Svg>
  );
};

// Bar Chart Component
const HorizontalBarChart = ({ data }: { data: { name: string; budget: number; spent: number; color: string }[] }) => {
  const maxValue = Math.max(...data.map(d => d.budget));

  return (
    <View style={styles.barChartContainer}>
      {data.slice(0, 6).map((item, index) => {
        const budgetWidth = (item.budget / maxValue) * 100;
        const spentWidth = (item.spent / maxValue) * 100;
        const percentage = Math.round((item.spent / item.budget) * 100);

        return (
          <View key={index} style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>{item.name}</Text>
              <Text style={[
                styles.barPercentage,
                percentage > 90 ? { color: colors.danger } : percentage > 70 ? { color: colors.warning } : { color: colors.success }
              ]}>
                %{percentage}
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barBudget, { width: `${budgetWidth}%`, backgroundColor: colors.gray[200] }]} />
              <View style={[styles.barSpent, { width: `${spentWidth}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const FinanceScreen = () => {
  const [activeTab, setActiveTab] = useState('ozet');
  const [budget, setBudget] = useState(initialBudget);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof budget.categories[0] | null>(null);

  // Form states
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Additional states
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const tabs = [
    { key: 'ozet', label: 'Özet' },
    { key: 'butce', label: 'Bütçe' },
    { key: 'harcamalar', label: 'Harcamalar' },
  ];

  // Calculations
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = budget.total - totalSpent;
  const spentPercentage = Math.round((totalSpent / budget.total) * 100);

  const donutData = budget.categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  const addExpense = () => {
    if (!expenseAmount || !expenseCategory) return;

    const amount = parseFloat(expenseAmount);
    const newTransaction = {
      id: Date.now().toString(),
      description: expenseDescription || 'Harcama',
      amount: -amount,
      date: new Date().toISOString().split('T')[0],
      category: expenseCategory,
      vendor: expenseVendor || '-',
    };

    setTransactions([newTransaction, ...transactions]);

    // Update category spent
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.name === expenseCategory
          ? { ...cat, spent: cat.spent + amount }
          : cat
      ),
    }));

    // Reset form
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseCategory('');
    setExpenseVendor('');
    setShowAddExpenseModal(false);
  };

  const updateCategoryBudget = () => {
    if (!selectedCategory || !newBudgetAmount) return;

    const newAmount = parseFloat(newBudgetAmount);
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === selectedCategory.id
          ? { ...cat, budget: newAmount }
          : cat
      ),
    }));

    setNewBudgetAmount('');
    setSelectedCategory(null);
    setShowEditBudgetModal(false);
  };

  const addIncome = () => {
    if (!incomeAmount) return;

    const amount = parseFloat(incomeAmount);
    const newTransaction = {
      id: Date.now().toString(),
      description: incomeDescription || 'Gelir',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      category: 'Gelir',
      vendor: incomeSource || '-',
    };

    setTransactions([newTransaction, ...transactions]);

    // Update total budget
    setBudget(prev => ({
      ...prev,
      total: prev.total + amount,
    }));

    // Reset form
    setIncomeAmount('');
    setIncomeDescription('');
    setIncomeSource('');
    setShowIncomeModal(false);
    Alert.alert('Başarılı', 'Gelir eklendi');
  };

  const handleGenerateReport = () => {
    Alert.alert(
      'Rapor Oluştur',
      'Hangi raporu oluşturmak istiyorsunuz?',
      [
        { text: 'Aylık Özet', onPress: () => Alert.alert('Rapor', 'Aylık özet raporu hazırlanıyor...') },
        { text: 'Kategori Raporu', onPress: () => Alert.alert('Rapor', 'Kategori raporu hazırlanıyor...') },
        { text: 'Harcama Detayı', onPress: () => Alert.alert('Rapor', 'Harcama detay raporu hazırlanıyor...') },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const handleEditTotalBudget = () => {
    Alert.alert(
      'Toplam Bütçe Düzenle',
      'Toplam bütçeyi düzenlemek için Bütçe sekmesinden kategori detaylarına gidin.',
      [{ text: 'Tamam' }]
    );
  };

  const filteredTransactions = activeFilter === 'Tümü'
    ? transactions
    : transactions.filter(tx => tx.category === activeFilter);

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Icon name="credit-card" size={20} color={colors.primary} />
          <Text style={styles.summaryLabel}>Toplam Bütçe</Text>
          <Text style={styles.summaryValue}>{formatCurrency(budget.total)}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Icon name="trending-down" size={20} color={colors.danger} />
          <Text style={styles.summaryLabel}>Harcanan</Text>
          <Text style={[styles.summaryValue, { color: colors.danger }]}>{formatCurrency(totalSpent)}</Text>
        </Card>
      </View>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Icon name="trending-up" size={20} color={colors.success} />
          <Text style={styles.summaryLabel}>Kalan</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrency(totalRemaining)}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Icon name="pie-chart" size={20} color={colors.warning} />
          <Text style={styles.summaryLabel}>Kullanım</Text>
          <Text style={[styles.summaryValue, { color: spentPercentage > 80 ? colors.danger : colors.warning }]}>
            %{spentPercentage}
          </Text>
        </Card>
      </View>

      {/* Donut Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Harcama Dağılımı</Text>
        <View style={styles.donutContainer}>
          <DonutChart data={donutData} />
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterLabel}>Toplam</Text>
            <Text style={styles.donutCenterValue}>{formatCurrency(totalSpent)}</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {budget.categories.slice(0, 6).map((cat, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
              <Text style={styles.legendText}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={styles.quickAction} onPress={() => setShowAddExpenseModal(true)}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.dangerLight }]}>
            <Icon name="minus" size={20} color={colors.danger} />
          </View>
          <Text style={styles.quickActionText}>Harcama Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => setShowIncomeModal(true)}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
            <Icon name="plus" size={20} color={colors.success} />
          </View>
          <Text style={styles.quickActionText}>Gelir Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={handleGenerateReport}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.infoLight }]}>
            <Icon name="file-text" size={20} color={colors.info} />
          </View>
          <Text style={styles.quickActionText}>Rapor</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Card style={styles.transactionsCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Tümü</Text>
          </TouchableOpacity>
        </View>
        {transactions.slice(0, 4).map((tx) => (
          <View key={tx.id} style={styles.transactionItem}>
            <View style={[
              styles.transactionIcon,
              { backgroundColor: tx.amount > 0 ? colors.successLight : colors.dangerLight }
            ]}>
              <Icon
                name={tx.amount > 0 ? 'arrow-down-left' : 'arrow-up-right'}
                size={16}
                color={tx.amount > 0 ? colors.success : colors.danger}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDesc}>{tx.description}</Text>
              <Text style={styles.transactionCategory}>{tx.category}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionAmount,
                { color: tx.amount > 0 ? colors.success : colors.danger }
              ]}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </Text>
              <Text style={styles.transactionDate}>{tx.date}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderBudget = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Total Budget Card */}
      <Card style={styles.totalBudgetCard}>
        <View style={styles.totalBudgetHeader}>
          <View>
            <Text style={styles.totalBudgetLabel}>Toplam Bütçe</Text>
            <Text style={styles.totalBudgetValue}>{formatCurrency(budget.total)}</Text>
          </View>
          <TouchableOpacity style={styles.editBudgetBtn} onPress={handleEditTotalBudget}>
            <Icon name="edit-2" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.budgetProgressBar}>
          <View style={[styles.budgetProgressFill, { width: `${spentPercentage}%` }]} />
        </View>
        <View style={styles.budgetProgressLabels}>
          <Text style={styles.budgetProgressText}>Harcanan: {formatCurrency(totalSpent)}</Text>
          <Text style={styles.budgetProgressText}>Kalan: {formatCurrency(totalRemaining)}</Text>
        </View>
      </Card>

      {/* Bar Chart */}
      <Card>
        <Text style={styles.sectionTitle}>Kategori Kullanımı</Text>
        <HorizontalBarChart data={budget.categories} />
      </Card>

      {/* Category List */}
      <Card>
        <Text style={styles.sectionTitle}>Kategori Detayları</Text>
        {budget.categories.map((cat) => {
          const percentage = Math.round((cat.spent / cat.budget) * 100);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => {
                setSelectedCategory(cat);
                setNewBudgetAmount(cat.budget.toString());
                setShowEditBudgetModal(true);
              }}
            >
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Icon name={cat.icon as any} size={18} color={cat.color} />
                </View>
                <View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryBudget}>Bütçe: {formatCurrency(cat.budget)}</Text>
                </View>
              </View>
              <View style={styles.categoryRight}>
                <Text style={[
                  styles.categorySpent,
                  percentage > 90 ? { color: colors.danger } : percentage > 70 ? { color: colors.warning } : { color: colors.success }
                ]}>
                  {formatCurrency(cat.spent)}
                </Text>
                <Text style={styles.categoryPercentage}>%{percentage}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderExpenses = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'Tümü' && styles.filterChipActive]}
          onPress={() => setActiveFilter('Tümü')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'Tümü' && styles.filterChipTextActive]}>Tümü</Text>
        </TouchableOpacity>
        {budgetCategories.slice(0, 5).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.filterChip, activeFilter === cat.name && styles.filterChipActive]}
            onPress={() => setActiveFilter(cat.name)}
          >
            <Text style={[styles.filterChipText, activeFilter === cat.name && styles.filterChipTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tüm İşlemler ({filteredTransactions.length})</Text>
          <TouchableOpacity style={styles.sortBtn} onPress={() => {
            Alert.alert('Sırala', 'Sıralama türünü seçin', [
              { text: 'Tarihe Göre (Yeni)', onPress: () => {} },
              { text: 'Tarihe Göre (Eski)', onPress: () => {} },
              { text: 'Tutara Göre (Yüksek)', onPress: () => {} },
              { text: 'Tutara Göre (Düşük)', onPress: () => {} },
              { text: 'İptal', style: 'cancel' },
            ]);
          }}>
            <Icon name="filter" size={18} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
        {filteredTransactions.map((tx) => (
          <TouchableOpacity key={tx.id} style={styles.expenseItem}>
            <View style={[
              styles.expenseIcon,
              { backgroundColor: tx.amount > 0 ? colors.successLight : colors.dangerLight }
            ]}>
              <Icon
                name={tx.amount > 0 ? 'arrow-down-left' : 'arrow-up-right'}
                size={18}
                color={tx.amount > 0 ? colors.success : colors.danger}
              />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseDesc}>{tx.description}</Text>
              <View style={styles.expenseMeta}>
                <Text style={styles.expenseCategory}>{tx.category}</Text>
                <Text style={styles.expenseDot}>•</Text>
                <Text style={styles.expenseVendor}>{tx.vendor}</Text>
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={[
                styles.expenseAmount,
                { color: tx.amount > 0 ? colors.success : colors.danger }
              ]}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </Text>
              <Text style={styles.expenseDate}>{tx.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="Finans" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'ozet' && renderOverview()}
      {activeTab === 'butce' && renderBudget()}
      {activeTab === 'harcamalar' && renderExpenses()}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddExpenseModal(true)}>
        <Icon name="plus" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddExpenseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Harcama Ekle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddExpenseModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tutar *</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₺</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={colors.gray[300]}
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                />
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Kategori *</Text>
              <View style={styles.categoryGrid}>
                {budgetCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryOption,
                      expenseCategory === cat.name && styles.categoryOptionActive
                    ]}
                    onPress={() => setExpenseCategory(cat.name)}
                  >
                    <View style={[styles.categoryOptionIcon, { backgroundColor: cat.color + '20' }]}>
                      <Icon name={cat.icon as any} size={16} color={cat.color} />
                    </View>
                    <Text style={[
                      styles.categoryOptionText,
                      expenseCategory === cat.name && styles.categoryOptionTextActive
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Açıklama</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Harcama açıklaması"
                placeholderTextColor={colors.gray[400]}
                value={expenseDescription}
                onChangeText={setExpenseDescription}
              />
            </View>

            {/* Vendor */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tedarikçi / Firma</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Firma adı"
                placeholderTextColor={colors.gray[400]}
                value={expenseVendor}
                onChangeText={setExpenseVendor}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, (!expenseAmount || !expenseCategory) && styles.submitButtonDisabled]}
              onPress={addExpense}
              disabled={!expenseAmount || !expenseCategory}
            >
              <Icon name="check" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Harcama Kaydet</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        visible={showEditBudgetModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditBudgetModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bütçe Düzenle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowEditBudgetModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedCategory && (
              <>
                <View style={styles.selectedCategoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: selectedCategory.color + '20' }]}>
                    <Icon name={selectedCategory.icon as any} size={24} color={selectedCategory.color} />
                  </View>
                  <Text style={styles.selectedCategoryName}>{selectedCategory.name}</Text>
                </View>

                <View style={styles.budgetInfoRow}>
                  <View style={styles.budgetInfoItem}>
                    <Text style={styles.budgetInfoLabel}>Mevcut Bütçe</Text>
                    <Text style={styles.budgetInfoValue}>{formatCurrency(selectedCategory.budget)}</Text>
                  </View>
                  <View style={styles.budgetInfoItem}>
                    <Text style={styles.budgetInfoLabel}>Harcanan</Text>
                    <Text style={[styles.budgetInfoValue, { color: colors.danger }]}>
                      {formatCurrency(selectedCategory.spent)}
                    </Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Yeni Bütçe Tutarı</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.currencySymbol}>₺</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0"
                      placeholderTextColor={colors.gray[300]}
                      keyboardType="numeric"
                      value={newBudgetAmount}
                      onChangeText={setNewBudgetAmount}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, !newBudgetAmount && styles.submitButtonDisabled]}
                  onPress={updateCategoryBudget}
                  disabled={!newBudgetAmount}
                >
                  <Icon name="check" size={20} color={colors.white} />
                  <Text style={styles.submitButtonText}>Bütçeyi Güncelle</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        visible={showIncomeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowIncomeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gelir Ekle</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowIncomeModal(false)}>
              <Icon name="x" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tutar *</Text>
              <View style={styles.amountInputContainer}>
                <Text style={[styles.currencySymbol, { color: colors.success }]}>₺</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={colors.gray[300]}
                  keyboardType="numeric"
                  value={incomeAmount}
                  onChangeText={setIncomeAmount}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Açıklama</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Gelir açıklaması"
                placeholderTextColor={colors.gray[400]}
                value={incomeDescription}
                onChangeText={setIncomeDescription}
              />
            </View>

            {/* Source */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Kaynak / Müşteri</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Gelir kaynağı"
                placeholderTextColor={colors.gray[400]}
                value={incomeSource}
                onChangeText={setIncomeSource}
              />
            </View>

            {/* Income Types */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gelir Türü</Text>
              <View style={styles.incomeTypeGrid}>
                {['Müşteri Ödemesi', 'Banka Kredisi', 'Yatırım', 'Diğer'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.incomeTypeBtn,
                      incomeDescription === type && styles.incomeTypeBtnActive
                    ]}
                    onPress={() => setIncomeDescription(type)}
                  >
                    <Text style={[
                      styles.incomeTypeText,
                      incomeDescription === type && styles.incomeTypeTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.success }, !incomeAmount && styles.submitButtonDisabled]}
              onPress={addIncome}
              disabled={!incomeAmount}
            >
              <Icon name="plus" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Gelir Kaydet</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },

  // Summary Cards
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: spacing.xs,
  },

  // Donut Chart
  chartCard: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  donutContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutCenterLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  donutCenterValue: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.gray[900],
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  legendText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
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

  // Transactions
  transactionsCard: {
    marginBottom: spacing.sm,
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
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  transactionDesc: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
  },
  transactionCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 2,
  },

  // Budget Tab
  totalBudgetCard: {
    marginBottom: spacing.sm,
  },
  totalBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  totalBudgetLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  totalBudgetValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginTop: spacing.xs,
  },
  editBudgetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetProgressBar: {
    height: 12,
    backgroundColor: colors.gray[100],
    borderRadius: 6,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  budgetProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  budgetProgressText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },

  // Bar Chart
  barChartContainer: {
    marginTop: spacing.sm,
  },
  barItem: {
    marginBottom: spacing.md,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  barPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    position: 'relative',
  },
  barBudget: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },
  barSpent: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },

  // Category List
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
  },
  categoryBudget: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categorySpent: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  categoryPercentage: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },

  // Expenses Tab
  filterScroll: {
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  sortBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  expenseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  expenseDesc: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expenseCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
  },
  expenseDot: {
    color: colors.gray[400],
    marginHorizontal: 4,
  },
  expenseVendor: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  expenseDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 2,
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

  // Modal
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

  // Form
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[400],
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    paddingVertical: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryOption: {
    width: '30%',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[50],
  },
  categoryOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  categoryOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryOptionText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    textAlign: 'center',
  },
  categoryOptionTextActive: {
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

  // Edit Budget Modal
  selectedCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  selectedCategoryName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray[800],
  },
  budgetInfoRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  budgetInfoItem: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  budgetInfoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  budgetInfoValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },

  bottomSpacing: {
    height: 120,
  },

  // Income Type Grid
  incomeTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  incomeTypeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  incomeTypeBtnActive: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  incomeTypeText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  incomeTypeTextActive: {
    color: colors.success,
    fontWeight: '600',
  },
});

export default FinanceScreen;
