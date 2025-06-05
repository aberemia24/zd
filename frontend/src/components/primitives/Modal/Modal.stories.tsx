import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AlertTriangle, CreditCard, DollarSign, Save, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'CVA-v2/Primitives/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'CVA-v2 Modal component cu Portal rendering, focus management, accessibility compliance, keyboard navigation și animations pentru aplicații financiare.'
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Size of the modal window'
    },
    variant: {
      control: 'select',
      options: ['default', 'overlay', 'centered'],
      description: 'Visual style and positioning'
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Allow closing modal by clicking backdrop'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allow closing modal with Escape key'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default modal story demonstrating basic functionality
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            Default Modal
          </ModalHeader>
          <ModalBody>
            <p>This is a default modal with standard size and behavior.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
};

/**
 * Comprehensive showcase of all modal variants and sizes
 */
export const AllVariants: Story = {
  render: () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    return (
      <div className="grid grid-cols-2 gap-8 p-8">
        {/* Sizes Demo */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Button
                key={size}
                size="sm"
                variant="outline"
                onClick={() => setActiveModal(`size-${size}`)}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Variants Demo */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Variants</h3>
          <div className="flex flex-wrap gap-2">
            {(['default', 'overlay', 'centered'] as const).map((variant) => (
              <Button
                key={variant}
                size="sm"
                variant="outline"
                onClick={() => setActiveModal(`variant-${variant}`)}
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>

        {/* Size Modals */}
        {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Modal
            key={`size-${size}`}
            isOpen={activeModal === `size-${size}`}
            onClose={() => setActiveModal(null)}
            size={size}
          >
            <ModalHeader onClose={() => setActiveModal(null)}>
              Modal Size: {size.toUpperCase()}
            </ModalHeader>
            <ModalBody>
              <p>This modal demonstrates the {size} size variant.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setActiveModal(null)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        ))}

        {/* Variant Modals */}
        {(['default', 'overlay', 'centered'] as const).map((variant) => (
          <Modal
            key={`variant-${variant}`}
            isOpen={activeModal === `variant-${variant}`}
            onClose={() => setActiveModal(null)}
            variant={variant}
            size="md"
          >
            <ModalHeader onClose={() => setActiveModal(null)}>
              Modal Variant: {variant}
            </ModalHeader>
            <ModalBody>
              <p>This modal demonstrates the {variant} positioning variant.</p>
              <p>Test keyboard navigation with Tab and Escape keys.</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setActiveModal(null)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Interactive modal playground with focus management testing
 */
export const Interactive: Story = {
  render: () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Interactive Modal Testing</h3>
          <p className="text-sm text-muted-foreground">
            Test focus management, escape handling, and backdrop clicks
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => setActiveModal('basic')}>
            Basic Modal
          </Button>
          <Button onClick={() => setActiveModal('no-backdrop')}>
            No Backdrop Close
          </Button>
          <Button onClick={() => setActiveModal('no-escape')}>
            No Escape Close
          </Button>
        </div>

        {/* Basic Interactive Modal */}
        <Modal
          isOpen={activeModal === 'basic'}
          onClose={() => setActiveModal(null)}
          size="lg"
        >
          <ModalHeader onClose={() => setActiveModal(null)}>
            Interactive Test Modal
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p>Try pressing Escape or clicking the backdrop to close.</p>
              <p>Focus should be trapped within this modal.</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveModal(null)}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>

        {/* No Backdrop Close Modal */}
        <Modal
          isOpen={activeModal === 'no-backdrop'}
          onClose={() => setActiveModal(null)}
          closeOnBackdropClick={false}
          size="md"
        >
          <ModalHeader onClose={() => setActiveModal(null)}>
            Backdrop Click Disabled
          </ModalHeader>
          <ModalBody>
            <p>This modal cannot be closed by clicking the backdrop.</p>
            <p>You must use the close button or Escape key.</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setActiveModal(null)}>
              Close Modal
            </Button>
          </ModalFooter>
        </Modal>

        {/* No Escape Close Modal */}
        <Modal
          isOpen={activeModal === 'no-escape'}
          onClose={() => setActiveModal(null)}
          closeOnEscape={false}
          size="md"
        >
          <ModalHeader onClose={() => setActiveModal(null)}>
            Escape Key Disabled
          </ModalHeader>
          <ModalBody>
            <p>This modal cannot be closed with the Escape key.</p>
            <p>You must use the close button or click backdrop.</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setActiveModal(null)}>
              Close Modal
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
};

/**
 * Financial application use cases demonstrating real-world scenarios
 */
export const FinancialUseCases: Story = {
  render: () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Transaction Management */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Transaction Management</h3>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => setActiveModal('add-transaction')}>
              Add Transaction
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveModal('transfer-funds')}
            >
              Transfer Funds
            </Button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Account Management</h3>
          <div className="flex gap-4 flex-wrap">
            <Button 
              variant="outline"
              onClick={() => setActiveModal('account-settings')}
            >
              Account Settings
            </Button>
            <Button 
              variant="danger"
              onClick={() => setActiveModal('delete-confirmation')}
            >
              Delete Account
            </Button>
          </div>
        </div>

        {/* Add Transaction Modal */}
        <Modal
          isOpen={activeModal === 'add-transaction'}
          onClose={() => setActiveModal(null)}
          size="lg"
        >
          <ModalHeader onClose={() => setActiveModal(null)}>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Add New Transaction
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md">
                    <option>Food & Dining</option>
                    <option>Transportation</option>
                    <option>Utilities</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input 
                  placeholder="Transaction description..."
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveModal(null)}>
              Save Transaction
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={activeModal === 'delete-confirmation'}
          onClose={() => setActiveModal(null)}
          size="sm"
          closeOnBackdropClick={false}
        >
          <ModalHeader onClose={() => setActiveModal(null)}>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <p>Are you sure you want to delete this account?</p>
              <div className="bg-destructive/10 p-3 rounded border-l-4 border-destructive">
                <p className="text-sm font-medium text-destructive">
                  This action cannot be undone.
                </p>
                <p className="text-sm text-muted-foreground">
                  All transaction history will be permanently lost.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setActiveModal(null)}>
              Delete Account
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
}; 