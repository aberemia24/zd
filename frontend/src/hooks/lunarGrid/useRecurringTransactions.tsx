import { useState, useCallback, useMemo, useEffect } from "react";
import {
  RecurringTemplate,
  GeneratedTransaction,
  GenerationConfig,
  GenerationResult,
  ConflictSummary,
  TemplateValidationResult,
  BulkUpdateOperation,
  BulkDeleteOperation,
} from "../../types/lunarGrid/RecurringTransactions";
import {
  generateAllRecurringTransactions,
  validateRecurringTemplate,
  detectConflicts,
  resolveConflicts,
} from "../../utils/lunarGrid/recurringTransactionGenerator";
import { TransactionType } from "@budget-app/shared-constants";

/**
 * useRecurringTransactions.tsx - Hook pentru LunarGrid Phase 3
 * Recurring Transaction Management cu Template-Based Generation
 *
 * Features:
 * ✅ Template CRUD operations cu validation
 * ✅ Automated generation cu conflict detection
 * ✅ Performance optimized cu memoization
 * ✅ Real-time synchronization cu manual transactions
 * ✅ Bulk operations pentru template management
 * ✅ Error handling și user feedback
 */

// =============================================================================
// MAIN HOOK INTERFACE
// =============================================================================

export interface UseRecurringTransactionsResult {
  // Template management
  templates: RecurringTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<RecurringTemplate[]>>;

  // Generated transactions
  generatedTransactions: GeneratedTransaction[];
  conflicts: ConflictSummary;

  // Template operations
  createTemplate: (
    templateData: Partial<RecurringTemplate>,
  ) => Promise<RecurringTemplate>;
  updateTemplate: (
    id: string,
    updates: Partial<RecurringTemplate>,
  ) => Promise<RecurringTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  validateTemplate: (
    template: Partial<RecurringTemplate>,
  ) => TemplateValidationResult;

  // Generation operations
  generateForPeriod: (startDate: string, endDate: string) => GenerationResult;
  regenerateAll: () => GenerationResult;
  resolveAllConflicts: () => GeneratedTransaction[];

  // Bulk operations
  bulkUpdateTemplates: (
    operation: BulkUpdateOperation,
  ) => Promise<RecurringTemplate[]>;
  bulkDeleteTemplates: (operation: BulkDeleteOperation) => Promise<void>;

  // State management
  isGenerating: boolean;
  lastGenerationResult: GenerationResult | null;
  generationStats: {
    totalTemplates: number;
    activeTemplates: number;
    totalGenerated: number;
    totalConflicts: number;
    lastGenerationTime: number;
  };

  // Error handling
  errors: string[];
  warnings: string[];
  clearErrors: () => void;
}

// =============================================================================
// CONFIGURATION INTERFACE
// =============================================================================

export interface UseRecurringTransactionsConfig {
  /** Current period pentru generation (start date) */
  currentStartDate: string;

  /** Current period pentru generation (end date) */
  currentEndDate: string;

  /** Existing manual transactions pentru conflict detection */
  existingTransactions?: Array<{
    id: string;
    date: string;
    categoryId: string;
    subcategoryId?: string;
    amount: number;
    type: TransactionType;
    isRecurring: boolean;
  }>;

  /** Skip weekends pentru business transactions */
  skipWeekends?: boolean;

  /** Holiday dates to skip */
  holidayDates?: string[];

  /** Auto-regenerate când se schimbă templates */
  autoRegenerate?: boolean;

