# 🔗 CONECTAR TABLA ÁREAS CON RECURSOS

## 📋 Problema Actual

La tabla `areas` está **desconectada** de `recursos`. Actualmente:
- ❌ `recursos.area` es **TEXT** (texto simple como "ATENCIÓN - FRONT")
- ❌ **No hay relación** entre las tablas
- ❌ **No hay integridad referencial**

## ✅ Solución: Foreign Key

Crear una relación **uno a muchos**:
- Un **área** puede tener **muchos recursos**
- Un **recurso** pertenece a **un área**

```
areas (1) ----< (N) recursos
  id  ←─────── area_id
```

---

## 🚀 PASOS A SEGUIR

### **PASO 1: Ejecutar Script en Supabase** 

1. Ve a **Supabase → SQL Editor**
2. Copia y pega el contenido de: `docs/SQL_MIGRATE_RECURSOS_AREAS_FK.sql`
3. Click en **"Run"**

**¿Qué hace este script?**
- ✅ Agrega columna `area_id` (UUID) en `recursos`
- ✅ Migra datos: convierte "ATENCIÓN - FRONT" → UUID del área
- ✅ Crea Foreign Key: `recursos.area_id` → `areas.id`
- ✅ Elimina la columna vieja `area` (TEXT)

---

### **PASO 2: Actualizar Código Frontend**

**Actualmente el código usa:**
```javascript
r.area  // ❌ Ya no existe después de la migración
```

**Debe cambiarse a:**
```javascript
r.areas.nombre  // ✅ Usando JOIN con tabla areas
```

#### **Cambios necesarios en `js/script.js`:**

1. **Línea ~70 - Cargar recursos con JOIN:**
```javascript
// ANTES:
const { data, error } = await supabase
    .from('recursos')
    .select('*')
    .eq('activo', true);

// DESPUÉS:
const { data, error } = await supabase
    .from('recursos')
    .select(`
        *,
        areas:area_id (
            id,
            nombre,
            correo,
            descripcion,
            icono
        )
    `)
    .eq('activo', true);
```

2. **Líneas donde se usa `r.area` o `recurso.area`:**
```javascript
// ANTES:
recurso.area

// DESPUÉS:
recurso.areas?.nombre || 'Sin área'
```

3. **Filtro por área (línea ~159):**
```javascript
// ANTES:
return r.area.toUpperCase() === area.nombre.toUpperCase();

// DESPUÉS:
return r.areas?.nombre?.toUpperCase() === area.nombre.toUpperCase();
```

---

## 📊 Ventajas de la Foreign Key

✅ **Integridad referencial**: No se pueden crear recursos con áreas inexistentes  
✅ **Joins eficientes**: Se puede obtener toda la info del área en una sola query  
✅ **Cascada**: Si cambias el nombre de un área, no necesitas actualizar recursos  
✅ **Normalización**: Sin duplicar datos (correos, iconos, etc.)  
✅ **Visualización en Supabase**: Se verá la relación en el diagrama de tablas  

---

## ⚠️ IMPORTANTE

**ORDEN DE EJECUCIÓN:**
1. Primero ejecuta `SQL_CREATE_AREAS_TABLE.sql` (crear tabla areas)
2. Luego ejecuta `SQL_MIGRATE_RECURSOS_AREAS_FK.sql` (conectar tablas)
3. Finalmente actualiza el código JavaScript

**Si algo sale mal:**
```sql
-- Restaurar columna area (TEXT)
ALTER TABLE public.recursos ADD COLUMN area TEXT;
UPDATE public.recursos r
SET area = a.nombre
FROM public.areas a
WHERE r.area_id = a.id;
```

---

## 🧪 Verificación

**Consulta de prueba:**
```sql
SELECT 
    r.id,
    r.titulo,
    r.area_id,
    a.nombre AS area_nombre,
    a.correo AS area_correo
FROM public.recursos r
LEFT JOIN public.areas a ON r.area_id = a.id
LIMIT 10;
```

Deberías ver los recursos con sus áreas vinculadas correctamente.
