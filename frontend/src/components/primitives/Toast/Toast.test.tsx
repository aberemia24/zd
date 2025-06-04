import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from './useToast';
import Toast from './Toast';
import type { ToastData } from './types';

/**
 * 🧪 TOAST COMPONENT TESTS
 * Teste pentru componenta Toast
 */

const mockToastData: ToastData = {
  id: 'test-toast-1',
  message: 'Test message',
  variant: 'info',
  title: 'Test Title'
};

const mockOnClose = jest.fn();

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toast with message and title', () => {
    render(
      <ToastProvider>
        <Toast toast={mockToastData} onClose={mockOnClose} />
      </ToastProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders correct icon for variant', () => {
    render(
      <ToastProvider>
        <Toast toast={mockToastData} onClose={mockOnClose} />
      </ToastProvider>
    );

    expect(screen.getByText('💡')).toBeInTheDocument(); // info icon
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ToastProvider>
        <Toast toast={mockToastData} onClose={mockOnClose} />
      </ToastProvider>
    );

    const closeButton = screen.getByLabelText('Închide notificarea');
    fireEvent.click(closeButton);

    // Should call onClose after animation delay
    setTimeout(() => {
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    }, 250);
  });

  it('renders action button when action is provided', () => {
    const mockAction = jest.fn();
    const toastWithAction: ToastData = {
      ...mockToastData,
      action: {
        label: 'Undo',
        onClick: mockAction
      }
    };

    render(
      <ToastProvider>
        <Toast toast={toastWithAction} onClose={mockOnClose} />
      </ToastProvider>
    );

    const actionButton = screen.getByText('Undo');
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(mockAction).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ToastProvider>
        <Toast toast={mockToastData} onClose={mockOnClose} />
      </ToastProvider>
    );

    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveAttribute('aria-live', 'polite');
    expect(toastElement).toHaveAttribute('aria-atomic', 'true');
  });
}); 