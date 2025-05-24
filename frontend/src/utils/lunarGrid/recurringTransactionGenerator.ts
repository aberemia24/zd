import { 
  RecurringTemplate,
  RecurringFrequency,
  GeneratedTransaction,
  GenerationConfig,
  GenerationResult,
  ConflictInfo,
  ConflictSummary,
  TemplateValidationResult
} from '../../types/lunarGrid/RecurringTransactions';
import { TransactionType } from '@shared-constants';

/**
 * recurringTransactionGenerator.ts - Core Algorithms pentru LunarGrid Phase 3
 * Template-Based Generation cu Intelligent Conflict Resolution
 * 
 * Features:
 * ✅ Template-based generation cu flexible frequency support
 * ✅ Smart date calculation cu edge case handling
 * ✅ Conflict detection și resolution logic
 * ✅ Performance optimized pentru large datasets
 * ✅ Comprehensive validation și error handling
 */

// =============================================================================
// DATE CALCULATION UTILITIES
// =============================================================================

/**
 * Calculează următoarea occurrences pentru o frecvență dată
 * Handles edge cases: month-end dates, weekends, leap years
 */
export function calculateNextOccurrence(
  currentDate: Date,
  frequency: RecurringFrequency
): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency.type) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + frequency.interval);
      break;
      
    case 'weekly':
      // Pentru weekly, avansează la ziua specificată din săptămâna următoare
      if (frequency.dayOfWeek !== undefined) {
        const daysUntilTarget = (frequency.dayOfWeek - nextDate.getDay() + 7) % 7;
        const daysToAdd = daysUntilTarget === 0 ? 7 * frequency.interval : daysUntilTarget;
        nextDate.setDate(nextDate.getDate() + daysToAdd);
      } else {
        nextDate.setDate(nextDate.getDate() + (7 * frequency.interval));
      }
      break;
      
    case 'monthly':
      // Pentru monthly, navighează la luna următoare și ajustează ziua
      nextDate.setMonth(nextDate.getMonth() + frequency.interval);
      
      if (frequency.dayOfMonth !== undefined) {
        // Ajustează pentru luna care poate avea mai puține zile
        const targetDay = Math.min(
          frequency.dayOfMonth,
          getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())
        );
        nextDate.setDate(targetDay);
      }
      break;
      
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + frequency.interval);
      
      // Pentru yearly, respectă luna și ziua specificate
      if (frequency.monthOfYear !== undefined) {
        nextDate.setMonth(frequency.monthOfYear - 1); // Months sunt 0-indexed
      }
      
      if (frequency.dayOfMonth !== undefined) {
        const targetDay = Math.min(
          frequency.dayOfMonth,
          getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())
        );
        nextDate.setDate(targetDay);
      }
      break;
      
    default:
      throw new Error(`Unsupported frequency type: ${frequency.type}`);
  }
  
  return nextDate;
}

/**
 * Helper function pentru getting days în a specific month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Verifică dacă o dată este weekend (Saturday sau Sunday)
 */
function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Ajustează o dată pentru a evita weekends (move to next Monday)
 */
function adjustForWeekend(date: Date): Date {
  const adjusted = new Date(date);
  
  if (isWeekend(adjusted)) {
    const daysToAdd = adjusted.getDay() === 0 ? 1 : 2; // Sunday -> Monday, Saturday -> Monday
    adjusted.setDate(adjusted.getDate() + daysToAdd);
  }
  
  return adjusted;
}

// =============================================================================
// CORE GENERATION ALGORITHMS
// =============================================================================

/**
 * Generează tranzacții recurente pentru un template în perioada specificată
 */
