# Script pentru curățarea cache-ului TypeScript și reconstruirea proiectului
$projectRoot = "c:\Users\abere\CascadeProjects\budget-app\frontend"

Write-Host "Curățăm cache-ul TypeScript și fișierele generate..."

# Ștergem directoarele de build și cache
if (Test-Path "$projectRoot\node_modules\.cache") {
    Remove-Item -Recurse -Force "$projectRoot\node_modules\.cache"
    Write-Host "Cache-ul node_modules a fost șters."
}

if (Test-Path "$projectRoot\dist") {
    Remove-Item -Recurse -Force "$projectRoot\dist"
    Write-Host "Directorul dist a fost șters."
}

if (Test-Path "$projectRoot\build") {
    Remove-Item -Recurse -Force "$projectRoot\build"
    Write-Host "Directorul build a fost șters."
}

if (Test-Path "$projectRoot\.tsbuildinfo") {
    Remove-Item -Force "$projectRoot\.tsbuildinfo"
    Write-Host "Fișierul .tsbuildinfo a fost șters."
}

Write-Host "Cache-ul TypeScript a fost curățat. Acum poți reconstrui proiectul."
Write-Host "Rulează 'npm run build' sau 'npm start' pentru a reconstrui proiectul."
