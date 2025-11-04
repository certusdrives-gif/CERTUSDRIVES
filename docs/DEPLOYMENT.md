# 🚀 Guía de Despliegue en Netlify

## 📋 Pre-requisitos

- [x] Cuenta en GitHub
- [x] Cuenta en Netlify (gratuita)
- [x] Proyecto Supabase configurado
- [x] Tablas creadas en Supabase
- [x] Un usuario con rol admin

---

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd c:\Users\CHUNGA\Desktop\CERTUS\supabase-version
git init
git add .
git commit -m "Initial commit - CERTUS Drive"
```

### 1.2 Crear repositorio en GitHub

1. Ve a **https://github.com/new**
2. Nombre del repo: `certus-drive`
3. Descripción: "Sistema de gestión de recursos corporativos CERTUS"
4. **Privado** (importante para seguridad)
5. Click en **Create repository**

### 1.3 Subir código a GitHub

```bash
git remote add origin https://github.com/TU-USUARIO/certus-drive.git
git branch -M main
git push -u origin main
```

---

## 🌐 Paso 2: Desplegar en Netlify

### 2.1 Conectar con GitHub

1. Ve a **https://app.netlify.com/**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Autoriza Netlify a acceder a tus repos
5. Busca y selecciona **`certus-drive`**

### 2.2 Configurar Build Settings

```
Build command:     (dejar vacío)
Publish directory: .
```

### 2.3 Agregar Variables de Entorno

En **Site settings** → **Environment variables** → **Add a variable**

```
SUPABASE_URL = https://alcrunnigsatnvwexssd.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Usa las mismas credenciales que tienes en `js/config.js`

### 2.4 Deploy!

Click en **"Deploy site"**

Netlify generará una URL como:
```
https://certus-drive-abc123.netlify.app
```

---

## 🔒 Paso 3: Configurar Dominio (Opcional)

### 3.1 Cambiar nombre del sitio

En **Site settings** → **Change site name**

De: `certus-drive-abc123`  
A: `certus-drive` (si está disponible)

Nueva URL: `https://certus-drive.netlify.app`

### 3.2 Dominio personalizado (si tienes uno)

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Ingresa: `drive.certus.edu.pe`
4. Sigue las instrucciones para configurar DNS

---

## ✅ Paso 4: Verificar Despliegue

### 4.1 Probar Login

1. Abre `https://certus-drive.netlify.app/login.html`
2. Registra un usuario con email `@certus.edu.pe`
3. Verifica que se cree el perfil en Supabase

### 4.2 Probar Búsqueda

1. Accede a la página principal
2. Verifica que carguen los recursos
3. Prueba la búsqueda y filtros

### 4.3 Probar Panel Admin

1. Promover tu usuario a admin en Supabase:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu@certus.edu.pe';
```

2. Recargar la página
3. Click en **"Panel Admin"**
4. Verifica que puedas crear/editar/eliminar recursos

---

## 🔄 Paso 5: Actualizaciones Futuras

### 5.1 Hacer cambios en local

```bash
# Hacer cambios en los archivos
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### 5.2 Deploy automático

Netlify detectará el push y desplegará automáticamente! 🎉

---

## 🐛 Troubleshooting

### Problema: "La página no carga"
**Solución**: Verifica que los archivos estén en la raíz del repo, no en subcarpetas.

### Problema: "Error de Supabase"
**Solución**: Verifica las variables de entorno en Netlify.

### Problema: "No puedo registrarme"
**Solución**: Verifica que las tablas existan en Supabase.

### Problema: "Redireccionamiento no funciona"
**Solución**: Asegúrate de tener el archivo `_redirects` en la raíz.

---

## 📊 Monitoreo

### Netlify Analytics (Opcional)

En **Analytics** puedes ver:
- 📈 Visitas diarias
- 🌍 Ubicación geográfica
- 🔗 Páginas más visitadas
- ⚡ Rendimiento

### Logs de Netlify

En **Deploys** → Click en el último deploy → **Deploy log**

Aquí verás:
- ✅ Build exitoso
- ❌ Errores de build
- ⏱️ Tiempo de despliegue

---

## 🔐 Seguridad Post-Deploy

### 1. Configurar Supabase Auth

En Supabase → **Authentication** → **URL Configuration**

Agregar:
```
Site URL: https://certus-drive.netlify.app
Redirect URLs: https://certus-drive.netlify.app/**
```

### 2. Habilitar Email Allowlist

En Supabase → **Authentication** → **Providers** → **Email**

Activar:
- [x] Confirm email
- [x] Enable email allowlist
- Agregar: `@certus.edu.pe`

### 3. Backup Regular

En Supabase → **Database** → **Backups**

Activar backups automáticos (disponible en plan Pro)

---

## 🎉 ¡Listo!

Tu aplicación está en producción y lista para usar:

✅ **URL de Login**: https://certus-drive.netlify.app/login.html  
✅ **URL Principal**: https://certus-drive.netlify.app  
✅ **Panel Admin**: https://certus-drive.netlify.app/admin.html

---

**¿Necesitas ayuda?** Contacta al equipo de IT de CERTUS.