export function generateRecurringTransactions(
  template: RecurringTemplate,
  startDate: string,
  endDate: string,
  config?: {
    skipWeekends?: boolean;
    holidayDates?: string[];
  }
): GeneratedTransaction[] {
  const generated: GeneratedTransaction[] = [];
  
  // Parse dates și validare
  const templateStart = new Date(template.startDate);
  const periodStart = new Date(startDate);
  const periodEnd = new Date(endDate);
  const templateEnd = template.endDate ? new Date(template.endDate) : new Date('2099-12-31');
  
  // Determinăm data de început efectivă
  const effectiveStart = new Date(Math.max(templateStart.getTime(), periodStart.getTime()));
  const effectiveEnd = new Date(Math.min(templateEnd.getTime(), periodEnd.getTime()));
  
  // Dacă perioada nu e validă, returnăm array gol
  if (effectiveStart > effectiveEnd) {
    return generated;
  }
  
  // Generăm tranzacțiile iterate prin perioada specificată
  let currentDate = new Date(effectiveStart);
  
  while (currentDate <= effectiveEnd) {
    let finalDate = new Date(currentDate);
    
    // Ajustări pentru weekend dacă este necesar
    if (config?.skipWeekends && isWeekend(finalDate)) {
      finalDate = adjustForWeekend(finalDate);
      
      // Dacă data ajustată iese din perioada, o skipped
      if (finalDate > effectiveEnd) {
        currentDate = calculateNextOccurrence(currentDate, template.frequency);
        continue;
      }
    }
    
    // Skip holiday dates
    const dateString = finalDate.toISOString().split('T')[0];
    if (config?.holidayDates?.includes(dateString)) {
      currentDate = calculateNextOccurrence(currentDate, template.frequency);
      continue;
    }
    
    // Creăm tranzacția generată
    const generatedTransaction: GeneratedTransaction = {
      id: `recurring-${template.id}-${dateString}`,
      userId: template.userId,
      amount: template.amount,
      type: template.type,
      categoryId: template.categoryId,
      subcategoryId: template.subcategoryId,
      description: template.description,
      date: dateString,
      isRecurring: true,
      recurringTemplateId: template.id
    };
    
    generated.push(generatedTransaction);
    
    // Calculăm următoarea occurrence
    currentDate = calculateNextOccurrence(currentDate, template.frequency);
  }
  
  return generated;
}

/**
 * Generează tranzacții pentru multiple templates
 */
