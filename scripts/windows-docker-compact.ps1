# Docker WSL2 Disk Compactor
# Сжимает виртуальный диск Docker WSL2 для освобождения места на диске C:\

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker WSL2 Disk Compactor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка прав администратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Этот скрипт требует прав администратора!" -ForegroundColor Red
    Write-Host "Запустите PowerShell от имени администратора и повторите." -ForegroundColor Yellow
    pause
    exit 1
}

# Путь к файлу виртуального диска
$vhdxPath = "C:\Users\$env:USERNAME\AppData\Local\Docker\wsl\disk\docker_data.vhdx"

Write-Host "Путь к диску: $vhdxPath" -ForegroundColor White
Write-Host ""

# Проверка существования файла
if (-not (Test-Path $vhdxPath)) {
    Write-Host "ERROR: Файл не найден: $vhdxPath" -ForegroundColor Red
    Write-Host "Возможно Docker Desktop установлен в другом месте." -ForegroundColor Yellow
    pause
    exit 1
}

# Размер ДО сжатия
$sizeBefore = (Get-Item $vhdxPath).Length / 1GB
Write-Host "Размер диска ДО сжатия: $([math]::Round($sizeBefore, 2)) GB" -ForegroundColor Yellow
Write-Host ""

# Шаг 1: Остановка Docker Desktop
Write-Host "[1/4] Остановка Docker Desktop..." -ForegroundColor Cyan
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Шаг 2: Остановка WSL
Write-Host "[2/4] Остановка WSL..." -ForegroundColor Cyan
wsl --shutdown
Start-Sleep -Seconds 2

# Шаг 3: Сжатие диска через diskpart
Write-Host "[3/4] Сжатие виртуального диска (это может занять 1-2 минуты)..." -ForegroundColor Cyan

$diskpartScript = @"
select vdisk file="$vhdxPath"
compact vdisk
exit
"@

$diskpartScript | diskpart | Out-Null

# Проверка успешности
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Диск успешно сжат!" -ForegroundColor Green
} else {
    Write-Host "✗ Ошибка при сжатии диска" -ForegroundColor Red
}

# Размер ПОСЛЕ сжатия
$sizeAfter = (Get-Item $vhdxPath).Length / 1GB
$saved = $sizeBefore - $sizeAfter

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Размер диска ПОСЛЕ сжатия: $([math]::Round($sizeAfter, 2)) GB" -ForegroundColor Green
Write-Host "Освобождено места: $([math]::Round($saved, 2)) GB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Шаг 4: Запуск Docker Desktop обратно
Write-Host "[4/4] Запуск Docker Desktop..." -ForegroundColor Cyan
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Готово! Теперь можете запускать контейнеры." -ForegroundColor Green
Write-Host ""
pause