  /** Mock mode pentru testing (no API calls) */
  mockMode?: boolean;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

export function useRecurringTransactions(
  config: UseRecurringTransactionsConfig,
): UseRecurringTransactionsResult {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  const [templates, setTemplates] = useState<RecurringTemplate[]>([]);
  const [generatedTransactions, setGeneratedTransactions] = useState<
    GeneratedTransaction[]
  >([]);
  const [conflicts, setConflicts] = useState<ConflictSummary>({
    conflicts: [],
    totalConflicts: 0,
    resolutionSuggestions: [],
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGenerationResult, setLastGenerationResult] =
    useState<GenerationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // =============================================================================
  // MEMOIZED VALUES
  // =============================================================================

  const activeTemplates = useMemo(
    () => templates.filter((template) => template.isActive),
    [templates],
  );

  const generationConfig = useMemo(
    (): GenerationConfig => ({
      startDate: config.currentStartDate,
      endDate: config.currentEndDate,
      activeTemplates,
      existingTransactions: config.existingTransactions,
      skipWeekends: config.skipWeekends,
      holidayDates: config.holidayDates,
    }),
    [
      config.currentStartDate,
      config.currentEndDate,
      activeTemplates,
      config.existingTransactions,
      config.skipWeekends,
      config.holidayDates,
    ],
  );

  const generationStats = useMemo(
    () => ({
      totalTemplates: templates.length,
      activeTemplates: activeTemplates.length,
      totalGenerated: generatedTransactions.length,
      totalConflicts: conflicts.totalConflicts,
      lastGenerationTime:
        lastGenerationResult?.statistics.generationTimeMs || 0,
    }),
    [
      templates.length,
      activeTemplates.length,
      generatedTransactions.length,
      conflicts.totalConflicts,
      lastGenerationResult,
    ],
  );

  // =============================================================================
  // TEMPLATE CRUD OPERATIONS
  // =============================================================================

  const createTemplate = useCallback(
    async (
      templateData: Partial<RecurringTemplate>,
    ): Promise<RecurringTemplate> => {
      try {
        // Validate template înainte de creation
        const validation = validateRecurringTemplate(templateData);
        if (!validation.isValid) {
          const errorMessage = `Template validation failed: ${validation.errors.join(", ")}`;
          setErrors((prev) => [...prev, errorMessage]);
          throw new Error(errorMessage);
        }

        // Create new template cu generated ID și timestamps
        const newTemplate: RecurringTemplate = {
          id: config.mockMode ? `mock-${Date.now()}` : `template-${Date.now()}`,
          userId: "current-user", // TODO: Get from auth context
          name: templateData.name!,
          amount: templateData.amount!,
          type: templateData.type!,
          categoryId: templateData.categoryId!,
          subcategoryId: templateData.subcategoryId,
          description: templateData.description,
          frequency: templateData.frequency!,
          startDate: templateData.startDate!,
          endDate: templateData.endDate,
          isActive: templateData.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Mock API call dacă nu suntem în mock mode
        if (!config.mockMode) {
          // TODO: API call pentru creating template
          // const response = await recurringService.createTemplate(newTemplate);
          // newTemplate = response;
        }

        // Update local state
        setTemplates((prev) => [...prev, newTemplate]);

        // Add warnings dacă există
        if (validation.warnings.length > 0) {
          setWarnings((prev) => [...prev, ...validation.warnings]);
        }

        return newTemplate;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Template creation failed";
        setErrors((prev) => [...prev, errorMessage]);
        throw error;
      }
    },
    [config.mockMode],
  );

  const updateTemplate = useCallback(
    async (
      id: string,
      updates: Partial<RecurringTemplate>,
    ): Promise<RecurringTemplate> => {
      try {
        const existingTemplate = templates.find((t) => t.id === id);
        if (!existingTemplate) {
          throw new Error(`Template with ID ${id} not found`);
        }

        // Merge updates cu existing template
        const updatedTemplateData = { ...existingTemplate, ...updates };

        // Validate updated template
        const validation = validateRecurringTemplate(updatedTemplateData);
        if (!validation.isValid) {
          const errorMessage = `Template validation failed: ${validation.errors.join(", ")}`;
          setErrors((prev) => [...prev, errorMessage]);
          throw new Error(errorMessage);
        }

        // Create updated template cu new timestamp
        const updatedTemplate: RecurringTemplate = {
          ...updatedTemplateData,
          updatedAt: new Date().toISOString(),
        };

        // Mock API call dacă nu suntem în mock mode
        if (!config.mockMode) {
          // TODO: API call pentru updating template
          // const response = await recurringService.updateTemplate(id, updatedTemplate);
          // updatedTemplate = response;
        }

        // Update local state
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? updatedTemplate : t)),
        );

        // Add warnings dacă există
        if (validation.warnings.length > 0) {
          setWarnings((prev) => [...prev, ...validation.warnings]);
        }

        return updatedTemplate;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Template update failed";
        setErrors((prev) => [...prev, errorMessage]);
        throw error;
      }
    },
    [templates, config.mockMode],
  );

