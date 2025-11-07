# 📋 Instrucciones para crear la tabla `areas` en Supabase

## Paso 1: Acceder a Supabase SQL Editor

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/alcrunnigsatnvwexssd
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**

## Paso 2: Ejecutar el script SQL

1. Abre el archivo `SQL_CREATE_AREAS_TABLE.sql`
2. Copia TODO el contenido del archivo
3. Pégalo en el editor SQL de Supabase
4. Haz clic en **Run** (botón verde en la esquina inferior derecha)

## Paso 3: Verificar que se creó correctamente

Ejecuta esta consulta para ver las áreas creadas:

```sql
SELECT id, nombre, correo, activo, orden 
FROM public.areas 
ORDER BY orden;
```

Deberías ver 8 áreas:
- ATENCIÓN - FRONT (sin correo)
- ATENCIÓN - CANALES (atencion@certus.edu.pe)
- CRÉDITO Y COBRANZAS (2 correos)
- FACTURACIÓN (facturacion@certus.edu.pe)
- RR.AA (coord_registrosacademicos@certus.edu.pe)
- PEC (experienciapec@visivaedu.com)
- REINGRESO (reingresos@certus.edu.pe)
- CAJA (cajacertus@certus.edu.pe)

## Paso 4: Verificar permisos RLS

Verifica que las políticas de seguridad estén activas:

```sql
SELECT * FROM pg_policies WHERE tablename = 'areas';
```

¡Listo! La tabla está creada y lista para usar. 🎉

## Siguiente paso

Ahora el frontend debe leer desde esta tabla en lugar de tener los datos hardcoded.