export function generateAllRecurringTransactions(
  config: GenerationConfig
): GenerationResult {
  const startTime = performance.now();
  const result: GenerationResult = {
    generatedTransactions: [],
    conflicts: [],
    statistics: {
      templatesProcessed: 0,
      transactionsGenerated: 0,
      conflictsDetected: 0,
      periodCovered: {
        startDate: config.startDate,
        endDate: config.endDate,
        daysSpanned: Math.ceil(
          (new Date(config.endDate).getTime() - new Date(config.startDate).getTime()) / 
          (1000 * 60 * 60 * 24)
        )
      },
      generationTimeMs: 0
    },
    errors: [],
    warnings: []
  };
  
  try {
    // Generăm tranzacții pentru fiecare template activ
    for (const template of config.activeTemplates) {
      if (!template.isActive) {
        continue;
      }
      
      try {
        const templateTransactions = generateRecurringTransactions(
          template,
          config.startDate,
          config.endDate,
          {
            skipWeekends: config.skipWeekends,
            holidayDates: config.holidayDates
          }
        );
        
        result.generatedTransactions.push(...templateTransactions);
        result.statistics.templatesProcessed++;
        result.statistics.transactionsGenerated += templateTransactions.length;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Template ${template.name}: ${errorMessage}`);
      }
    }
    
    // Detectăm conflicte cu tranzacțiile existente
    if (config.existingTransactions) {
      const conflicts = detectConflicts(
        result.generatedTransactions,
        config.existingTransactions
      );
      
      result.conflicts = conflicts.conflicts;
      result.statistics.conflictsDetected = conflicts.totalConflicts;
    }
    
    // Calculăm timpul total
    result.statistics.generationTimeMs = performance.now() - startTime;
    
    // Adăugăm warnings pentru performance
    if (result.statistics.generationTimeMs > 500) {
      result.warnings.push(
        `Generation took ${Math.round(result.statistics.generationTimeMs)}ms - consider optimizing for better performance`
      );
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Generation failed: ${errorMessage}`);
  }
  
  return result;
}

// =============================================================================
// CONFLICT DETECTION & RESOLUTION
// =============================================================================

/**
 * Detectează conflicte între tranzacții recurente și manuale
 */
export function detectConflicts(
  recurringTransactions: GeneratedTransaction[],
  existingTransactions: Array<{
    id: string;
    date: string;
    categoryId: string;
    subcategoryId?: string;
    amount: number;
    type: TransactionType;
    isRecurring: boolean;
  }>
): ConflictSummary {
  const conflicts: ConflictInfo[] = [];
  
  // Creăm un map pentru tranzacțiile manuale (non-recurring)
  const manualTransactionsMap = new Map<string, typeof existingTransactions[0]>();
  
  existingTransactions
    .filter(tx => !tx.isRecurring)
    .forEach(tx => {
      const key = `${tx.date}-${tx.categoryId}-${tx.subcategoryId || 'none'}`;
      manualTransactionsMap.set(key, tx);
    });
  
  // Verificăm fiecare tranzacție recurentă pentru conflicte
  for (const recurringTx of recurringTransactions) {
    const key = `${recurringTx.date}-${recurringTx.categoryId}-${recurringTx.subcategoryId || 'none'}`;
    const manualTx = manualTransactionsMap.get(key);
    
    if (manualTx) {
      // Am găsit un conflict
      const conflict: ConflictInfo = {
        date: recurringTx.date,
        categoryId: recurringTx.categoryId,
        subcategoryId: recurringTx.subcategoryId,
        recurringTransaction: recurringTx,
        manualTransaction: {
          id: manualTx.id,
          amount: manualTx.amount,
          type: manualTx.type,
          description: 'Manual transaction'
        },
        amountDifference: manualTx.amount - recurringTx.amount
      };
      
      conflicts.push(conflict);
      
      // Marcăm tranzacția recurentă ca fiind overridden
      recurringTx.isOverridden = true;
      recurringTx.overrideTransactionId = manualTx.id;
    }
  }
  
  // Generăm sugestii pentru rezolvare
  const resolutionSuggestions: string[] = [];
  
  if (conflicts.length > 0) {
    resolutionSuggestions.push(
      `${conflicts.length} conflicts detected between recurring and manual transactions`
    );
    
    if (conflicts.length > 5) {
      resolutionSuggestions.push(
        'Consider using bulk operations to resolve multiple conflicts at once'
      );
    }
    
    const significantDifferences = conflicts.filter(c => Math.abs(c.amountDifference) > 100);
    if (significantDifferences.length > 0) {
      resolutionSuggestions.push(
        `${significantDifferences.length} conflicts have significant amount differences (>100 RON)`
      );
    }
  }
  
  return {
    conflicts,
    totalConflicts: conflicts.length,
    resolutionSuggestions
  };
}

/**
 * Filtrează tranzacțiile recurente pentru a elimina cele conflicted
 */
export function resolveConflicts(
  recurringTransactions: GeneratedTransaction[],
  existingTransactions: Array<{
    id: string;
    date: string;
    categoryId: string;
    subcategoryId?: string;
    amount: number;
    type: TransactionType;
    isRecurring: boolean;
  }>
): GeneratedTransaction[] {
  const conflicts = detectConflicts(recurringTransactions, existingTransactions);
  
  // Returnăm doar tranzacțiile recurente care nu sunt overridden
  return recurringTransactions.filter(tx => !tx.isOverridden);
}

// =============================================================================
// TEMPLATE VALIDATION
// =============================================================================

/**
 * Validează un recurring template
 */
export function validateRecurringTemplate(
  template: Partial<RecurringTemplate>
): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validări obligatorii
  if (!template.name || template.name.trim().length === 0) {
    errors.push('Numele template-ului este obligatoriu');
  }
  
  if (!template.amount || template.amount <= 0) {
    errors.push('Suma trebuie să fie pozitivă');
  }
  
  if (!template.type) {
    errors.push('Tipul tranzacției este obligatoriu');
  }
  
  if (!template.categoryId) {
    errors.push('Categoria este obligatorie');
  }
  
  if (!template.startDate) {
    errors.push('Data de început este obligatorie');
  } else {
    const startDate = new Date(template.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push('Data de început nu este validă');
    }
  }
  
  if (!template.frequency) {
    errors.push('Frecvența este obligatorie');
  } else {
    // Validăm frecvența
    if (!template.frequency.type) {
      errors.push('Tipul frecvenței este obligatoriu');
    }
    
    if (!template.frequency.interval || template.frequency.interval < 1) {
      errors.push('Intervalul frecvenței trebuie să fie pozitiv');
    }
    
    // Validări specifice pentru tipul de frecvență
    if (template.frequency.type === 'weekly' && template.frequency.dayOfWeek !== undefined) {
      if (template.frequency.dayOfWeek < 0 || template.frequency.dayOfWeek > 6) {
        errors.push('Ziua săptămânii trebuie să fie între 0 (Duminică) și 6 (Sâmbătă)');
      }
    }
    
    if (template.frequency.type === 'monthly' && template.frequency.dayOfMonth !== undefined) {
      if (template.frequency.dayOfMonth < 1 || template.frequency.dayOfMonth > 31) {
        errors.push('Ziua lunii trebuie să fie între 1 și 31');
      }
    }
    
    if (template.frequency.type === 'yearly' && template.frequency.monthOfYear !== undefined) {
      if (template.frequency.monthOfYear < 1 || template.frequency.monthOfYear > 12) {
        errors.push('Luna anului trebuie să fie între 1 și 12');
      }
    }
  }
  
  // Validări pentru end date
  if (template.endDate) {
    const endDate = new Date(template.endDate);
    if (isNaN(endDate.getTime())) {
      errors.push('Data de sfârșit nu este validă');
    } else if (template.startDate && endDate <= new Date(template.startDate)) {
      errors.push('Data de sfârșit trebuie să fie după data de început');
    }
  }
  
  // Warnings
  if (template.name && template.name.length > 50) {
    warnings.push('Numele template-ului este foarte lung (>50 caractere)');
  }
  
  if (template.amount && template.amount > 100000) {
    warnings.push('Suma este foarte mare (>100,000 RON) - verificați dacă este corectă');
  }
  
  if (template.frequency?.interval && template.frequency.interval > 12) {
    warnings.push('Interval foarte mare poate genera puține tranzacții');
  }
  
  // Calculăm impact estimat
  let estimatedImpact = {
    transactionsPerMonth: 0,
    totalTransactionsNextYear: 0
  };
  
  if (template.frequency && errors.length === 0) {
    try {
      // Calculăm câte tranzacții vor fi generate pe lună
      const now = new Date();
      const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      const mockTemplate = {
        ...template,
        id: 'test',
        userId: 'test',
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      } as RecurringTemplate;
      
      const monthlyTransactions = generateRecurringTransactions(
        mockTemplate,
        now.toISOString().split('T')[0],
        oneMonthLater.toISOString().split('T')[0]
      );
      
      estimatedImpact.transactionsPerMonth = monthlyTransactions.length;
      estimatedImpact.totalTransactionsNextYear = monthlyTransactions.length * 12;
      
    } catch (error) {
      warnings.push('Nu s-a putut calcula impactul estimat');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    estimatedImpact
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Helper pentru creating a date range array
 */
export function createDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  while (start <= end) {
    dates.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }
  
  return dates;
}

/**
 * Helper pentru formatting frequency pentru display
 */
export function formatFrequencyDisplay(frequency: RecurringFrequency): string {
  switch (frequency.type) {
    case 'daily':
      return frequency.interval === 1 ? 'Zilnic' : `La fiecare ${frequency.interval} zile`;
      
    case 'weekly':
      const dayNames = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
      const dayName = frequency.dayOfWeek !== undefined ? dayNames[frequency.dayOfWeek] : '';
      return frequency.interval === 1 
        ? `Săptămânal${dayName ? ` (${dayName})` : ''}`
        : `La fiecare ${frequency.interval} săptămâni${dayName ? ` (${dayName})` : ''}`;
        
        case 'monthly':      const monthlyDayText = frequency.dayOfMonth ? ` în ziua ${frequency.dayOfMonth}` : '';      return frequency.interval === 1         ? `Lunar${monthlyDayText}`        : `La fiecare ${frequency.interval} luni${monthlyDayText}`;            case 'yearly':      const monthNames = [        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'      ];      const monthText = frequency.monthOfYear ? ` în ${monthNames[frequency.monthOfYear - 1]}` : '';      const yearlyDayText = frequency.dayOfMonth ? ` ziua ${frequency.dayOfMonth}` : '';      return frequency.interval === 1         ? `Anual${monthText}${yearlyDayText}`        : `La fiecare ${frequency.interval} ani${monthText}${yearlyDayText}`;
        
    default:
      return 'Frecvență necunoscută';
  }
} 