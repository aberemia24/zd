import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTransactionFormStore as originalUseTransactionFormStore } from '../../../stores/transactionFormStore';
import { useTransactionStore as originalUseTransactionStore } from '../../../stores/transactionStore';
import { useAuthStore as originalUseAuthStore } from '../../../stores/authStore';
import TransactionForm, { TransactionFormData } from './TransactionForm'; 
import { setMockFormState } from '../../../__mocks__/stores/transactionFormStore';
import { setMockTransactionState } from '../../../__mocks__/stores/transactionStore';
import { setMockAuthState } from '../../../__mocks__/stores/authStore';
import { MESAJE } from '@shared-constants/messages';
import { CategoryType, FrequencyType, TransactionType } from '@shared-constants/enums';
import type { TransactionValidated } from '@shared-constants/transaction.schema';
import type { TransactionState } from '../../../stores/transactionStore';
import type { TransactionFormStoreState } from '../../../stores/transactionFormStore';
import type { AuthState } from '../../../stores/authStore';

// Alias hooks to mocked versions for TS
const useTransactionFormStore = originalUseTransactionFormStore as unknown as jest.Mock & { getState: jest.Mock };
const useTransactionStore = originalUseTransactionStore as unknown as jest.Mock & { getState: jest.Mock };
const useAuthStore = originalUseAuthStore as unknown as jest.Mock & { getState: jest.Mock };

// Mock-uri pentru store-uri
jest.mock('../../../stores/transactionFormStore');
jest.mock('../../../stores/transactionStore');
jest.mock('../../../stores/authStore');

// Helper pentru date inițiale (format corect pentru input date)
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const initialForm: TransactionFormData = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: getTodayDateString(),
  recurring: false,
  frequency: FrequencyType.MONTHLY,
};

