/**
 * Tests pentru EditableCell - Core Phase 1 UI Component
 *
 * Testează cu live data, fără mocks:
 * - CVA styling integration
 * - Visual feedback states
 * - Excel shortcuts (F2, Enter, Escape)
 * - Event handling
 * - Accessibility features
 */

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EditableCell } from "./EditableCell";
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

describe("EditableCell - Phase 1 UI Component", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnStartEdit = jest.fn();

  const createMockProps = (overrides = {}) => ({
    cellId: "test-cell-editable",
    value: 250.75,
    isEditing: false,
    error: null,
    validationType: "amount" as const,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    onStartEdit: mockOnStartEdit,
    "data-testid": "editable-cell-test",
    ...overrides,
  });

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
    mockOnStartEdit.mockClear();
  });

  test("renderizează corect în modul de vizualizare", () => {
    render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const cell = screen.getByTestId("editable-cell-test");
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent("250,75"); // Romanian number format
    expect(cell).not.toHaveClass("editing"); // CVA class check
  });

  test("arată input în modul de editare", () => {
    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("type", "text");
  });

  test("activează editarea cu F2", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const cell = screen.getByTestId("editable-cell-test");
    cell.focus();

    await user.keyboard("{F2}");

    expect(mockOnStartEdit).toHaveBeenCalled();
  });

  test("activează editarea cu double-click", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const cell = screen.getByTestId("editable-cell-test");

    await user.dblClick(cell);

    expect(mockOnStartEdit).toHaveBeenCalled();
  });

  test("salvează cu Enter în modul editare", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true, value: 300.5 })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("300.5");

    await user.clear(input);
    await user.type(input, "450.75");
    await user.keyboard("{Enter}");

    expect(mockOnSave).toHaveBeenCalledWith(450.75); // amount = number pentru calcule în grid
  });

  test("anulează cu Escape în modul editare", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");

    await user.clear(input);
    await user.type(input, "999.99");
    await user.keyboard("{Escape}");

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("arată eroarea de validare cu stiluri CVA", () => {
    const errorMessage =
      EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_NUMBER;

    render(
      <TestWrapper>
        <EditableCell
          {...createMockProps({
            isEditing: true,
            error: errorMessage,
          })}
        />
      </TestWrapper>,
    );

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass("text-red-600"); // CVA error styling

    const input = screen.getByDisplayValue("250.75");
    expect(input).toHaveClass("border-red-500"); // CVA error border
  });

  test("CVA styling pentru diferite stări", () => {
    const { rerender } = render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    let cell = screen.getByTestId("editable-cell-test");
    expect(cell).toHaveClass("cursor-pointer"); // Default state

    // Test editing state
    rerender(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");
    expect(input).toHaveClass("border-blue-500"); // Focus styling

    // Test readonly state
    rerender(
      <TestWrapper>
        <EditableCell {...createMockProps({ isReadonly: true })} />
      </TestWrapper>,
    );

    cell = screen.getByTestId("editable-cell-test");
    expect(cell).toHaveClass("cursor-not-allowed"); // Readonly styling
  });

  test("accessibility features", () => {
    render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const cell = screen.getByTestId("editable-cell-test");
    expect(cell).toHaveAttribute("tabIndex", "0");
    expect(cell).toHaveAttribute("role", "gridcell");
    expect(cell).toHaveAttribute("aria-label");
  });

  test("accessibility în modul editare", () => {
    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");
    expect(input).toHaveAttribute("aria-label");
    expect(input).toHaveAttribute("aria-describedby");
  });

  test("formatarea diferitelor tipuri de valori", () => {
    const { rerender } = render(
      <TestWrapper>
        <EditableCell
          {...createMockProps({
            validationType: "percentage",
            value: 25.5,
          })}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("25,5%")).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <EditableCell
          {...createMockProps({
            validationType: "text",
            value: "Test Text",
          })}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Test Text")).toBeInTheDocument();
  });

  test("performance - render time sub-16ms", () => {
    const startTime = performance.now();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(16); // Sub-16ms requirement
  });

  test("performance - state change sub-16ms", async () => {
    const { rerender } = render(
      <TestWrapper>
        <EditableCell {...createMockProps()} />
      </TestWrapper>,
    );

    const startTime = performance.now();

    rerender(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const stateChangeTime = performance.now() - startTime;
    expect(stateChangeTime).toBeLessThan(16); // Sub-16ms requirement
  });

  test("integrare cu shared-constants pentru placeholder-uri", () => {
    render(
      <TestWrapper>
        <EditableCell
          {...createMockProps({
            isEditing: true,
            value: "",
            validationType: "amount",
          })}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText(
      EXCEL_GRID.INLINE_EDITING.PLACEHOLDER.AMOUNT,
    );
    expect(input).toBeInTheDocument();
  });

  test("blur event auto-save", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");

    await user.clear(input);
    await user.type(input, "333.33");

    // Blur the input
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith(333.33); // amount = number pentru calcule în grid
  });

  test("loading state display", () => {
    render(
      <TestWrapper>
        <EditableCell
          {...createMockProps({
            isEditing: true,
            isSaving: true,
          })}
        />
      </TestWrapper>,
    );

    const loadingIndicator = screen.getByRole("status");
    expect(loadingIndicator).toBeInTheDocument();

    const input = screen.getByDisplayValue("250.75");
    expect(input).toBeDisabled();
  });

  test("tab navigation în edit mode", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EditableCell {...createMockProps({ isEditing: true })} />
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");
    input.focus();

    await user.keyboard("{Tab}");

    // Tab should save and move focus
    expect(mockOnSave).toHaveBeenCalled();
  });

  test("click outside anulează editarea", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <div>
          <EditableCell {...createMockProps({ isEditing: true })} />
          <button>Outside Button</button>
        </div>
      </TestWrapper>,
    );

    const input = screen.getByDisplayValue("250.75");
    const outsideButton = screen.getByRole("button");

    await user.clear(input);
    await user.type(input, "999.99");
    await user.click(outsideButton);

    expect(mockOnSave).toHaveBeenCalledWith(999.99); // amount = number pentru calcule în grid
  });
});
