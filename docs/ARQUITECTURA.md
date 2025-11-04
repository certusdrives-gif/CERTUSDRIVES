# 🏗️ Arquitectura del Proyecto - CERTUS Drive

## 📁 Estructura de Carpetas

```
supabase-version/
│
├── 📂 assets/              # Recursos estáticos
│   └── certus.png          # Logo de CERTUS
│
├── 📂 css/                 # Hojas de estilo
│   ├── login.css           # Estilos de página de login
│   ├── styles.css          # Estilos de página principal
│   └── admin.css           # Estilos del panel de administración
│
├── 📂 js/                  # Scripts JavaScript
│   ├── config.js           # Configuración de Supabase
│   ├── auth.js             # Módulo de autenticación
│   ├── login.js            # Lógica de login/registro
│   ├── script.js           # Lógica de página principal
│   └── admin.js            # Lógica del panel admin (CRUD)
│
├── 📂 docs/                # Documentación
│   ├── GUIA_SUPABASE_SETUP.md     # Guía completa de configuración
│   ├── INICIO_RAPIDO.md           # Inicio rápido (15 min)
│   ├── CREAR_TABLAS.md            # Scripts SQL para crear tablas
│   ├── README.md                  # Instrucciones de uso
│   └── ARQUITECTURA.md            # Este archivo
│
├── 📄 login.html           # Página de inicio de sesión
├── 📄 index.html           # Página principal (búsqueda de recursos)
└── 📄 admin.html           # Panel de administración (CRUD)
```

---

## 🎯 Arquitectura de Capas

### **1. Capa de Presentación (Frontend)**
- **HTML5**: Estructura semántica
- **CSS3**: Estilos responsivos con variables CSS
- **JavaScript Vanilla**: Sin frameworks, código limpio

### **2. Capa de Lógica de Negocio**
- **auth.js**: Manejo de autenticación y autorización
- **Validaciones**: Email corporativo (@certus.edu.pe)
- **Roles**: Sistema de permisos (admin/user)

### **3. Capa de Datos (Backend)**
- **Supabase**: Backend as a Service (BaaS)
- **PostgreSQL**: Base de datos relacional
- **Row Level Security (RLS)**: Seguridad a nivel de fila
- **Audit Logs**: Registro de auditoría

---

## 🔐 Modelo de Seguridad

### **Autenticación**
```
Usuario → Supabase Auth → Verificación Email → Perfil Creado
```

### **Autorización**
```
Request → Check Auth → Verify Role → Execute Policy → Response
```

### **Políticas RLS**
- **profiles**: Los usuarios ven su propio perfil, admins ven todos
- **recursos**: Todos ven recursos activos, solo admins modifican
- **audit_logs**: Solo admins ven logs

---

## 📊 Modelo de Datos

