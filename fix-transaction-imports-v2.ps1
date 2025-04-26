# Script îmbunătățit pentru corectarea importurilor din Transaction.ts (cu T mare) la transaction.ts (cu t mic)
$projectRoot = "c:\Users\abere\CascadeProjects\budget-app\frontend\src"
$excludeFile = "c:\Users\abere\CascadeProjects\budget-app\frontend\src\utils\transactions.ts"

# Găsește toate fișierele TypeScript și TSX din proiect
$files = Get-ChildItem -Path $projectRoot -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -ne $excludeFile }

$totalFiles = $files.Count
$modifiedFiles = 0

Write-Host "Analizez $totalFiles fișiere..."

foreach ($file in $files) {
    $filePath = $file.FullName
    $content = Get-Content -Path $filePath -Raw
    $modified = $false
    
    # Verifică și înlocuiește importurile cu calea completă
    if ($content -match "from ['\`"](\.\./|\./)?types/Transaction['\`"]") {
        $newContent = $content -replace "from (['\`"])(\.\./|\./)?types/Transaction(['\`"])", "from `$1`$2types/transaction`$3"
        $content = $newContent
        $modified = $true
    }
    
    # Verifică și înlocuiește importurile de tip
    if ($content -match "import.*from ['\`"](\.\./|\./)?types/Transaction['\`"]") {
        $newContent = $content -replace "import (.*) from (['\`"])(\.\./|\./)?types/Transaction(['\`"])", "import `$1 from `$2`$3types/transaction`$4"
        $content = $newContent
        $modified = $true
    }
    
    # Verifică și înlocuiește importurile de tip cu destructurare
    if ($content -match "import \{.*\} from ['\`"](\.\./|\./)?types/Transaction['\`"]") {
        $newContent = $content -replace "import (\{.*\}) from (['\`"])(\.\./|\./)?types/Transaction(['\`"])", "import `$1 from `$2`$3types/transaction`$4"
        $content = $newContent
        $modified = $true
    }
    
    # Salvează fișierul dacă a fost modificat
    if ($modified) {
        Set-Content -Path $filePath -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Modificat: $filePath"
    }
}

Write-Host "Finalizat! Au fost modificate $modifiedFiles fișiere din $totalFiles."