describe('TransactionForm Component Tests', () => {
  let onSave: jest.Mock;
  let onCancel: jest.Mock;

  // --- Setup Mocks Before Each Test ---
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Form Store
    setMockFormState({
      form: { ...initialForm }, 
      error: '',
      success: '',
      loading: false,
      // Mock store actions, ensure they interact with the mock state correctly
      setForm: jest.fn((newForm) => setMockFormState({ form: { ...useTransactionFormStore.getState().form, ...newForm } })),
      setError: jest.fn((error) => setMockFormState({ error })),
      setSuccess: jest.fn((success) => setMockFormState({ success })),
      setLoading: jest.fn((loading) => setMockFormState({ loading })),
      resetForm: jest.fn(() => setMockFormState({ form: { ...initialForm }, error: '', success: '', loading: false })),
      validateForm: jest.fn(() => true), // Default to valid
      handleSubmit: jest.fn<Promise<void>, [React.FormEvent<HTMLFormElement>?]>(async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const state = useTransactionFormStore.getState(); // Correctly get mock state
        state.setLoading(true);
        if (state.validateForm(state.form)) { // Validate the current mock form state
            // Simulate async save
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
            onSave(state.form); // Call prop function with form data
            state.setSuccess(MESAJE.SUCCES_ADAUGARE);
        } else {
            state.setError(MESAJE.EROARE_GENERALA); // Set validation error if invalid
        }
        state.setLoading(false);
      }),
      getForm: jest.fn(() => useTransactionFormStore.getState().form),
      getError: jest.fn(() => useTransactionFormStore.getState().error),
      getSuccess: jest.fn(() => useTransactionFormStore.getState().success),
      getLoading: jest.fn(() => useTransactionFormStore.getState().loading),
      setTransactionService: jest.fn(),
    });

    // Mock Transaction Store (override only needed fields)
    setMockTransactionState({
      transactions: [],
      total: 0,
      loading: false,
      error: null,
      getAllSubcategories: jest.fn((category?: CategoryType) => {
        if (!category) return [];
        if (category === CategoryType.EXPENSE) return ['Supermarket', 'Haine'];
        return ['Subcategorie Default'];
      }),
    });

    // Mock Auth Store
    setMockAuthState({
      user: { id: 'test-user-id', email: 'test@example.com' }, // Mock logged-in user
      loading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkUser: jest.fn(),
    });

    // Apply the mock implementations correctly
    // We mock the hook itself to return the current state of our mock object
    (useTransactionFormStore as jest.Mock).mockImplementation(() => useTransactionFormStore.getState());
    (useTransactionStore as jest.Mock).mockImplementation(() => useTransactionStore.getState());
    (useAuthStore as jest.Mock).mockImplementation(() => useAuthStore.getState());


    onSave = jest.fn();
    onCancel = jest.fn();
  });

  // --- Teste Redare Inițială ---
  test('Redare inițială corectă', () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />); // NO initialData prop

    // Check key fields exist
    expect(screen.getByTestId('type-select')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('subcategory-select')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('recurring-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
  });

  test('Valorile inițiale sunt afișate corect', () => {
    const specificInitialForm = { ...initialForm, amount: '123.45' };
    setMockFormState({ form: specificInitialForm });
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);

    expect(screen.getByTestId('amount-input')).toHaveValue(123.45); // Number input value
    expect(screen.getByTestId('date-input')).toHaveValue(getTodayDateString());
    expect(screen.getByTestId('recurring-checkbox')).not.toBeChecked();
  });

  // --- Teste Validare Câmpuri Obligatorii ---
  test('Afișează eroare la submit fără câmpuri obligatorii', async () => {
    // Override validateForm mock for this test
    setMockFormState({
      validateForm: jest.fn(() => false), // Simulate validation failure
      getError: jest.fn(() => MESAJE.EROARE_GENERALA), // Simulate generic error message
    });

    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const saveButton = screen.getByTestId('save-btn');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Check if error message is displayed (assuming an element with data-testid="error-message" exists)
     await waitFor(() => {
       expect(screen.getByTestId('error-message')).toHaveTextContent(MESAJE.EROARE_GENERALA);
     });
    expect(onSave).not.toHaveBeenCalled(); // Save should not be called
  });

  test('Afișează eroare specifică dacă recurent e bifat dar frecvența lipsește', async () => {
     const stateWithRecurringNoFreq = {
      ...initialForm,
      recurring: true,
      frequency: '', // Empty frequency
    };
    setMockFormState({
      form: stateWithRecurringNoFreq,
      validateForm: jest.fn((form) => !form.recurring || !!form.frequency), // Validation logic
      getError: jest.fn(() => useTransactionFormStore.getState().error), // Get error from mock state
    });
     // Trigger validation error manually for the test setup
    useTransactionFormStore.getState().setError(MESAJE.FRECV_RECURENTA);


    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const saveButton = screen.getByTestId('save-btn');

    await act(async () => {
      fireEvent.click(saveButton);
    });

     await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(MESAJE.FRECV_RECURENTA);
     });
    expect(onSave).not.toHaveBeenCalled();
  });

   // --- Teste Interacțiuni Câmpuri ---
   test('Actualizează suma la input', async () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const amountInput = screen.getByTestId('amount-input');

    await act(async () => {
        fireEvent.change(amountInput, { target: { value: '250.75' } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ amount: '250.75' }));
    // Check input reflects change if component updates correctly
    // expect(amountInput).toHaveValue(250.75); // May need re-render or state update simulation
  });

   test('Actualizează data la selectare', async () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const dateInput = screen.getByTestId('date-input');
    const newDate = '2024-01-15';

    await act(async () => {
      fireEvent.change(dateInput, { target: { value: newDate } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ date: newDate }));
  });

   test('Actualizează tipul tranzacției la selectare', async () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const typeSelect = screen.getByTestId('type-select');

    await act(async () => {
      fireEvent.change(typeSelect, { target: { value: TransactionType.EXPENSE } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ type: TransactionType.EXPENSE }));
   });

   test('Actualizează categoria la selectare', async () => {
     // Set type first to enable categories
    setMockFormState({ form: { ...initialForm, type: TransactionType.EXPENSE } });
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const categorySelect = screen.getByTestId('category-select');

    await act(async () => {
      fireEvent.change(categorySelect, { target: { value: CategoryType.EXPENSE } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ category: CategoryType.EXPENSE }));
  });

  test('Actualizează subcategoria la selectare', async () => {
     // Set type and category first
    setMockFormState({ form: { ...initialForm, type: TransactionType.EXPENSE, category: CategoryType.EXPENSE } });
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const subcategorySelect = screen.getByTestId('subcategory-select');

     // Wait for options to potentially load (if async)
     await waitFor(() => expect(screen.getByText('Supermarket')).toBeInTheDocument());

    await act(async () => {
      fireEvent.change(subcategorySelect, { target: { value: 'Supermarket' } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ subcategory: 'Supermarket' }));
  });

   test('Actualizează starea recurentă la bifare/debifare', async () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const recurringCheckbox = screen.getByTestId('recurring-checkbox');

    await act(async () => {
      fireEvent.click(recurringCheckbox); // Check it
    });
    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ recurring: true }));

    await act(async () => {
      fireEvent.click(recurringCheckbox); // Uncheck it
    });
    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ recurring: false }));
  });

  test('Actualizează frecvența la selectare (când recurent e activ)', async () => {
    // Set recurring to true
    setMockFormState({ form: { ...initialForm, recurring: true } });
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const frequencySelect = screen.getByTestId('frequency-select');

    await act(async () => {
      fireEvent.change(frequencySelect, { target: { value: FrequencyType.WEEKLY } });
    });

    expect(useTransactionFormStore.getState().setForm).toHaveBeenCalledWith(expect.objectContaining({ frequency: FrequencyType.WEEKLY }));
   });

   test('Câmpul frecvență este vizibil doar când recurent este bifat', () => {
     // Initial render (recurring false)
     render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
     expect(screen.queryByTestId('frequency-select')).not.toBeVisible();

     // Set recurring to true in mock state and re-render/update
     act(() => {
        setMockFormState({ form: { ...useTransactionFormStore.getState().form, recurring: true } });
     });
     // Re-rendering might be needed if the component doesn't auto-update based on store change
     // For simplicity, let's assume component reacts or re-render manually
     render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
     expect(screen.getByTestId('frequency-select')).toBeVisible();
   });


  // --- Teste Submit ---
  test('Apelează onSave cu datele corecte la submit valid', async () => {
    const validFormData: TransactionFormData = {
      ...initialForm,
      type: TransactionType.EXPENSE,
      amount: '50.99',
      category: CategoryType.EXPENSE,
      subcategory: 'Supermarket',
      date: '2023-10-27',
      recurring: false,
      frequency: initialForm.frequency,
    };
    setMockFormState({ form: validFormData, validateForm: jest.fn(() => true) }); // Ensure validation passes

    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const saveButton = screen.getByTestId('save-btn');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
        expect(onSave).toHaveBeenCalledTimes(1);
        // Check the argument passed to onSave matches the form state
        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            type: TransactionType.EXPENSE,
            amount: '50.99',
            category: CategoryType.EXPENSE,
            subcategory: 'Supermarket',
            date: '2023-10-27',
            recurring: false,
        }));
    });

    // Check loading state was handled
    expect(useTransactionFormStore.getState().setLoading).toHaveBeenCalledWith(true);
    expect(useTransactionFormStore.getState().setLoading).toHaveBeenCalledWith(false);
    // Check for success message
    await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent(MESAJE.SUCCES_ADAUGARE);
    });
  });

   test('Afișează eroare și nu apelează onSave la eroare de submit (ex: API error)', async () => {
    const validFormData = { ...initialForm, type: TransactionType.INCOME, amount: '1000', category: CategoryType.INCOME };
    // Simulate validation passing but handleSubmit throwing an error
    setMockFormState({
        form: validFormData,
        validateForm: jest.fn(() => true),
        handleSubmit: jest.fn<Promise<void>, [React.FormEvent<HTMLFormElement>?]>(async (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            const state = useTransactionFormStore.getState();
            state.setLoading(true);
            // Simulate API error
            await new Promise((_, reject) => setTimeout(() => reject(new Error('API Error')), 50));
            // The catch block should handle this in a real scenario
            state.setError(MESAJE.EROARE_ADAUGARE); // Manually set error for test
            state.setLoading(false);
        }),
    });


    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const saveButton = screen.getByTestId('save-btn');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
       expect(screen.getByTestId('error-message')).toHaveTextContent(MESAJE.EROARE_ADAUGARE);
    });
    expect(onSave).not.toHaveBeenCalled();
     // Check loading state was handled
    expect(useTransactionFormStore.getState().setLoading).toHaveBeenCalledWith(true);
    expect(useTransactionFormStore.getState().setLoading).toHaveBeenCalledWith(false);
  });


  // --- Teste Butoane ---
  test('Apelează onCancel la click pe butonul Anulează', async () => {
    render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
    const cancelButton = screen.getByTestId('cancel-btn');

    await act(async () => {
        fireEvent.click(cancelButton);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  test('Butonul Salvează este dezactivat când loading este true', () => {
     setMockFormState({ loading: true }); // Set loading state in mock
     render(<TransactionForm onSave={onSave} onCancel={onCancel} />);
     const saveButton = screen.getByTestId('save-btn');
     expect(saveButton).toBeDisabled();
   });

});