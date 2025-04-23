// IMPORTANT: Always scope queries to the form using within(form) and reset global.fetch in each test to avoid ambiguity and side effects.
import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: async () => ({ data: [], total: 0, limit: 10, offset: 0 })
    }));
  });
  it('renderizează titlul aplicației', () => {
    render(<App />);
    expect(screen.getByText(/Tranzacții/i)).toBeInTheDocument();
  });

  it('afișează formularul de adăugare tranzacție cu toate inputurile', () => {
    render(<App />);
    const form = screen.getByRole('form');
    expect(within(form).getByLabelText(/Tip/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Sumă/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Monedă/i)).toBeInTheDocument();
    expect(within(form).getByLabelText('Categorie', { exact: true })).toBeInTheDocument();
    expect(within(form).getByLabelText('Subcategorie', { exact: true })).toBeInTheDocument();
    expect(within(form).getByLabelText(/Dată/i)).toBeInTheDocument();
  });

  it('nu permite submit dacă lipsesc câmpuri obligatorii', async () => {
    render(<App />);
    const submitBtn = screen.getByText(/Adaugă/i);
    submitBtn.click();
    await waitFor(() => {
      expect(screen.getByText((text) => text.includes('Completează toate câmpurile obligatorii'))).toBeInTheDocument();
    });
  });
  // NOTE: If this test fails due to 'Categorie' ambiguity, check if the filter bar input is inside the form or if both have the same aria-label. Only the form input should have aria-label='Categorie'!

  it('poți completa și trimite formularul, iar tranzacția apare în tabel', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })) // POST
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [
        { id: '1', userId: 'u1', type: 'income', amount: 100, currency: 'RON', date: '2025-04-22', category: 'salariu', subcategory: 'bonus' }
      ], total: 1, limit: 10, offset: 0 }) })); // GET
    render(<App />);
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'income' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '100' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText('Categorie', { exact: true }), { target: { value: 'salariu' } });
    fireEvent.change(within(form).getByLabelText('Subcategorie', { exact: true }), { target: { value: 'bonus' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-22' } });
    screen.getByText(/Adaugă/i).click();
    expect(await screen.findByText('100')).toBeInTheDocument();
  });

  it('resetează formularul după submit reușit', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })) // POST
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })); // GET
    render(<App />);
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'income' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '100' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText('Categorie', { exact: true }), { target: { value: 'salariu' } });
    fireEvent.change(within(form).getByLabelText('Subcategorie', { exact: true }), { target: { value: 'bonus' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-22' } });
    screen.getByText(/Adaugă/i).click();
    await waitFor(() => {
      expect(within(form).getByLabelText(/Sumă/i)).toHaveValue('');
    });
  });

  it('afișează mesaj de succes sau eroare la submit', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })) // POST
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], total: 0, limit: 10, offset: 0 }) })); // GET
    render(<App />);
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'income' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '100' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText('Categorie', { exact: true }), { target: { value: 'salariu' } });
    fireEvent.change(within(form).getByLabelText('Subcategorie', { exact: true }), { target: { value: 'bonus' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-04-22' } });
    screen.getByText(/Adaugă/i).click();
    await waitFor(() => {
      expect(screen.getByText(/Tranzacție adăugată cu succes/i)).toBeInTheDocument();
    });
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: false, json: async () => ({}) }));
    screen.getByText(/Adaugă/i).click();
    await waitFor(() => {
      expect(screen.getByText(/Eroare la adăugare/i)).toBeInTheDocument();
    });
  });

  it('nu permite submit dacă e recurent dar nu are frecvență', async () => {
    render(<App />);
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'expense' } });
    fireEvent.change(within(form).getByLabelText(/Sumă/i), { target: { value: '10' } });
    fireEvent.change(within(form).getByLabelText(/Monedă/i), { target: { value: 'RON' } });
    fireEvent.change(within(form).getByLabelText('Categorie', { exact: true }), { target: { value: 'test' } });
    fireEvent.change(within(form).getByLabelText(/Dată/i), { target: { value: '2025-01-01' } });
    // Bifează recurent
    fireEvent.click(within(form).getByLabelText(/Recurent/i));
    // Nu selectează frecvență
    fireEvent.click(within(form).getByText(/Adaugă/i));
    await waitFor(() => {
      expect(screen.getByText(/Selectează frecvența pentru tranzacție recurentă/i)).toBeInTheDocument();
    });
  });
});
