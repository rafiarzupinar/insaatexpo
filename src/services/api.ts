// Supabase API Servisleri
import { supabase, handleSupabaseError } from '../lib/supabase';
import {
  Project,
  ProjectInsert,
  ProjectUpdate,
  Task,
  TaskInsert,
  TaskUpdate,
  Transaction,
  Material,
  Equipment,
  Personnel,
  Supplier,
  SafetyIncident,
  SafetyChecklist,
} from '../types/database';

// ==================== PROJELER ====================
export const projectsApi = {
  // Tüm projeleri getir
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  // Tek proje getir
  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  // Proje oluştur
  async create(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  // Proje güncelle
  async update(id: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  // Proje sil
  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },
};

// ==================== GÖREVLER ====================
export const tasksApi = {
  async getAll(projectId?: string) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(task: TaskInsert) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },
};

// ==================== FİNANS ====================
export const transactionsApi = {
  async getAll(projectId?: string) {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(transaction: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },

  // Özet istatistikler
  async getSummary(projectId?: string) {
    let query = supabase.from('transactions').select('type, amount');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);

    const income = data?.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const expense = data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    return { data: { income, expense, balance: income - expense }, error: null };
  },
};

// ==================== MALZEMELER ====================
export const materialsApi = {
  async getAll(projectId?: string) {
    let query = supabase
      .from('materials')
      .select('*')
      .order('name');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(material: Partial<Material>) {
    const { data, error } = await supabase
      .from('materials')
      .insert(material)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: Partial<Material>) {
    const { data, error } = await supabase
      .from('materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },

  // Düşük stok uyarısı
  async getLowStock() {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .filter('quantity', 'lte', 'min_stock');

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },
};

// ==================== EKİPMAN ====================
export const equipmentApi = {
  async getAll(projectId?: string) {
    let query = supabase
      .from('equipment')
      .select('*')
      .order('name');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(equipment: Partial<Equipment>) {
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipment)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: Partial<Equipment>) {
    const { data, error } = await supabase
      .from('equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },
};

// ==================== PERSONEL ====================
export const personnelApi = {
  async getAll(projectId?: string) {
    let query = supabase
      .from('personnel')
      .select('*')
      .order('name');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(person: Partial<Personnel>) {
    const { data, error } = await supabase
      .from('personnel')
      .insert(person)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: Partial<Personnel>) {
    const { data, error } = await supabase
      .from('personnel')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('personnel')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },
};

// ==================== TEDARİKÇİLER ====================
export const suppliersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async create(supplier: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async update(id: string, updates: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
    return { error: null };
  },
};

// ==================== GÜVENLİK ====================
export const safetyApi = {
  // Olaylar
  async getIncidents(projectId?: string) {
    let query = supabase
      .from('safety_incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async createIncident(incident: Partial<SafetyIncident>) {
    const { data, error } = await supabase
      .from('safety_incidents')
      .insert(incident)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async updateIncident(id: string, updates: Partial<SafetyIncident>) {
    const { data, error } = await supabase
      .from('safety_incidents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  // Kontrol listeleri
  async getChecklists(projectId?: string) {
    let query = supabase
      .from('safety_checklists')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async createChecklist(checklist: Partial<SafetyChecklist>) {
    const { data, error } = await supabase
      .from('safety_checklists')
      .insert(checklist)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },

  async updateChecklist(id: string, updates: Partial<SafetyChecklist>) {
    const { data, error } = await supabase
      .from('safety_checklists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return { data, error: null };
  },
};

// ==================== DASHBOARD ====================
export const dashboardApi = {
  async getSummary() {
    // Paralel sorgular
    const [projectsRes, tasksRes, transactionsRes] = await Promise.all([
      supabase.from('projects').select('id, name, progress, status, budget, spent'),
      supabase.from('tasks').select('id, status, priority'),
      supabase.from('transactions').select('type, amount'),
    ]);

    const projects = projectsRes.data || [];
    const tasks = tasksRes.data || [];
    const transactions = transactionsRes.data || [];

    // Hesaplamalar
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      data: {
        projects: {
          total: projects.length,
          active: activeProjects,
        },
        budget: {
          total: totalBudget,
          spent: totalSpent,
          remaining: totalBudget - totalSpent,
        },
        tasks: {
          total: tasks.length,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },
        finance: {
          income,
          expense,
          balance: income - expense,
        },
      },
      error: null,
    };
  },
};
