-- ============================================================
-- TABLA: areas
-- Descripción: Gestión dinámica de áreas con correos electrónicos
-- ============================================================

CREATE TABLE IF NOT EXISTS public.areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    correo TEXT,
    descripcion TEXT,
    icono TEXT, -- SVG del icono (opcional, se usa icono por defecto si está vacío)
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0, -- Para ordenar las áreas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_areas_activo ON public.areas(activo);
CREATE INDEX idx_areas_orden ON public.areas(orden);

-- RLS (Row Level Security)
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer áreas activas
CREATE POLICY "Permitir lectura pública de áreas activas"
ON public.areas FOR SELECT
USING (activo = true);

-- Política: Solo admins pueden insertar/actualizar/eliminar
-- Ajustado para usar la tabla 'profiles' existente
CREATE POLICY "Solo admins pueden modificar áreas"
ON public.areas FOR ALL
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_areas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_areas_updated_at
BEFORE UPDATE ON public.areas
FOR EACH ROW
EXECUTE FUNCTION update_areas_updated_at();

-- ============================================================
-- INSERTAR DATOS INICIALES (8 áreas)
-- ============================================================

INSERT INTO public.areas (nombre, correo, descripcion, icono, activo, orden) VALUES
(
    'ATENCIÓN - FRONT',
    NULL,
    'Atención presencial y servicios de front office',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    true,
    1
),
(
    'ATENCIÓN - CANALES',
    'atencion@certus.edu.pe',
    'Atención por canales digitales y telefónicos',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    true,
    2
),
(
    'CRÉDITO Y COBRANZAS',
    'creditoycobranzaspreg@certus.edu.pe, creditoycobranzaspec@certus.edu.pe',
    'Gestión de créditos educativos y cobranzas',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
    true,
    3
),
(
    'FACTURACIÓN',
    'facturacion@certus.edu.pe',
    'Emisión de comprobantes y facturación',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    true,
    4
),
(
    'RR.AA',
    'coord_registrosacademicos@certus.edu.pe',
    'Registros académicos y certificaciones',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    true,
    5
),
(
    'PEC',
    'experienciapec@visivaedu.com',
    'Programa de Educación Continua',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
    true,
    6
),
(
    'REINGRESO',
    'reingresos@certus.edu.pe',
    'Gestión de reingresos de estudiantes',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>',
    true,
    7
),
(
    'CAJA',
    'cajacertus@certus.edu.pe',
    'Pagos y operaciones de caja',
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    true,
    8
)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- COMENTARIOS
-- ============================================================
COMMENT ON TABLE public.areas IS 'Tabla para gestión dinámica de áreas con correos electrónicos';
COMMENT ON COLUMN public.areas.nombre IS 'Nombre único del área';
COMMENT ON COLUMN public.areas.correo IS 'Correo(s) electrónico(s) del área, separados por comas si son múltiples';
COMMENT ON COLUMN public.areas.icono IS 'SVG del icono del área';
COMMENT ON COLUMN public.areas.activo IS 'Si el área está activa y visible';
COMMENT ON COLUMN public.areas.orden IS 'Orden de visualización del área';
