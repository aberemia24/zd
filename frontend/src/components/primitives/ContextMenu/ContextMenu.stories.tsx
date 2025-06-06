import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Copy, Edit, Eye, MoreVertical, Trash2, ArrowUpRight, Download, Share, Tag } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuOption, ContextMenuState } from '../../../types/financial';
import { Button } from '../Button';

const meta: Meta<typeof ContextMenu> = {
  title: 'CVA-v2/Primitives/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'CVA-v2 ContextMenu component cu right-click positioning, keyboard navigation, nested menus, boundary detection și financial use cases specifice pentru gestiunea datelor.'
      }
    }
  },
  argTypes: {
    offset: {
      control: 'object',
      description: 'Positioning offset from cursor location'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock function for actions
const mockAction = (action: string) => () => console.log(`Action: ${action}`);

// Sample context menu options for financial use cases
const basicFinancialOptions: ContextMenuOption[] = [
  { 
    id: 'view', 
    label: 'View Details', 
    icon: Eye,
    onClick: mockAction('view-details')
  },
  { 
    id: 'edit', 
    label: 'Edit Transaction', 
    icon: Edit,
    onClick: mockAction('edit-transaction')
  },
  { 
    id: 'copy', 
    label: 'Copy', 
    icon: Copy,
    shortcut: 'Ctrl+C',
    onClick: mockAction('copy')
  },
  { id: 'separator1', label: '', separator: true },
  { 
    id: 'delete', 
    label: 'Delete', 
    icon: Trash2,
    shortcut: 'Del',
    onClick: mockAction('delete')
  }
];

const transactionOptions: ContextMenuOption[] = [
  { 
    id: 'view-transaction', 
    label: 'View Transaction', 
    icon: Eye,
    onClick: mockAction('view-transaction')
  },
  { 
    id: 'edit-transaction', 
    label: 'Edit Transaction', 
    icon: Edit,
    onClick: mockAction('edit-transaction')
  },
  { 
    id: 'duplicate-transaction', 
    label: 'Duplicate Transaction', 
    icon: Copy,
    onClick: mockAction('duplicate-transaction')
  },
  { id: 'separator1', label: '', separator: true },
  { 
    id: 'add-tag', 
    label: 'Add Tag', 
    icon: Tag,
    onClick: mockAction('add-tag')
  },
  { 
    id: 'export-transaction', 
    label: 'Export Data', 
    icon: Download,
    onClick: mockAction('export-transaction')
  },
  { id: 'separator2', label: '', separator: true },
  { 
    id: 'delete-transaction', 
    label: 'Delete Transaction', 
    icon: Trash2,
    shortcut: 'Del',
    onClick: mockAction('delete-transaction')
  }
];

const accountOptions: ContextMenuOption[] = [
  { 
    id: 'view-account', 
    label: 'View Account Details', 
    icon: Eye,
    onClick: mockAction('view-account')
  },
  { 
    id: 'edit-account', 
    label: 'Edit Account', 
    icon: Edit,
    onClick: mockAction('edit-account')
  },
  { 
    id: 'export-account', 
    label: 'Export Transactions', 
    icon: Download,
    onClick: mockAction('export-account')
  },
  { 
    id: 'share-account', 
    label: 'Share Account', 
    icon: Share,
    onClick: mockAction('share-account')
  },
  { id: 'separator1', label: '', separator: true },
  { 
    id: 'archive-account', 
    label: 'Archive Account', 
    icon: ArrowUpRight,
    onClick: mockAction('archive-account')
  },
  { 
    id: 'delete-account', 
    label: 'Delete Account', 
    icon: Trash2,
    onClick: mockAction('delete-account')
  }
];

/**
 * Default context menu story demonstrating basic functionality
 */
export const Default: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
      isVisible: false,
      x: 0,
      y: 0
    });

    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({
        isVisible: true,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleClose = () => {
      setContextMenu({ isVisible: false, x: 0, y: 0 });
    };

    return (
      <>
        <div className="p-8 border-2 border-dashed border-muted rounded-lg">
          <div 
            className="p-6 bg-card border rounded cursor-context-menu"
            onContextMenu={handleRightClick}
          >
            <h3 className="font-semibold mb-2">Sample Transaction</h3>
            <p className="text-sm text-muted-foreground">Right-click here to open context menu</p>
            <div className="mt-2 text-sm">
              <div>Amount: $25.99</div>
              <div>Category: Food & Dining</div>
              <div>Date: Today</div>
            </div>
          </div>
        </div>

        <ContextMenu
          options={basicFinancialOptions}
          state={contextMenu}
          onClose={handleClose}
        />
      </>
    );
  }
};

/**
 * Comprehensive showcase of all context menu variants and positioning
 */
