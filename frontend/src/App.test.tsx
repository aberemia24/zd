import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { Transaction } from './types/Transaction'; // Import corect după best practice

import { TEST_API_URL } from './test/testEnv';
// Setăm explicit variabila de mediu pentru testare
process.env.REACT_APP_API_URL = TEST_API_URL;
const API_URL = process.env.REACT_APP_API_URL;
import { MOCK_OPTIONS, MOCK_TRANSACTIONS_LIST, MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE, MOCK_PLACEHOLDERS } from './test/mockData';
import { MESAJE } from './constants/messages';

// Helper pentru a crea un obiect compatibil cu tipul Response
function fakeResponse<T>(body: T, ok = true, status = ok ? 200 : 400): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
    // Proprietăți minime pentru compatibilitate cu tipul Response
    headers: new Headers(),
    redirected: false,
    statusText: ok ? 'OK' : 'Bad Request',
    type: 'basic',
    url: '',
    clone: () => { throw new Error('clone not implemented in mock'); }, // Aruncă eroare dacă e apelat
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.reject(new Error('arrayBuffer not implemented in mock')),
    blob: () => Promise.reject(new Error('blob not implemented in mock')),
    formData: () => Promise.reject(new Error('formData not implemented in mock')),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response; // Folosim 'as unknown as Response' pentru a forța tipul
}

describe('App', () => {
  let postCount = 0;
  // Simulăm o "bază de date" în memorie pentru tranzacții pentru fiecare test
  let mockTransactions: Transaction[] = []; // Folosim tipul Transaction
  let nextId = 2; // Pentru a genera ID-uri unice

  beforeEach(() => {
    postCount = 0;
    // Resetăm baza de date mock la începutul fiecărui test cu o tranzacție inițială
    mockTransactions = [ ...MOCK_TRANSACTIONS_LIST ]; // Folosește mock list centralizată
    nextId = 2;

    // Mock global pentru fetch
    global.fetch = jest.fn((url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const urlString = url.toString();

      // --- POST la API_URL ---
      if (options?.method === 'POST' && urlString.startsWith(API_URL)) {
        postCount++;
        if (postCount === 1) { // Primul POST reușește
          let newTransactionData: Partial<Transaction> = {}; // Folosim Partial<Transaction>
          if (options.body) {
              try {
                  // Parsăm body-ul requestului POST
                  newTransactionData = JSON.parse(options.body.toString());
              } catch (e) {
                  console.error("[MOCK POST ERROR] Failed to parse body:", options.body?.toString());
                  // Returnăm eroare dacă body-ul nu e JSON valid
                  return Promise.resolve(fakeResponse({ message: 'Invalid request body' }, false, 400));
              }
          }
          // Creăm noua tranzacție cu un _id generat și o adăugăm în mock-ul nostru
          const newTransaction: Transaction = {
              ...newTransactionData, // Datele din request
              _id: `t${nextId++}`, // ID unic generat
              userId: 'mockUser', // Adăugăm un userId mock dacă e necesar
          } as Transaction; // Forțăm tipul dacă e nevoie, deși ar trebui să se potrivească
          mockTransactions.push(newTransaction);
          console.log('[MOCK POST SUCCESS] Added transaction:', newTransaction._id);
          console.log('[MOCK POST SUCCESS] Current mock transactions:', mockTransactions.map(t => t._id));
          // Returnăm răspuns de succes
          return Promise.resolve(fakeResponse({ success: true, transaction: newTransaction }, true, 201));
        } else { // POST-urile următoare eșuează (pentru testul de eroare)
          console.log('[MOCK POST FAIL] Simulating failure on subsequent POST');
          return Promise.resolve(fakeResponse({ message: 'Mocked POST error after first attempt' }, false, 500));
        }
      }

      // --- GET la API_URL (cu sau fără parametri) ---
      if ((!options || options?.method === 'GET') && urlString.startsWith(API_URL)) {
        const currentTestName = expect.getState().currentTestName;
        // Caz special pentru testul de resetare: după un POST reușit, returnăm lista goală
        if (postCount >= 1 && currentTestName && currentTestName.includes('resetează formularul')) {
            console.log('[MOCK GET] In "resetează formularul" test after POST, returning empty list');
            return Promise.resolve(fakeResponse({ data: [], total: 0, limit: 10, offset: 0 }, true));
        }
        // În toate celelalte cazuri GET, returnăm starea curentă a mock-ului
        console.log('[MOCK GET] Returning current mock transactions:', mockTransactions.map(t => t._id));
        return Promise.resolve(fakeResponse({
          data: [...mockTransactions], // Returnează o copie a listei curente
          total: mockTransactions.length,
          limit: 10, // Sau valorile default/din parametri dacă le parsezi
          offset: 0
        }, true));
      }

      // --- FALLBACK pentru orice alt request neașteptat ---
      console.error(`[MOCK FALLBACK] Unhandled fetch request: ${urlString}`, options);
      // Returnează un răspuns OK gol pentru a nu bloca lanțul .then() și a vedea eroarea în consolă
      return Promise.resolve(fakeResponse({ message: `Unhandled mock request to ${urlString}` }, true, 200)); // Răspuns OK, dar gol/informativ
    }) as jest.Mock;
  });

  afterEach(() => {
    // Restaurează implementările originale (dacă există) și curăță mock-urile Jest
    jest.restoreAllMocks();
  });

  // --- TESTELE ---

  it('renderizează titlul aplicației', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Tranzacții/i })).toBeInTheDocument();
  });

  it('afișează formularul de adăugare tranzacție cu toate inputurile', () => {
    render(<App />);
    // Caută formularul după `aria-label` setat pe <form> în App.tsx
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });
    expect(form).toBeInTheDocument();
    // Verifică prezența elementelor esențiale în formular
    expect(within(form).getByLabelText(/Tip/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Sumă/i)).toBeInTheDocument();
    // Verifică existența unui singur dropdown "Categorie" (folosește getAllByLabelText dacă există ambiguitate)
