import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

describe('Tranzacții și venituri recurente', () => {
  // Reset mocks before each test
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) }));
  });

  it('formularul permite setarea unei tranzacții ca recurentă cu frecvență', () => {
    render(<App />);
    expect(screen.getByLabelText(/Recurent/i)).toBeInTheDocument();
    // Inițial, selectul de frecvență e dezactivat
    expect(screen.getByLabelText(/Frecvență/i)).toBeDisabled();
    // Bifează recurent
    fireEvent.click(screen.getByLabelText(/Recurent/i));
    expect(screen.getByLabelText(/Frecvență/i)).not.toBeDisabled();
  });

  it('nu permite submit dacă e recurent dar nu are frecvență', async () => {
    render(<App />);
    // Completează câmpurile obligatorii (folosind within pentru a evita ambiguitatea)
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'expense' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '10' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'EUR' } });
    fireEvent.change(within(form).getByLabelText(/Categorie/i), { target: { value: 'test' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-01-01' } });

    // Bifează recurent
    fireEvent.click(within(form).getByLabelText(/Recurent/i));

    // Lăsăm frecvența neselectată
    fireEvent.click(within(form).getByText(/Adaugă/i));

    // Așteaptă apariția mesajului de eroare
    await waitFor(() => {
      expect(screen.getByText(/Selectează frecvența pentru tranzacție recurentă/i)).toBeInTheDocument();
    });
  });

  it('poți adăuga o tranzacție recurentă și apare marcată în tabel', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })) // Initial GET
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })) // POST
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [
        { id: '2', userId: 'u1', type: 'expense', amount: 50, currency: 'RON', date: '2025-04-23', category: 'abonament', subcategory: 'netflix', recurring: true, frequency: 'lunar' }
      ], total: 1, limit: 10, offset: 0 }) })); // GET after add
    render(<App />);

    const form = screen.getByRole('form'); // Obține elementul form

    // Completează formularul folosind within(form)
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'expense' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '50' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText(/Categorie/i), { target: { value: 'abonament' } });
    fireEvent.change(within(form).getByLabelText(/Subcategorie/i), { target: { value: 'netflix' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-23' } });
    fireEvent.click(within(form).getByLabelText(/Recurent/i)); // Bifează recurent
    fireEvent.change(within(form).getByLabelText(/Frecvență/i), { target: { value: 'lunar' } }); // Selectează frecvența

    // Trimite formularul
    fireEvent.click(within(form).getByText(/Adaugă/i));

    // Verifică dacă tranzacția apare în tabel cu marcajul de recurență
    await waitFor(() => {
      expect(screen.getByText('abonament')).toBeInTheDocument();
      expect(screen.getByText('Da (lunar)')).toBeInTheDocument(); // Verifică textul specific pentru recurență
    });
  });

  it('poți adăuga un venit recurent și apare marcat în tabel', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })) // Initial GET
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })) // POST
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [
        { id: '3', userId: 'u1', type: 'income', amount: 200, currency: 'RON', date: '2025-04-24', category: 'salariu', subcategory: 'principal', recurring: true, frequency: 'lunar' }
      ], total: 1, limit: 10, offset: 0 }) })); // GET after add
    render(<App />);

    const form = screen.getByRole('form'); // Obține elementul form

    // Completează formularul
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'income' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '200' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText(/Categorie/i), { target: { value: 'salariu' } });
    fireEvent.change(within(form).getByLabelText(/Subcategorie/i), { target: { value: 'principal' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-24' } });
    fireEvent.click(within(form).getByLabelText(/Recurent/i));
    fireEvent.change(within(form).getByLabelText(/Frecvență/i), { target: { value: 'lunar' } });

    // Trimite formularul
    fireEvent.click(within(form).getByText(/Adaugă/i));

    // Verifică dacă venitul apare în tabel cu marcajul corect
    await waitFor(() => {
      expect(screen.getByText('salariu')).toBeInTheDocument();
      expect(screen.getByText('Da (lunar)')).toBeInTheDocument();
    });
  });
});
