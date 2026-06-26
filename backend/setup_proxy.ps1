$ErrorActionPreference = 'Stop'

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configurando Google Cloud SQL Proxy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Obtener la conexión de GCP
Write-Host "1. Buscando tu base de datos en Google Cloud..."
$gcloudOutput = gcloud sql instances list --format="json" | ConvertFrom-Json
if (-not $gcloudOutput -or $gcloudOutput.Count -eq 0) {
    Write-Host "❌ No se encontraron bases de datos. Asegúrate de tener seleccionado el proyecto correcto de GCP:" -ForegroundColor Red
    Write-Host "   Ejecuta: gcloud config set project TU_PROYECTO_ID" -ForegroundColor Yellow
    exit 1
}

$connName = $gcloudOutput[0].connectionName
Write-Host "✅ Instancia encontrada: $connName" -ForegroundColor Green

# 2. Descargar el Proxy
$proxyUrl = "https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.2/cloud-sql-proxy-windows-amd64.exe"
$proxyPath = ".\cloud-sql-proxy.exe"

if (-Not (Test-Path $proxyPath)) {
    Write-Host "2. Descargando Cloud SQL Proxy (versión 2.14.2)..."
    Invoke-WebRequest -Uri $proxyUrl -OutFile $proxyPath
    Write-Host "✅ Proxy descargado." -ForegroundColor Green
} else {
    Write-Host "2. El Proxy ya estaba descargado." -ForegroundColor Green
}

# 3. Actualizar el archivo .env
Write-Host "3. Actualizando configuración de IP en el archivo .env..."
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "^DB_HOST=.*", "DB_HOST=127.0.0.1"
    $envContent | Set-Content ".env"
    Write-Host "✅ Archivo .env actualizado (DB_HOST=127.0.0.1)." -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró el archivo .env" -ForegroundColor Yellow
}

# 4. Ejecutar el proxy
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 Iniciando Cloud SQL Proxy..." -ForegroundColor Cyan
Write-Host "⚠️ DEJA ESTA TERMINAL ABIERTA MIENTRAS TRABAJAS" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
& $proxyPath $connName
