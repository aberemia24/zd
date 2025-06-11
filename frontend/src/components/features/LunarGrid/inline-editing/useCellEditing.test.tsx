/**
 * 🎯 TESTS FOR useCellEditing - TASK 2 IMPLEMENTATION
 *
 * Testează noul hook consolidat care combină logica din useInlineCellEdit și useCellState.
 * Verifică interfața simplificată, prop getters, și funcționalitățile complete.
 */

import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCellEditing } from "./useCellEditing";
import { EXCEL_GRID, VALIDATION_MESSAGES } from "@budget-app/shared-constants";
import { vi } from "vitest";

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
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Helper pentru crearea props-urilor de test
const createTestProps = (overrides = {}) => ({
  cellId: "test-cell-1",
  initialValue: "100.50",
  onSave: vi.fn().mockResolvedValue(undefined),
  validationType: "amount" as const,
  isReadonly: false,
  isSelected: false,
  isFocused: false,
  ...overrides,
});

describe("useCellEditing - Task 2 Consolidated Hook", () => {
  
  test("implementează interfața UseCellEditingReturn completă", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps()),
      { wrapper: TestWrapper },
    );

    // Verifică toate proprietățile din interfață
    expect(result.current).toHaveProperty("isEditing");
    expect(result.current).toHaveProperty("value");
    expect(result.current).toHaveProperty("displayValue");
    expect(result.current).toHaveProperty("startEdit");
    expect(result.current).toHaveProperty("cancelEdit");
    expect(result.current).toHaveProperty("saveEdit");
    expect(result.current).toHaveProperty("setValue");
    expect(result.current).toHaveProperty("getCellProps");
    expect(result.current).toHaveProperty("getInputProps");
         expect(result.current).toHaveProperty("error");
     expect(result.current).toHaveProperty("isSaving");
     expect(result.current).toHaveProperty("cellState");
     expect(result.current).toHaveProperty("interactionState");
     expect(result.current).toHaveProperty("shouldShowActions");
     expect(result.current).toHaveProperty("shouldShowHints");

     // Verifică tipurile și valorile inițiale
     expect(typeof result.current.isEditing).toBe("boolean");
     expect(typeof result.current.value).toBe("string");
     expect(typeof result.current.displayValue).toBe("string");
     expect(typeof result.current.startEdit).toBe("function");
     expect(typeof result.current.cancelEdit).toBe("function");
     expect(typeof result.current.saveEdit).toBe("function");
     expect(typeof result.current.setValue).toBe("function");
     expect(typeof result.current.getCellProps).toBe("function");
     expect(typeof result.current.getInputProps).toBe("function");
     expect(typeof result.current.isSaving).toBe("boolean");
     expect(result.current.error === null || typeof result.current.error === "string").toBe(true);
  });

  test("getCellProps returnează props complete pentru display mode", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ isSelected: true, isFocused: true })),
      { wrapper: TestWrapper },
    );

    const cellProps = result.current.getCellProps();

    expect(cellProps).toHaveProperty("data-cell-id", "test-cell-1");
    expect(cellProps).toHaveProperty("data-cell-state");
    expect(cellProps).toHaveProperty("data-interaction-state");
    expect(cellProps).toHaveProperty("aria-selected", true);
    expect(cellProps).toHaveProperty("tabIndex", 0);
    expect(cellProps).toHaveProperty("onMouseEnter");
    expect(cellProps).toHaveProperty("onMouseLeave");
    expect(cellProps).toHaveProperty("onFocus");
    expect(cellProps).toHaveProperty("onBlur");
    expect(cellProps).toHaveProperty("onMouseDown");
    expect(cellProps).toHaveProperty("onMouseUp");
    expect(cellProps).toHaveProperty("onDoubleClick");
    expect(cellProps).toHaveProperty("onKeyDown");
    expect(cellProps).toHaveProperty("onTouchStart");
    expect(cellProps).toHaveProperty("onTouchEnd");
  });

  test("getInputProps returnează props complete pentru edit mode", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps()),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
    });

    const inputProps = result.current.getInputProps();

    expect(inputProps).toHaveProperty("value", "100.50");
    expect(inputProps).toHaveProperty("onChange");
    expect(inputProps).toHaveProperty("onBlur");
    expect(inputProps).toHaveProperty("onKeyDown");
    expect(inputProps).toHaveProperty("aria-label", "Editează celula test-cell-1");
    expect(inputProps).toHaveProperty("aria-invalid", false);
    expect(inputProps).toHaveProperty("autoFocus", true);
    expect(inputProps).toHaveProperty("ref");
  });

  test("integrează corect cu useCellState pentru visual feedback", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ isSelected: true })),
      { wrapper: TestWrapper },
    );

         expect(result.current.cellState).toBeDefined();
     expect(result.current.interactionState).toBeDefined();
     
     // Când isSelected = true, cellState ar trebui să reflecteze asta
     expect(result.current.cellState).toBe("selected");
  });

  test("gestionează readonly state corect", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ isReadonly: true })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
    });

         // Nu ar trebui să intre în edit mode dacă e readonly
     expect(result.current.isEditing).toBe(false);
     expect(result.current.cellState).toBe("readonly");
  });

  test("workflow complet: start -> edit -> save", async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ onSave: mockOnSave })),
      { wrapper: TestWrapper },
    );

    // Start edit
    act(() => {
      result.current.startEdit();
    });
    expect(result.current.isEditing).toBe(true);

    // Change value
    act(() => {
      result.current.setValue("200.75");
    });
    expect(result.current.value).toBe("200.75");

    // Save
    await act(async () => {
      await result.current.saveEdit();
    });

    expect(mockOnSave).toHaveBeenCalledWith(200.75);
    expect(result.current.isEditing).toBe(false);
  });

  test("workflow complet: start -> edit -> cancel", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ initialValue: "150.25" })),
      { wrapper: TestWrapper },
    );

    // Start edit și change value
    act(() => {
      result.current.startEdit();
      result.current.setValue("999.99");
    });
    expect(result.current.value).toBe("999.99");

    // Cancel ar trebui să reverteze la valoarea inițială
    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.value).toBe("150.25");
  });

  test("keyboard interactions prin getCellProps", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps()),
      { wrapper: TestWrapper },
    );

    const cellProps = result.current.getCellProps();
    
    // Test F2 key pentru start edit
    act(() => {
      cellProps.onKeyDown({
        key: "F2",
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as any);
    });

    expect(result.current.isEditing).toBe(true);
  });

  test("keyboard interactions prin getInputProps", async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ onSave: mockOnSave })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
    });

    const inputProps = result.current.getInputProps();

    // Test Enter key pentru save
    await act(async () => {
      await inputProps.onKeyDown({
        key: "Enter",
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as any);
    });

    expect(mockOnSave).toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  test("validează input real-time cu mesaje centralizate", async () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ validationType: "amount" })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
      result.current.setValue("invalid-amount");
    });

    await act(async () => {
      await result.current.saveEdit();
    });

         // Verifică că avem o eroare (folosind constantele corecte)
     expect(result.current.error).toBeTruthy();
     const errorMessage = result.current.error!;
     
     // Verifică că mesajul conține reference la validare
     expect(errorMessage).toMatch(/număr|valid|invalidă/i);
  });

  test("clearează erori când utilizatorul tapează", async () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ validationType: "amount" })),
      { wrapper: TestWrapper },
    );

    // Pornește editarea
    act(() => {
      result.current.startEdit();
    });

    // Introduce valoare invalidă
    act(() => {
      result.current.setValue("invalid");
    });

    // Încearcă să salveze pentru a genera eroarea
    await act(async () => {
      await result.current.saveEdit();
    });

    // Verifică că avem eroare
    expect(result.current.error).toBeTruthy();

    // Erorile ar trebui să se cleareze când utilizatorul tapează o valoare nouă
    await act(async () => {
      result.current.setValue("123.45");
    });

    // Wait for state update to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Erorile ar trebui să fie clearate
    expect(result.current.error).toBeNull();
  });

  test("formatează displayValue corect pentru amount", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ 
        initialValue: 1234.56,
        validationType: "amount" 
      })),
      { wrapper: TestWrapper },
    );

    // Pentru amount, ar trebui să formateze cu locale românesc
    expect(result.current.displayValue).toContain("1.234");
  });

  test("formatează displayValue corect pentru percentage", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ 
        initialValue: 15.5,
        validationType: "percentage" 
      })),
      { wrapper: TestWrapper },
    );

    expect(result.current.displayValue).toBe("15.5%");
  });

  test("formatează displayValue corect pentru text", () => {
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ 
        initialValue: "Sample Text",
        validationType: "text" 
      })),
      { wrapper: TestWrapper },
    );

    expect(result.current.displayValue).toBe("Sample Text");
  });

  test("gestionează erori de salvare async", async () => {
    const mockOnSave = vi.fn().mockRejectedValue(new Error("Save failed"));
    const { result } = renderHook(
      () => useCellEditing(createTestProps({ onSave: mockOnSave })),
      { wrapper: TestWrapper },
    );

    act(() => {
      result.current.startEdit();
      result.current.setValue("100");
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    // Ar trebui să rămână în edit mode și să aibă eroare
    expect(result.current.isEditing).toBe(true);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain("Save failed");
  });

  test("prop getters mențin referințe stabile", () => {
    const { result, rerender } = renderHook(
      () => useCellEditing(createTestProps()),
      { wrapper: TestWrapper },
    );

    const initialCellProps = result.current.getCellProps;
    const initialInputProps = result.current.getInputProps;

    // Re-render cu aceleași props
    rerender();

    // Referințele ar trebui să rămână stabile
    expect(result.current.getCellProps).toBe(initialCellProps);
    expect(result.current.getInputProps).toBe(initialInputProps);
  });

  test("performance validation - hook initialization sub-16ms", () => {
    const startTime = performance.now();
    
    renderHook(
      () => useCellEditing(createTestProps()),
      { wrapper: TestWrapper },
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Hook-ul ar trebui să se inițializeze rapid
    expect(duration).toBeLessThan(16); // 16ms pentru 60fps
  });
}); 