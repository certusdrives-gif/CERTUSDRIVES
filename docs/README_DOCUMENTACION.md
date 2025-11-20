# 📚 DOCUMENTACIÓN DEL PROYECTO CERTUS DRIVE

## Sistema de Gestión de Recursos Administrativos

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Desarrollado para:** CERTUS - Institución Educativa  
**Desarrollado por:** Jeffcode

---

## 📖 ÍNDICE DE DOCUMENTACIÓN

Este proyecto incluye documentación completa y profesional para todos los aspectos del sistema:

### 1. 📘 [DOCUMENTACIÓN COMPLETA](./DOCUMENTACION_COMPLETA.md)
**Archivo:** `DOCUMENTACION_COMPLETA.md`

Documento técnico exhaustivo que cubre:
- ✅ Resumen ejecutivo del proyecto
- ✅ Arquitectura del sistema (JAMstack)
- ✅ Stack tecnológico completo (HTML5, CSS3, JavaScript ES6+, Supabase, Netlify)
- ✅ Infraestructura y servicios en la nube
- ✅ Estructura completa del proyecto
- ✅ Módulos y componentes detallados
- ✅ Esquema de base de datos (PostgreSQL)
- ✅ Sistema de autenticación y seguridad (JWT, RLS)
- ✅ Flujos de trabajo ilustrados

**Audiencia:** Desarrolladores, Arquitectos de Software, CTO

### 2. 👥 [GUÍA DE USUARIO](./GUIA_USUARIO.md)
**Archivo:** `GUIA_USUARIO.md`

Manual completo para usuarios del sistema:
- ✅ Acceso al sistema (público y administrador)
- ✅ Interfaz de usuario explicada
- ✅ Cómo buscar recursos efectivamente
- ✅ Uso del panel de administración
- ✅ Gestión completa de recursos (CRUD)
- ✅ Gestión completa de áreas (CRUD)
- ✅ Preguntas frecuentes (FAQ)
- ✅ Solución de problemas paso a paso

**Audiencia:** Usuarios Finales, Administradores del Sistema, Soporte Técnico

### 3. 🛠️ [GUÍA TÉCNICA DE DEPLOYMENT](./GUIA_TECNICA_DEPLOYMENT.md)
**Archivo:** `GUIA_TECNICA_DEPLOYMENT.md`

Guía paso a paso para configurar y desplegar el sistema:
- ✅ Requisitos previos (cuentas, herramientas)
- ✅ Configuración completa de Supabase (BD + Auth)
- ✅ Setup del proyecto local
- ✅ Deployment en Netlify (3 métodos)
- ✅ Configuración de Google Drive
- ✅ Variables de entorno
- ✅ Testing y validación
- ✅ Mantenimiento y backups
- ✅ Troubleshooting
- ✅ Plan de escalabilidad

**Audiencia:** DevOps, Administradores de Sistema, Desarrolladores

### 4. 🗄️ [SCRIPTS SQL](./SQL_CREATE_AREAS_TABLE.sql)
**Archivos:** Varios archivos SQL

Scripts de base de datos:
- `SQL_CREATE_AREAS_TABLE.sql` - Creación de tabla areas
- `SQL_MIGRAR_RECURSOS_AREAS_SEGURO.sql` - Migración con Foreign Keys
- `SQL_UPDATE_ICONO_OPCIONAL.sql` - Actualización de esquema
- `SQL_DIAGNOSTICO_RECURSOS.sql` - Diagnóstico del sistema

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué es CERTUS Drive?

CERTUS Drive es un sistema web moderno de gestión de recursos institucionales internos que centraliza y organiza enlaces de Google Drive de 8 áreas operativas de la institución CERTUS.

### Características Principales

🔍 **Búsqueda Inteligente**
- Búsqueda en tiempo real por título, descripción y palabras clave
- Filtrado por área operativa
- Paginación automática

🎨 **Interfaz Moderna**
- Diseño responsivo (móvil, tablet, desktop)
- Skeleton loaders para mejor UX
- Animaciones fluidas

🔐 **Seguridad Robusta**
- Autenticación con JWT
- Row Level Security (RLS) en base de datos
- HTTPS forzado
- Headers de seguridad configurados

