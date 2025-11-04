# 📖 Guía de Uso - CERTUS Drive

## 👤 Para Usuarios Normales

### 1. Iniciar Sesión

1. Abre **`login.html`** en tu navegador
2. Haz click en la pestaña **"Iniciar Sesión"**
3. Ingresa tu email corporativo: `tunombre@certus.edu.pe`
4. Ingresa tu contraseña
5. Click en **"Iniciar Sesión"**

### 2. Buscar Recursos

Una vez dentro verás:

#### 🎯 **Barra de Búsqueda**
- Escribe cualquier palabra clave
- La búsqueda es en tiempo real
- Busca en: título, descripción, área y palabras clave

#### 🗂️ **Carousel de Áreas**
Puedes filtrar por área haciendo click en cualquier tarjeta:
- 💰 CRÉDITO EDUCATIVO
- 📝 PEC
- 🎓 GESTIÓN ESCOLAR
- 📞 ATENCIÓN AL CLIENTE
- 📊 INFORMES
- 🎓 ADMISIÓN
- 🌐 CERTUS 360
- 📋 SOLICITUDES
- 📁 GENERAL

#### 📋 **Resultados**
- Cada tarjeta muestra el recurso
- Click en **"Abrir Drive"** para acceder al enlace
- Se muestra: área, título, descripción

### 3. Cerrar Sesión

Click en el botón **"Cerrar Sesión"** en la esquina superior derecha.

---

## 👑 Para Administradores

### 1. Acceder al Panel Admin

1. Inicia sesión normalmente
2. Verás un botón adicional: **"Panel Admin"** ⚙️
3. Click para acceder al panel de administración

### 2. Ver Estadísticas

En el panel lateral izquierdo verás:
- 📊 **Total Recursos**: Cantidad total en la base de datos
- ✅ **Recursos Activos**: Recursos visibles para usuarios
- 🗂️ **Áreas Diferentes**: Cantidad de áreas únicas

### 3. Crear Nuevo Recurso

1. Click en **"➕ Nuevo Recurso"**
2. Llena el formulario:
   - **Área** (obligatorio): Selecciona de la lista
   - **Título** (obligatorio): Nombre descriptivo
   - **Descripción**: Breve descripción (opcional)
   - **Enlace** (obligatorio): URL de Google Drive
   - **Palabras Clave**: Separadas por comas (opcional)
   - **Recurso Activo**: Marcar si quieres que sea visible
3. Click en **"💾 Guardar"**

✅ Verás una notificación verde: **"Recurso creado correctamente"**

### 4. Editar Recurso

1. Busca el recurso en la tabla
2. Click en el botón **✏️ amarillo**
3. Se abre el modal con los datos precargados
4. Modifica lo que necesites
5. Click en **"💾 Guardar"**

✅ Verás: **"Recurso actualizado correctamente"**

### 5. Eliminar Recurso

1. Busca el recurso en la tabla
2. Click en el botón **🗑️ rojo**
3. Aparece modal de confirmación
4. Lee el mensaje: **"Esta acción no se puede deshacer"**
5. Click en **"🗑️ Eliminar"** para confirmar

✅ Verás: **"Recurso eliminado correctamente"**

### 6. Buscar en Admin Panel

Usa la barra de búsqueda en el panel:
- Busca por título, área, descripción o palabras clave
- La búsqueda es instantánea
- Combina con filtros para mejores resultados

### 7. Filtrar Recursos

#### **Por Área:**
Usa el selector en el panel lateral izquierdo:
- Selecciona un área específica
- O selecciona "Todas las áreas"

#### **Por Estado:**
Usa el segundo selector:
- **Todos**: Muestra todos los recursos
- **Solo Activos**: Recursos visibles para usuarios
- **Solo Inactivos**: Recursos ocultos

### 8. Paginación

- La tabla muestra **10 recursos por página**
- Navega con los botones en la parte inferior:
  - **← Anterior**: Página anterior
  - **Números**: Saltar a página específica
  - **Siguiente →**: Página siguiente

