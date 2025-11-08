# Docker Cleanup для Windows (WSL2)

## Проблема

Docker Desktop на Windows использует WSL2, который создаёт виртуальный диск:
```
C:\Users\<юзер>\AppData\Local\Docker\wsl\disk\docker_data.vhdx
```

Этот файл **постоянно растёт** при каждой сборке Docker образов, но **НЕ сжимается автоматически** после удаления данных.

Результат: диск C:\ забивается на 20-50 GB, даже если в Docker показывает 0 GB используется.

## Быстрое решение: Автоматическое сжатие

### Способ 1: PowerShell скрипт (рекомендуется)

1. Откройте **PowerShell от администратора**
2. Перейдите в папку проекта:
   ```powershell
   cd C:\путь\к\dungeonland-backend
   ```
3. Запустите скрипт:
   ```powershell
   .\scripts\windows-docker-compact.ps1
   ```

Скрипт автоматически:
- Остановит Docker Desktop
- Остановит WSL2
- Сожмёт виртуальный диск
- Запустит Docker обратно

**Результат:** освободится 10-20 GB на диске C:\

### Способ 2: Вручную

Если скрипт не работает, выполните вручную:

```powershell
# 1. Остановите Docker Desktop (закройте через трей)

# 2. Остановите WSL
wsl --shutdown

# 3. Запустите diskpart от администратора
diskpart

# 4. В diskpart выполните (замените <юзер> на своё имя):
select vdisk file="C:\Users\<юзер>\AppData\Local\Docker\wsl\disk\docker_data.vhdx"
compact vdisk
exit

# 5. Запустите Docker Desktop обратно
```

## Долгосрочное решение: Ограничить рост диска

### 1. Настройка .wslconfig

Создайте файл `C:\Users\<юзер>\.wslconfig` со следующим содержимым:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
localhostForwarding=true

[experimental]
sparseVhd=true
```

Или скопируйте готовый:
```powershell
Copy-Item .\scripts\.wslconfig-example C:\Users\$env:USERNAME\.wslconfig
wsl --shutdown
```

**Что это даёт:**
- `sparseVhd=true` - диск будет сжиматься автоматически (экспериментальная функция)
- `memory=8GB` - ограничивает потребление RAM (по умолчанию WSL берёт 50% всей памяти)

### 2. Регулярная очистка Docker

Добавьте задачу в **Task Scheduler** (Планировщик заданий):

**Задача:** Запускать раз в неделю
**Действие:** Запустить программу
**Программа:** `powershell.exe`
**Аргументы:** `-File "C:\путь\к\dungeonland-backend\scripts\windows-docker-compact.ps1"`
**Права:** От имени администратора

## Проверка размера диска

### До сжатия:
```powershell
Get-Item "C:\Users\$env:USERNAME\AppData\Local\Docker\wsl\disk\docker_data.vhdx" | Select-Object Length
```

### Использование Docker:
Внутри WSL выполните:
```bash
docker system df
```

## Альтернатива: Перенос на другой диск

Если у вас есть диск D:\ с большим количеством места:

```powershell
# 1. Остановите Docker Desktop

# 2. Экспортируйте WSL дистрибутив
wsl --shutdown
wsl --export docker-desktop-data D:\docker-desktop-data.tar

# 3. Удалите старый
wsl --unregister docker-desktop-data

# 4. Импортируйте в новое место на D:\
wsl --import docker-desktop-data D:\DockerDesktopWSL D:\docker-desktop-data.tar --version 2

# 5. Удалите tar архив
del D:\docker-desktop-data.tar

# 6. Запустите Docker Desktop
```

Теперь все данные Docker будут на диске D:\ вместо C:\

## Размеры файлов

Примерные размеры:
- **Новый диск**: ~500 MB
- **После разработки**: 5-10 GB
- **Без очистки**: 20-50 GB ❌

После регулярного сжатия: **5-8 GB** ✅

## FAQ

**Q: Потеряю ли я данные при сжатии?**
A: Нет, сжатие безопасно. Данные в контейнерах и volumes сохранятся.

**Q: Как часто нужно сжимать?**
A: Рекомендуется раз в неделю, или когда диск C:\ заполнен.

**Q: Можно ли сжать без остановки Docker?**
A: Нет, WSL и Docker должны быть остановлены.

**Q: sparseVhd не работает**
A: Эта функция экспериментальная, работает не на всех версиях Windows. Используйте ручное сжатие.

## Полезные команды

```powershell
# Проверить версию WSL
wsl --version

# Список всех WSL дистрибутивов
wsl --list --verbose

# Полностью остановить WSL
wsl --shutdown

# Проверить статус Docker
docker ps
docker system df

# Очистка Docker (выполнять внутри WSL/PowerShell)
docker system prune -a --volumes -f
```

## Автоматизация

Для полной автоматизации создайте батник `cleanup.bat`:

```batch
@echo off
echo Останавливаем Docker...
taskkill /F /IM "Docker Desktop.exe" 2>nul

echo Останавливаем WSL...
wsl --shutdown

timeout /t 3

echo Сжимаем диск...
powershell -Command "& {diskpart /s cleanup-diskpart.txt}"

echo Запускаем Docker...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo Готово!
pause
```

И файл `cleanup-diskpart.txt`:
```
select vdisk file="C:\Users\ivanb\AppData\Local\Docker\wsl\disk\docker_data.vhdx"
compact vdisk
exit
```

Запускайте `cleanup.bat` от администратора когда нужна очистка.
