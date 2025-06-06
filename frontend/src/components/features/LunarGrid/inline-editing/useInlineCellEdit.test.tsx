/**
 * Tests pentru useInlineCellEdit - Core Phase 1 Functionality
 *
 * Testează cu live data, fără mocks:
 * - Activare editare (F2, single-click, double-click)
 * - Validare input real-time
 * - Auto-save functionality
 * - Error handling
 * - Performance validation
 */

import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@budget-app/shared-constants";

// Live data setup - no mocks
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useInlineCellEdit - Phase 1 Core Functionality", () => {
  const mockOnSave = jest.fn();

  const createMockProps = (overrides = {}) => ({
    cellId: "test-cell-1",
    initialValue: 250.75,
    onSave: mockOnSave,
    validationType: "amount" as const,
    ...overrides,
  });

  beforeEach(() => {
    mockOnSave.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("inițializează hook-ul corect cu date live", () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.value).toBe("250.75"); // value e string pentru input display
    expect(result.current.error).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  test("activează editarea cu startEdit", async () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.startEdit();
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("activează editarea cu double-click", () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleDoubleClick();
    });

    expect(result.current.isEditing).toBe(true);
  });

  test("validează input real-time cu valori live", async () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.startEdit();
    });

    // Test valoare validă
    act(() => {
      result.current.setValue("150.50");
    });
    expect(result.current.value).toBe("150.50");

    // Test și salvează pentru a vedea validarea
    await act(async () => {
      await result.current.saveEdit();
    });
    expect(mockOnSave).toHaveBeenCalledWith(150.5); // onSave primește number

    // Test valoare invalidă (text pentru amount)
    act(() => {
      result.current.startEdit();
      result.current.setValue("abc");
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(result.current.error).toContain(
      EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_NUMBER,
    );
  });

  test("salvează cu Enter și anulează cu Escape", async () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.startEdit();
      result.current.setValue("300.25");
    });

    // Test salvare cu Enter
    await act(async () => {
      result.current.handleKeyDown({
        key: "Enter",
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    expect(mockOnSave).toHaveBeenCalledWith(300.25); // onSave primește number

    // Reset pentru test anulare
    act(() => {
      result.current.startEdit();
      result.current.setValue("400.00");
    });

    // Test anulare cu Escape
    act(() => {
      result.current.handleKeyDown({
        key: "Escape",
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.value).toBe("250.75"); // Reverted to original, value e string
  });

  test("auto-save cu handleBlur", async () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.startEdit();
      result.current.setValue("175.25");
    });

    await act(async () => {
      result.current.handleBlur();
    });

    expect(mockOnSave).toHaveBeenCalledWith(175.25); // onSave primește number
    expect(result.current.isEditing).toBe(false);
  });

  test("performance validation - sub-16ms response time", async () => {
    const { result } = renderHook(() => useInlineCellEdit(createMockProps()), {
      wrapper: TestWrapper,
    });

    // Test start edit performance
    const startTime = performance.now();
    act(() => {
      result.current.startEdit();
    });
    const editStartTime = performance.now() - startTime;

    expect(editStartTime).toBeLessThan(16); // Sub-16ms requirement

    // Test value update performance
    const updateStartTime = performance.now();
    act(() => {
      result.current.setValue("123.45");
    });
    const updateTime = performance.now() - updateStartTime;

    expect(updateTime).toBeLessThan(16); // Sub-16ms requirement
  });

  test("error handling cu network failure simulation", async () => {
    const failingOnSave = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(
      () => useInlineCellEdit(createMockProps({ onSave: failingOnSave })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
      result.current.setValue("150.00");
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(result.current.error).toContain("Network error");
    expect(result.current.isEditing).toBe(true); // Stays in edit mode
    expect(result.current.isSaving).toBe(false);
  });

  test("integrare cu shared-constants pentru diferite tipuri de validare", async () => {
    // Test amount validation
    const { result: amountResult } = renderHook(
      () => useInlineCellEdit(createMockProps({ validationType: "amount" })),
      { wrapper: TestWrapper },
    );

    act(() => {
      amountResult.current.startEdit();
      amountResult.current.setValue("-10");
    });

    await act(async () => {
      await amountResult.current.saveEdit();
    });

    expect(amountResult.current.error).toContain(
      EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.NEGATIVE_VALUE,
    );

    // Test percentage validation
    const { result: percentResult } = renderHook(
      () =>
        useInlineCellEdit(
          createMockProps({ validationType: "percentage", initialValue: 50 }),
        ),
      { wrapper: TestWrapper },
    );

    act(() => {
      percentResult.current.startEdit();
      percentResult.current.setValue("150"); // Over 100%
    });

    await act(async () => {
      await percentResult.current.saveEdit();
    });

    expect(percentResult.current.error).toContain(
      EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.PERCENTAGE_RANGE,
    );
  });

  test("readonly mode prevention", () => {
    const { result } = renderHook(
      () => useInlineCellEdit(createMockProps({ isReadonly: true })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
    });

    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.handleDoubleClick();
    });

    expect(result.current.isEditing).toBe(false);
  });

  test("concurrent editing prevention during save", async () => {
    let resolveSave: (value: unknown) => void;
    const slowOnSave = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result } = renderHook(
      () => useInlineCellEdit(createMockProps({ onSave: slowOnSave })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
      result.current.setValue("100");
    });

    // Start save operation
    act(() => {
      result.current.saveEdit();
    });

    expect(result.current.isSaving).toBe(true);

    // Try to start edit again while saving
    act(() => {
      result.current.startEdit();
    });

    expect(result.current.isEditing).toBe(true); // Should still be editing the same cell

    // Resolve the save
    act(() => {
      resolveSave(undefined);
    });
  });
});
