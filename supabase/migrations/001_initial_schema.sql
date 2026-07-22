-- ============================================================
-- SIERRA ALTA — Supabase Migration
-- Full schema with RLS, indexes, triggers, and seed data
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ───
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'empleado' CHECK (role IN ('admin', 'empleado', 'veterinario')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FINCAS (farms) ───
CREATE TABLE public.fincas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FINCA MEMBERS ───
CREATE TABLE public.finca_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'empleado' CHECK (role IN ('admin', 'empleado', 'veterinario')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(finca_id, user_id)
);

-- ─── ANIMALES ───
CREATE TABLE public.animales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  name TEXT DEFAULT '',
  sex TEXT NOT NULL DEFAULT 'Hembra' CHECK (sex IN ('Hembra', 'Macho')),
  status TEXT NOT NULL DEFAULT 'Activa' CHECK (status IN ('Activa', 'Preñada', 'Seca', 'Vendida', 'Muerta', 'Descartada')),
  category TEXT NOT NULL DEFAULT 'Vaca' CHECK (category IN ('Vaca', 'Novilla', 'Ternera', 'Toro', 'Ternero')),
  breed TEXT DEFAULT '',
  color TEXT DEFAULT '',
  weight NUMERIC(8,2),
  birth_date DATE,
  father_name TEXT DEFAULT '',
  mother_name TEXT DEFAULT '',
  father_id UUID REFERENCES public.animales(id) ON DELETE SET NULL,
  mother_id UUID REFERENCES public.animales(id) ON DELETE SET NULL,
  genetic_line TEXT DEFAULT '',
  observations TEXT DEFAULT '',
  photo_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(finca_id, number)
);

-- ─── REPRODUCCIÓN ───
CREATE TABLE public.reproducciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  parto DATE,
  servicio DATE,
  servicio_1 DATE,
  servicio_2 DATE,
  servicio_3 DATE,
  nueve_meses DATE,
  resultado TEXT DEFAULT '',
  expected_birth DATE GENERATED ALWAYS AS (
    CASE WHEN servicio IS NOT NULL THEN servicio + INTERVAL '283 days' ELSE NULL END
  ) STORED,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PRODUCCIÓN DE LECHE ───
CREATE TABLE public.produccion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  litros_am NUMERIC(6,2) DEFAULT 0,
  litros_pm NUMERIC(6,2) DEFAULT 0,
  total NUMERIC(6,2) GENERATED ALWAYS AS (litros_am + litros_pm) STORED,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(animal_id, fecha)
);

-- ─── SANIDAD ───
CREATE TABLE public.sanidad (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('Vacuna', 'Vitamina', 'Desparasitación', 'Medicamento', 'Diagnóstico', 'Cirugía', 'Otro')),
  description TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  veterinario TEXT DEFAULT '',
  observaciones TEXT DEFAULT '',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── EVENTOS ───
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('Venta', 'Compra', 'Aborto', 'Nacimiento', 'Tratamiento', 'Cambio de lote', 'Muerte', 'Secado', 'Otro')),
  description TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FOTOGRAFÍAS ───
CREATE TABLE public.fotografias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  caption TEXT DEFAULT '',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── LOTES ───
CREATE TABLE public.lotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.animal_lote (
  animal_id UUID NOT NULL REFERENCES public.animales(id) ON DELETE CASCADE,
  lote_id UUID NOT NULL REFERENCES public.lotes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (animal_id, lote_id)
);

