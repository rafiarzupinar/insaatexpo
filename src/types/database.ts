// Supabase veritabanı tipleri
// Bu dosya otomatik generate edilebilir: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          spent: number | null;
          progress: number | null;
          status: string | null;
          manager: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          spent?: number | null;
          progress?: number | null;
          status?: string | null;
          manager?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          spent?: number | null;
          progress?: number | null;
          status?: string | null;
          manager?: string | null;
          description?: string | null;
        };
      };
      project_phases: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          status: string | null;
          progress: number | null;
          start_date: string | null;
          end_date: string | null;
          notes: string | null;
          order_index: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          status?: string | null;
          progress?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          notes?: string | null;
          order_index?: number | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          status?: string | null;
          progress?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          notes?: string | null;
          order_index?: number | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string | null;
          phase_id: string | null;
          title: string;
          description: string | null;
          assignee: string | null;
          priority: string | null;
          status: string | null;
          start_date: string | null;
          end_date: string | null;
          progress: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          phase_id?: string | null;
          title: string;
          description?: string | null;
          assignee?: string | null;
          priority?: string | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          progress?: number | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          phase_id?: string | null;
          title?: string;
          description?: string | null;
          assignee?: string | null;
          priority?: string | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          progress?: number | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          project_id: string | null;
          type: string;
          category: string | null;
          description: string | null;
          amount: number;
          date: string | null;
          payment_method: string | null;
          vendor: string | null;
          invoice_no: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          type: string;
          category?: string | null;
          description?: string | null;
          amount: number;
          date?: string | null;
          payment_method?: string | null;
          vendor?: string | null;
          invoice_no?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          type?: string;
          category?: string | null;
          description?: string | null;
          amount?: number;
          date?: string | null;
          payment_method?: string | null;
          vendor?: string | null;
          invoice_no?: string | null;
          status?: string | null;
        };
      };
      materials: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          category: string | null;
          unit: string | null;
          quantity: number | null;
          min_stock: number | null;
          unit_price: number | null;
          supplier: string | null;
          location: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          category?: string | null;
          unit?: string | null;
          quantity?: number | null;
          min_stock?: number | null;
          unit_price?: number | null;
          supplier?: string | null;
          location?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          category?: string | null;
          unit?: string | null;
          quantity?: number | null;
          min_stock?: number | null;
          unit_price?: number | null;
          supplier?: string | null;
          location?: string | null;
          status?: string | null;
        };
      };
      equipment: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          type: string | null;
          status: string | null;
          condition: string | null;
          last_maintenance: string | null;
          next_maintenance: string | null;
          operator: string | null;
          location: string | null;
          daily_cost: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          type?: string | null;
          status?: string | null;
          condition?: string | null;
          last_maintenance?: string | null;
          next_maintenance?: string | null;
          operator?: string | null;
          location?: string | null;
          daily_cost?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          type?: string | null;
          status?: string | null;
          condition?: string | null;
          last_maintenance?: string | null;
          next_maintenance?: string | null;
          operator?: string | null;
          location?: string | null;
          daily_cost?: number | null;
          notes?: string | null;
        };
      };
      personnel: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          role: string | null;
          department: string | null;
          phone: string | null;
          email: string | null;
          status: string | null;
          hire_date: string | null;
          hourly_rate: number | null;
          skills: string[] | null;
          certifications: string[] | null;
          emergency_contact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          role?: string | null;
          department?: string | null;
          phone?: string | null;
          email?: string | null;
          status?: string | null;
          hire_date?: string | null;
          hourly_rate?: number | null;
          skills?: string[] | null;
          certifications?: string[] | null;
          emergency_contact?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          role?: string | null;
          department?: string | null;
          phone?: string | null;
          email?: string | null;
          status?: string | null;
          hire_date?: string | null;
          hourly_rate?: number | null;
          skills?: string[] | null;
          certifications?: string[] | null;
          emergency_contact?: string | null;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          contact_person: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          rating: number | null;
          status: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          rating?: number | null;
          status?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          rating?: number | null;
          status?: string | null;
          notes?: string | null;
        };
      };
      safety_incidents: {
        Row: {
          id: string;
          project_id: string | null;
          type: string;
          severity: string | null;
          description: string | null;
          location: string | null;
          date: string | null;
          time: string | null;
          injured_person: string | null;
          witnesses: string[] | null;
          actions_taken: string | null;
          status: string | null;
          reported_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          type: string;
          severity?: string | null;
          description?: string | null;
          location?: string | null;
          date?: string | null;
          time?: string | null;
          injured_person?: string | null;
          witnesses?: string[] | null;
          actions_taken?: string | null;
          status?: string | null;
          reported_by?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          type?: string;
          severity?: string | null;
          description?: string | null;
          location?: string | null;
          date?: string | null;
          time?: string | null;
          injured_person?: string | null;
          witnesses?: string[] | null;
          actions_taken?: string | null;
          status?: string | null;
          reported_by?: string | null;
        };
      };
      safety_checklists: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          category: string | null;
          items: Json | null;
          completed_by: string | null;
          completed_at: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          category?: string | null;
          items?: Json | null;
          completed_by?: string | null;
          completed_at?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          category?: string | null;
          items?: Json | null;
          completed_by?: string | null;
          completed_at?: string | null;
          status?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Yardımcı tipler
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Material = Database['public']['Tables']['materials']['Row'];
export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type Personnel = Database['public']['Tables']['personnel']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type SafetyIncident = Database['public']['Tables']['safety_incidents']['Row'];
export type SafetyChecklist = Database['public']['Tables']['safety_checklists']['Row'];
