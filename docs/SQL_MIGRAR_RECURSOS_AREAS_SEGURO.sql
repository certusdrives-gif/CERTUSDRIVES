-- ============================================================
-- MIGRACIÓN SEGURA: Recursos con áreas (TEXT → UUID Foreign Key)
-- Ejecutar SOLO si tienes recursos con columna "area" (TEXT)
-- ============================================================

-- PASO 1: Crear columna area_id si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recursos' AND column_name = 'area_id'
    ) THEN
        ALTER TABLE public.recursos ADD COLUMN area_id UUID;
        RAISE NOTICE '✅ Columna area_id creada';
    ELSE
        RAISE NOTICE '⚠️ Columna area_id ya existe';
    END IF;
END $$;

-- PASO 2: Migrar datos de area (TEXT) a area_id (UUID)
-- Solo si la columna 'area' existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recursos' AND column_name = 'area'
    ) THEN
        -- Migrar datos
        UPDATE public.recursos r
        SET area_id = a.id
        FROM public.areas a
        WHERE UPPER(TRIM(r.area)) = UPPER(TRIM(a.nombre));
        
        RAISE NOTICE '✅ Datos migrados de area (TEXT) a area_id (UUID)';
    ELSE
        RAISE NOTICE '⚠️ Columna area (TEXT) no existe, omitiendo migración';
    END IF;
END $$;

-- PASO 3: Crear índice
CREATE INDEX IF NOT EXISTS idx_recursos_area_id ON public.recursos(area_id);

-- PASO 4: Crear Foreign Key
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_recursos_areas'
    ) THEN
        ALTER TABLE public.recursos
        ADD CONSTRAINT fk_recursos_areas
        FOREIGN KEY (area_id)
        REFERENCES public.areas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
        
        RAISE NOTICE '✅ Foreign Key creada';
    ELSE
        RAISE NOTICE '⚠️ Foreign Key ya existe';
    END IF;
END $$;

-- PASO 5: (OPCIONAL) Eliminar columna antigua 'area' (TEXT)
-- ⚠️ DESCOMENTA SOLO SI ESTÁS SEGURO DE QUE LA MIGRACIÓN FUNCIONÓ
-- DO $$ 
-- BEGIN
--     IF EXISTS (
--         SELECT 1 FROM information_schema.columns 
--         WHERE table_name = 'recursos' AND column_name = 'area'
--     ) THEN
--         ALTER TABLE public.recursos DROP COLUMN area;
--         RAISE NOTICE '✅ Columna area (TEXT) eliminada';
--     END IF;
-- END $$;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Ver recursos con sus áreas vinculadas
SELECT 
    r.id,
    r.titulo,
    r.area_id,
    a.nombre AS area_nombre,
    a.correo AS area_correo,
    a.icono AS area_icono
FROM public.recursos r
LEFT JOIN public.areas a ON r.area_id = a.id
LIMIT 10;

-- Ver estadísticas
SELECT 
    'Total recursos' AS tipo,
    COUNT(*) AS cantidad
FROM recursos
UNION ALL
SELECT 
    'Con area_id asignado' AS tipo,
    COUNT(*) AS cantidad
FROM recursos
WHERE area_id IS NOT NULL
UNION ALL
SELECT 
    'Sin area_id (huérfanos)' AS tipo,
    COUNT(*) AS cantidad
FROM recursos
WHERE area_id IS NULL;