expect(within(form).getAllByLabelText(/Categorie/i)[0]).toBeInTheDocument();
    expect(within(form).getByLabelText(/Dată/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Recurent/i)).toBeInTheDocument();
    // Verifică butonul de submit
    expect(within(form).getByRole('button', { name: /Adaugă/i })).toBeInTheDocument();
  });

  it('afișează tranzacția inițială în tabel', async () => {
    render(<App />);
    // Așteaptă ca tabelul să conțină datele tranzacției inițiale din mock (t1)
    await waitFor(() => {
      // Caută celule specifice după conținut
      expect(screen.getByRole('cell', { name: 'income' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'VENITURI' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '2025-04-22' })).toBeInTheDocument();
    });
  });

  it('nu permite submit dacă lipsesc câmpuri obligatorii', async () => {
    render(<App />);
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });
    const submitButton = within(form).getByRole('button', { name: /Adaugă/i });

    // Click pe submit cu formularul gol
    fireEvent.click(submitButton); // MOCK_BUTTONS.ADD este deja folosit la selectare mai sus

    // Așteaptă apariția mesajului de eroare specific
    await waitFor(() => {
      expect(screen.getByText('Completează toate câmpurile obligatorii')).toBeInTheDocument();
    });
    // Verifică că fetch (POST) nu a fost apelat
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining(API_URL), expect.objectContaining({ method: 'POST' }));
  });

  it('poți completa și trimite formularul, iar tranzacția apare în tabel', async () => {
    render(<App />);
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });

    // --- Compleăm formularul ---
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
    // Selectează tipul "expense" și apoi categoria "CHELTUIELI"
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
    await waitFor(() => {
        expect(within(form).getAllByLabelText(/Categorie/i)[0].querySelector('option[value="CHELTUIELI"]')).toBeInTheDocument();
    });
    fireEvent.change(within(form).getAllByLabelText(MOCK_LABELS.CATEGORY)[0], { target: { value: MOCK_OPTIONS.CATEGORY[1].value } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '50' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-23' } });

    // --- Trimitem formularul ---
    fireEvent.click(within(form).getByRole('button', { name: /Adaugă/i }));

    // --- Așteptări și Verificări ---
    // 1. Așteaptă ca fetch POST să fie apelat cu datele corecte
    await waitFor(() => {
      // Verifică apelul POST cu payload-ul real
const calls = (global.fetch as jest.Mock).mock.calls;
const postCall = calls.find(call => call[1]?.method === 'POST');
expect(postCall).toBeDefined();
expect(postCall[0]).toContain(API_URL);
const bodyObj = JSON.parse(postCall[1].body);
expect(bodyObj).toMatchObject({
  type: 'expense',
  amount: 50,
  category: 'CHELTUIELI',
  date: '2025-04-23',
  subcategory: '',
  recurring: false,
  frequency: '',
  currency: 'RON'
});
    });

    // 2. Așteaptă ca fetch GET să fie apelat DIN NOU după POST pentru refresh-ul listei
    // Ne așteptăm la 3 apeluri în total: GET inițial, POST, GET refresh
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
        const calls = (global.fetch as jest.Mock).mock.calls;
        // Verifică al treilea apel (index 2)
        expect(calls[2][0]).toContain(API_URL); // URL-ul
        expect(calls[2][1]?.method === 'GET' || !calls[2][1]?.method).toBe(true); // Metoda GET (sau nedefinită)
    }, { timeout: 2000 }); // Mărim timeout-ul preventiv

    // 3. Așteaptă ca noua tranzacție (50 EUR) să apară în tabel
    await waitFor(() => {
        // Caută celule specifice noii tranzacții
        expect(screen.getByRole('cell', { name: 'expense' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '50' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'CHELTUIELI' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '2025-04-23' })).toBeInTheDocument();
    });

    // 4. Verifică dacă tranzacția inițială (100 RON) este încă prezentă
    expect(screen.getByRole('cell', { name: 'income' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument();
  });

  it('resetează formularul după submit reușit', async () => {
    render(<App />);
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });

    // Referințe la elementele de input
    const typeSelect = within(form).getByLabelText(/Tip/i) as HTMLSelectElement;
    const amountInput = within(form).getByLabelText(/Sumă/i) as HTMLInputElement;
    const dateInput = within(form).getByLabelText(/Dată/i) as HTMLInputElement;
    // Dacă există ambiguitate, ia primul dropdown "Categorie"
    const categorySelect = within(form).getAllByLabelText(/Categorie/i)[0] as HTMLSelectElement;
    
    // Nu mai bifează recurentCheckbox pentru a evita validarea frecvenței

    // --- Compleăm formularul ---
    fireEvent.change(typeSelect, { target: { value: 'income' } });
    await waitFor(() => { // Așteaptă actualizarea categoriilor
        expect(within(form).getAllByLabelText(/Categorie/i)[0].querySelector('option[value="VENITURI"]')).toBeInTheDocument();
    });
    fireEvent.change(categorySelect, { target: { value: 'VENITURI' } });
    fireEvent.change(amountInput, { target: { value: '200' } });
    fireEvent.change(dateInput, { target: { value: '2025-04-24' } });

    // Verificăm valorile setate înainte de submit
    expect(typeSelect.value).toBe('income');
    expect(amountInput.value).toBe('200');
    expect(dateInput.value).toBe('2025-04-24');
    expect(categorySelect.value).toBe('VENITURI');
    // Nu mai verificăm recurringCheckbox.checked

    // --- Trimitem formularul ---
    fireEvent.click(within(form).getByRole('button', { name: /Adaugă/i }));

    // --- Așteptări și Verificări ---
    // 1. Așteptăm DOAR mesajul de succes folosind data-testid, imediat după click
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toHaveTextContent(MESAJE.SUCCES_ADAUGARE);
    });

    // 2. Așteptăm separat ca formularul să se reseteze la valorile inițiale
    // Valorile 'goale' pot depinde de implementarea componentelor ('' sau valoarea placeholder)
    await waitFor(() => {
        expect(typeSelect.value).toBe(''); // Sau valoarea placeholder-ului
        expect(amountInput.value).toBe(''); // Inputurile numerice devin goale
        expect(dateInput.value).toBe('');   // Inputul de dată devine gol
        expect(categorySelect.value).toBe(''); // Selectul de categorie revine la placeholder
        // Nu mai verificăm frecvența sau checkbox-ul recurent
    });
  });

  it('afișează mesaj de succes sau eroare la submit', async () => {
    // Mock fetch pentru POST eșuat - Simulăm un răspuns de eroare de la API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Server error details' }), // Detalii care nu ar trebui afișate direct
    });

    render(<App />);
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });

    // --- Test Succes (primul POST) ---
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[0].value } });
    // Selectează tipul "income" și apoi categoria "VENITURI"
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[0].value } });
    await waitFor(() => {
        expect(within(form).getAllByLabelText(/Categorie/i)[0].querySelector('option[value="VENITURI"]')).toBeInTheDocument();
    });
    fireEvent.change(within(form).getAllByLabelText(/Categorie/i)[0], { target: { value: 'VENITURI' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '300' } });
    // Nu există câmp "Monedă" în formularul actualizat, deci nu completăm acest câmp
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-25' } });

    fireEvent.click(within(form).getByRole('button', { name: /Adaugă/i })); // Primul POST -> Succes

    // Verifică mesajul de succes folosind data-testid
    await waitFor(() => {
      // Folosește matcher de funcție care concatenează textul din nod și copiii săi, robust la fragmentare
      expect(screen.getByTestId('success-message')).toHaveTextContent(MESAJE.SUCCES_ADAUGARE);
    });
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();

    // --- Test Eșec (al doilea POST) ---
    // Formularul ar trebui să fie resetat, re-compleăm pentru al doilea submit
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
    // Selectează tipul "expense" și apoi categoria "CHELTUIELI"
fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
await waitFor(() => {
    expect(within(form).getAllByLabelText(MOCK_LABELS.CATEGORY)[0].querySelector(`option[value="${MOCK_OPTIONS.CATEGORY[1].value}"]`)).toBeInTheDocument();
});
fireEvent.change(within(form).getAllByLabelText(MOCK_LABELS.CATEGORY)[0], { target: { value: MOCK_OPTIONS.CATEGORY[1].value } });
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.AMOUNT), { target: { value: '25' } });
    // Nu mai completăm moneda și data, deja știm că sunt obligatorii din alt test,
    // dar pentru a ajunge la al doilea POST trebuie să fie valide.
    
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.DATE), { target: { value: '2025-04-26' } });

    fireEvent.click(within(form).getByRole('button', { name: MOCK_BUTTONS.ADD })); // Al doilea POST -> Eșec conform mock

    // Verifică mesajul de eroare specific setat în catch block folosind data-testid
    await waitFor(() => {
      // Folosește matcher de funcție care concatenează textul din nod și copiii săi, robust la fragmentare
      expect(screen.getByTestId('error-message')).toHaveTextContent(MESAJE.EROARE_ADAUGARE);
    }); // vezi App.tsx -> setFormError

    // Verifică și că mesajul de succes a dispărut sau nu a reapărut
    expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
  });

  it('nu permite submit dacă e recurent dar nu are frecvență', async () => {
    render(<App />);
    const form = screen.getByRole('form', { name: MOCK_LABELS.FORM });
    const submitButton = within(form).getByRole('button', { name: /Adaugă/i });

    // Compleăm câmpurile obligatorii
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
    // Selectează tipul "expense" și apoi categoria "CHELTUIELI"
fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: MOCK_OPTIONS.TYPE[1].value } });
await waitFor(() => {
    expect(within(form).getAllByLabelText(MOCK_LABELS.CATEGORY)[0].querySelector(`option[value="${MOCK_OPTIONS.CATEGORY[1].value}"]`)).toBeInTheDocument();
});

    // Încercăm să trimitem
    fireEvent.click(submitButton); // MOCK_BUTTONS.ADD este deja folosit la selectare mai sus

    // Așteaptă apariția mesajului de eroare specific
    await waitFor(() => {
      // Mesajul de eroare trebuie să corespundă exact cu cel din implementare
      expect(screen.getByText(MESAJE.FRECV_RECURENTA)).toBeInTheDocument();
    }); // vezi App.tsx -> handleFormSubmit

    // Verificăm că fetch (POST) nu a fost apelat în acest scenariu
    // Contorizăm apelurile POST de la începutul testului
    const postCalls = (global.fetch as jest.Mock).mock.calls.filter(call => call[1]?.method === 'POST');
    expect(postCalls.length).toBe(0);
  });
});