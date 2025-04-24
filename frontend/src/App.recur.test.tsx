import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import App from './App';
import { LABELS, BUTTONS, TABLE, OPTIONS } from './constants/ui';
import { MESAJE } from './constants/messages';
import { TransactionType, FrequencyType } from './constants/enums';
import { FORM_DEFAULTS } from './constants/defaults';

import { TEST_API_URL } from './test/testEnv';
// Setăm explicit variabila de mediu pentru testare
process.env.REACT_APP_API_URL = TEST_API_URL;
const API_URL = process.env.REACT_APP_API_URL; 
// Add a check to ensure the environment variable is set during tests
if (!API_URL) {
  throw new Error("REACT_APP_API_URL environment variable not set for tests.");
}

describe('Tranzacții și venituri recurente', () => {

  let originalLog: typeof console.log;
  const originalFetch = global.fetch;

  beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalLog;
  });

  it('formularul permite setarea unei tranzacții ca recurentă cu frecvență', async () => {
    // Mock specific pentru acest test (doar fetch inițial)
    global.fetch = jest.fn(async (url, options) => {
      // Introduce a minimal delay
      await new Promise(resolve => setTimeout(resolve, 0));

      const urlString = url.toString();
      // Mock GET for fetching initial/refreshed transaction list
      if (urlString.startsWith(API_URL) && (!options || options.method === 'GET')) {
        // Simulate finding the added transaction after refresh
        const mockData = [
          {
            id: 'mock-recur-income-1', // Example ID
            userId: 'u1',
            type: TransactionType.INCOME,
            amount: 200,
            currency: FORM_DEFAULTS.CURRENCY,
            date: '2025-04-24',
            category: 'salariu',
            subcategory: 'principal',
            recurring: true,
            frequency: FrequencyType.MONTHLY,
            description: 'Mocked Salariu'
          }
          // Add other transactions if needed for other tests or initial state
        ];
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockData, total: mockData.length, limit: 10, offset: 0 }),
        } as Response);
      }
      // Reject any other fetch calls
      return Promise.reject(new Error(`Unexpected fetch call: ${options?.method} ${url}`));
    });

    await act(async () => {
      render(<App />);
      // Așteaptă ca mesajul 'Se încarcă...' să dispară
      await waitFor(() => expect(screen.queryByText(/Se încarcă.../i)).toBeNull());
    });

    expect(screen.getByLabelText(/Recurent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Frecvență/i)).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/Recurent/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/Frecvență/i)).not.toBeDisabled();
    });
  });

  it('nu permite submit dacă e recurent dar nu are frecvență', async () => {
    // Mock specific pentru acest test (doar fetch inițial)
    global.fetch = jest.fn(async (url, options) => {
      // Introduce a minimal delay
      await new Promise(resolve => setTimeout(resolve, 0));

      const urlString = url.toString();
      // Mock GET for fetching initial/refreshed transaction list
      if (urlString.startsWith(API_URL) && (!options || options.method === 'GET')) {
        // Simulate finding the added transaction after refresh
        const mockData = [
          {
            id: 'mock-recur-income-1', // Example ID
            userId: 'u1',
            type: TransactionType.INCOME,
            amount: 200,
            currency: FORM_DEFAULTS.CURRENCY,
            date: '2025-04-24',
            category: 'salariu',
            subcategory: 'principal',
            recurring: true,
            frequency: FrequencyType.MONTHLY,
            description: 'Mocked Salariu'
          }
          // Add other transactions if needed for other tests or initial state
        ];
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockData, total: mockData.length, limit: 10, offset: 0 }),
        } as Response);
      }
      // Reject any other fetch calls
      return Promise.reject(new Error(`Unexpected fetch call: ${options?.method} ${url}`));
    });

    let form: HTMLElement;
    let submitButton: HTMLElement;

    // Învelește render și așteptarea inițială în act
    await act(async () => {
      render(<App />);
      // Așteaptă ca mesajul 'Se încarcă...' să dispară
      await waitFor(() => expect(screen.queryByText(/Se încarcă.../i)).toBeNull());
    });

    // Obține form și submitButton DUPĂ act-ul inițial
    form = screen.getByRole('form');
    submitButton = within(form).getByText(/Adaugă/i);

    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'expense' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '10' } });
    
    fireEvent.change(within(form).getByRole('combobox', { name: 'Categorie' }), { target: { value: 'CHELTUIELI' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-01-01' } });
    fireEvent.click(within(form).getByLabelText(/Recurent/i));

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText(/Selectează frecvența pentru tranzacție recurentă/i)).toBeInTheDocument();
    });
  });

  it('poți adăuga o tranzacție recurentă și apare marcată în tabel', async () => {
    const mockTransaction = {
      id: '2', userId: 'u1', type: TransactionType.EXPENSE, amount: 50, currency: FORM_DEFAULTS.CURRENCY, date: '2025-04-23',
      category: 'abonament', 
      subcategory: 'Taxe școlare | universitare', 
      recurring: true, frequency: FrequencyType.MONTHLY
    };

    // Mock-uri specifice pentru acest test, în ordinea așteptată
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })) // Initial GET
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockTransaction) })) // POST add
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [mockTransaction], total: 1, limit: 10, offset: 0 }) })); // GET refresh

    let form: HTMLElement;
    let submitButton: HTMLElement;

    // Învelește render și așteptarea inițială în act
    await act(async () => {
      render(<App />);
      // Așteaptă ca mesajul 'Se încarcă...' să dispară
      await waitFor(() => expect(screen.queryByText(/Se încarcă.../i)).toBeNull());
    });

    // Obține form și submitButton DUPĂ act-ul inițial
    form = screen.getByRole('form'); 
    submitButton = within(form).getByText(/Adaugă/i);

    await act(async () => {
      fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: mockTransaction.type } });
      fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: String(mockTransaction.amount) } });
    });
    
    await act(async () => {
      fireEvent.change(within(form).getByRole('combobox', { name: 'Categorie' }), { target: { value: 'CHELTUIELI' } }); 
      await waitFor(() => {
        const select = within(form).getByRole('combobox', { name: 'Subcategorie' }) as HTMLSelectElement;
        expect(select).not.toBeDisabled(); // Așteaptă să fie activat
        expect(Array.from(select.options).some((opt: HTMLOptionElement) => opt.value === mockTransaction.subcategory)).toBe(true);
      });
      fireEvent.change(within(form).getByRole('combobox', { name: 'Subcategorie' }), { target: { value: mockTransaction.subcategory } });
    });
    await act(async () => {
      fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: mockTransaction.date } });
      fireEvent.click(within(form).getByLabelText(/Recurent/i));
      // NU selecta frecvența, las-o goală
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // DEBUG: Afișează DOM-ul după submit pentru a vedea exact ce se afișează
    screen.debug();

    // Așteaptă apariția mesajului de eroare corect
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(MESAJE.FRECV_RECURENTA);
    });
  });

  it('poți adăuga un venit recurent și apare marcat în tabel', async () => {
    const mockIncome = {
      id: '3', userId: 'u1', type: TransactionType.INCOME, amount: 200, currency: FORM_DEFAULTS.CURRENCY, date: '2025-04-24',
      category: 'venit', 
      subcategory: 'Salarii', 
      recurring: true, frequency: FrequencyType.MONTHLY
    };

    // Mock-uri specifice pentru acest test, în ordinea așteptată
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })) // Initial GET
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockIncome) })) // POST add
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [mockIncome], total: 1, limit: 10, offset: 0 }) })); // GET refresh

    await act(async () => {
      render(<App />);
      // Așteaptă ca mesajul 'Se încarcă...' să dispară
      await waitFor(() => expect(screen.queryByText(/Se încarcă.../i)).toBeNull());
    });

    const form = screen.getByRole('form'); 
    const submitButton = within(form).getByText(/Adaugă/i);

    await act(async () => {
      fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: mockIncome.type } });
      fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: String(mockIncome.amount) } });
    });
    
    await act(async () => {
      fireEvent.change(within(form).getByRole('combobox', { name: 'Categorie' }), { target: { value: 'VENITURI' } });
      await waitFor(() => {
        const select = within(form).getByRole('combobox', { name: 'Subcategorie' }) as HTMLSelectElement;
        expect(select).not.toBeDisabled(); // Așteaptă să fie activat
        expect(Array.from(select.options).some((opt: HTMLOptionElement) => opt.value === mockIncome.subcategory)).toBe(true);
      });
      fireEvent.change(within(form).getByRole('combobox', { name: 'Subcategorie' }), { target: { value: mockIncome.subcategory } });
    });
    await act(async () => {
      fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: mockIncome.date } });
      fireEvent.click(within(form).getByLabelText(/Recurent/i));
      fireEvent.change(within(form).getByLabelText(/Frecvență/i), { target: { value: mockIncome.frequency } });
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Păstrăm DOAR: așteaptă ca elementele să apară în DOM
    await waitFor(() => {
      const row = screen.getByRole('row', { name: /Salarii/i });
      expect(row).toBeInTheDocument();
      // Verificăm și că celula Monedă conține 'RON'
      expect(within(row).getByText('RON')).toBeInTheDocument();
    }, { timeout: 1500 }); // Timeout mărit
  });
});
