---
trigger: always_on
description: Defines canonical paths for core Memory Bank files.
globs: memory-bank-paths.mdc
---
# CORE MEMORY BANK FILE LOCATIONS

**CRITICAL:** All core Memory Bank files reside within the `memory-bank/` directory at the project root. Do NOT create or modify these files outside this directory unless explicitly instructed for archiving purposes.

* **Tasks File:** `memory-bank/tasks.md` - This file is used for active, in-progress task tracking, detailing steps, checklists, and component lists. Its content, particularly the detailed checklists, is merged into the main archive document for the task upon completion. After archival, `tasks.md` is cleared to be ready for the next task. It is an ephemeral working document during a task's lifecycle, with its persistent record captured in the task's archive file.
* **Active Context File:** `memory-bank/activeContext.md`
* **Progress File:** `memory-bank/progress.md`
* **Project Brief File:** `memory-bank/projectbrief.md`
* **Product Context File:** `memory-bank/productContext.md`
* **System Patterns File:** `memory-bank/systemPatterns.md`
* **Tech Context File:** `memory-bank/techContext.md`
* **Style Guide File:** `memory-bank/style-guide.md`
* **Creative Phase Docs:** `memory-bank/creative/creative-[feature_name].md`
* **Reflection Docs:** `memory-bank/reflection/reflection-[task_id].md`
* **Archive Directory:** `memory-bank/archive/archive-[task_id].md`

**Verification Mandate:** Before any `create_file` or `edit_file` operation on these core files, verify the path starts with `memory-bank/`. If attempting to create a new core file (e.g., `tasks.md` at the start of a project), ensure it is created at `memory-bank/tasks.md`.

## DATE CONSISTENCY REQUIREMENTS

**MANDATORY:** Before ANY Memory Bank file updates, verify current system date to ensure accuracy and consistency across all documentation.

### Required Date Verification Commands
```powershell
# Windows PowerShell - Get current system date
Get-Date -Format "dd/MM/yyyy"

# Convert to Romanian format for files
# Example: 29/05/2025 → 29 Mai 2025
```

### Files Requiring Date Synchronization
* **activeContext.md** - Current status dates
* **progress.md** - Progress tracking dates  
* **tasks.md** - Task completion dates
* **archive/archive-[name]_YYYYMMDD.md** - Archive creation dates

### Archive File Naming Convention
```
Format: archive-[task-name]_YYYYMMDD.md
Example: archive-lunargrid-optimizations_20250529.md

Date Conversion: 29/05/2025 → 20250529 (for file naming)
Date Display: 29/05/2025 → 29 Mai 2025 (for content)
```

### Date Consistency Verification Checklist
- [ ] System date verified with `Get-Date -Format "dd/MM/yyyy"`
- [ ] Date converted to Romanian format (dd Luna yyyy)
- [ ] All Memory Bank files updated with consistent dates
- [ ] Archive files named with YYYYMMDD format
- [ ] All cross-references between files updated

**CRITICAL:** Never use hardcoded or estimated dates. Always verify actual system date before Memory Bank updates to maintain temporal accuracy and documentation integrity.
