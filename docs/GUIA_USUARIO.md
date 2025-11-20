# 👥 GUÍA DE USUARIO
## CERTUS Drive - Sistema de Gestión de Recursos Administrativos

---

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Interfaz de Usuario](#interfaz-de-usuario)
4. [Búsqueda de Recursos](#búsqueda-de-recursos)
5. [Panel de Administración](#panel-de-administración)
6. [Gestión de Recursos](#gestión-de-recursos)
7. [Gestión de Áreas](#gestión-de-áreas)
8. [Preguntas Frecuentes](#preguntas-frecuentes)
9. [Solución de Problemas](#solución-de-problemas)

---

## 📖 INTRODUCCIÓN

### ¿Qué es CERTUS Drive?

CERTUS Drive es un sistema web que centraliza todos los recursos institucionales internos de Google Drive de la institución CERTUS, organizándolos por áreas operativas para facilitar su búsqueda y acceso al personal administrativo.

### ¿Para quién es este sistema?

**👨‍💼 Personal Administrativo y Operativo**: Buscan y acceden a recursos institucionales  
**👨‍💼 Administradores**: Gestionan recursos y áreas del sistema

### Requisitos Técnicos

- **Navegador**: Chrome, Firefox, Edge o Safari (actualizado)
- **Conexión a Internet**: Requerida
- **Cuenta**: Solo para administradores

---

## 🔑 ACCESO AL SISTEMA

### Acceso Público (Sin cuenta)

**URL**: `https://[tu-sitio].netlify.app`

1. Abrir el navegador
2. Ingresar a la URL del sistema
3. La página principal se carga automáticamente
4. Puedes buscar y acceder a recursos sin iniciar sesión

### Acceso de Administrador

**URL**: `https://[tu-sitio].netlify.app/admin.html`

#### Paso 1: Ir a Login

1. Hacer clic en el botón **"Admin"** en la barra superior
2. Serás redirigido a `/login.html`

#### Paso 2: Iniciar Sesión

![Login Screenshot]

1. Ingresar **email** registrado
2. Ingresar **contraseña**
3. Hacer clic en **"Iniciar Sesión"**

**Credenciales de ejemplo:**
```
Email: admin@certus.edu.pe
Contraseña: [solicitar a IT]
```

#### Paso 3: Redirección Automática

- ✅ **Éxito**: Redirige a `/admin.html`
- ❌ **Error**: Muestra mensaje de error

### Cerrar Sesión

1. En el panel de admin, hacer clic en **"Cerrar Sesión"**
2. Serás redirigido a `/login.html`
3. La sesión se cierra completamente

---

## 🖥️ INTERFAZ DE USUARIO

### Página Principal (index.html)

#### Estructura

```
┌─────────────────────────────────────────────────┐
│             BARRA DE NAVEGACIÓN                 │
│  [Logo CERTUS] [CERTUS Drive]  [Admin] [Login] │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│           BARRA DE BÚSQUEDA                     │
│  [ 🔍 Buscar recursos... ]                      │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│         CARRUSEL DE ÁREAS                       │
│  [📊][💳][📞][📚][🎓][⚙️][🔄][👥]              │
│  Facturación | Crédito | Canales...            │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│         GRID DE RESULTADOS                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ 📄   │ │ 📄   │ │ 📄   │ │ 📄   │           │
│  │ Rec1 │ │ Rec2 │ │ Rec3 │ │ Rec4 │           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ 📄   │ │ 📄   │ │ 📄   │ │ 📄   │           │
│  │ Rec5 │ │ Rec6 │ │ Rec7 │ │ Rec8 │           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│           PAGINACIÓN                            │
│      [< Anterior] [1] [2] [3] [Siguiente >]    │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│               FOOTER                            │
│  © 2025 CERTUS - Sistema de Gestión            │
│  Powered by Jeffcode                            │
└─────────────────────────────────────────────────┘
```

#### Elementos de la Interfaz

**1. Barra de Navegación**
- **Logo CERTUS**: Volver a inicio
- **"CERTUS Drive"**: Título del sistema
- **Botón "Admin"**: Acceso al panel de administración
- **Botón "Login"**: Iniciar sesión

**2. Barra de Búsqueda**
- Campo de texto con ícono de lupa
- Búsqueda en tiempo real (al escribir)
- Placeholder: "Buscar recursos..."

**3. Carrusel de Áreas**
- 8 tarjetas de áreas operativas
- Cada tarjeta muestra:
  - Ícono del área
  - Nombre del área
  - Email de contacto
  - Fondo con color del área
- Hacer clic filtra recursos de esa área

**4. Grid de Resultados**
- Tarjetas de recursos en cuadrícula
- Cada tarjeta contiene:
  - Ícono del tipo de archivo
  - Badge con nombre del área
  - Título del recurso
  - Descripción breve
  - Botón "Abrir enlace"
- Diseño responsivo (adapta columnas según pantalla)

**5. Paginación**
- Botones de navegación
- Muestra 12 recursos por página
- Números de página visibles
- "Anterior" y "Siguiente"

---

## 🔍 BÚSQUEDA DE RECURSOS

### Búsqueda por Texto

#### ¿Cómo buscar?

1. Hacer clic en la barra de búsqueda
2. Escribir el término a buscar
3. Los resultados se filtran automáticamente **mientras escribes**

#### ¿Dónde busca?

El sistema busca en:
- ✅ **Títulos** de recursos
- ✅ **Descripciones**
- ✅ **Palabras clave** asociadas

#### Ejemplo de Búsqueda

**Buscar**: `"manual matricula"`

**Resultados encontrados**:
- Manual de Matrícula 2025
- Procedimiento de Matrícula Online
- Guía Rápida - Matrícula Alumnos Nuevos

### Filtrado por Área

#### ¿Cómo filtrar?

1. En el carrusel de áreas, hacer clic en una tarjeta
2. La tarjeta se **marca** (borde azul)
3. Solo se muestran recursos de esa área

#### ¿Cómo quitar el filtro?

- Hacer clic nuevamente en la misma área
- Hacer clic en "Todas las Áreas" (si está disponible)
- Recargar la página

### Búsqueda Combinada

Puedes **combinar** búsqueda de texto y filtro de área:

**Ejemplo:**
1. Seleccionar área **"FACTURACIÓN"**
2. Buscar **"procedimiento"**
3. Resultado: Solo procedimientos del área de Facturación

### Sin Resultados

Si no hay resultados, verás:

```
┌─────────────────────────────┐
│         🔍                  │
│  No se encontraron          │
│  resultados                 │
│                             │
│  Intenta con otros          │
│  términos de búsqueda       │
└─────────────────────────────┘
```

**Sugerencias:**
- Verifica la ortografía
- Usa términos más generales
- Prueba con sinónimos
- Quita los filtros de área

---

## 🎛️ PANEL DE ADMINISTRACIÓN

### Acceso al Panel

**Requisitos:**
- Cuenta de administrador
- Sesión iniciada

**URL**: `https://[tu-sitio].netlify.app/admin.html`

### Estructura del Panel

```
┌─────────────────────────────────────────────────┐
│  [Logo] CERTUS Drive Admin    [Cerrar Sesión]  │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│         TARJETAS DE ESTADÍSTICAS                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Total:   │ │ Activos: │ │ Áreas:   │        │
│  │   45     │ │   42     │ │   8      │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│         PESTAÑAS                                │
│  [📚 Gestión de Recursos] [🏢 Gestión de Áreas]│
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│         CONTENIDO ACTIVO                        │
│  (Tabla de Recursos o Tabla de Áreas)          │
└─────────────────────────────────────────────────┘
```

### Estadísticas

En la parte superior del panel verás 3 tarjetas:

**1. Total Recursos**
- Cantidad total de recursos en el sistema
- Incluye activos e inactivos

**2. Recursos Activos**
- Recursos visibles en la página principal
- Excluye los marcados como inactivos

**3. Áreas Diferentes**
- Número de áreas operativas configuradas
- Actualmente: 8 áreas

### Sistema de Pestañas

**Pestaña 1: Gestión de Recursos**
- Ver todos los recursos
- Crear nuevos recursos
- Editar recursos existentes
- Eliminar recursos
- Activar/Desactivar recursos

**Pestaña 2: Gestión de Áreas**
- Ver todas las áreas
- Crear nuevas áreas
- Editar áreas existentes
- Eliminar áreas
- Activar/Desactivar áreas

---

## 📚 GESTIÓN DE RECURSOS

### Ver Recursos

#### Tabla de Recursos

La tabla muestra los siguientes campos:

| Columna         | Descripción                           |
|-----------------|---------------------------------------|
| **Área**        | Área operativa del recurso            |
| **Título**      | Nombre del recurso                    |
| **Descripción** | Breve descripción                     |
| **Enlace**      | URL de Google Drive                   |
| **Palabras Clave** | Tags de búsqueda                   |
| **Estado**      | Activo ✅ / Inactivo ❌               |
| **Fecha**       | Fecha de creación                     |
| **Acciones**    | Botones Editar ✏️ / Eliminar 🗑️     |

#### Funciones de la Tabla

**Búsqueda**
- Campo de búsqueda en la parte superior
- Busca en: título, descripción, área

**Filtro por Área**
- Dropdown para filtrar por área específica
- Opción "Todas las áreas" para ver todo

**Paginación**
- 10 recursos por página
- Navegación con botones

### Crear Nuevo Recurso

#### Paso 1: Abrir Modal

1. Hacer clic en el botón **"+ Nuevo Recurso"**
2. Se abre una ventana modal

#### Paso 2: Completar Formulario

![Formulario Nuevo Recurso]

**Campos obligatorios (*):**

**1. Área***
- Seleccionar del dropdown
- Opciones: 8 áreas operativas

**2. Título***
- Nombre descriptivo del recurso
- Ejemplo: "Manual de Matrícula 2025"

**3. Descripción**
- Breve descripción del contenido
- Ejemplo: "Guía paso a paso para el proceso de matrícula"

**4. Enlace***
- URL completa de Google Drive
- Ejemplo: `https://drive.google.com/file/d/ABC123/view`

**5. Palabras Clave**
- Separadas por comas
- Ejemplo: `matrícula, alumnos, procedimiento`

**6. Estado**
- ☑️ Activo (visible en la web)
- ☐ Inactivo (oculto)

#### Paso 3: Guardar

1. Hacer clic en **"Guardar"**
2. El sistema valida los datos
3. Muestra notificación de éxito o error
4. El modal se cierra automáticamente
5. La tabla se actualiza con el nuevo recurso

### Editar Recurso Existente

#### Paso 1: Seleccionar Recurso

1. En la tabla, hacer clic en el botón **✏️ Editar**
2. Se abre el modal con los datos actuales

#### Paso 2: Modificar Datos

1. Editar los campos deseados
2. Los cambios se marcan visualmente

#### Paso 3: Guardar Cambios

1. Hacer clic en **"Guardar"**
2. Confirmación de éxito
3. Tabla se actualiza automáticamente

### Eliminar Recurso

#### Paso 1: Seleccionar Recurso

1. Hacer clic en el botón **🗑️ Eliminar**
2. Se abre modal de confirmación

#### Paso 2: Confirmar Eliminación

Modal muestra:
```
┌────────────────────────────────┐
│  ⚠️ ¿Eliminar Recurso?         │
│                                │
│  "Manual de Matrícula 2025"   │
│                                │
│  Esta acción no se puede      │
│  deshacer.                     │
│                                │
│  [Cancelar]  [Eliminar]        │
└────────────────────────────────┘
```

3. Hacer clic en **"Eliminar"** para confirmar
4. O **"Cancelar"** para abortar

#### Paso 3: Confirmación

- Notificación de éxito
- El recurso desaparece de la tabla
- **Nota**: La eliminación es permanente

### Activar/Desactivar Recurso

**Opción rápida sin eliminar**

#### ¿Por qué desactivar en lugar de eliminar?

- ✅ No se pierde la información
- ✅ Se puede reactivar después
- ✅ Oculta el recurso de la página pública
- ✅ Útil para recursos temporales o en revisión

#### ¿Cómo hacerlo?

**Método 1: Desde la tabla**
1. El badge de estado muestra: ✅ Activo o ❌ Inactivo
2. Algunos sistemas permiten hacer clic directo

**Método 2: Editando el recurso**
1. Abrir el recurso en modo edición
2. Desmarcar checkbox **"Activo"**
3. Guardar cambios

---

## 🏢 GESTIÓN DE ÁREAS

### Ver Áreas

#### Tabla de Áreas

| Columna         | Descripción                         |
|-----------------|-------------------------------------|
| **Orden**       | Posición en el carrusel (1-8)       |
| **Nombre**      | Nombre del área                     |
| **Correo**      | Email de contacto                   |
| **Descripción** | Breve descripción del área          |
| **Estado**      | Activo ✅ / Inactivo ❌             |
| **Fecha**       | Fecha de creación                   |
| **Acciones**    | Editar ✏️ / Eliminar 🗑️            |

### Crear Nueva Área

#### Paso 1: Abrir Modal

1. Hacer clic en **"+ Nueva Área"**
2. Se abre formulario modal

#### Paso 2: Completar Formulario

**Campos del formulario:**

**1. Nombre*** (Obligatorio)
- Nombre del área operativa
- Ejemplo: "RECURSOS HUMANOS"
- Máximo: 100 caracteres

**2. Correo**
- Email de contacto del área
- Ejemplo: `rrhh@certus.edu.pe`
- Validación de formato email

**3. Descripción**
- Descripción breve del área
- Ejemplo: "Gestión de personal y recursos humanos"

**4. Ícono**
- Emoji o ícono representativo
- Ejemplo: 👥, 📚, ⚙️
- Opcional: si no se ingresa, usa ícono por defecto

**5. Orden*** (Obligatorio)
- Posición en el carrusel (1-99)
- Ejemplo: 9 (para agregar al final)
- Debe ser único

**6. Estado**
- ☑️ Activo (visible en la web)
- ☐ Inactivo (oculto)

#### Paso 3: Guardar

1. Hacer clic en **"Guardar"**
2. Validación de datos
3. Notificación de éxito
4. Tabla se actualiza

### Editar Área Existente

#### Proceso

1. Hacer clic en **✏️ Editar** en la fila del área
2. Modal se abre con datos actuales
3. Modificar los campos deseados
4. Hacer clic en **"Guardar"**
5. Confirmación y actualización

**Importante:**
- Si cambias el nombre, afecta el filtro en la página principal
- Si cambias el orden, afecta la posición en el carrusel
- Si desactivas, el área no aparece en el frontend

### Eliminar Área

#### ⚠️ ADVERTENCIA

Eliminar un área tiene consecuencias:

- Los recursos asignados a esa área **NO se eliminan**
- Los recursos quedan con `area_id = NULL` (sin área)
- Aparecerán como "Sin área" en el sistema

#### Proceso

1. Hacer clic en **🗑️ Eliminar**
2. Modal de confirmación muestra:
   ```
   ┌────────────────────────────────┐
   │  ⚠️ ¿Eliminar Área?            │
   │                                │
   │  "FACTURACIÓN"                 │
   │                                │
   │  Los recursos de esta área     │
   │  quedarán sin área asignada.   │
   │                                │
   │  [Cancelar]  [Eliminar]        │
   └────────────────────────────────┘
   ```
3. Confirmar o cancelar

**Recomendación:**
- Es mejor **desactivar** que eliminar
- Solo eliminar si estás seguro

### Buscar Áreas

En la pestaña de Gestión de Áreas:

1. Usar la barra de búsqueda superior
2. Busca en: nombre, correo, descripción
3. Resultados en tiempo real

### Paginación de Áreas

- 10 áreas por página
- Navegación con botones
- Similar a la tabla de recursos

---

## ❓ PREGUNTAS FRECUENTES (FAQ)

### Generales

**P: ¿Necesito cuenta para ver los recursos?**  
R: No, la página principal es pública. Solo necesitas cuenta para administrar.

**P: ¿Puedo descargar los archivos directamente?**  
R: El sistema solo proporciona enlaces a Google Drive. La descarga se hace desde Drive.

**P: ¿Los recursos se almacenan en el sistema?**  
R: No, solo almacenamos enlaces. Los archivos están en Google Drive.

**P: ¿Funciona en móvil?**  
R: Sí, el diseño es completamente responsivo.

### Búsqueda

**P: ¿La búsqueda distingue mayúsculas/minúsculas?**  
R: No, la búsqueda es case-insensitive.

**P: ¿Puedo buscar por múltiples palabras?**  
R: Sí, escribe todas las palabras y buscará coincidencias.

**P: ¿Por qué no encuentro un recurso que sé que existe?**  
R: Posibles razones:
- El recurso está inactivo
- Estás filtrando por un área incorrecta
- El recurso fue eliminado
- Verifica ortografía

### Administración

**P: ¿Cuántos recursos puedo crear?**  
R: No hay límite definido, depende del plan de Supabase.

**P: ¿Puedo restaurar un recurso eliminado?**  
R: No, la eliminación es permanente. Usa "Desactivar" si no estás seguro.

**P: ¿Puedo cambiar mi contraseña?**  
R: Contacta al administrador del sistema o IT.

**P: ¿Cuántos administradores puede haber?**  
R: No hay límite, se crean desde Supabase.

### Áreas

**P: ¿Puedo agregar más de 8 áreas?**  
R: Sí, no hay límite. Las 8 actuales son las definidas inicialmente.

**P: ¿Qué pasa si elimino un área con recursos?**  
R: Los recursos NO se eliminan, quedan sin área asignada.

**P: ¿Puedo cambiar el orden de las áreas?**  
R: Sí, editando el campo "Orden" de cada área.

### Técnicas

**P: ¿Qué navegadores son compatibles?**  
R: Chrome, Firefox, Edge, Safari (versiones recientes).

**P: ¿Funciona sin internet?**  
R: No, requiere conexión para cargar datos de la base de datos.

**P: ¿Los cambios son instantáneos?**  
R: Sí, al guardar un recurso/área, se refleja inmediatamente.

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### No puedo iniciar sesión

**Síntomas:**
- "Email o contraseña incorrectos"
- No redirige después de login
- Botón de login no responde

**Soluciones:**

1. **Verificar credenciales**
   - Email correcto (incluye @)
   - Contraseña sin espacios extra
   - Mayúsculas/minúsculas importan

2. **Limpiar caché del navegador**
   - Chrome: Ctrl+Shift+Del → Borrar caché
   - Firefox: Ctrl+Shift+Del → Limpiar todo

3. **Probar en modo incógnito**
   - Descarta problemas de cookies

4. **Verificar conexión a internet**
   - Intentar cargar otra página

5. **Contactar a IT**
   - Puede que tu cuenta no esté activa
   - Solicitar reset de contraseña

### Los recursos no cargan

**Síntomas:**
- Skeleton loader infinito
- Página en blanco
- Error en consola

**Soluciones:**

1. **Recargar la página**
   - F5 o Ctrl+R

2. **Verificar conexión**
   - Abrir otra web para confirmar

3. **Limpiar caché**
   - Ctrl+Shift+Del → Borrar datos

4. **Revisar consola del navegador**
   - F12 → Pestaña Console
   - Buscar errores en rojo
   - Capturar y reportar a IT

5. **Probar en otro navegador**
   - Descartar problema del navegador actual

### No puedo crear un recurso

**Síntomas:**
- Botón "Guardar" no responde
- Error: "Faltan campos obligatorios"
- Modal no se cierra

**Soluciones:**

1. **Verificar campos obligatorios**
   - Área seleccionada
   - Título completado (mínimo 3 caracteres)
   - Enlace de Drive válido

2. **Validar enlace de Drive**
   - Debe empezar con `https://drive.google.com`
   - Debe ser un enlace completo

3. **Palabras clave bien escritas**
   - Separadas por comas
   - Sin caracteres especiales extraños

4. **Verificar permisos**
   - Tu cuenta debe tener rol "admin"

5. **Revisar consola**
   - F12 → Console
   - Buscar mensajes de error

### El área no aparece en el carrusel

**Síntomas:**
- Área creada pero no visible
- Carrusel vacío
- Área aparece en admin pero no en index

**Soluciones:**

1. **Verificar estado del área**
   - En Gestión de Áreas, revisar que esté "Activo" ✅

2. **Revisar orden del área**
   - Debe tener un número de orden
   - No debe haber conflictos con otras áreas

3. **Recargar página principal**
   - Ir a index.html
   - F5 para recargar

4. **Limpiar caché**
   - Puede estar cacheada la versión anterior

### Búsqueda no encuentra resultados

**Síntomas:**
- Escribo pero no filtra
- Mensaje "No se encontraron resultados"
- Búsqueda parece no funcionar

**Soluciones:**

1. **Verificar ortografía**
   - Revisar tildes y caracteres especiales

2. **Usar términos más generales**
   - Buscar "manual" en lugar de "manual completo de..."

3. **Quitar filtros de área**
   - Puede que estés filtrando por área incorrecta

4. **Verificar que el recurso existe**
   - Ir a panel admin
   - Buscar en la tabla de recursos

5. **Verificar estado del recurso**
   - Puede estar inactivo

### Botones de paginación no funcionan

**Síntomas:**
- Clic en "Siguiente" no hace nada
- Números de página deshabilitados
- Siempre muestra página 1

**Soluciones:**

1. **Verificar cantidad de resultados**
   - Si hay menos de 10 recursos, no hay paginación

2. **Revisar consola**
   - F12 → Console
   - Buscar errores JavaScript

3. **Recargar página**
   - F5

4. **Limpiar caché**

### Modal no se cierra

**Síntomas:**
- Botón X no responde
- Clic fuera del modal no funciona
- Modal se queda abierto

**Soluciones:**

1. **Presionar ESC**
   - Tecla Escape del teclado

2. **Recargar página**
   - F5 (perderás datos no guardados)

3. **Cerrar y volver a abrir**
   - Puede ser un bug temporal

### Error: "No tienes permisos"

**Síntomas:**
- Al intentar guardar/editar/eliminar
- Mensaje de error de permisos

**Soluciones:**

1. **Verificar que estás logueado**
   - Puede que la sesión haya expirado
   - Volver a iniciar sesión

2. **Verificar rol de usuario**
   - Tu cuenta debe ser "admin"
   - Contactar a IT para verificar

3. **Revisar en tabla profiles**
   - Admin puede verificar en Supabase

### Datos no se actualizan

**Síntomas:**
- Edito un recurso pero no cambia
- Estadísticas incorrectas
- Tabla no refleja cambios

**Soluciones:**

1. **Recargar página**
   - F5 o Ctrl+R

2. **Esperar unos segundos**
   - Algunos cambios tardan en propagarse

3. **Limpiar caché**
   - Ctrl+Shift+Del

4. **Verificar en base de datos**
   - Admin puede revisar Supabase

---

## 📞 SOPORTE

### Contacto

**Email IT**: it@certus.edu.pe  
**Teléfono**: [número de contacto]  
**Horario**: Lunes a Viernes, 8am - 6pm

### Reportar un Error

Al reportar un problema, incluye:

1. **Descripción del error**
   - Qué estabas haciendo
   - Qué esperabas que pasara
   - Qué pasó en realidad

2. **Capturas de pantalla**
   - Del error si es visible
   - De la consola (F12)

3. **Información técnica**
   - Navegador y versión
   - Sistema operativo
   - Hora aproximada del error

4. **Pasos para reproducir**
   - Cómo hacer que el error vuelva a ocurrir

### Solicitar Nuevas Funcionalidades

Si tienes ideas para mejorar el sistema:

1. Describir la funcionalidad
2. Explicar el beneficio
3. Dar ejemplos de uso
4. Enviar a: it@certus.edu.pe

---

## 📝 NOTAS FINALES

### Mejores Prácticas

✅ **Títulos descriptivos**: Usa nombres claros para recursos  
✅ **Descripciones completas**: Ayuda a otros a encontrar el recurso  
✅ **Palabras clave relevantes**: Mejora la búsqueda  
✅ **Enlaces verificados**: Prueba el enlace antes de guardar  
✅ **Áreas correctas**: Asigna el recurso al área apropiada  
✅ **Desactivar, no eliminar**: Usa inactivar en lugar de eliminar

### Seguridad

🔒 **No compartas credenciales**: Cada admin debe tener su cuenta  
🔒 **Cierra sesión**: Especialmente en computadoras compartidas  
🔒 **Enlaces seguros**: Solo usa enlaces de drive.google.com  
🔒 **Verifica cambios**: Revisa antes de guardar modificaciones importantes

---

**Última actualización:** Noviembre 2025  
**Versión del documento:** 1.0  
**Sistema:** CERTUS Drive v1.0
