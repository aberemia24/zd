import { http, HttpResponse } from 'msw';
import { MESSAGES } from '@shared-constants';

/**
 * Mock transaction data for testing
 */
const mockTransactions = [
  {
    id: 'mock-transaction-1',
    amount: 100.50,
    description: 'Test transaction 1',
    category: 'food',
    date: '2025-05-26',
    type: 'expense',
    user_id: 'mock-user-id'
  },
  {
    id: 'mock-transaction-2', 
    amount: 250.00,
    description: 'Test transaction 2',
    category: 'transport',
    date: '2025-05-25',
    type: 'expense',
    user_id: 'mock-user-id'
  }
];

/**
 * Mock categories data
 */
const mockCategories = [
  { id: 'cat-1', name: 'food', color: '#FF6B6B', icon: 'utensils' },
  { id: 'cat-2', name: 'transport', color: '#4ECDC4', icon: 'car' },
  { id: 'cat-3', name: 'entertainment', color: '#45B7D1', icon: 'film' }
];

/**
 * MSW handlers for Supabase API endpoints
 * Provides realistic mock responses for integration testing
 */
export const handlers = [
  // Transactions endpoints
  http.get('/rest/v1/transactions', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');
    
    return HttpResponse.json(mockTransactions, {
      headers: {
        'Content-Range': `0-${mockTransactions.length - 1}/${mockTransactions.length}`,
      },
    });
  }),

  http.post('/rest/v1/transactions', async ({ request }) => {
    const transaction = await request.json() as any;
    const newTransaction = {
      ...transaction,
      id: `mock-id-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(newTransaction, { status: 201 });
  }),

  http.patch('/rest/v1/transactions', async ({ request }) => {
    const updates = await request.json() as any;
    const updatedTransaction = {
      ...mockTransactions[0],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(updatedTransaction);
  }),

  http.delete('/rest/v1/transactions', () => {
    return HttpResponse.json({}, { status: 204 });
  }),

  // Categories endpoints
  http.get('/rest/v1/categories', () => {
    return HttpResponse.json(mockCategories);
  }),

  // Auth endpoints
  http.post('/auth/v1/token', async ({ request }) => {
    const credentials = await request.json() as any;
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
          email_confirmed_at: new Date().toISOString(),
        },
      });
    }
    
    return HttpResponse.json(
      { error: MESSAGES.ERRORS.INVALID_CREDENTIALS },
      { status: 400 }
    );
  }),

  http.get('/auth/v1/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader?.includes('mock-access-token')) {
      return HttpResponse.json({
        id: 'mock-user-id',
        email: 'test@example.com',
        email_confirmed_at: new Date().toISOString(),
      });
    }
    
    return HttpResponse.json(
      { error: MESSAGES.ERRORS.UNAUTHORIZED },
      { status: 401 }
    );
  }),

  http.post('/auth/v1/logout', () => {
    return HttpResponse.json({}, { status: 204 });
  }),

  // Error simulation handlers for testing error states
  http.get('/rest/v1/transactions-error', () => {
    return HttpResponse.json(
      { error: MESSAGES.ERRORS.NETWORK_ERROR },
      { status: 500 }
    );
  }),
];

/**
 * Handlers for specific error scenarios
 * Use these to test error handling in components
 */
export const errorHandlers = [
  http.get('/rest/v1/transactions', () => {
    return HttpResponse.json(
      { error: MESSAGES.ERRORS.NETWORK_ERROR },
      { status: 500 }
    );
  }),
  
  http.post('/rest/v1/transactions', () => {
    return HttpResponse.json(
      { error: MESSAGES.ERRORS.VALIDATION_FAILED },
      { status: 400 }
    );
  }),
]; 