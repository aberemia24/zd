import { useTransactionFormStore } from './transactionFormStore';
import { INITIAL_FORM_STATE, MESAJE, FORM_DEFAULTS } from 'shared-constants';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
import type { TransactionFormWithNumberAmount } from '../types/transaction';

describe('transactionFormStore Zustand', () => {
  let store: ReturnType<typeof useTransactionFormStore.getState>;
  let onSubmitMock: jest.Mock;

  beforeEach(() => {
    // Resetăm store-ul global înainte de fiecare test
    const zustandStore = useTransactionFormStore;
    // Resetăm complet state-ul store-ului
    zustandStore.setState({
      form: { ...INITIAL_FORM_STATE },
      error: '',
      success: '',
      loading: false
    });
    store = zustandStore.getState();
    onSubmitMock = jest.fn();
  });

  it('inițializează corect starea cu valorile default', () => {
    expect(store.getForm()).toEqual(INITIAL_FORM_STATE);
    expect(store.getError()).toBe('');
    expect(store.getSuccess()).toBe('');
    expect(store.getLoading()).toBe(false);
  });

  it('setează corect un câmp individual', () => {
    store.setField('amount', '123');
    expect(store.getForm().amount).toBe('123');
  });

  it('setează toate valorile formularului', () => {
    const newForm: TransactionFormData = { ...INITIAL_FORM_STATE, amount: '999', category: 'food' };
    store.setForm(newForm);
    expect(store.getForm()).toEqual(newForm);
  });

  it('setează și resetează eroarea/succesul/loading', () => {
    store.setError('err');
    expect(store.getError()).toBe('err');
    store.setSuccess('ok');
    expect(store.getSuccess()).toBe('ok');
    store.setLoading(true);
    expect(store.getLoading()).toBe(true);
  });

  it('resetează formularul la valorile inițiale', () => {
    store.setField('amount', '123');
    store.setError('err');
    store.setSuccess('ok');
    store.resetForm();
    expect(store.getForm()).toEqual(INITIAL_FORM_STATE);
    expect(store.getError()).toBe('');
    expect(store.getSuccess()).toBe('');
  });

  describe('validare', () => {
    it('returnează true pentru date valide', () => {
      store.setForm({ ...INITIAL_FORM_STATE, type: 'expense', amount: '100', category: 'food', date: '2025-04-25' });
      expect(store.validateForm()).toBe(true);
      expect(store.getError()).toBe('');
    });
    it('returnează false și setează eroare pentru lipsă câmpuri obligatorii', () => {
      store.setForm({ ...INITIAL_FORM_STATE, type: '', amount: '', category: '', date: '' });
      expect(store.validateForm()).toBe(false);
      expect(store.getError()).toBe(MESAJE.CAMPURI_OBLIGATORII);
    });
    it('returnează false și setează eroare pentru recurring fără frequency', () => {
      store.setForm({ ...INITIAL_FORM_STATE, type: 'expense', amount: '10', category: 'food', date: '2025-04-25', recurring: true, frequency: '' });
      expect(store.validateForm()).toBe(false);
      expect(store.getError()).toBe(MESAJE.FRECV_RECURENTA);
    });
  });

  describe('submit', () => {
    it('apelează serviciul și setează succes pentru date valide', async () => {
      const mockService = { saveTransaction: jest.fn().mockResolvedValue({}) };
      store.setTransactionService(mockService as any);
      store.setForm({ ...INITIAL_FORM_STATE, type: 'expense', amount: '100', category: 'food', date: '2025-04-25' });
      await store.handleSubmit();
      expect(mockService.saveTransaction).toHaveBeenCalledWith({
        ...store.getForm(), amount: 100, currency: FORM_DEFAULTS.CURRENCY
      });
      expect(store.getSuccess()).toBe(MESAJE.SUCCES_ADAUGARE);
      expect(store.getLoading()).toBe(false);
    });
    it('setează eroare pentru date invalide', async () => {
      store.setForm({ ...INITIAL_FORM_STATE, type: '', amount: '', category: '', date: '' });
      await store.handleSubmit();
      expect(store.getError()).toBe(MESAJE.CAMPURI_OBLIGATORII);
      expect(store.getLoading()).toBe(false);
    });
    it('setează eroare dacă serviciul aruncă excepție', async () => {
      const mockService = { saveTransaction: jest.fn().mockRejectedValue(new Error('fail')) };
      store.setTransactionService(mockService as any);
      store.setForm({ ...INITIAL_FORM_STATE, type: 'expense', amount: '100', category: 'food', date: '2025-04-25' });
      await store.handleSubmit();
      expect(store.getError()).toBe(MESAJE.EROARE_ADAUGARE);
      expect(store.getLoading()).toBe(false);
    });
  });

  it('poate reseta formularul chiar dacă loading este true', () => {
    store.setLoading(true);
    store.setField('amount', '123');
    store.resetForm();
    expect(store.getForm()).toEqual(INITIAL_FORM_STATE);
    expect(store.getLoading()).toBe(true); // resetForm nu afectează loading
  });
});
