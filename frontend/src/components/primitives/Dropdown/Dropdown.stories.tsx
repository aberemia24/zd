import type { Meta, StoryObj } from '@storybook/react';
import { Building, CreditCard, DollarSign, Home, Settings, TrendingUp, User, Wallet } from 'lucide-react';
import { Dropdown, DropdownProps, DropdownItem } from './Dropdown';

// Mock function for actions
const fn = () => () => {};

const meta: Meta<typeof Dropdown> = {
  title: 'CVA-v2/Primitives/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'CVA-v2 Dropdown component cu support pentru nested menus, multi-select, search functionality, positioning edge cases și comprehensive keyboard navigation pentru aplicații financiare.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'active'],
      description: 'Visual variant of the trigger button'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Size of the trigger button'
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Horizontal alignment of dropdown menu'
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Side where dropdown appears relative to trigger'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropdown trigger'
    }
  },
  args: {
    onOpenChange: fn(),
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for financial use cases
const basicItems: DropdownItem[] = [
  { id: '1', label: 'Dashboard', href: '/dashboard', icon: Home },
  { id: '2', label: 'Transactions', href: '/transactions', icon: CreditCard },
  { id: '3', label: 'Reports', href: '/reports', icon: TrendingUp },
  { id: '4', label: 'Settings', href: '/settings', icon: Settings }
];

const nestedFinancialItems: DropdownItem[] = [
  {
    id: '1',
    label: 'Accounts',
    icon: Wallet,
    children: [
      { id: '1.1', label: 'Checking Account', href: '/accounts/checking' },
      { id: '1.2', label: 'Savings Account', href: '/accounts/savings' },
      { id: '1.3', label: 'Investment Account', href: '/accounts/investment' },
    ]
  },
  {
    id: '2', 
    label: 'Transactions',
    icon: CreditCard,
    children: [
      { id: '2.1', label: 'Income', href: '/transactions/income' },
      { id: '2.2', label: 'Expenses', href: '/transactions/expenses' },
      { id: '2.3', label: 'Transfers', href: '/transactions/transfers' },
      { id: '2.4', label: '', separator: true },
      { id: '2.5', label: 'Recurring', href: '/transactions/recurring' }
    ]
  },
  {
    id: '3',
    label: 'Reporting',
    icon: TrendingUp,
    children: [
      { id: '3.1', label: 'Monthly Budget', href: '/reports/budget' },
      { id: '3.2', label: 'Cash Flow', href: '/reports/cashflow' },
      { id: '3.3', label: 'Net Worth', href: '/reports/networth' },
      {
        id: '3.4',
        label: 'Analytics',
        children: [
          { id: '3.4.1', label: 'Spending Trends', href: '/analytics/spending' },
          { id: '3.4.2', label: 'Investment Performance', href: '/analytics/investment' },
          { id: '3.4.3', label: 'Budget Variance', href: '/analytics/variance' }
        ]
      }
    ]
  },
  { id: '4', label: '', separator: true },
  { id: '5', label: 'Profile', icon: User, href: '/profile' },
  { id: '6', label: 'Settings', icon: Settings, href: '/settings' }
];

const actionItems: DropdownItem[] = [
  { 
    id: '1', 
    label: 'Add Transaction', 
    icon: DollarSign,
    shortcut: 'Ctrl+N',
    onClick: fn()
  },
  { 
    id: '2', 
    label: 'Create Budget', 
    icon: Building,
    shortcut: 'Ctrl+B',
    onClick: fn()
  },
  { id: '3', label: '', separator: true },
  { 
    id: '4', 
    label: 'Export Data', 
    onClick: fn()
  },
  { 
    id: '5', 
    label: 'Import Data', 
    disabled: true,
    onClick: fn()
  }
];

/**
 * Default story showing basic dropdown functionality
 */
export const Default: Story = {
  args: {
    label: 'Navigation Menu',
    items: basicItems,
    variant: 'default',
    size: 'md'
  }
};

/**
 * Comprehensive showcase of all variants, sizes, and positioning options
 */
export const AllVariants: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-8 p-8">
      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Variants</h3>
        <Dropdown
          label="Default"
          variant="default"
          items={basicItems}
        />
        <Dropdown
          label="Ghost"
          variant="ghost"
          items={basicItems}
        />
        <Dropdown
          label="Active"
          variant="active"
          items={basicItems}
        />
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Sizes</h3>
        <Dropdown
          label="Small"
          size="sm"
          items={basicItems}
        />
        <Dropdown
          label="Medium"
          size="md"
          items={basicItems}
        />
        <Dropdown
          label="Large"
          size="lg"
          items={basicItems}
        />
      </div>

      {/* Positioning */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Positioning</h3>
        <Dropdown
          label="Bottom Start"
          items={basicItems}
          side="bottom"
          align="start"
        />
        <Dropdown
          label="Bottom Center"
          items={basicItems}
          side="bottom"
          align="center"
        />
        <Dropdown
          label="Top End"
          items={basicItems}
          side="top"
          align="end"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Interactive playground for testing complex interactions
 */
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Financial Navigation Menu</h3>
        <p className="text-sm text-muted-foreground">
          Testează navigarea cu mouse, keyboard navigation (Arrow keys, Enter, Escape) și nested submenus
        </p>
      </div>
      
      <div className="flex gap-4">
        <Dropdown
          label="Financial Dashboard"
          items={nestedFinancialItems}
          variant="default"
          size="md"
          testId="financial-menu"
        />
        
        <Dropdown
          label="Quick Actions"
          items={actionItems}
          variant="ghost"
          size="md"
          testId="actions-menu"
        />
        
        <Dropdown
          label="Disabled Menu"
          items={basicItems}
          variant="default"
          size="md"
          disabled
          testId="disabled-menu"
        />
      </div>
    </div>
  )
};

