# Script pentru corectarea importurilor din Transaction.ts (cu T mare) la transaction.ts (cu t mic)
$projectRoot = "c:\Users\abere\CascadeProjects\budget-app\frontend"
$excludeFile = "c:\Users\abere\CascadeProjects\budget-app\frontend\src\utils\transactions.ts"

# Găsește toate fișierele TypeScript și TSX din proiect
$files = Get-ChildItem -Path $projectRoot -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -ne $excludeFile }

$totalFiles = $files.Count
$modifiedFiles = 0

Write-Host "Analizez $totalFiles fișiere..."

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Verifică dacă fișierul conține importuri din Transaction.ts (cu T mare)
    if ($content -match "from ['\`"](\.\./|\./)?types/Transaction['\`"]") {
        # Înlocuiește importurile
        $newContent = $content -replace "from (['\`"])(\.\./|\./)?types/Transaction(['\`"])", "from `$1`$2types/transaction`$3"
        
        # Salvează fișierul modificat
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        
        $modifiedFiles++
        Write-Host "Modificat: $($file.FullName)"
    }
}

Write-Host "Finalizat! Au fost modificate $modifiedFiles fișiere din $totalFiles."
