-- ============================================================
-- ACTUALIZACIÓN: Hacer campo 'icono' opcional en tabla areas
-- Descripción: Permite crear áreas sin icono personalizado
-- ============================================================

-- Eliminar la restricción NOT NULL del campo icono
ALTER TABLE public.areas 
ALTER COLUMN icono DROP NOT NULL;

-- Actualizar comentario de la columna
COMMENT ON COLUMN public.areas.icono IS 'SVG del icono del área (opcional - se usa icono por defecto si está vacío)';

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Ver la estructura actualizada de la tabla
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'areas' AND column_name = 'icono';

-- Debería mostrar: is_nullable = 'YES'