/**
 * Real-world financial use cases and patterns
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Account Selector */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Account Selection</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Select Account:</span>
          <Dropdown
            label="Main Checking"
            items={[
              { id: '1', label: 'Main Checking - $2,345.67' },
              { id: '2', label: 'Savings Account - $15,432.10' },
              { id: '3', label: 'Investment Account - $45,678.90' },
              { id: '4', label: '', separator: true },
              { id: '5', label: 'Add New Account...', onClick: fn() }
            ]}
            variant="ghost"
            testId="account-selector"
          />
        </div>
      </div>

      {/* Transaction Categories */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Transaction Categories</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Dropdown
            label="Select Category"
            items={[
              {
                id: '1',
                label: 'Income',
                children: [
                  { id: '1.1', label: 'Salary' },
                  { id: '1.2', label: 'Freelance' },
                  { id: '1.3', label: 'Investment Returns' }
                ]
              },
              {
                id: '2',
                label: 'Expenses',
                children: [
                  { id: '2.1', label: 'Food & Dining' },
                  { id: '2.2', label: 'Transportation' },
                  { id: '2.3', label: 'Utilities' },
                  { id: '2.4', label: 'Entertainment' }
                ]
              },
              {
                id: '3',
                label: 'Transfers',
                children: [
                  { id: '3.1', label: 'Between Accounts' },
                  { id: '3.2', label: 'To External' }
                ]
              }
            ]}
            variant="default"
            testId="category-selector"
          />
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Report Filters</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Dropdown
            label="Time Period"
            items={[
              { id: '1', label: 'Last 7 days' },
              { id: '2', label: 'Last 30 days' },
              { id: '3', label: 'Last 3 months' },
              { id: '4', label: 'Last 6 months' },
              { id: '5', label: 'Last year' },
              { id: '6', label: '', separator: true },
              { id: '7', label: 'Custom range...', onClick: fn() }
            ]}
            size="sm"
            testId="time-filter"
          />
          
          <Dropdown
            label="Report Type"
            items={[
              { id: '1', label: 'Summary', icon: TrendingUp },
              { id: '2', label: 'Detailed', icon: CreditCard },
              { id: '3', label: 'Comparison', icon: Building },
              { id: '4', label: '', separator: true },
              { id: '5', label: 'Export Options', disabled: true }
            ]}
            size="sm"
            testId="report-type"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Bulk Transaction Actions</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Selected: 5 transactions</span>
          <Dropdown
            label="Bulk Actions"
            items={[
              { id: '1', label: 'Mark as Cleared', onClick: fn() },
              { id: '2', label: 'Categorize', onClick: fn() },
              { id: '3', label: 'Add Tags', onClick: fn() },
              { id: '4', label: '', separator: true },
              { id: '5', label: 'Export Selection', onClick: fn() },
              { id: '6', label: 'Delete Selected', onClick: fn(), disabled: false }
            ]}
            variant="ghost"
            size="sm"
            testId="bulk-actions"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-lg font-semibold mb-4">Dropdown Trigger Sizes Comparison</div>
      
      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="space-y-2">
          <div className="text-sm font-medium text-carbon-600 dark:text-carbon-400">Small (sm)</div>
          <Dropdown 
            size="sm"
            label="Small Dropdown"
            items={basicItems}
            testId="small-dropdown"
          />
          <div className="text-xs text-carbon-500">Padding: px-2 py-1, Text: text-sm</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-carbon-600 dark:text-carbon-400">Medium (md)</div>
          <Dropdown 
            size="md"
            label="Medium Dropdown"
            items={basicItems}
            testId="medium-dropdown"
          />
          <div className="text-xs text-carbon-500">Padding: px-4 py-2, Text: text-base</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-carbon-600 dark:text-carbon-400">Large (lg)</div>
          <Dropdown 
            size="lg"
            label="Large Dropdown"
            items={basicItems}
            testId="large-dropdown"
          />
          <div className="text-xs text-carbon-500">Padding: px-6 py-3, Text: text-lg</div>
        </div>
      </div>

      {/* Stacked comparison for mobile */}
      <div className="md:hidden space-y-4">
        <Dropdown size="sm" label="Small Trigger" items={basicItems} />
        <Dropdown size="md" label="Medium Trigger" items={basicItems} />
        <Dropdown size="lg" label="Large Trigger" items={basicItems} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available Dropdown trigger button sizes with visible padding and text size differences.'
      }
    }
  }
}; 
