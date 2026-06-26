$dir = "C:\Users\nains\OneDrive\Desktop\zim\gymflow\backend\mongodb_portable"
if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force
}

$zipPath = "$dir\mongodb.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Clean any older extracted folders
$extractedDir = "$dir\mongodb-win32-x86_64-windows-4.4.29"
if (Test-Path $extractedDir) {
    Remove-Item $extractedDir -Recurse -Force
}
$oldDir = "$dir\mongodb-win32-x86_64-windows-7.0.12"
if (Test-Path $oldDir) {
    Remove-Item $oldDir -Recurse -Force
}

Write-Host "Downloading portable MongoDB 4.4.29 binaries (Non-AVX Compatible)..."
Import-Module BitsTransfer
Start-BitsTransfer -Source "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.29.zip" -Destination $zipPath

Write-Host "Extracting portable archives..."
Expand-Archive -Path $zipPath -DestinationPath $dir -Force

# Locate the executable
$binPath = Get-ChildItem -Path $dir -Filter "mongod.exe" -Recurse | Select-Object -First 1

$dbPath = "$dir\data"
if (!(Test-Path $dbPath)) {
    New-Item -ItemType Directory -Path $dbPath -Force
}

Write-Host "Starting local MongoDB server..."
Start-Process -FilePath $binPath.FullName -ArgumentList "--dbpath=`"$dbPath`"" -WindowStyle Hidden

Write-Host "Database started successfully!"