📊 **Panel de Administración**
- CRUD completo de recursos
- CRUD completo de áreas
- Estadísticas en tiempo real
- Sistema de búsqueda y filtros

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | Estándar | Estructura semántica |
| CSS3 | Estándar | Estilos y diseño responsivo |
| JavaScript | ES6+ | Lógica de aplicación |
| Vanilla JS | - | Sin frameworks (rendimiento) |

### Backend (BaaS)
| Servicio | Plan | Uso |
|----------|------|-----|
| Supabase | Free | PostgreSQL + Auth + API REST |
| PostgreSQL | 15 | Base de datos relacional |
| PostgREST | - | API REST auto-generada |

### Hosting & CDN
| Servicio | Plan | Uso |
|----------|------|-----|
| Netlify | Free | Hosting estático + CDN global |
| Let's Encrypt | Free | Certificados SSL/TLS |

### Almacenamiento
| Servicio | Uso |
|----------|-----|
| Google Drive | Archivos institucionales internos (PDFs, Docs, etc.) |

---

## 📊 ARQUITECTURA DEL SISTEMA

### Tipo: JAMstack (JavaScript, APIs, Markup)

```
Usuario → Netlify CDN → JavaScript Frontend → Supabase API → PostgreSQL
                                                    ↓
                                           Google Drive (enlaces)
```

**Ventajas**:
- ⚡ Alto rendimiento (contenido pre-renderizado)
- 🔒 Seguridad mejorada (sin servidor expuesto)
- 💰 Bajo costo (planes free suficientes)
- 📈 Escalabilidad automática (CDN)

---

## 🗄️ BASE DE DATOS

### Tablas Principales

**1. `recursos`** (Recursos Institucionales Internos)
- `id` (UUID)
- `area_id` (FK → areas)
- `titulo`, `descripcion`, `enlace`
- `palabras_clave` (Array)
- `is_active` (Boolean)

**2. `areas`** (Áreas Operativas)
- `id` (UUID)
- `nombre`, `correo`, `descripcion`
- `icono`, `orden`
- `activo` (Boolean)

**3. `profiles`** (Perfiles de Usuario)
- `id` (FK → auth.users)
- `email`, `full_name`
- `role` ('admin' o 'user')

### Relaciones
- `recursos.area_id` → `areas.id` (Foreign Key)
- `recursos.created_by` → `auth.users.id`
- `profiles.id` → `auth.users.id`

---

## 🔐 SEGURIDAD IMPLEMENTADA

### Autenticación
- ✅ JWT (JSON Web Tokens)
- ✅ Sesiones persistentes con refresh tokens
- ✅ Expiración automática (1 hora)

### Autorización
- ✅ Row Level Security (RLS) en PostgreSQL
- ✅ Políticas por rol (admin vs user)
- ✅ Acceso público controlado (solo lectura de activos)

### Headers HTTP
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Frame-Options (anti-clickjacking)
- ✅ X-XSS-Protection
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy

---

## 📁 ESTRUCTURA DEL PROYECTO

```
temp-deploy/
├── 📄 index.html              # Página principal (pública)
├── 📄 admin.html              # Panel de administración
├── 📄 login.html              # Autenticación
├── 📄 netlify.toml            # Configuración de Netlify
├── 📄 _redirects              # Reglas de redirección
│
├── 📂 css/                    # Estilos
│   ├── styles.css             # (1000+ líneas)
│   └── admin.css              # (1000+ líneas)
│
├── 📂 js/                     # Scripts
│   ├── config.js              # Configuración Supabase
│   ├── auth.js                # Sistema de autenticación
│   ├── login.js               # Lógica de login
│   ├── script.js              # Página principal (800+ líneas)
│   ├── admin.js               # Panel admin (600+ líneas)
│   └── areas.js               # CRUD áreas (470+ líneas)
│
├── 📂 assets/                 # Recursos estáticos
│   ├── logo.svg
│   └── favicon.ico
│
└── 📂 docs/                   # Documentación
    ├── DOCUMENTACION_COMPLETA.md
    ├── GUIA_USUARIO.md
    ├── GUIA_TECNICA_DEPLOYMENT.md
    └── [scripts SQL]
```

---

## 🚀 GUÍA RÁPIDA DE INSTALACIÓN

### Pre-requisitos
- Cuenta en Supabase (gratis)
- Cuenta en Netlify (gratis)
- Git instalado
- Cuenta de GitHub

