/**
 * Utilități simplificate pentru testare 
 * OWNER: echipa testare
 * 
 * Abordare minimalistă pentru setup și cleanup în teste.
 */

import { API } from '@shared-constants/api';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';

// Mock pentru fetch folosit în teste
export const mockApiResponse = (data: any, error = null) => ({
  data,
  error
});

// Mockuiește global fetch-ul pentru teste
export const mockFetch = (response: any = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(response)
  });
  return global.fetch;
};

// Resetează store-urile după teste (abordare sigură)
export const resetZustandStores = () => {
  try {
    // Verificăm existența fiecărui store și a metodelor de reset
    try {
      const { useAuthStore } = require('./stores/authStore');
      const authState = useAuthStore.getState();
      if (authState && typeof authState.reset === 'function') {
        authState.reset();
      }
    } catch (e) {
      console.warn('Nu s-a putut reseta authStore', e);
    }
    
    try {
      const { useTransactionStore } = require('./stores/transactionStore');
      const txState = useTransactionStore.getState();
      if (txState && typeof txState.reset === 'function') {
        txState.reset();
      }
    } catch (e) {
      console.warn('Nu s-a putut reseta transactionStore', e);
    }
    
    try {
      const { useTransactionFormStore } = require('./stores/transactionFormStore');
      const formState = useTransactionFormStore.getState();
      if (formState && typeof formState.resetForm === 'function') {
        formState.resetForm();
      }
    } catch (e) {
      console.warn('Nu s-a putut reseta transactionFormStore', e);
    }
  } catch (e) {
    console.warn('Eroare la resetarea store-urilor', e);
  }
};

// Custom render care adaugă provideri dacă sunt necesari
export function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

// Re-export tot din RTL
export * from '@testing-library/react';
export { customRender as render };