### 9. Activar/Desactivar Recursos

En lugar de eliminar, puedes desactivar:
1. Click en **✏️ Editar**
2. Desmarca **"Recurso Activo"**
3. Guardar

Los recursos inactivos:
- ❌ No se muestran a usuarios normales
- ✅ Siguen en la base de datos
- ✅ Puedes reactivarlos después

---

## 🔍 Casos de Uso Comunes

### Caso 1: Usuario Busca Manual de Crédito

**Acción del Usuario:**
1. Ingresa a la aplicación
2. Escribe "credito" en la búsqueda
3. Ve todos los recursos relacionados con crédito educativo

**Alternativa:**
1. Click en la tarjeta "💰 CRÉDITO EDUCATIVO" del carousel
2. Ve solo recursos de esa área

### Caso 2: Admin Agrega Nueva Política

**Acción del Admin:**
1. Panel Admin → "➕ Nuevo Recurso"
2. Área: "GENERAL"
3. Título: "Política de Privacidad 2025"
4. Descripción: "Actualización de políticas institucionales"
5. Enlace: `https://drive.google.com/file/d/...`
6. Palabras clave: `politica, privacidad, 2025`
7. Marcar "Recurso Activo"
8. Guardar

✅ Recurso disponible inmediatamente para todos

### Caso 3: Admin Actualiza Enlace Roto

**Acción del Admin:**
1. Usuario reporta enlace roto
2. Admin busca el recurso en el panel
3. Click en **✏️ Editar**
4. Actualiza el campo "Enlace"
5. Guardar

✅ Enlace actualizado sin crear recurso duplicado

### Caso 4: Recurso Temporal (Solo para Esta Semana)

**Acción del Admin:**
1. Crea el recurso normalmente
2. Actívalo
3. Al terminar la semana:
   - Editar recurso
   - Desmarcar "Recurso Activo"
   - Guardar

✅ No aparece en búsquedas pero puedes reactivarlo después

---

## ⚠️ Errores Comunes y Soluciones

### Error: "No tienes permiso para acceder"
**Causa**: No eres administrador  
**Solución**: Contacta a IT para que te promuevan a admin

### Error: "Email inválido"
**Causa**: No usaste email @certus.edu.pe  
**Solución**: Usa tu email corporativo institucional

### Error: "Las contraseñas no coinciden"
**Causa**: Al registrarte, las contraseñas no son iguales  
**Solución**: Verifica que ambos campos tengan la misma contraseña

### Error: "El enlace debe comenzar con http://"
**Causa**: Falta el protocolo en la URL  
**Solución**: Asegúrate que el enlace comience con `https://`

### No veo el botón "Panel Admin"
**Causa**: Tu rol es 'user', no 'admin'  
**Solución**: Ejecuta en Supabase SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu@certus.edu.pe';
```

---

## 📱 Uso en Dispositivos Móviles

El sistema es **100% responsive**:

### En Tablet
- Menú adaptado
- Tabla scrollable horizontalmente
- Botones más grandes

### En Móvil
- Diseño vertical optimizado
- AppBar compacto
- Modales full-screen
- Touch-friendly

---

## 💡 Tips y Trucos

### Para Búsquedas Efectivas
1. Usa palabras clave cortas
2. Prueba con sinónimos
3. Combina búsqueda + filtro por área

### Para Admins
1. Usa palabras clave descriptivas al crear recursos
2. Desactiva en lugar de eliminar
3. Revisa los audit logs regularmente
4. Mantén las descripciones actualizadas

### Para Todos
1. Usa Google Chrome o Edge (mejor rendimiento)
2. No compartas tu contraseña
3. Cierra sesión en computadoras compartidas

---

## 🆘 Soporte

Si tienes problemas:

1. 📖 Revisa esta guía
2. 📧 Email: it@certus.edu.pe
3. 💬 Slack: #certus-drive-support
4. 📞 Extensión IT: 1234

---

**¿Necesitas agregar más funcionalidades?** Habla con el equipo de IT! 🚀