export const AllVariants: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
      isVisible: false,
      x: 0,
      y: 0
    });
    const [currentOptions, setCurrentOptions] = useState<ContextMenuOption[]>([]);

    const handleRightClick = (e: React.MouseEvent, options: ContextMenuOption[]) => {
      e.preventDefault();
      setCurrentOptions(options);
      setContextMenu({
        isVisible: true,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleClose = () => {
      setContextMenu({ isVisible: false, x: 0, y: 0 });
    };

    return (
      <div className="grid grid-cols-2 gap-8 p-8">
        {/* Basic Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Basic Financial Actions</h3>
          <div 
            className="p-4 bg-card border rounded cursor-context-menu"
            onContextMenu={(e) => handleRightClick(e, basicFinancialOptions)}
          >
            <div className="font-medium">Basic Transaction</div>
            <div className="text-sm text-muted-foreground">Right-click for basic actions</div>
          </div>
        </div>

        {/* Transaction Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Transaction Management</h3>
          <div 
            className="p-4 bg-card border rounded cursor-context-menu"
            onContextMenu={(e) => handleRightClick(e, transactionOptions)}
          >
            <div className="font-medium">Grocery Store Purchase</div>
            <div className="text-sm text-muted-foreground">$45.67 • Food & Dining</div>
            <div className="text-xs text-muted-foreground">Right-click for transaction actions</div>
          </div>
        </div>

        {/* Account Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Account Management</h3>
          <div 
            className="p-4 bg-card border rounded cursor-context-menu"
            onContextMenu={(e) => handleRightClick(e, accountOptions)}
          >
            <div className="font-medium">Main Checking Account</div>
            <div className="text-sm text-muted-foreground">Balance: $2,345.67</div>
            <div className="text-xs text-muted-foreground">Right-click for account actions</div>
          </div>
        </div>

        {/* Disabled Options Demo */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">With Disabled Options</h3>
          <div 
            className="p-4 bg-card border rounded cursor-context-menu"
            onContextMenu={(e) => handleRightClick(e, [
              ...basicFinancialOptions.slice(0, 2),
              { ...basicFinancialOptions[2], disabled: true },
              basicFinancialOptions[3],
              { ...basicFinancialOptions[4], disabled: true }
            ])}
          >
            <div className="font-medium">Readonly Transaction</div>
            <div className="text-sm text-muted-foreground">Some actions disabled</div>
          </div>
        </div>

        <ContextMenu
          options={currentOptions}
          state={contextMenu}
          onClose={handleClose}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Interactive playground testing positioning, keyboard navigation, and edge cases
 */
export const Interactive: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
      isVisible: false,
      x: 0,
      y: 0
    });

    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({
        isVisible: true,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleClose = () => {
      setContextMenu({ isVisible: false, x: 0, y: 0 });
    };

    return (
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Interactive Context Menu Testing</h3>
          <p className="text-sm text-muted-foreground">
            Test positioning edge cases, keyboard navigation (Arrow keys, Enter, Escape), and right-click behavior
          </p>
        </div>

        {/* Edge Case Testing Areas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Left Corner */}
          <div 
            className="h-32 bg-card border rounded cursor-context-menu flex items-center justify-center"
            onContextMenu={handleRightClick}
          >
            <div className="text-center">
              <div className="font-medium">Top Left Area</div>
              <div className="text-sm text-muted-foreground">Test boundary detection</div>
            </div>
          </div>

          {/* Top Right Corner */}
          <div 
            className="h-32 bg-card border rounded cursor-context-menu flex items-center justify-center"
            onContextMenu={handleRightClick}
          >
            <div className="text-center">
              <div className="font-medium">Top Right Area</div>
              <div className="text-sm text-muted-foreground">Test viewport boundaries</div>
            </div>
          </div>

          {/* Bottom Left Corner */}
          <div 
            className="h-32 bg-card border rounded cursor-context-menu flex items-center justify-center"
            onContextMenu={handleRightClick}
          >
            <div className="text-center">
              <div className="font-medium">Bottom Left Area</div>
              <div className="text-sm text-muted-foreground">Test position adjustment</div>
            </div>
          </div>

          {/* Bottom Right Corner */}
          <div 
            className="h-32 bg-card border rounded cursor-context-menu flex items-center justify-center"
            onContextMenu={handleRightClick}
          >
            <div className="text-center">
              <div className="font-medium">Bottom Right Area</div>
              <div className="text-sm text-muted-foreground">Test smart positioning</div>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Keyboard Navigation Testing</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Right-click any area above to open context menu</li>
            <li>• Use Arrow keys to navigate through options</li>
            <li>• Press Enter or Space to select an option</li>
            <li>• Press Escape to close the menu</li>
            <li>• Click outside to close via backdrop click</li>
          </ul>
        </div>

        <ContextMenu
          options={transactionOptions}
          state={contextMenu}
          onClose={handleClose}
        />
      </div>
    );
  }
};

/**
 * Real-world financial application use cases
 */
export const FinancialUseCases: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
      isVisible: false,
      x: 0,
      y: 0
    });
    const [selectedItem, setSelectedItem] = useState<string>('');

    const handleRightClick = (e: React.MouseEvent, itemType: string, options: ContextMenuOption[]) => {
      e.preventDefault();
      setSelectedItem(itemType);
      setContextMenu({
        isVisible: true,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleClose = () => {
      setContextMenu({ isVisible: false, x: 0, y: 0 });
      setSelectedItem('');
    };

    const getOptionsForItem = (itemType: string): ContextMenuOption[] => {
      switch (itemType) {
        case 'transaction':
          return transactionOptions;
        case 'account':
          return accountOptions;
        case 'income':
          return [
            { id: 'view-income', label: 'View Income Details', icon: Eye, onClick: mockAction('view-income') },
            { id: 'edit-income', label: 'Edit Income', icon: Edit, onClick: mockAction('edit-income') },
            { id: 'separator1', label: '', separator: true },
            { id: 'mark-recurring', label: 'Mark as Recurring', icon: Tag, onClick: mockAction('mark-recurring') },
            { id: 'export-income', label: 'Export Income Data', icon: Download, onClick: mockAction('export-income') }
          ];
        default:
          return basicFinancialOptions;
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Transaction Table Simulation */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <p className="text-sm text-muted-foreground">Right-click any transaction for context actions</p>
          </div>
          <div className="space-y-1">
            {/* Expense Transaction */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu border-b last:border-b-0"
              onContextMenu={(e) => handleRightClick(e, 'transaction', transactionOptions)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Grocery Store Purchase</div>
                  <div className="text-sm text-muted-foreground">Food & Dining • Main Checking</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-destructive">-$67.89</div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </div>
              </div>
            </div>

            {/* Income Transaction */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu border-b last:border-b-0"
              onContextMenu={(e) => handleRightClick(e, 'income', getOptionsForItem('income'))}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Salary Payment</div>
                  <div className="text-sm text-muted-foreground">Income • Main Checking</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">+$3,500.00</div>
                  <div className="text-sm text-muted-foreground">Yesterday</div>
                </div>
              </div>
            </div>

            {/* Transfer Transaction */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu"
              onContextMenu={(e) => handleRightClick(e, 'transaction', [
                { id: 'view-transfer', label: 'View Transfer Details', icon: Eye, onClick: mockAction('view-transfer') },
                { id: 'edit-transfer', label: 'Edit Transfer', icon: Edit, onClick: mockAction('edit-transfer') },
                { id: 'separator1', label: '', separator: true },
                { id: 'reverse-transfer', label: 'Reverse Transfer', icon: ArrowUpRight, onClick: mockAction('reverse-transfer') },
                { id: 'export-transfer', label: 'Export Transfer', icon: Download, onClick: mockAction('export-transfer') }
              ])}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Transfer to Savings</div>
                  <div className="text-sm text-muted-foreground">Transfer • Checking → Savings</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-muted-foreground">$500.00</div>
                  <div className="text-sm text-muted-foreground">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account List */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Accounts</h3>
            <p className="text-sm text-muted-foreground">Right-click any account for management options</p>
          </div>
          <div className="space-y-1">
            {/* Checking Account */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu border-b last:border-b-0"
              onContextMenu={(e) => handleRightClick(e, 'account', accountOptions)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Main Checking Account</div>
                  <div className="text-sm text-muted-foreground">****1234 • Active</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$2,345.67</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>

            {/* Savings Account */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu border-b last:border-b-0"
              onContextMenu={(e) => handleRightClick(e, 'account', accountOptions)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Emergency Savings</div>
                  <div className="text-sm text-muted-foreground">****5678 • Savings</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$15,432.10</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>

            {/* Investment Account */}
            <div 
              className="p-4 hover:bg-muted/50 cursor-context-menu"
              onContextMenu={(e) => handleRightClick(e, 'account', [
                ...accountOptions.filter(opt => opt.id !== 'delete-account'),
                { 
                  id: 'view-performance', 
                  label: 'View Performance', 
                  icon: Eye, 
                  onClick: mockAction('view-performance') 
                },
                { id: 'separator2', label: '', separator: true },
                { 
                  id: 'rebalance', 
                  label: 'Rebalance Portfolio', 
                  icon: ArrowUpRight, 
                  onClick: mockAction('rebalance') 
                }
              ])}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Investment Portfolio</div>
                  <div className="text-sm text-muted-foreground">****9012 • Brokerage</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$45,678.90</div>
                  <div className="text-sm text-green-600">+2.3% today</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContextMenu
          options={getOptionsForItem(selectedItem)}
          state={contextMenu}
          onClose={handleClose}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
}; 
