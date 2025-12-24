export * from './theme';
export { default as theme } from './theme';

// App sabitleri
export const APP_NAME = 'Constier';
export const APP_VERSION = '1.0.0';

// İnşaat aşamaları
export const CONSTRUCTION_PHASES = [
  { id: 'excavation', name: 'Temel Kazı', order: 1 },
  { id: 'foundation', name: 'İksa - Zemin', order: 2 },
  { id: 'roughConstruction', name: 'Kaba İnşaat', order: 3 },
  { id: 'electrical', name: 'Elektrik Tesisatı', order: 4 },
  { id: 'plumbing', name: 'Su Tesisatı', order: 5 },
  { id: 'heating', name: 'Isıtma Tesisatı', order: 6 },
  { id: 'facade', name: 'Dış Cephe', order: 7 },
  { id: 'plastering', name: 'Alçı İşleri', order: 8 },
  { id: 'painting', name: 'Boya İşleri', order: 9 },
  { id: 'flooring', name: 'Parke/Zemin', order: 10 },
  { id: 'doors', name: 'Kapı Montajı', order: 11 },
  { id: 'windows', name: 'Pencere Montajı', order: 12 },
  { id: 'elevator', name: 'Asansör', order: 13 },
  { id: 'insulation', name: 'Yalıtım', order: 14 },
  { id: 'roof', name: 'Çatı', order: 15 },
  { id: 'permits', name: 'Proje/Harita/Ruhsat', order: 16 },
];

// Varsayılan bütçe oranları
export const DEFAULT_BUDGET_RATIOS = {
  roughConstruction: 0.192,    // Kaba yapı %19.20
  electrical: 0.091,           // Elektrik işleri %9.10
  plumbing: 0.092,             // Tesisat %9.20
  windows: 0.071,              // Pencere %7.10
  woodwork: 0.061,             // Ahşap işler %6.10
  doors: 0.047,                // Kapı %4.70
  facade: 0.043,               // Dış cephe %4.30
  elevator: 0.029,             // Asansör %2.90
  other: 0.374,                // Diğer %37.40
};

// Görev durumları
export const TASK_STATUS = {
  pending: { label: 'Bekliyor', color: '#9CA3AF' },
  inProgress: { label: 'Devam Ediyor', color: '#3B82F6' },
  completed: { label: 'Tamamlandı', color: '#10B981' },
  delayed: { label: 'Gecikmiş', color: '#EF4444' },
  onHold: { label: 'Beklemede', color: '#F59E0B' },
};

// Öncelik seviyeleri
export const PRIORITY_LEVELS = {
  low: { label: 'Düşük', color: '#9CA3AF', bgColor: '#F3F4F6' },
  medium: { label: 'Orta', color: '#F97316', bgColor: '#FFF7ED' },
  high: { label: 'Yüksek', color: '#EF4444', bgColor: '#FEE2E2' },
};

// Kalite durumları
export const QUALITY_STATUS = {
  suitable: { label: 'Uygun', color: '#10B981' },
  needsFix: { label: 'Düzeltilecek', color: '#F59E0B' },
  rejected: { label: 'Reddedildi', color: '#EF4444' },
};

// İSG kategorileri
export const SAFETY_CATEGORIES = [
  { id: 'ppe', name: 'Kişisel Koruyucu Ekipman' },
  { id: 'scaffolding', name: 'İskele Güvenliği' },
  { id: 'electrical', name: 'Elektrik Güvenliği' },
  { id: 'fire', name: 'Yangın Güvenliği' },
  { id: 'falling', name: 'Düşme Riski' },
  { id: 'excavation', name: 'Kazı Güvenliği' },
  { id: 'crane', name: 'Vinç/Kaldırma Güvenliği' },
  { id: 'chemical', name: 'Kimyasal Madde' },
];

// Birimler
export const UNITS = {
  volume: ['m³', 'lt', 'cu yd'],
  length: ['m', 'cm', 'mm', 'ft'],
  area: ['m²', 'ft²'],
  weight: ['kg', 'ton', 'lb'],
  count: ['adet', 'paket', 'kutu'],
};
