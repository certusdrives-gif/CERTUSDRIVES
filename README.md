# 🚀 CERTUS Drive - Sistema de Gestión de Recursos Corporativos

<div align="center">

![CERTUS Logo](assets/certus.png)

**Sistema profesional de gestión de recursos corporativos con autenticación, roles y panel de administración**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com)
[![License](https://img.shields.io/badge/License-Internal%20Use-blue)](https://github.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com)

[Demo](#) • [Documentación](#documentación) • [Arquitectura](docs/ARQUITECTURA.md) • [Deployment](docs/DEPLOYMENT.md)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación-rápida)
- [Uso](#-uso)
- [Documentación](#-documentación)
- [Seguridad](#-seguridad)
- [Contribuir](#-contribuir)

---

## ✨ Características

### 🔐 Autenticación y Seguridad
- ✅ Registro e inicio de sesión con Supabase Auth
- ✅ Validación de email corporativo (`@certus.edu.pe`)
- ✅ Sistema de roles (Admin/Usuario)
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Registro de auditoría completo
- ✅ Protección de rutas por autenticación

### 📊 Gestión de Recursos
- ✅ Búsqueda en tiempo real con normalización de acentos
- ✅ Filtrado por áreas (9 categorías)
- ✅ Carousel interactivo de áreas
- ✅ Enlaces directos a Google Drive
- ✅ Sistema de palabras clave
- ✅ Activación/desactivación de recursos

### 👑 Panel de Administración (CRUD Completo)
- ✅ Crear nuevos recursos con formulario validado
- ✅ Editar recursos existentes
- ✅ Eliminar con confirmación
- ✅ Tabla con paginación (10 por página)
- ✅ Filtros dinámicos (área y estado)
- ✅ Estadísticas en tiempo real
- ✅ Búsqueda avanzada

### 🎨 Diseño y UX
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Colores corporativos CERTUS (#0B2660)
- ✅ Animaciones y transiciones suaves
- ✅ Notificaciones toast
- ✅ Modales con animaciones
- ✅ Loading states

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Base de Datos** | PostgreSQL 15+ |
| **Autenticación** | Supabase Auth |
| **Hosting** | Netlify |
| **Versionado** | Git/GitHub |

---

## 📁 Estructura del Proyecto

```
supabase-version/
│
├── 📂 assets/              # Logo y recursos estáticos
├── 📂 css/                 # Hojas de estilo (login, styles, admin)
├── 📂 js/                  # JavaScript modular (config, auth, logic)
├── 📂 docs/                # Documentación completa
│   ├── ARQUITECTURA.md     # Arquitectura del sistema
│   ├── DEPLOYMENT.md       # Guía de despliegue
│   ├── GUIA_SUPABASE_SETUP.md
│   ├── INICIO_RAPIDO.md
│   └── CREAR_TABLAS.md     # Scripts SQL
│
├── 📄 login.html           # Página de autenticación
├── 📄 index.html           # Aplicación principal
├── 📄 admin.html           # Panel de administración
├── 📄 netlify.toml         # Configuración de Netlify
├── 📄 _redirects           # Redirecciones SPA
├── 📄 .env.example         # Plantilla de variables de entorno
└── 📄 .gitignore           # Archivos ignorados por Git
```

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/certus-drive.git
cd certus-drive
```

### 2️⃣ Configurar Supabase

1. **Ejecutar scripts SQL** en Supabase SQL Editor:
   - Script 1: Crear tablas (`docs/CREAR_TABLAS.md`)
   - Script 2: Activar Row Level Security

2. **Obtener credenciales**:
   - Supabase URL
   - Anon Key

3. **Actualizar `js/config.js`**:
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-clave-aqui';
```

### 3️⃣ Abrir en Navegador

```bash
# Opción 1: Abrir directamente
start login.html

# Opción 2: Usar Live Server (VS Code)
# Click derecho → Open with Live Server
```

### 4️⃣ Registrar Primer Admin

1. Registrarte con email `@certus.edu.pe`
2. En Supabase SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu@certus.edu.pe';
```

---

## 📖 Uso

### 👤 Como Usuario Normal

1. **Login** en `login.html`
2. **Buscar** recursos en la página principal
3. **Filtrar** por áreas usando el carousel
4. **Acceder** a Google Drive con un click

### 👑 Como Administrador

1. **Login** y acceder al **Panel Admin**
2. **Crear** nuevos recursos con el botón "➕ Nuevo Recurso"
3. **Editar** haciendo click en el botón ✏️ amarillo
4. **Eliminar** con el botón 🗑️ rojo
5. **Filtrar** por área o estado
6. **Buscar** en tiempo real

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARQUITECTURA.md](docs/ARQUITECTURA.md) | Arquitectura técnica completa |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guía de despliegue en Netlify |
| [GUIA_SUPABASE_SETUP.md](docs/GUIA_SUPABASE_SETUP.md) | Setup completo de Supabase |
| [INICIO_RAPIDO.md](docs/INICIO_RAPIDO.md) | Inicio en 15 minutos |
| [CREAR_TABLAS.md](docs/CREAR_TABLAS.md) | Scripts SQL para base de datos |

---

## 🔐 Seguridad

### Implementaciones de Seguridad

✅ **Row Level Security (RLS)**: Políticas a nivel de base de datos  
✅ **Validación de Email**: Solo `@certus.edu.pe` permitidos  
✅ **Role-Based Access Control**: Permisos por rol (admin/user)  
✅ **Audit Logs**: Registro de todas las acciones  
✅ **HTTPS**: Comunicación encriptada  
✅ **XSS Protection**: Validación de inputs  
✅ **CSRF Protection**: Tokens de Supabase  

### Variables de Entorno

**NUNCA** subir credenciales al repositorio. Usar `.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-aqui
```

---

## 🎯 Roadmap

### ✅ Versión 1.0 (Actual)
- [x] Autenticación con Supabase
- [x] Sistema de roles
- [x] CRUD completo de recursos
- [x] Búsqueda y filtros
- [x] Panel de administración
- [x] Audit logs

### 🔄 Versión 1.1 (Próxima)
- [ ] Google OAuth (login con cuenta Google)
- [ ] Exportar recursos a Excel
- [ ] Importar recursos desde CSV
- [ ] Notificaciones por email
- [ ] Dashboard de estadísticas
- [ ] Drag & drop para ordenar

### 🚀 Versión 2.0 (Futuro)
- [ ] App móvil (React Native)
- [ ] Sistema de comentarios
- [ ] Favoritos por usuario
- [ ] Historial de accesos
- [ ] API REST pública
- [ ] Integración con Microsoft Teams

---

## 🤝 Contribuir

### Cómo Contribuir

1. **Fork** el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

### Convenciones de Commits

```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato (no afectan código)
refactor: Refactorización de código
test: Agregar o modificar tests
chore: Tareas de mantenimiento
```

---

## 📞 Soporte

- 📧 Email: it@certus.edu.pe
- 💬 Slack: #certus-drive-support
- 📖 Docs: [Documentación completa](docs/)

---

## 📜 Licencia

**Uso Interno CERTUS** - Este proyecto es de uso exclusivo para el Instituto CERTUS.

---

## 👥 Equipo

- **Desarrollador Principal**: Tu Nombre
- **Product Owner**: CERTUS IT Team
- **Stakeholders**: Departamento de Recursos Humanos

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Por el increíble BaaS
- [Netlify](https://netlify.com) - Por el hosting gratuito
- [CERTUS](https://certus.edu.pe) - Por la oportunidad

---

<div align="center">

**Hecho con ❤️ para CERTUS**

⭐ Si te gusta este proyecto, dale una estrella en GitHub!

[Reportar Bug](https://github.com/tu-usuario/certus-drive/issues) • [Solicitar Feature](https://github.com/tu-usuario/certus-drive/issues)

</div>
