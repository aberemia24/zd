import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UI, MESSAGES } from '@shared-constants';

/**
 * Creates a test-specific QueryClient with optimized settings for testing
 * - Disables retries to prevent flaky tests
 * - Reduces cache time for predictable test behavior
 */
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: { 
      retry: false,
    },
  },
});

/**
 * Enhanced TestProviders component that wraps components with necessary providers
 * for integration testing including React Query and MSW context
 */
export const TestProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * Custom render function that automatically wraps components with TestProviders
 * Use this instead of @testing-library/react render for integration tests
 * 
 * @param ui - React element to render
 * @param options - Additional render options
 * @returns Render result with providers
 */
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, { 
    wrapper: TestProviders,
    ...options 
  });
};

/**
 * Utility to wait for React Query to settle
 * Useful for ensuring all async operations complete before assertions
 */
export const waitForQueryToSettle = async (queryClient: QueryClient) => {
  await queryClient.getQueryCache().clear();
  await new Promise(resolve => setTimeout(resolve, 0));
}; 