/**
 * Mock pentru authStore folosit în teste
 * OWNER: echipa API/auth
 */

// Mock persistent pentru store
const mockState = {
  user: { id: 'mock-test-user-id', email: 'test@example.com' },
  loading: false,
  error: null,
  errorType: undefined,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  checkUser: jest.fn(),
};

// Exportăm un mock pentru useAuthStore hook
export const useAuthStore = jest.fn().mockImplementation((selector?: any) => {
  // Când e apelat fără selector, returnează starea direct (cum face în componenta reală)
  if (!selector) {
    return mockState;
  }
  if (typeof selector === 'function') {
    return selector(mockState);
  }
  return mockState;
}) as jest.Mock & { getState: jest.Mock };

// Necesar pentru mockGetState în Zustand
useAuthStore.getState = jest.fn().mockReturnValue(mockState);

// Funcție pentru a actualiza starea mockului în teste
export const setMockAuthState = (newState: Partial<typeof mockState>) => {
  Object.assign(mockState, newState);
  return mockState;
};

// Este util pentru componentele care ar putea folosi anume aceste funcții
export const login = jest.fn();
export const register = jest.fn();
export const logout = jest.fn();
export const checkUser = jest.fn();
