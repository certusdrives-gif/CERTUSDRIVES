-- ============================================================
-- MIGRACIÓN: Conectar recursos con areas mediante Foreign Key
-- Descripción: Reemplaza el campo 'area' (TEXT) por 'area_id' (UUID FK)
-- ============================================================

-- PASO 1: Agregar nueva columna area_id
ALTER TABLE public.recursos
ADD COLUMN IF NOT EXISTS area_id UUID;

-- PASO 2: Migrar datos existentes (mapear texto a UUID)
-- Actualizar cada recurso con el ID del área correspondiente
UPDATE public.recursos r
SET area_id = a.id
FROM public.areas a
WHERE UPPER(TRIM(r.area)) = UPPER(TRIM(a.nombre));

-- PASO 3: Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_recursos_area_id ON public.recursos(area_id);

-- PASO 4: Crear Foreign Key constraint
ALTER TABLE public.recursos
ADD CONSTRAINT fk_recursos_areas
FOREIGN KEY (area_id)
REFERENCES public.areas(id)
ON DELETE SET NULL -- Si se elimina un área, los recursos quedan sin área
ON UPDATE CASCADE; -- Si cambia el ID del área, actualiza automáticamente

-- PASO 5: Hacer area_id obligatorio (opcional - descomentar si quieres forzarlo)
-- ALTER TABLE public.recursos
-- ALTER COLUMN area_id SET NOT NULL;

-- PASO 6: Eliminar la columna antigua 'area' (TEXT)
-- ⚠️ IMPORTANTE: Comenta esta línea si quieres mantener el campo viejo como respaldo
ALTER TABLE public.recursos
DROP COLUMN IF EXISTS area;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Ver recursos con su área vinculada
-- SELECT 
--     r.id,
--     r.titulo,
--     r.area_id,
--     a.nombre AS area_nombre,
--     a.correo AS area_correo
-- FROM public.recursos r
-- LEFT JOIN public.areas a ON r.area_id = a.id
-- LIMIT 10;

-- ============================================================
-- COMENTARIOS
-- ============================================================
COMMENT ON COLUMN public.recursos.area_id IS 'ID del área (Foreign Key a tabla areas)';
