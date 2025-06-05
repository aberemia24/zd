import type { Meta, StoryObj } from '@storybook/react';
import Toast from './Toast';
import { useToast } from './useToast';
import ToastContainer from './ToastContainer';
import type { ToastData } from './types';

/**
 * 🎨 Toast Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Toast> = {
  title: 'CVA-v2/Primitives/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Toast component pentru notificări temporare cu variante multiple și acțiuni interactive, construit cu CVA-v2 system.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    toast: {
      control: 'object',
      description: 'Datele toast-ului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock toast data pentru demonstrații
const createMockToast = (variant: 'info' | 'success' | 'warning' | 'error', overrides?: Partial<ToastData>): ToastData => ({
  id: `toast-${Date.now()}-${Math.random()}`,
  variant,
  message: `This is a ${variant} toast message`,
  title: variant.charAt(0).toUpperCase() + variant.slice(1),
  ...overrides
});

/**
 * Default Toast Story
 */
export const Default: Story = {
  args: {
    toast: createMockToast('info'),
    onClose: (id) => console.log('Toast closed:', id)
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        toast={createMockToast('info', { 
          message: 'This is an informational message with helpful details.' 
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('success', { 
          message: 'Operation completed successfully!' 
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('warning', { 
          message: 'Please review this action before proceeding.' 
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('error', { 
          message: 'An error occurred. Please try again.' 
        })}
        onClose={() => {}}
      />
    </div>
  )
};

/**
 * Toast cu și fără titlu
 */
export const WithAndWithoutTitle: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        toast={createMockToast('success', {
          title: 'Success!',
          message: 'Your transaction has been saved successfully.'
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('info', {
          title: undefined,
          message: 'Simple toast without title for quick notifications.'
        })}
        onClose={() => {}}
      />
    </div>
  )
};

/**
 * Toast cu acțiuni interactive
 */
export const WithActions: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        toast={createMockToast('info', {
          title: 'Update Available',
          message: 'A new version of the app is available.',
          action: {
            label: 'Update Now',
            onClick: () => alert('Redirecting to update...')
          }
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('warning', {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes that will be lost.',
          action: {
            label: 'Save Changes',
            onClick: () => alert('Saving changes...')
          }
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('error', {
          title: 'Connection Failed',
          message: 'Unable to connect to the server.',
          action: {
            label: 'Retry',
            onClick: () => alert('Retrying connection...')
          }
        })}
        onClose={() => {}}
      />
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        toast={createMockToast('success', {
          title: 'Transaction Added',
          message: 'Your expense of 45.50 RON has been recorded.',
          action: {
            label: 'View Details',
            onClick: () => alert('Opening transaction details...')
          }
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('warning', {
          title: 'Budget Alert',
          message: 'You have spent 80% of your monthly food budget.',
          action: {
            label: 'View Budget',
            onClick: () => alert('Opening budget overview...')
          }
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('info', {
          title: 'Export Ready',
          message: 'Your transaction export (150 entries) is ready for download.',
          action: {
            label: 'Download',
            onClick: () => alert('Starting download...')
          }
        })}
        onClose={() => {}}
      />
      
      <Toast
        toast={createMockToast('error', {
          title: 'Sync Failed',
          message: 'Unable to sync transactions with your bank account.',
          action: {
            label: 'Retry Sync',
            onClick: () => alert('Retrying sync...')
          }
        })}
        onClose={() => {}}
      />
    </div>
  )
};

/**
 * Interactive Toast System Demo
 */
export const InteractiveToastSystem: Story = {
  render: () => {
    const ToastDemo = () => {
      const { toast, toasts, dismiss, dismissAll } = useToast();
      
      const showToast = (variant: 'info' | 'success' | 'warning' | 'error') => {
        const messages = {
          info: 'Here is some useful information',
          success: 'Operation completed successfully!',
          warning: 'Please check this carefully',
          error: 'Something went wrong'
        };
        
        toast[variant](messages[variant], {
          title: variant.charAt(0).toUpperCase() + variant.slice(1),
          action: variant === 'error' ? {
            label: 'Retry',
            onClick: () => alert('Retrying...')
          } : undefined
        });
      };
      
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => showToast('info')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Show Info
            </button>
            <button
              onClick={() => showToast('success')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Show Success
            </button>
            <button
              onClick={() => showToast('warning')}
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Show Warning
            </button>
            <button
              onClick={() => showToast('error')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Show Error
            </button>
            <button
              onClick={dismissAll}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear All ({toasts.length})
            </button>
          </div>
          
                     <ToastContainer children={null} />
        </div>
      );
    };
    
    return <ToastDemo />;
  }
}; 