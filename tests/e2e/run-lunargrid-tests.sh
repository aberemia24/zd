#!/bin/bash

# Script pentru rularea testelor Playwright pentru LunarGrid FAZA 7
# Poate fi rulat cu: npm run test:lunargrid

echo "🚀 Pornesc testele pentru LunarGrid FAZA 7..."

# Setează variabilele de mediu pentru teste
export TEST_EMAIL="aberemia@gmail.com"
export TEST_PASSWORD="test123"
export TEST_BASE_URL="http://localhost:3006"

# Configurează Playwright pentru headless sau cu UI
if [ "$1" = "--headed" ]; then
    echo "🖥️  Rulare cu browser vizibil"
    export PLAYWRIGHT_HEADLESS=false
else
    echo "👻 Rulare headless (fără UI)"
    export PLAYWRIGHT_HEADLESS=true
fi

# Verifică dacă aplicația rulează
echo "🔍 Verifică dacă aplicația rulează pe $TEST_BASE_URL..."
if curl -f -s "$TEST_BASE_URL" > /dev/null; then
    echo "✅ Aplicația este disponibilă"
else
    echo "❌ Aplicația nu răspunde pe $TEST_BASE_URL"
    echo "💡 Pornește aplicația cu: npm run dev"
    exit 1
fi

# Navigează în directorul frontend pentru a rula testele
cd frontend

# Rulează testele specifice pentru LunarGrid
echo "🧪 Rulare teste LunarGrid..."
npx playwright test suites/features/lunar-grid-cell-testing.spec.ts --reporter=html

# Afișează rezultatele
if [ $? -eq 0 ]; then
    echo "🎉 Toate testele au trecut cu succes!"
    echo "📊 Raportul complet este disponibil în: frontend/test-results/playwright-report/"
else
    echo "❌ Unele teste au eșuat. Verifică raportul pentru detalii."
fi 