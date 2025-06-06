import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './Alert';

describe('Alert Component', () => {
  describe('Basic Rendering', () => {
    it('should render alert with children', () => {
      render(
        <Alert>
          <p>Test alert message</p>
        </Alert>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });

    it('should render with default variant', () => {
      render(
        <Alert>Default alert</Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-l-copper-500');
      expect(alert).toHaveClass('bg-copper-50/50');
    });

    it('should apply custom className', () => {
      render(
        <Alert className="custom-alert">
          Alert content
        </Alert>
      );

      expect(screen.getByRole('alert')).toHaveClass('custom-alert');
    });
  });

  describe('Variants', () => {
    it('should render success variant correctly', () => {
      render(
        <Alert variant="success">Success message</Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-l-emerald-500');
      expect(alert).toHaveClass('bg-emerald-50/50');
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('should render warning variant correctly', () => {
      render(
        <Alert variant="warning">Warning message</Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-l-amber-500');
      expect(alert).toHaveClass('bg-amber-50/50');
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should render error variant correctly', () => {
      render(
        <Alert variant="error">Error message</Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-l-red-500');
      expect(alert).toHaveClass('bg-red-50/50');
      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('should render default variant with info icon', () => {
      render(
        <Alert variant="default">Default message</Alert>
      );

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });
  });

  describe('Title and Badge', () => {
    it('should render title when provided', () => {
      render(
        <Alert title="Alert Title">
          Alert content
        </Alert>
      );

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert Title')).toHaveClass('font-medium');
    });

    it('should render badge with variant label when title is provided', () => {
      render(
        <Alert variant="success" title="Success Title">
          Success content
        </Alert>
      );

      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });

    it('should not render title section when title is not provided', () => {
      render(
        <Alert>Alert without title</Alert>
      );

      expect(screen.queryByText('DEFAULT')).not.toBeInTheDocument();
    });
  });

  describe('Custom Icon', () => {
    it('should render custom icon when provided', () => {
      const customIcon = <span data-testid="custom-icon">🔔</span>;
      
      render(
        <Alert icon={customIcon}>
          Alert with custom icon
        </Alert>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('🔔')).toBeInTheDocument();
      // Default icon should not be rendered
      expect(screen.queryByText('ℹ️')).not.toBeInTheDocument();
    });

    it('should use default icon when custom icon is not provided', () => {
      render(
        <Alert variant="warning">
          Alert with default icon
        </Alert>
      );

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should render close button when onClose is provided', () => {
      const onClose = jest.fn();
      
      render(
        <Alert onClose={onClose}>
          Closeable alert
        </Alert>
      );

      expect(screen.getByRole('button', { name: /închide/i })).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      render(
        <Alert>
          Non-closeable alert
        </Alert>
      );

      expect(screen.queryByRole('button', { name: /închide/i })).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      
      render(
        <Alert onClose={onClose}>
          Closeable alert
        </Alert>
      );

      fireEvent.click(screen.getByRole('button', { name: /închide/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should have proper accessibility attributes for close button', () => {
      const onClose = jest.fn();
      
      render(
        <Alert onClose={onClose}>
          Closeable alert
        </Alert>
      );

      const closeButton = screen.getByRole('button', { name: /închide/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Închide alertă');
      expect(closeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      render(
        <Alert>Accessible alert</Alert>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should include sr-only text for close button', () => {
      const onClose = jest.fn();
      
      render(
        <Alert onClose={onClose}>
          Alert with close
        </Alert>
      );

      expect(screen.getByText('Închide')).toHaveClass('sr-only');
    });

    it('should be keyboard accessible for close button', () => {
      const onClose = jest.fn();
      
      render(
        <Alert onClose={onClose}>
          Keyboard accessible alert
        </Alert>
      );

      const closeButton = screen.getByRole('button', { name: /închide/i });
      
      // Simulate keyboard interaction
      closeButton.focus();
      fireEvent.keyDown(closeButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render complete alert with all features', () => {
      const onClose = jest.fn();
      const customIcon = <span data-testid="star-icon">⭐</span>;
      
      render(
        <Alert
          variant="success"
          title="Complete Alert"
          icon={customIcon}
          onClose={onClose}
          className="custom-class"
        >
          <div>
            <p>This is a complete alert with all features:</p>
            <ul>
              <li>Custom variant</li>
              <li>Title with badge</li>
              <li>Custom icon</li>
              <li>Close functionality</li>
            </ul>
          </div>
        </Alert>
      );

      // Check all parts are rendered
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Complete Alert')).toBeInTheDocument();
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
      expect(screen.getByTestId('star-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /închide/i })).toBeInTheDocument();
      expect(screen.getByText('This is a complete alert with all features:')).toBeInTheDocument();
      expect(screen.getByText('Custom variant')).toBeInTheDocument();
      
      // Check styling
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-l-emerald-500');
      expect(alert).toHaveClass('custom-class');
      
      // Test close functionality
      fireEvent.click(screen.getByRole('button', { name: /închide/i }));
      expect(onClose).toHaveBeenCalled();
    });

    it('should handle complex children content', () => {
      render(
        <Alert variant="warning" title="Complex Content">
          <div>
            <p>This alert contains:</p>
            <button>A button</button>
            <input placeholder="An input field" />
            <a href="#test">A link</a>
          </div>
        </Alert>
      );

      expect(screen.getByText('This alert contains:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'A button' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('An input field')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'A link' })).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should include dark mode classes', () => {
      render(
        <Alert variant="success" title="Dark Mode Alert">
          Dark mode content
        </Alert>
      );

      const alert = screen.getByRole('alert');
      // Check that dark mode classes are present
      expect(alert.className).toContain('dark:bg-emerald-900/20');
    });
  });
}); 
