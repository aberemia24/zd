import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal, ModalHeader, ModalBody, ModalFooter, useModal } from './index';

// Test component pentru useModal hook
const TestModalConsumer = () => {
  const { isOpen, open, close } = useModal();
  
  return (
    <div>
      <button onClick={open} data-testid="open-button">
        Open
      </button>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalHeader>Test Modal</ModalHeader>
        <ModalBody>
          <p>Modal content</p>
        </ModalBody>
        <ModalFooter>
          <button onClick={close}>Close Modal</button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

describe('Modal Components', () => {
  describe('Modal', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call onClose when ESC key is pressed', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should apply custom className', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} className="custom-modal">
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toHaveClass('custom-modal');
    });
  });

  describe('ModalHeader', () => {
    it('should render children correctly', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalHeader>Test Title</ModalHeader>
        </Modal>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render close button when showCloseButton is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalHeader showCloseButton={true}>Test Title</ModalHeader>
        </Modal>
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('ModalBody', () => {
    it('should render children correctly', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalBody>
            <div data-testid="body-content">Body content</div>
          </ModalBody>
        </Modal>
      );

      expect(screen.getByTestId('body-content')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });
  });

  describe('ModalFooter', () => {
    it('should render children correctly', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalFooter>
            <button data-testid="footer-button">Footer Button</button>
          </ModalFooter>
        </Modal>
      );

      expect(screen.getByTestId('footer-button')).toBeInTheDocument();
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });
  });

  describe('useModal hook', () => {
    it('should initialize with closed state', () => {
      render(<TestModalConsumer />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open modal when open is called', () => {
      render(<TestModalConsumer />);
      
      fireEvent.click(screen.getByTestId('open-button'));
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with all modal parts together', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <ModalHeader showCloseButton={true}>Complete Modal</ModalHeader>
          <ModalBody>
            <p>This is a complete modal example</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose}>Cancel</button>
            <button>Confirm</button>
          </ModalFooter>
        </Modal>
      );

      // Check all parts are rendered
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Complete Modal')).toBeInTheDocument();
      expect(screen.getByText('This is a complete modal example')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();

      // Test close functionality
      fireEvent.click(screen.getByText('Cancel'));
      expect(onClose).toHaveBeenCalled();
    });
  });
}); 