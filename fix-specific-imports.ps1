# Script pentru corectarea importurilor în fișiere specifice
$problematicFiles = @(
    "c:\Users\abere\CascadeProjects\budget-app\frontend\src\services\transactionApiClient.test.ts",
    "c:\Users\abere\CascadeProjects\budget-app\frontend\src\test\helpers.ts",
    "c:\Users\abere\CascadeProjects\budget-app\frontend\src\test\mockData.ts"
)

foreach ($file in $problematicFiles) {
    Write-Host "Procesez fișierul: $file"
    
    # Citim conținutul fișierului
    $content = Get-Content -Path $file -Raw
    
    # Înlocuim importurile
    $newContent = $content -replace "from ['\`"](\.\./|\./)?types/Transaction['\`"]", "from `$1types/transaction`$2"
    $newContent = $newContent -replace "import (.*) from (['\`"])(\.\./|\./)?types/Transaction(['\`"])", "import `$1 from `$2`$3types/transaction`$4"
    
    # Salvăm fișierul
    Set-Content -Path $file -Value $newContent -NoNewline
    
    Write-Host "Fișier actualizat: $file"
}

Write-Host "Finalizat! Toate fișierele specificate au fost actualizate."
