# Script PowerShell pentru rularea testelor Playwright pentru LunarGrid FAZA 7
# Poate fi rulat cu: ./tests/e2e/run-lunargrid-tests.ps1

param(
    [switch]$Headed = $false
)

Write-Host "🚀 Pornesc testele pentru LunarGrid FAZA 7..." -ForegroundColor Green

# Setează variabilele de mediu pentru teste
$env:TEST_EMAIL = "aberemia@gmail.com"
$env:TEST_PASSWORD = "test123"
$env:TEST_BASE_URL = "http://localhost:3006"

# Configurează Playwright pentru headless sau cu UI
if ($Headed) {
    Write-Host "🖥️  Rulare cu browser vizibil" -ForegroundColor Yellow
    $env:PLAYWRIGHT_HEADLESS = "false"
} else {
    Write-Host "👻 Rulare headless (fără UI)" -ForegroundColor Blue
    $env:PLAYWRIGHT_HEADLESS = "true"
}

# Verifică dacă aplicația rulează
Write-Host "🔍 Verifică dacă aplicația rulează pe $env:TEST_BASE_URL..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $env:TEST_BASE_URL -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Aplicația este disponibilă" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Aplicația nu răspunde pe $env:TEST_BASE_URL" -ForegroundColor Red
    Write-Host "💡 Pornește aplicația cu: npm run dev" -ForegroundColor Yellow
    exit 1
}

# Navigează în directorul frontend pentru a rula testele
Set-Location frontend

# Rulează testele specifice pentru LunarGrid
Write-Host "🧪 Rulare teste LunarGrid..." -ForegroundColor Magenta

try {
    & npx playwright test suites/features/lunar-grid-cell-testing.spec.ts --reporter=html
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Toate testele au trecut cu succes!" -ForegroundColor Green
        Write-Host "📊 Raportul complet este disponibil în: frontend/test-results/playwright-report/" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Unele teste au eșuat. Verifică raportul pentru detalii." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Eroare la rularea testelor: $($_.Exception.Message)" -ForegroundColor Red
}

# Revine la directorul original
Set-Location .. 