-- InsaatExpo Veritabanı Şeması
-- Bu SQL'i Supabase SQL Editor'e yapıştır ve çalıştır

-- Projeler Tablosu
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  spent DECIMAL(15,2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  manager TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proje Fazları Tablosu
CREATE TABLE project_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Görevler Tablosu
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finansal İşlemler Tablosu
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'income' veya 'expense'
  category TEXT,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT,
  vendor TEXT,
  invoice_no TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bütçe Kategorileri
CREATE TABLE budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned_amount DECIMAL(15,2) DEFAULT 0,
  spent_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Malzemeler Tablosu
CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  quantity DECIMAL(10,2) DEFAULT 0,
  min_stock DECIMAL(10,2) DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier TEXT,
  location TEXT,
  status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ekipmanlar Tablosu
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'available',
  condition TEXT,
  last_maintenance DATE,
  next_maintenance DATE,
  operator TEXT,
  location TEXT,
  daily_cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tedarikçiler Tablosu
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  rating INTEGER,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Siparişler Tablosu
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  order_no TEXT,
  items JSONB,
  total_amount DECIMAL(15,2),
  status TEXT DEFAULT 'pending',
  order_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personel Tablosu
CREATE TABLE personnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  hire_date DATE,
  hourly_rate DECIMAL(10,2),
  skills TEXT[],
  certifications TEXT[],
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vardiya Tablosu
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME,
  end_time TIME,
  personnel_ids UUID[],
  days TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devamsızlık/İzin Tablosu
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT, -- 'present', 'absent', 'leave', 'sick'
  check_in TIME,
  check_out TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik Kontrol Listeleri
CREATE TABLE safety_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  items JSONB,
  completed_by TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik Olayları/Kazalar
CREATE TABLE safety_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT,
  description TEXT,
  location TEXT,
  date DATE,
  time TIME,
  injured_person TEXT,
  witnesses TEXT[],
  actions_taken TEXT,
  status TEXT DEFAULT 'open',
  reported_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eğitimler
CREATE TABLE trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT,
  instructor TEXT,
  date DATE,
  duration INTEGER, -- dakika
  attendees UUID[],
  status TEXT DEFAULT 'scheduled',
  materials TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raporlar
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  content JSONB,
  generated_by TEXT,
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bildirimler
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları ekle
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Temel politikalar
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;

-- Public erişim politikası (geliştirme için - production'da değiştir)
CREATE POLICY "Enable all access for all users" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON tasks FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON materials FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON equipment FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON personnel FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON safety_incidents FOR ALL USING (true);

-- Örnek veri ekle
INSERT INTO projects (name, location, start_date, end_date, budget, spent, progress, status, manager) VALUES
('Merkez Residence', 'İstanbul, Kadıköy', '2024-01-15', '2024-12-31', 15000000, 8500000, 65, 'active', 'Ahmet Yılmaz'),
('Plaza Tower', 'Ankara, Çankaya', '2024-03-01', '2025-06-30', 25000000, 5000000, 25, 'active', 'Mehmet Demir'),
('Sahil Villaları', 'İzmir, Çeşme', '2024-02-01', '2024-10-15', 8000000, 6800000, 85, 'active', 'Ayşe Kaya');