-- ─── FINANCIERO ───
CREATE TABLE public.finanzas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finca_id UUID NOT NULL REFERENCES public.fincas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  categoria TEXT NOT NULL,
  description TEXT NOT NULL,
  monto NUMERIC(12,2) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  animal_id UUID REFERENCES public.animales(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── AUDIT LOG ───
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_animales_finca ON public.animales(finca_id);
CREATE INDEX idx_animales_number ON public.animales(finca_id, number);
CREATE INDEX idx_animales_name ON public.animales(finca_id, name);
CREATE INDEX idx_animales_status ON public.animales(finca_id, status);
CREATE INDEX idx_animales_category ON public.animales(finca_id, category);
CREATE INDEX idx_animales_mother ON public.animales(mother_id);
CREATE INDEX idx_animales_father ON public.animales(father_id);
CREATE INDEX idx_reproducciones_animal ON public.reproducciones(animal_id);
CREATE INDEX idx_produccion_animal ON public.produccion(animal_id);
CREATE INDEX idx_produccion_fecha ON public.produccion(finca_id, fecha);
CREATE INDEX idx_sanidad_animal ON public.sanidad(animal_id);
CREATE INDEX idx_eventos_animal ON public.eventos(animal_id);
CREATE INDEX idx_fotografias_animal ON public.fotografias(animal_id);
CREATE INDEX idx_finanzas_finca ON public.finanzas(finca_id, fecha);
CREATE INDEX idx_audit_log_record ON public.audit_log(table_name, record_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_animales BEFORE UPDATE ON public.animales
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reproducciones BEFORE UPDATE ON public.reproducciones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'empleado')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUDIT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_animales AFTER INSERT OR UPDATE OR DELETE ON public.animales
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_reproducciones AFTER INSERT OR UPDATE OR DELETE ON public.reproducciones
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_sanidad AFTER INSERT OR UPDATE OR DELETE ON public.sanidad
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_eventos AFTER INSERT OR UPDATE OR DELETE ON public.eventos
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finca_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reproducciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotografias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_lote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finanzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: check if user belongs to a finca
CREATE OR REPLACE FUNCTION public.user_belongs_to_finca(finca UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.finca_members
    WHERE finca_id = finca AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if user is admin of a finca
CREATE OR REPLACE FUNCTION public.user_is_finca_admin(finca UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.finca_members
    WHERE finca_id = finca AND user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- FINCAS
CREATE POLICY "Members can view finca" ON public.fincas
  FOR SELECT USING (public.user_belongs_to_finca(id));
CREATE POLICY "Owner can insert finca" ON public.fincas
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Admin can update finca" ON public.fincas
  FOR UPDATE USING (public.user_is_finca_admin(id));

-- FINCA MEMBERS
CREATE POLICY "Members can view members" ON public.finca_members
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can manage members" ON public.finca_members
  FOR ALL USING (public.user_is_finca_admin(finca_id));

-- ANIMALES
CREATE POLICY "Members can view animales" ON public.animales
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert animales" ON public.animales
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update animales" ON public.animales
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete animales" ON public.animales
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- REPRODUCCIONES
CREATE POLICY "Members can view reproducciones" ON public.reproducciones
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert reproducciones" ON public.reproducciones
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update reproducciones" ON public.reproducciones
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete reproducciones" ON public.reproducciones
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- PRODUCCION
CREATE POLICY "Members can view produccion" ON public.produccion
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert produccion" ON public.produccion
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update produccion" ON public.produccion
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete produccion" ON public.produccion
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- SANIDAD
CREATE POLICY "Members can view sanidad" ON public.sanidad
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert sanidad" ON public.sanidad
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update sanidad" ON public.sanidad
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete sanidad" ON public.sanidad
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- EVENTOS
CREATE POLICY "Members can view eventos" ON public.eventos
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert eventos" ON public.eventos
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update eventos" ON public.eventos
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete eventos" ON public.eventos
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- FOTOGRAFIAS
CREATE POLICY "Members can view fotos" ON public.fotografias
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert fotos" ON public.fotografias
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can update fotos" ON public.fotografias
  FOR UPDATE USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can delete fotos" ON public.fotografias
  FOR DELETE USING (public.user_is_finca_admin(finca_id));

-- LOTES
CREATE POLICY "Members can view lotes" ON public.lotes
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can manage lotes" ON public.lotes
  FOR ALL USING (public.user_belongs_to_finca(finca_id));

-- ANIMAL_LOTE
CREATE POLICY "Members can view animal_lote" ON public.animal_lote
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.animales a WHERE a.id = animal_id AND public.user_belongs_to_finca(a.finca_id))
  );
CREATE POLICY "Members can manage animal_lote" ON public.animal_lote
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.animales a WHERE a.id = animal_id AND public.user_belongs_to_finca(a.finca_id))
  );

-- FINANZAS
CREATE POLICY "Members can view finanzas" ON public.finanzas
  FOR SELECT USING (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Members can insert finanzas" ON public.finanzas
  FOR INSERT WITH CHECK (public.user_belongs_to_finca(finca_id));
CREATE POLICY "Admin can manage finanzas" ON public.finanzas
  FOR ALL USING (public.user_is_finca_admin(finca_id));

-- AUDIT LOG (admin only)
CREATE POLICY "Admin can view audit log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.finca_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- STORAGE BUCKET FOR PHOTOS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Members can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'animal-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'animal-photos');

CREATE POLICY "Members can delete own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'animal-photos' AND auth.uid() IS NOT NULL);

-- ============================================================
-- VIEWS FOR DASHBOARD
-- ============================================================
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  a.finca_id,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE a.status IN ('Activa', 'Preñada', 'Seca')) AS activas,
  COUNT(*) FILTER (WHERE a.status = 'Preñada') AS prenadas,
  COUNT(*) FILTER (WHERE a.status = 'Seca') AS secas,
  COUNT(*) FILTER (WHERE a.status = 'Vendida') AS vendidas,
  COUNT(*) FILTER (WHERE a.status = 'Muerta') AS muertas,
  COUNT(*) FILTER (WHERE a.category = 'Vaca') AS vacas,
  COUNT(*) FILTER (WHERE a.category = 'Novilla') AS novillas,
  COUNT(*) FILTER (WHERE a.category IN ('Ternera', 'Ternero')) AS crias,
  COUNT(*) FILTER (WHERE a.category = 'Toro') AS toros
FROM public.animales a
GROUP BY a.finca_id;
