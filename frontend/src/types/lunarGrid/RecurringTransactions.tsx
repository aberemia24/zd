import { TransactionType } from "@budget-app/shared-constants";

/**
 * RecurringTransactions.ts - Type Definitions pentru LunarGrid Phase 3
 * Recurring Transaction Architecture cu Template-Based Generation
 *
 * Creative Decision: Template-Based Generation (Option 1)
 * ✅ Clear separation între templates și generated instances
 * ✅ Simple conflict resolution logic
 * ✅ Easy bulk operations pe templates
 * ✅ Clear audit trail pentru changes
 */

// =============================================================================
// RECURRING FREQUENCY TYPES
// =============================================================================

export type RecurringFrequencyType = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurringFrequency {
  /** Tipul frecvenței (daily, weekly, monthly, yearly) */
  type: RecurringFrequencyType;

  /** Intervalul - la fiecare N zile/săptămâni/luni/ani (default: 1) */
  interval: number;

  /** Pentru weekly - ziua săptămânii (0 = Duminică, 6 = Sâmbătă) */
  dayOfWeek?: number;

  /** Pentru monthly - ziua lunii (1-31, dacă > zile în lună = ultima zi) */
  dayOfMonth?: number;

  /** Pentru yearly - luna anului (1-12) */
  monthOfYear?: number;
}

// =============================================================================
// RECURRING TEMPLATE INTERFACE
// =============================================================================

export interface RecurringTemplate {
  /** Unique identifier pentru template */
  id: string;

  /** User ID proprietar */
  userId: string;

  /** Nume descriptiv pentru template (ex: "Salariu lunar", "Chirie") */
  name: string;

  /** Suma tranzacției */
  amount: number;

  /** Tipul tranzacției */
  type: TransactionType;

  /** Category ID */
  categoryId: string;

  /** Subcategory ID (optional) */
  subcategoryId?: string;

  /** Descriere opțională pentru tranzacții generate */
  description?: string;

  /** Configurația frecvenței */
  frequency: RecurringFrequency;

  /** Data început generare (ISO string) */
  startDate: string;

  /** Data sfârșit generare (optional, null = indefinit) */
  endDate?: string;

  /** Template activ sau temporar disabled */
  isActive: boolean;

  /** Ultima dată când s-au generat tranzacții (pentru tracking) */
  lastGenerated?: string;

  /** Data creării template-ului */
  createdAt: string;

  /** Data ultimei modificări */
  updatedAt: string;
}

// =============================================================================
// GENERATED TRANSACTION INTERFACE
// =============================================================================

export interface GeneratedTransaction {
  /** Unique ID pentru generated transaction */
  id: string;

  /** User ID proprietar */
  userId: string;

  /** Suma tranzacției (din template) */
  amount: number;

  /** Tipul tranzacției (din template) */
  type: TransactionType;

  /** Category ID (din template) */
  categoryId: string;

  /** Subcategory ID (din template) */
  subcategoryId?: string;

  /** Descriere (din template) */
  description?: string;

  /** Data tranzacției (generated based on frequency) */
  date: string;

  /** Flag că este generated din recurring template */
  isRecurring: true;

  /** Reference către template-ul sursă */
  recurringTemplateId: string;

  /** Flag că este overridden de o tranzacție manuală */
  isOverridden?: boolean;

  /** ID-ul tranzacției manuale care override-uiește */
  overrideTransactionId?: string;
}

// =============================================================================
// CONFLICT RESOLUTION TYPES
// =============================================================================

export interface ConflictInfo {
  /** Data conflictului */
  date: string;

  /** Category ID conflicted */
  categoryId: string;

  /** Subcategory ID conflicted */
  subcategoryId?: string;

  /** Tranzacția recurentă care ar fi trebuit generată */
  recurringTransaction: GeneratedTransaction;

  /** Tranzacția manuală care override-uiește */
  manualTransaction: {
    id: string;
    amount: number;
    type: TransactionType;
    description?: string;
  };

  /** Diferența de sumă între manual și recurring */
  amountDifference: number;
}

export interface ConflictSummary {
  /** Lista conflictelor detectate */
  conflicts: ConflictInfo[];

  /** Numărul total de conflicte */
  totalConflicts: number;

  /** Sugestii pentru rezolvare */
  resolutionSuggestions: string[];
}

// =============================================================================
// GENERATION CONFIGURATION
// =============================================================================

export interface GenerationConfig {
  /** Data început pentru generare */
  startDate: string;

  /** Data sfârșit pentru generare */
  endDate: string;

  /** Template-urile active pentru generare */
  activeTemplates: RecurringTemplate[];

  /** Tranzacțiile manuale existente pentru conflict detection */
  existingTransactions?: Array<{
    id: string;
    date: string;
    categoryId: string;
    subcategoryId?: string;
    amount: number;
    type: TransactionType;
    isRecurring: boolean;
  }>;

  /** Flag pentru skip weekends (pentru business transactions) */
  skipWeekends?: boolean;

  /** Holiday dates care trebuie evitate */
  holidayDates?: string[];
}

// =============================================================================
// GENERATION RESULT TYPES
// =============================================================================

export interface GenerationResult {
  /** Tranzacțiile generate cu succes */
  generatedTransactions: GeneratedTransaction[];

  /** Conflictele detectate */
  conflicts: ConflictInfo[];

  /** Statistici despre generare */
  statistics: {
    /** Numărul de template-uri procesate */
    templatesProcessed: number;

    /** Numărul de tranzacții generate */
    transactionsGenerated: number;

    /** Numărul de conflicte detectate */
    conflictsDetected: number;

    /** Perioada acoperită */
    periodCovered: {
      startDate: string;
      endDate: string;
      daysSpanned: number;
    };

    /** Timpul de generare (ms) */
    generationTimeMs: number;
  };

  /** Erori întâlnite în timpul generării */
  errors: string[];

  /** Warnings și sugestii */
  warnings: string[];
}

// =============================================================================
// BULK OPERATIONS TYPES
// =============================================================================

export interface BulkUpdateOperation {
  /** Template IDs de modificat */
  templateIds: string[];

  /** Actualizările de aplicat */
  updates: Partial<
    Pick<RecurringTemplate, "amount" | "description" | "isActive" | "endDate">
  >;

  /** Flag pentru regenerare automată după update */
  regenerateAfterUpdate?: boolean;
}

export interface BulkDeleteOperation {
  /** Template IDs de șters */
  templateIds: string[];

  /** Flag pentru confirmare (prevent accidental deletion) */
  confirmed: boolean;
}

// =============================================================================
// TEMPLATE VALIDATION TYPES
// =============================================================================

export interface TemplateValidationResult {
  /** Template-ul este valid */
  isValid: boolean;

  /** Erori de validare */
  errors: string[];

  /** Warnings și sugestii */
  warnings: string[];

  /** Estimated impact (numărul de tranzacții ce vor fi generate) */
  estimatedImpact: {
    transactionsPerMonth: number;
    totalTransactionsNextYear: number;
  };
}

// =============================================================================// EXPORT ALL TYPES// =============================================================================// All types are already exported via the individual export statements above