  const deleteTemplate = useCallback(
    async (id: string): Promise<void> => {
      try {
        const existingTemplate = templates.find((t) => t.id === id);
        if (!existingTemplate) {
          throw new Error(`Template with ID ${id} not found`);
        }

        // Mock API call dacă nu suntem în mock mode
        if (!config.mockMode) {
          // TODO: API call pentru deleting template
          // await recurringService.deleteTemplate(id);
        }

        // Update local state
        setTemplates((prev) => prev.filter((t) => t.id !== id));

        // Remove generated transactions for deleted template
        setGeneratedTransactions((prev) =>
          prev.filter((tx) => tx.recurringTemplateId !== id),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Template deletion failed";
        setErrors((prev) => [...prev, errorMessage]);
        throw error;
      }
    },
    [templates, config.mockMode],
  );

  const validateTemplate = useCallback(
    (template: Partial<RecurringTemplate>): TemplateValidationResult => {
      return validateRecurringTemplate(template);
    },
    [],
  );

  // =============================================================================
  // GENERATION OPERATIONS
  // =============================================================================

  const generateForPeriod = useCallback(
    (startDate: string, endDate: string): GenerationResult => {
      setIsGenerating(true);

      try {
        const customConfig: GenerationConfig = {
          ...generationConfig,
          startDate,
          endDate,
        };

        const result = generateAllRecurringTransactions(customConfig);

        // Update state cu result
        setGeneratedTransactions(result.generatedTransactions);
        setLastGenerationResult(result);

        // Update conflicts
        if (result.conflicts.length > 0) {
          setConflicts({
            conflicts: result.conflicts,
            totalConflicts: result.conflicts.length,
            resolutionSuggestions: [
              `${result.conflicts.length} conflicts detected`,
              "Manual transactions override recurring ones",
              "Use resolveAllConflicts() to get clean list",
            ],
          });
        } else {
          setConflicts({
            conflicts: [],
            totalConflicts: 0,
            resolutionSuggestions: [],
          });
        }

        // Add errors și warnings
        if (result.errors.length > 0) {
          setErrors((prev) => [...prev, ...result.errors]);
        }

        if (result.warnings.length > 0) {
          setWarnings((prev) => [...prev, ...result.warnings]);
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Generation failed";
        setErrors((prev) => [...prev, errorMessage]);

        const failedResult: GenerationResult = {
          generatedTransactions: [],
          conflicts: [],
          statistics: {
            templatesProcessed: 0,
            transactionsGenerated: 0,
            conflictsDetected: 0,
            periodCovered: {
              startDate,
              endDate,
              daysSpanned: 0,
            },
            generationTimeMs: 0,
          },
          errors: [errorMessage],
          warnings: [],
        };

        setLastGenerationResult(failedResult);
        return failedResult;
      } finally {
        setIsGenerating(false);
      }
    },
    [generationConfig],
  );

  const regenerateAll = useCallback((): GenerationResult => {
    return generateForPeriod(config.currentStartDate, config.currentEndDate);
  }, [generateForPeriod, config.currentStartDate, config.currentEndDate]);

  const resolveAllConflicts = useCallback((): GeneratedTransaction[] => {
    if (!config.existingTransactions) {
      return generatedTransactions;
    }

    const resolved = resolveConflicts(
      generatedTransactions,
      config.existingTransactions,
    );

    // Update conflicts state
    setConflicts({
      conflicts: [],
      totalConflicts: 0,
      resolutionSuggestions: ["All conflicts resolved"],
    });

    return resolved;
  }, [generatedTransactions, config.existingTransactions]);

  // =============================================================================
  // BULK OPERATIONS
  // =============================================================================

  const bulkUpdateTemplates = useCallback(
    async (operation: BulkUpdateOperation): Promise<RecurringTemplate[]> => {
      try {
        const updatedTemplates: RecurringTemplate[] = [];

        for (const templateId of operation.templateIds) {
          const updated = await updateTemplate(templateId, operation.updates);
          updatedTemplates.push(updated);
        }

        // Regenerate dacă e requested
        if (operation.regenerateAfterUpdate) {
          regenerateAll();
        }

        return updatedTemplates;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bulk update failed";
        setErrors((prev) => [...prev, errorMessage]);
        throw error;
      }
    },
    [updateTemplate, regenerateAll],
  );

  const bulkDeleteTemplates = useCallback(
    async (operation: BulkDeleteOperation): Promise<void> => {
      try {
        if (!operation.confirmed) {
          throw new Error("Bulk delete must be confirmed");
        }

        for (const templateId of operation.templateIds) {
          await deleteTemplate(templateId);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bulk delete failed";
        setErrors((prev) => [...prev, errorMessage]);
        throw error;
      }
    },
    [deleteTemplate],
  );

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const clearErrors = useCallback(() => {
    setErrors([]);
    setWarnings([]);
  }, []);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Auto-regenerate când se schimbă templates sau config
  useEffect(() => {
    if (config.autoRegenerate && activeTemplates.length > 0) {
      regenerateAll();
    }
  }, [config.autoRegenerate, activeTemplates, regenerateAll]);

  // =============================================================================
  // RETURN HOOK RESULT
  // =============================================================================

  return {
    // Template management
    templates,
    setTemplates,

    // Generated transactions
    generatedTransactions,
    conflicts,

    // Template operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    validateTemplate,

    // Generation operations
    generateForPeriod,
    regenerateAll,
    resolveAllConflicts,

    // Bulk operations
    bulkUpdateTemplates,
    bulkDeleteTemplates,

    // State management
    isGenerating,
    lastGenerationResult,
    generationStats,

    // Error handling
    errors,
    warnings,
    clearErrors,
  };
}

// =============================================================================
// EXPORT HOOK
// =============================================================================

export default useRecurringTransactions;