### Pasos Básicos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/certusdrives-gif/CERTUSDRIVES.git
   cd CERTUSDRIVES/temp-deploy
   ```

2. **Configurar Supabase**
   - Crear proyecto en Supabase
   - Ejecutar scripts SQL de `docs/`
   - Obtener URL y API Key

3. **Configurar el proyecto**
   - Editar `js/config.js` con credenciales de Supabase

4. **Deploy en Netlify**
   - Conectar repositorio GitHub
   - Auto-deploy configurado

Para instrucciones detalladas, ver **[GUIA_TECNICA_DEPLOYMENT.md](./GUIA_TECNICA_DEPLOYMENT.md)**

---

## 📈 ESTADÍSTICAS DEL PROYECTO

### Código
- **Total de líneas**: ~4,000+
- **Archivos JavaScript**: 6 módulos
- **Archivos CSS**: 2 hojas de estilo
- **Archivos HTML**: 3 páginas

### Base de Datos
- **Tablas**: 3 principales
- **Áreas operativas**: 8 configuradas
- **RLS Policies**: 9 políticas activas
- **Índices**: 11 índices optimizados

### Características
- **Recursos gestionables**: Ilimitados
- **Búsqueda**: Tiempo real
- **Paginación**: 10-12 items por página
- **Soporte**: Desktop + Mobile + Tablet

---

## 🎨 CAPTURAS DE PANTALLA

### Página Principal
*Interfaz pública con búsqueda y carrusel de áreas*

### Panel de Administración
*Gestión CRUD de recursos y áreas*

### Sistema de Login
*Autenticación segura con JWT*

---

## 📞 SOPORTE Y CONTACTO

### Para Usuarios
- **Email**: soporte@certus.edu.pe
- **Documentación**: [GUIA_USUARIO.md](./GUIA_USUARIO.md)

### Para Desarrolladores
- **GitHub**: [certusdrives-gif/CERTUSDRIVES](https://github.com/certusdrives-gif/CERTUSDRIVES)
- **Issues**: Reportar en GitHub Issues
- **Documentación Técnica**: [DOCUMENTACION_COMPLETA.md](./DOCUMENTACION_COMPLETA.md)

---

## 📋 ROADMAP FUTURO

### Fase 1 (Actual) ✅
- ✅ Sistema básico funcional
- ✅ CRUD completo
- ✅ Búsqueda y filtros
- ✅ Autenticación y roles

### Fase 2 (Próximamente)
- ⏳ Exportación de reportes (Excel, PDF)
- ⏳ Dashboard con gráficos
- ⏳ Notificaciones por email
- ⏳ Log de actividad de usuarios

### Fase 3 (Futuro)
- 📅 Integración con Microsoft OneDrive
- 📅 Versionado de recursos
- 📅 Comentarios y ratings
- 📅 API pública para integraciones

---

## 📜 LICENCIA

**Propietario:** CERTUS - Institución Educativa  
**Desarrollado por:** Jeffcode  
**Uso:** Exclusivo para CERTUS

---

## 🏆 CRÉDITOS

### Desarrollador Principal
**Jeffcode** - Desarrollo completo del sistema

### Colaboradores
- Equipo de IT de CERTUS
- Coordinadores de áreas operativas

### Tecnologías de Terceros
- Supabase (Backend as a Service)
- Netlify (Hosting y CDN)
- Google Drive (Almacenamiento)

---

## 📝 CHANGELOG

### Versión 1.0 (Noviembre 2025)
- ✅ Release inicial
- ✅ Sistema completo funcional
- ✅ 8 áreas operativas configuradas
- ✅ Panel de administración completo
- ✅ Documentación completa

---

## 🔗 ENLACES ÚTILES

### Producción
- **URL Principal**: `https://[tu-sitio].netlify.app`
- **Panel Admin**: `https://[tu-sitio].netlify.app/admin.html`
- **Login**: `https://[tu-sitio].netlify.app/login.html`

### Servicios
- **Supabase Dashboard**: `https://app.supabase.com`
- **Netlify Dashboard**: `https://app.netlify.com`
- **GitHub Repo**: `https://github.com/certusdrives-gif/CERTUSDRIVES`

### Documentación Externa
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Última actualización:** Noviembre 2025  
**Versión del documento:** 1.0  
**Sistema:** CERTUS Drive v1.0

---

*Para ver la documentación completa, navega a los archivos listados en el índice al inicio de este documento.*
