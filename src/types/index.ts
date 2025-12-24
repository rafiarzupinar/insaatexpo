// Kullanıcı tipleri
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'manager' | 'worker';
  createdAt: Date;
  updatedAt: Date;
}

// Proje tipleri
export interface Project {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  progress: number; // 0-100
  totalBudget: number;
  spentBudget: number;
  managerId: string;
  teamIds: string[];
  phases: ProjectPhase[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'planning' | 'active' | 'onHold' | 'completed' | 'cancelled';

export interface ProjectPhase {
  id: string;
  projectId: string;
  phaseType: string;
  name: string;
  order: number;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  status: PhaseStatus;
  responsibleTeamId?: string;
  notes?: string;
  photos: string[];
  qualityStatus: QualityStatus;
}

export type PhaseStatus = 'pending' | 'inProgress' | 'completed' | 'delayed';
export type QualityStatus = 'suitable' | 'needsFix' | 'rejected' | 'pending';

// Görev tipleri
export interface Task {
  id: string;
  projectId: string;
  phaseId?: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  priority: Priority;
  progress: number; // 0-100
  assignedTo: string[];
  createdBy: string;
  isDelayed: boolean;
  delayDays?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'inProgress' | 'completed' | 'delayed' | 'onHold';
export type Priority = 'low' | 'medium' | 'high';

// Finansal tipler
export interface Budget {
  id: string;
  projectId: string;
  totalAmount: number;
  allocations: BudgetAllocation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAllocation {
  id: string;
  budgetId: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  percentage: number;
}

export interface Expense {
  id: string;
  projectId: string;
  budgetId: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  invoiceNumber?: string;
  vendor?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  createdAt: Date;
}

// Kaynak & Tedarik tipleri
export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId?: string;
  projectId: string;
  status: MaterialStatus;
  orderDate?: Date;
  deliveryDate?: Date;
  notes?: string;
}

export type MaterialStatus = 'needed' | 'ordered' | 'shipped' | 'delivered' | 'inUse';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string[];
  rating?: number;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'inUse' | 'maintenance' | 'outOfService';
  assignedProjectId?: string;
  dailyRate?: number;
  notes?: string;
}

// İş gücü tipleri
export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  phone: string;
  email?: string;
  specialization: string[];
  dailyRate?: number;
  status: 'active' | 'onLeave' | 'inactive';
  currentProjectId?: string;
  currentPhaseId?: string;
  photoUrl?: string;
  notes?: string;
}

export type WorkerRole = 'foreman' | 'skilled' | 'unskilled' | 'contractor' | 'engineer';

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  projectId?: string;
  specialization: string;
}

// İSG tipleri
export interface SafetyChecklist {
  id: string;
  projectId: string;
  date: Date;
  inspectorId: string;
  category: string;
  items: ChecklistItem[];
  overallStatus: 'pass' | 'fail' | 'partialPass';
  notes?: string;
  photos: string[];
}

export interface ChecklistItem {
  id: string;
  description: string;
  isCompliant: boolean;
  notes?: string;
}

export interface Incident {
  id: string;
  projectId: string;
  date: Date;
  type: 'accident' | 'nearMiss' | 'hazard';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  location: string;
  involvedWorkerIds: string[];
  reportedBy: string;
  actions: string[];
  status: 'open' | 'investigating' | 'resolved';
  photos: string[];
}

export interface RiskArea {
  id: string;
  projectId: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  preventiveActions: string[];
  responsibleId: string;
  status: 'active' | 'mitigated' | 'resolved';
}

// Rapor tipleri
export interface Report {
  id: string;
  projectId: string;
  type: ReportType;
  title: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  generatedBy: string;
  generatedAt: Date;
  data: Record<string, any>;
  pdfUrl?: string;
}

export type ReportType = 'progress' | 'financial' | 'safety' | 'delay' | 'summary';

// Dashboard tipleri
export interface DashboardStats {
  projectProgress: number;
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  profitMargin: number;
  delayedTasks: number;
  upcomingTasks: Task[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'task' | 'expense' | 'phase' | 'incident' | 'material';
  action: string;
  description: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Navigation tipleri
export type RootStackParamList = {
  Main: undefined;
  ProjectDetail: { projectId: string };
  TaskDetail: { taskId: string };
  AddTask: { projectId?: string };
  AddExpense: { projectId: string };
  WorkerDetail: { workerId: string };
  ReportDetail: { reportId: string };
  Settings: undefined;
  Profile: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Projects: undefined;
  QuickAction: undefined;
  Safety: undefined;
  Analytics: undefined;
};

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
