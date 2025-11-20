# 📄 GUÍA: Convertir Documentación Markdown a PDF

## 🎯 Opciones Disponibles

---

## ✅ MÉTODO 1: Extensión VS Code (RECOMENDADO - MÁS FÁCIL)

### Instalación
1. Abrir VS Code
2. Ir a Extensions (Ctrl+Shift+X)
3. Buscar: **"Markdown PDF"** (autor: yzane)
4. Clic en **Install**

### Uso
1. Abrir cualquier archivo `.md` de la carpeta `docs/`
2. Presionar `Ctrl+Shift+P`
3. Escribir: **"Markdown PDF: Export (pdf)"**
4. Enter
5. El PDF se genera en la misma carpeta

### Repetir para cada archivo:
- ✅ `DOCUMENTACION_COMPLETA.md`
- ✅ `GUIA_USUARIO.md`
- ✅ `GUIA_TECNICA_DEPLOYMENT.md`
- ✅ `README_DOCUMENTACION.md`

---

## ✅ MÉTODO 2: Script PowerShell con Pandoc (PROFESIONAL)

### Requisitos
Instalar **Pandoc** (motor de conversión profesional):

**Opción A - Con Chocolatey:**
```powershell
choco install pandoc
```

**Opción B - Descarga Manual:**
1. Ir a: https://pandoc.org/installing.html
2. Descargar instalador Windows
3. Ejecutar instalador
4. Reiniciar terminal

### Uso
1. Abrir PowerShell en la carpeta `docs/`
2. Ejecutar:
```powershell
cd C:\Users\CHUNGA\Desktop\CERTUS\temp-deploy\docs
.\convertir-a-pdf.ps1
```

3. Los PDFs se generarán automáticamente en carpeta `pdfs/`

### Ventajas de Pandoc
✅ Mejor calidad tipográfica
✅ Tabla de contenidos automática
✅ Syntax highlighting para código
✅ Enlaces clickeables
✅ Conversión en lote (todos a la vez)

---

## ✅ MÉTODO 3: Herramientas Online (SIN INSTALAR)

### Opción A: Dillinger (Recomendado)
1. Ir a: https://dillinger.io/
2. Clic en **"Import from"** → **"Disk"**
3. Seleccionar archivo `.md`
4. Clic en **"Export as"** → **"PDF"**
5. Descargar PDF

### Opción B: Markdown to PDF
1. Ir a: https://www.markdowntopdf.com/
2. Arrastrar archivo `.md` o hacer clic para subirlo
3. Esperar conversión
4. Descargar PDF

### Opción C: CloudConvert
1. Ir a: https://cloudconvert.com/md-to-pdf
2. Subir archivo `.md`
3. Clic en **"Convert"**
4. Descargar resultado

**⚠️ Nota:** Con herramientas online tendrás que convertir cada archivo individualmente.

---

## ✅ MÉTODO 4: Usar Chrome/Edge (Imprimir como PDF)

### Pasos
1. Abrir el archivo `.md` en VS Code
2. Presionar `Ctrl+Shift+V` (Vista previa de Markdown)
3. En la vista previa, presionar `Ctrl+P`
4. Seleccionar **"Microsoft Print to PDF"** como impresora
5. Ajustar configuración:
   - Márgenes: Normales
   - Escala: 100%
   - Páginas: Todas
6. Clic en **"Guardar"**

**⚠️ Limitación:** Este método es básico, sin estilos profesionales.

---

## 🎨 MÉTODO 5: Typora (Mejor presentación visual)

### Instalación
1. Descargar Typora: https://typora.io/
2. Instalar (versión de prueba gratuita)

### Uso
1. Abrir archivo `.md` en Typora
2. Menú: **File** → **Export** → **PDF**
3. Guardar archivo

**Ventajas:**
✅ Interfaz WYSIWYG (lo que ves es lo que obtienes)
✅ Temas profesionales
✅ Exportación de alta calidad

---

## 📊 COMPARACIÓN DE MÉTODOS

| Método | Facilidad | Calidad | Velocidad | Batch |
|--------|-----------|---------|-----------|-------|
| **VS Code Extension** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| **Pandoc Script** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ |
| **Online Tools** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ❌ |
| **Print to PDF** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| **Typora** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |

---

## 🎯 RECOMENDACIÓN POR CASO DE USO

### Para el Cliente (entrega profesional):
→ **Método 2: Pandoc Script** o **Método 5: Typora**

### Para ti (rapidez):
→ **Método 1: VS Code Extension**

### Sin instalar nada:
→ **Método 3: Herramientas Online**

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### "Pandoc no reconocido"
- Reiniciar PowerShell después de instalar
- Verificar PATH del sistema
- Intentar con ruta completa: `C:\Program Files\Pandoc\pandoc.exe`

### PDFs sin formato correcto
- Instalar MiKTeX (motor LaTeX): https://miktex.org/download
- Pandoc lo necesita para PDFs de alta calidad

### Extensión VS Code no funciona
- Actualizar VS Code a última versión
- Desinstalar y reinstalar extensión
- Revisar permisos de escritura en carpeta

---

## 📞 NECESITAS AYUDA?

Si tienes problemas con algún método:
1. Revisa los logs de error
2. Verifica que los archivos `.md` no tengan errores de sintaxis
3. Prueba con otro método alternativo

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0
