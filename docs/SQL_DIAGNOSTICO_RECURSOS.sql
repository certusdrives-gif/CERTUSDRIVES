-- ============================================================
-- DIAGNÓSTICO: Ver estructura actual de tabla recursos
-- ============================================================

-- Ver todas las columnas de la tabla recursos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'recursos'
ORDER BY ordinal_position;

-- ============================================================
-- RESULTADO ESPERADO:
-- ============================================================
-- Si ves "area" (TEXT) → Necesitas migrar a area_id
-- Si ves "area_id" (UUID) → Ya está migrado, solo falta actualizar el código JavaScript
-- Si ves AMBAS → Necesitas decidir cuál usar y eliminar la otra

-- ============================================================
-- Ver datos de ejemplo
-- ============================================================
SELECT 
    id,
    titulo,
    area,      -- Si existe
    area_id    -- Si existe
FROM recursos
LIMIT 5;
