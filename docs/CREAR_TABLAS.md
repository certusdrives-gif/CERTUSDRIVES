# 🚨 PASO CRÍTICO: CREAR TABLAS EN SUPABASE

## ❌ ERROR ACTUAL:
```
ERROR: 42P01: relation "profiles" does not exist
```

**PROBLEMA:** No has ejecutado los SQLs para crear las tablas en Supabase.

---

## ✅ SOLUCIÓN - EJECUTA ESTOS 2 SCRIPTS:

### 📍 **PASO 1: Ve a Supabase**
1. Abre: **https://supabase.com**
2. Selecciona tu proyecto: `certus-drive` o similar
3. En el menú lateral izquierdo: **SQL Editor**
4. Click en **"New Query"**

---

### 📝 **PASO 2: SCRIPT 1 - CREAR TABLAS**

**Copia TODO este SQL** y pégalo en el editor:

```sql
-- ============================================================
-- SCRIPT 1: CREAR TODAS LAS TABLAS
-- ============================================================

-- 1. TABLA DE PERFILES (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Comentario descriptivo
COMMENT ON TABLE profiles IS 'Perfiles de usuario con roles y metadata';

-- 2. FUNCIÓN PARA AUTO-ACTUALIZAR FECHA
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. FUNCIÓN PARA AUTO-CREAR PERFIL AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función al crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. TABLA DE RECURSOS (DRIVES)
CREATE TABLE IF NOT EXISTS recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  enlace TEXT NOT NULL,
  palabras_clave TEXT[],
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Índices para búsquedas optimizadas
CREATE INDEX IF NOT EXISTS idx_recursos_area ON recursos(area);
CREATE INDEX IF NOT EXISTS idx_recursos_created_by ON recursos(created_by);
CREATE INDEX IF NOT EXISTS idx_recursos_is_active ON recursos(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_recursos_created_at ON recursos(created_at DESC);

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_recursos_updated_at ON recursos;
CREATE TRIGGER update_recursos_updated_at
  BEFORE UPDATE ON recursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentario descriptivo
COMMENT ON TABLE recursos IS 'Recursos y drives de CERTUS organizados por área';

-- 5. TABLA DE AUDITORÍA
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Comentario descriptivo
COMMENT ON TABLE audit_logs IS 'Registro de todas las acciones en el sistema para auditoría';
```

**Click en el botón "RUN" ▶️** (abajo a la derecha)

✅ Debe decir: **"Success. No rows returned"**

---

### 🔒 **PASO 3: SCRIPT 2 - ACTIVAR SEGURIDAD (RLS)**

**Nueva Query** → Copia este SQL:

```sql
-- ============================================================
-- SCRIPT 2: ACTIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 1. ACTIVAR RLS EN TODAS LAS TABLAS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA PROFILES
-- Los usuarios ven su propio perfil, admins ven todos
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON profiles;
CREATE POLICY "Users can view own profile or admins view all"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Los usuarios actualizan su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Solo admins pueden cambiar roles (INSERT para trigger automático)
DROP POLICY IF EXISTS "Auto insert profiles" ON profiles;
CREATE POLICY "Auto insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

-- 3. POLÍTICAS PARA RECURSOS
-- Todos los usuarios autenticados pueden VER recursos activos
DROP POLICY IF EXISTS "Users can view active recursos" ON recursos;
CREATE POLICY "Users can view active recursos"
  ON recursos FOR SELECT
  USING (is_active = TRUE AND auth.role() = 'authenticated');

-- Solo ADMINS pueden CREAR recursos
DROP POLICY IF EXISTS "Only admins create recursos" ON recursos;
CREATE POLICY "Only admins create recursos"
  ON recursos FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Solo ADMINS pueden ACTUALIZAR recursos
DROP POLICY IF EXISTS "Only admins update recursos" ON recursos;
CREATE POLICY "Only admins update recursos"
  ON recursos FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Solo ADMINS pueden ELIMINAR recursos
DROP POLICY IF EXISTS "Only admins delete recursos" ON recursos;
CREATE POLICY "Only admins delete recursos"
  ON recursos FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. POLÍTICAS PARA AUDIT_LOGS
-- Solo admins ven logs
DROP POLICY IF EXISTS "Only admins view logs" ON audit_logs;
CREATE POLICY "Only admins view logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Sistema inserta logs
DROP POLICY IF EXISTS "System inserts logs" ON audit_logs;
CREATE POLICY "System inserts logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);
```

**Click en "RUN" ▶️**

✅ Debe decir: **"Success. No rows returned"**

---

## 🎯 **PASO 4: VERIFICAR QUE TODO ESTÁ CREADO**

Nueva Query → Ejecuta:

```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'recursos', 'audit_logs');
```

✅ Debe mostrar 3 filas:
- `profiles`
- `recursos`
- `audit_logs`

---

## 👤 **PASO 5: AHORA SÍ, REGÍSTRATE**

1. Abre: `login.html`
2. Regístrate con: `tunombre@certus.edu.pe`
3. Deberías poder registrarte SIN ERRORES

---

## 👑 **PASO 6: PROMOVER A ADMIN**

Una vez registrado, ejecuta:

```sql
-- Reemplaza con tu email real
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tunombre@certus.edu.pe';

-- Verificar
SELECT email, role, created_at FROM profiles;
```

✅ Debe mostrar tu usuario con `role = admin`

---

## 📊 **PASO 7 (OPCIONAL): AGREGAR DATOS DE PRUEBA**

Si quieres probar con datos de ejemplo:

```sql
-- Primero obtén tu user ID
SELECT id, email FROM profiles WHERE email = 'tunombre@certus.edu.pe';

-- Copia el ID (UUID) y úsalo abajo reemplazando 'TU_USER_ID'

INSERT INTO recursos (area, titulo, descripcion, enlace, palabras_clave, created_by) VALUES
('CREDITO EDUCATIVO', 'Manual de Crédito Educativo 2025', 'Guía completa para solicitar crédito educativo', 'https://drive.google.com/example1', ARRAY['credito', 'educativo', 'manual'], 'TU_USER_ID'),
('PEC', 'Proceso de Evaluación Continua', 'Documentación del proceso PEC', 'https://drive.google.com/example2', ARRAY['pec', 'evaluacion'], 'TU_USER_ID'),
('ATENCION AL CLIENTE', 'Protocolo de Atención', 'Protocolo de atención al estudiante', 'https://drive.google.com/example3', ARRAY['atencion', 'cliente', 'protocolo'], 'TU_USER_ID');

-- Verificar
SELECT area, titulo, created_at FROM recursos;
```

---

## ✅ **RESUMEN DE LO QUE HICISTE:**

1. ✅ Ejecutaste Script 1: Crear 3 tablas (profiles, recursos, audit_logs)
2. ✅ Ejecutaste Script 2: Activar seguridad RLS
3. ✅ Verificaste que las tablas existen
4. ✅ Te registraste en la app
5. ✅ Te promoviste a admin
6. ✅ (Opcional) Agregaste datos de prueba

---

## 🚀 **AHORA SÍ FUNCIONA TODO:**

- ✅ Login/Registro
- ✅ Perfiles de usuario
- ✅ Tabla de recursos
- ✅ Seguridad activada
- ✅ Listo para CRUD

---

**¿EJECUTASTE LOS SCRIPTS? Avísame si hay algún error o si todo funcionó! 💪**
