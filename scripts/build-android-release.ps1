# Build a signed Play Store .aab for AJYN (com.ajyn.app)
# Usage: .\scripts\build-android-release.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AndroidDir = Join-Path $Root "android"
$KeystoreProps = Join-Path $AndroidDir "keystore.properties"
$KeystoreFile = Join-Path $AndroidDir "ajyn-release.keystore"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

if (-not (Test-Path $KeystoreProps)) {
    Write-Host ""
    Write-Host "Missing android/keystore.properties — create it first:" -ForegroundColor Yellow
    Write-Host "  1. Copy-Item android/keystore.properties.example android/keystore.properties"
    Write-Host "  2. Create keystore (replace passwords with yours):"
    Write-Host '     keytool -genkeypair -v -keystore android/ajyn-release.keystore -alias ajyn -keyalg RSA -keysize 2048 -validity 10000'
    Write-Host "  3. Edit keystore.properties with your passwords"
    Write-Host ""
    exit 1
}

Set-Location $Root
Write-Host "Syncing web app into Android..." -ForegroundColor Cyan
npm run cap:sync

Set-Location $AndroidDir
Write-Host "Building release bundle..." -ForegroundColor Cyan
.\gradlew.bat bundleRelease

$Bundle = Join-Path $AndroidDir "app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $Bundle) {
    $Size = [math]::Round((Get-Item $Bundle).Length / 1MB, 2)
    Write-Host ""
    Write-Host "Done! Upload this file to Play Console:" -ForegroundColor Green
    Write-Host "  $Bundle ($Size MB)"
} else {
    Write-Error "Build finished but app-release.aab was not found."
}
