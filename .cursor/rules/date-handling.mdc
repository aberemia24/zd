---
description: 
globs: 
alwaysApply: false
---
# Date Handling Rules

## **MANDATORY DATE VERIFICATION**
- **ÎNTOTDEAUNA** verifică data reală din sistem înainte de a actualiza Memory Bank
- **NU FOLOSI** date hardcodate sau estimate în documentația Memory Bank
- **ACTUALIZEAZĂ** toate referințele de date consistent în toate fișierele

## **PowerShell Commands for Date**
```powershell
# Obține data curentă în format românesc
Get-Date -Format "dd/MM/yyyy"

# Conversie manuală la format românesc pentru fișiere:
# dd/MM/yyyy → dd Luna yyyy (ex: 29/05/2025 → 29 Mai 2025)
```

## **Files That Require Date Updates**
- ✅ `memory-bank/activeContext.md` - Current status date
- ✅ `memory-bank/progress.md` - Last update date  
- ✅ `memory-bank/tasks.md` - Task completion dates
- ✅ `memory-bank/archive/archive-[name]_YYYYMMDD.md` - Archive file naming
- ✅ `memory-bank/reflection/reflection-[name].md` - Reflection dates

## **Archive File Naming Convention**
```
Format: archive-[task-name]_YYYYMMDD.md
Example: archive-lunargrid-optimizations_20250529.md

Date Format: YYYYMMDD (pentru sorting cronologic)
Conversion: 29/05/2025 → 20250529
```

## **Workflow Integration**
1. **Before any Memory Bank update**: Run `Get-Date -Format "dd/MM/yyyy"`
2. **Convert to Romanian format**: 29/05/2025 → 29 Mai 2025
3. **Update all relevant files** with consistent dates
4. **Rename archive files** using YYYYMMDD format

## **Common Date Conversion Reference**
- 01 → Ianuarie, 02 → Februarie, 03 → Martie, 04 → Aprilie
- 05 → Mai, 06 → Iunie, 07 → Iulie, 08 → August  
- 09 → Septembrie, 10 → Octombrie, 11 → Noiembrie, 12 → Decembrie

## **Verification Checklist**
- [ ] Verificat data reală din sistem cu PowerShell
- [ ] Actualizat activeContext.md cu data corectă
- [ ] Actualizat progress.md cu data corectă
- [ ] Actualizat tasks.md cu data corectă
- [ ] Redenumit/creat archive file cu format YYYYMMDD
- [ ] Actualizat toate link-urile către archive în fișiere

