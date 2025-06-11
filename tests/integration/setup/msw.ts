import { setupServer } from 'msw/node';
import { handlers } from './mockHandlers';

/**
 * MSW server setup for Node.js environment (Vitest)
 * Intercepts HTTP requests during testing and provides mock responses
 */
export const server = setupServer(...handlers);

/**
 * Setup MSW server for testing environment
 * Call this in your test setup files
 */
export const setupMSW = () => {
  // Start server before all tests
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn', // Warn about unhandled requests
    });
  });

  // Reset handlers after each test to ensure test isolation
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests
  afterAll(() => {
    server.close();
  });
};

/**
 * Utility to override handlers for specific tests
 * Useful for testing error scenarios
 * 
 * @param newHandlers - Array of MSW handlers to use
 */
export const overrideHandlers = (newHandlers: any[]) => {
  server.use(...newHandlers);
}; 