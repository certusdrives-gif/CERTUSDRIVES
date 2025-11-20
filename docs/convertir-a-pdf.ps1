# ========================================
# Script para convertir Documentación MD a PDF
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONVERTIR DOCUMENTACIÓN A PDF" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Pandoc está instalado
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if (-not $pandocInstalled) {
    Write-Host "❌ Pandoc no está instalado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar Pandoc:" -ForegroundColor Yellow
    Write-Host "1. Opción 1 (Chocolatey): choco install pandoc" -ForegroundColor White
    Write-Host "2. Opción 2 (Manual): Descargar de https://pandoc.org/installing.html" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Pandoc encontrado: $($pandocInstalled.Version)" -ForegroundColor Green
Write-Host ""

# Crear carpeta para PDFs
$pdfFolder = ".\pdfs"
if (-not (Test-Path $pdfFolder)) {
    New-Item -ItemType Directory -Path $pdfFolder | Out-Null
    Write-Host "📁 Carpeta 'pdfs' creada" -ForegroundColor Green
}

# Archivos a convertir
$archivos = @(
    "DOCUMENTACION_COMPLETA.md",
    "GUIA_USUARIO.md",
    "GUIA_TECNICA_DEPLOYMENT.md",
    "README_DOCUMENTACION.md"
)

Write-Host "🔄 Convirtiendo archivos..." -ForegroundColor Cyan
Write-Host ""

foreach ($archivo in $archivos) {
    $archivoPath = ".\$archivo"
    
    if (Test-Path $archivoPath) {
        $nombrePdf = [System.IO.Path]::GetFileNameWithoutExtension($archivo) + ".pdf"
        $pdfPath = Join-Path $pdfFolder $nombrePdf
        
        Write-Host "  📄 $archivo → $nombrePdf" -ForegroundColor White
        
        # Convertir con Pandoc (opciones para mejor calidad)
        pandoc $archivoPath `
            -o $pdfPath `
            --pdf-engine=xelatex `
            -V geometry:margin=1in `
            -V fontsize=11pt `
            -V documentclass=article `
            -V colorlinks=true `
            -V linkcolor=blue `
            -V urlcolor=blue `
            --toc `
            --toc-depth=3 `
            --highlight-style=tango `
            2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "     ✅ Generado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "     ❌ Error al generar PDF" -ForegroundColor Red
        }
    } else {
        Write-Host "  ⚠️  Archivo no encontrado: $archivo" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CONVERSIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Los PDFs están en: $pdfFolder" -ForegroundColor White
Write-Host ""

# Abrir carpeta de PDFs
Start-Process explorer.exe $pdfFolder
