import { useTransactionFormStore } from './transactionFormStore';
import { INITIAL_FORM_STATE, FORM_DEFAULTS } from '@shared-constants';
import { MESAJE } from '@shared-constants/messages'; // Import corect pentru mesaje
import { TransactionType } from '@shared-constants/enums'; // Import corect pentru enum-uri

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
      // ARRANGE - form cu date valide
      store.setForm({ 
        ...INITIAL_FORM_STATE, 
        type: TransactionType.EXPENSE, 
        amount: '100', 
        category: 'food', 
        date: '2025-04-25' 
      });
      
      // ACT & ASSERT
      expect(store.validateForm()).toBe(true);
      expect(store.getError()).toBe('');
    });
    
    it('returnează false și setează eroare pentru lipsă câmpuri obligatorii', () => {
      // ARRANGE - form cu câmpuri obligatorii lipsă
      store.setForm({ ...INITIAL_FORM_STATE, type: '', amount: '', category: '', date: '' });
      
      // ACT
      const rezultat = store.validateForm();
      
      // ASSERT - verificăm rezultatul și mesajul exact din constante
      expect(rezultat).toBe(false);
      expect(store.getError()).toBe(MESAJE.CAMPURI_OBLIGATORII);
    });
    
    it('returnează false și setează eroare pentru recurring fără frequency', () => {
      // ARRANGE - form cu recurring=true dar fără frequency
      store.setForm({ 
        ...INITIAL_FORM_STATE, 
        type: TransactionType.EXPENSE, 
        amount: '10', 
        category: 'food', 
        date: '2025-04-25', 
        recurring: true, 
        frequency: '' 
      });
      
      // ACT
      const rezultat = store.validateForm();
      
      // ASSERT - verificăm rezultatul și mesajul exact din constante
      expect(rezultat).toBe(false);
      expect(store.getError()).toBe(MESAJE.FRECV_RECURENTA);
    });
  });

  describe('submit', () => {
    // Mock pentru supabaseService
    jest.mock('../services/supabaseService', () => ({
      supabaseService: {
        createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
        updateTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
      }
    }));
    
    it('setează eroare pentru date invalide', async () => {
      // ARRANGE - date invalide în formular
      store.setForm({ ...INITIAL_FORM_STATE, type: '', amount: '', category: '', date: '' });
      
      // ACT - încercare submit
      await store.handleSubmit();
      
      // ASSERT - verificare mesaj exact din constante
      expect(store.getError()).toBe(MESAJE.CAMPURI_OBLIGATORII);
      expect(store.getLoading()).toBe(false);
    });
    // Test adaptat pentru a folosi jest.spyOn pentru mock-uirea supabaseService
    it('setează eroare corectă dacă serviciul aruncă excepție', async () => {
      // Import dinamic pentru a putea spiona serviciul
      const { supabaseService } = await import('../services/supabaseService');
      
      // ARRANGE - mock pentru supabaseService.createTransaction care aruncă excepție
      // Folosim jest.spyOn conform memoriei 'ae29d291-b6dc-4706-b226-aa6e6221a7ae'
      const createTransactionSpy = jest.spyOn(supabaseService, 'createTransaction')
        .mockRejectedValue(new Error('Test error'));  

      // Pregătim form cu date valide
      store.setForm({ 
        ...INITIAL_FORM_STATE, 
        type: TransactionType.EXPENSE, 
        amount: '100', 
        category: 'food', 
        date: '2025-04-25' 
      });
      
      // ACT - încercare submit care va eșua din cauza mock-ului
      await store.handleSubmit();
      
      // ASSERT - verificăm că s-a setat mesajul corect de eroare
      expect(store.getError()).toBe(MESAJE.EROARE_ADAUGARE);
      expect(store.getLoading()).toBe(false);
      
      // Restaurăm implementarea originală
      createTransactionSpy.mockRestore();
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
