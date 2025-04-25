import { renderHook, act } from '@testing-library/react';
import { useTransactionForm } from '.';
import { INITIAL_FORM_STATE } from '../constants/defaults';
import { MESAJE } from '../constants/messages';

// Teste pentru hook-ul useTransactionForm
describe('useTransactionForm', () => {
  // Test pentru inițializarea cu valori implicite
  it('inițializează formularul cu valorile implicite', () => {
    const { result } = renderHook(() => useTransactionForm({ onSubmit: jest.fn() }));
    
    expect(result.current.form).toEqual(INITIAL_FORM_STATE);
    expect(result.current.error).toBe('');
    expect(result.current.success).toBe('');
    expect(result.current.loading).toBe(false);
  });

  // Test pentru inițializarea cu valori personalizate
  it('inițializează formularul cu valorile furnizate', () => {
    const initialValues = {
      type: 'expense',
      amount: '100',
      category: 'food',
      subcategory: 'groceries',
      date: '2025-04-25',
      recurring: false,
      frequency: '',
    };
    
    const { result } = renderHook(() => useTransactionForm({ 
      onSubmit: jest.fn(),
      initialValues
    }));
    
    expect(result.current.form).toEqual(initialValues);
  });

  // Test pentru actualizarea unui câmp în formular
  it('actualizează un câmp în formular', () => {
    const { result } = renderHook(() => useTransactionForm({ onSubmit: jest.fn() }));
    
    act(() => {
      result.current.handleChange({
        target: {
          name: 'amount',
          value: '150',
          type: 'text'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.form.amount).toBe('150');
  });

  // Test pentru actualizarea unui checkbox în formular
  it('actualizează un checkbox în formular', () => {
    const { result } = renderHook(() => useTransactionForm({ onSubmit: jest.fn() }));
    
    act(() => {
      result.current.handleChange({
        target: {
          name: 'recurring',
          type: 'checkbox',
          checked: true
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.form.recurring).toBe(true);
  });

  // Test pentru resetarea câmpului frequency când recurring este debifat
  it('resetează frequency când recurring este debifat', () => {
    const initialValues = {
      ...INITIAL_FORM_STATE,
      recurring: true,
      frequency: 'monthly'
    };
    
    const { result } = renderHook(() => useTransactionForm({ 
      onSubmit: jest.fn(),
      initialValues
    }));
    
    expect(result.current.form.frequency).toBe('monthly');
    
    act(() => {
      result.current.handleChange({
        target: {
          name: 'recurring',
          type: 'checkbox',
          checked: false
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.form.recurring).toBe(false);
    expect(result.current.form.frequency).toBe('');
  });

  // Test pentru validarea câmpurilor obligatorii
  it('validează câmpurile obligatorii la submit', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() => useTransactionForm({ onSubmit: mockSubmit }));
    
    act(() => {
      result.current.handleSubmit(new Event('submit') as any);
    });
    
    expect(result.current.error).toBe(MESAJE.CAMPURI_OBLIGATORII);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test pentru validarea frecvenței pentru tranzacții recurente
  it('validează frecvența pentru tranzacții recurente', () => {
    const mockSubmit = jest.fn();
    const initialValues = {
      type: 'expense',
      amount: '100',
      category: 'food',
      subcategory: 'groceries',
      date: '2025-04-25',
      recurring: true,
      frequency: '',
    };
    
    const { result } = renderHook(() => useTransactionForm({ 
      onSubmit: mockSubmit,
      initialValues
    }));
    
    act(() => {
      result.current.handleSubmit(new Event('submit') as any);
    });
    
    expect(result.current.error).toBe(MESAJE.FRECV_RECURENTA);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test pentru submit valid
  it('apelează callback-ul onSubmit pentru un formular valid', () => {
    const mockSubmit = jest.fn();
    const validForm = {
      type: 'expense',
      amount: '100',
      category: 'food',
      subcategory: 'groceries',
      date: '2025-04-25',
      recurring: false,
      frequency: '',
    };
    
    const { result } = renderHook(() => useTransactionForm({ 
      onSubmit: mockSubmit,
      initialValues: validForm
    }));
    
    act(() => {
      result.current.handleSubmit(new Event('submit') as any);
    });
    
    expect(result.current.error).toBe('');
    expect(mockSubmit).toHaveBeenCalledWith({
      ...validForm,
      amount: 100, // Valorile numerice sunt convertite
    });
  });

  // Test pentru resetarea formularului
  it('resetează formularul', () => {
    const initialValues = {
      type: 'expense',
      amount: '100',
      category: 'food',
      subcategory: 'groceries',
      date: '2025-04-25',
      recurring: false,
      frequency: '',
    };
    
    const { result } = renderHook(() => useTransactionForm({ 
      onSubmit: jest.fn(),
      initialValues
    }));
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.form).toEqual(INITIAL_FORM_STATE);
  });

  // Test pentru resetarea mesajelor de eroare și succes
  it('resetează mesajele de eroare și succes la schimbarea unui câmp', () => {
    const { result } = renderHook(() => useTransactionForm({ onSubmit: jest.fn() }));
    
    // Setăm eroarea și succesul
    act(() => {
      result.current.handleSubmit(new Event('submit') as any);
    });
    
    expect(result.current.error).toBe(MESAJE.CAMPURI_OBLIGATORII);
    
    // Schimbăm un câmp
    act(() => {
      result.current.handleChange({
        target: {
          name: 'type',
          value: 'expense',
          type: 'text'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Verificăm că mesajele sunt resetate
    expect(result.current.error).toBe('');
    expect(result.current.success).toBe('');
  });
});