### **Tabla: profiles**
```sql
id          UUID (PK, FK → auth.users)
email       TEXT (UNIQUE, NOT NULL)
full_name   TEXT
role        TEXT (DEFAULT 'user', CHECK: 'admin' | 'user')
avatar_url  TEXT
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### **Tabla: recursos**
```sql
id              UUID (PK)
area            TEXT (NOT NULL)
titulo          TEXT (NOT NULL)
descripcion     TEXT
enlace          TEXT (NOT NULL)
palabras_clave  TEXT[] (Array)
created_by      UUID (FK → profiles)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
is_active       BOOLEAN (DEFAULT TRUE)
```

### **Tabla: audit_logs**
```sql
id          UUID (PK)
user_id     UUID (FK → profiles)
action      TEXT (CHECK: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT')
table_name  TEXT
record_id   UUID
old_data    JSONB
new_data    JSONB
created_at  TIMESTAMPTZ
```

---

## 🔄 Flujo de Trabajo

### **1. Registro/Login**
```
1. Usuario accede a login.html
2. Ingresa email @certus.edu.pe y contraseña
3. Validación en frontend (auth.js)
4. Supabase verifica credenciales
5. Trigger crea perfil automáticamente
6. Redirección a index.html
```

### **2. Visualización de Recursos (Usuario Normal)**
```
1. checkAuth() verifica sesión activa
2. cargarRecursosDesdeSupabase() consulta tabla recursos
3. Aplica filtro WHERE is_active = TRUE
4. Muestra carousel de áreas
5. Usuario busca y filtra recursos
6. Click en enlace → Abre Google Drive
```

### **3. Gestión CRUD (Admin)**
```
1. Click en "Panel Admin" (solo visible para admins)
2. esAdministrador() verifica rol
3. Carga admin.html con todas las herramientas
4. CRUD completo:
   - CREATE: Modal con formulario → INSERT en recursos
   - READ: Tabla con paginación → SELECT con filtros
   - UPDATE: Modal precargado → UPDATE en recursos
   - DELETE: Confirmación → DELETE en recursos
5. Registra todas las acciones en audit_logs
```

---

## 🎨 Patrones de Diseño

### **1. Module Pattern**
- Cada archivo JS es un módulo independiente
- `auth.js` exporta funciones de autenticación
- `config.js` centraliza la configuración

### **2. Separation of Concerns**
- HTML: Solo estructura
- CSS: Solo presentación
- JS: Solo lógica

### **3. DRY (Don't Repeat Yourself)**
- Funciones reutilizables (`mostrarToast`, `formatearFecha`)
- Variables CSS para colores corporativos
- Componentes modulares

### **4. Progressive Enhancement**
- Funciona sin JavaScript (formularios básicos)
- Mejora con JavaScript (validación, UX)
- Responsive por defecto

---

## 🚀 Flujo de Despliegue

```
1. Desarrollo Local
   ↓
2. Pruebas en Supabase Free Tier
   ↓
3. Push a GitHub
   ↓
4. Deploy en Netlify
   ↓
5. Variables de entorno configuradas
   ↓
6. SSL/HTTPS automático
   ↓
7. Producción ✅
```

---

## 📈 Escalabilidad

### **Actual (MVP)**
- ✅ Hasta 50,000 usuarios mensuales (Supabase Free)
- ✅ Hasta 500 MB de base de datos
- ✅ Hasta 1 GB de almacenamiento de archivos
- ✅ Row Level Security activado

### **Futuro (Escalar)**
- 🔄 Migrar a Supabase Pro ($25/mes)
- 🔄 CDN para assets estáticos
- 🔄 Caché de recursos con Service Workers
- 🔄 Lazy loading de imágenes
- 🔄 Paginación en backend (OFFSET/LIMIT)

---

## 🧪 Testing (Recomendado)

### **Frontend**
```javascript
// Ejemplo con Jest
test('Valida email @certus.edu.pe', () => {
    const email = 'test@certus.edu.pe';
    expect(validarEmailCorporativo(email)).toBe(true);
});
```

### **Backend (SQL)**
```sql
-- Verificar RLS
SELECT * FROM recursos; -- Usuario normal: Solo activos
SELECT * FROM recursos; -- Admin: Todos
```

---

## 🔧 Mantenimiento

### **Tareas Regulares**
- 📅 **Semanal**: Revisar audit_logs para actividad sospechosa
- 📅 **Mensual**: Backup de base de datos en Supabase
- 📅 **Trimestral**: Actualizar dependencias (@supabase/supabase-js)

### **Monitoreo**
- 📊 Dashboard de Supabase para métricas
- 🚨 Alertas en Netlify para errores 500
- 📧 Notificaciones por email configuradas

---

## 📚 Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Frontend | HTML5 | - |
| Frontend | CSS3 | - |
| Frontend | JavaScript | ES6+ |
| Backend | Supabase | 2.x |
| Base de Datos | PostgreSQL | 15+ |
| Autenticación | Supabase Auth | 2.x |
| Hosting | Netlify | - |
| Versionado | Git/GitHub | - |

---

## 🎓 Convenciones de Código

### **Nomenclatura**
- **Variables**: camelCase (`recursosOriginales`)
- **Funciones**: camelCase (`cargarRecursos()`)
- **Constantes**: UPPER_SNAKE_CASE (`SUPABASE_URL`)
- **Clases CSS**: kebab-case (`.app-bar`)

### **Comentarios**
```javascript
// ============================================
// SECCIÓN PRINCIPAL
// ============================================

// Comentario de una línea

/**
 * Comentario de función
 * @param {string} email - Email del usuario
 * @returns {boolean} - True si válido
 */
```

---

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. **Crea una rama**: `git checkout -b feature/nueva-funcionalidad`
2. **Sigue la estructura de carpetas**
3. **Documenta tus cambios**
4. **Prueba localmente**
5. **Crea Pull Request**

---

**Última actualización**: 3 de noviembre de 2025
**Autor**: Equipo CERTUS IT
**Licencia**: Uso interno CERTUS
