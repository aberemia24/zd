import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';
import type { SelectOption } from './Select';

/**
 * 🎨 Select Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Select> = {
  title: 'CVA-v2/Primitives/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Select component cu suport pentru validare, opțiuni multiple și variante CVA-v2, optimizat pentru aplicații financiare.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      description: 'Stilul vizual al select-ului'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea select-ului'
    },
    label: {
      control: 'text',
      description: 'Label-ul select-ului'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează select-ul'
    },
    required: {
      control: 'boolean',
      description: 'Marchează select-ul ca obligatoriu'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Select ocupă toată lățimea disponibilă'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data pentru demonstrații
const basicOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true }
];

const categoryOptions: SelectOption[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills & Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' }
];

const currencyOptions: SelectOption[] = [
  { value: 'RON', label: 'Romanian Leu (RON)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'GBP', label: 'British Pound (GBP)' }
];

const frequencyOptions: SelectOption[] = [
  { value: 'once', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

/**
 * Default Select Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Choose an option',
    placeholder: 'Select an option...',
    options: basicOptions
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <Select
        variant="default"
        label="Default Variant"
        placeholder="Select an option..."
        options={basicOptions}
      />
      
      <Select
        variant="filled"
        label="Filled Variant"
        placeholder="Select an option..."
        options={basicOptions}
      />
      
      <Select
        variant="default"
        label="Error State (with error prop)"
        placeholder="Select an option..."
        options={basicOptions}
        error="Please select a valid option"
      />
    </div>
  )
};

/**
 * Toate mărimile disponibile
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <Select
        size="sm"
        label="Small Size"
        placeholder="Small select..."
        options={basicOptions}
      />
      
      <Select
        size="md"
        label="Medium Size (Default)"
        placeholder="Medium select..."
        options={basicOptions}
      />
      
      <Select
        size="lg"
        label="Large Size"
        placeholder="Large select..."
        options={basicOptions}
      />
    </div>
  )
};

/**
 * Stări de validare
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Select
        label="Required Field"
        placeholder="This field is required"
        options={basicOptions}
        required
        hint="Please select one of the available options"
      />
      
      <Select
        label="Valid Selection"
        placeholder="Valid selection"
        options={basicOptions}
        success="Great choice!"
        defaultValue="option2"
      />
      
      <Select
        label="Invalid Selection"
        placeholder="Invalid selection"
        options={basicOptions}
        error="This selection is not allowed"
      />
      
      <Select
        label="Disabled Select"
        placeholder="This select is disabled"
        options={basicOptions}
        disabled
        defaultValue="option1"
      />
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Transaction Category"
          placeholder="Select category..."
          options={categoryOptions}
          hint="Choose the category that best describes this transaction"
        />
        
        <Select
          label="Currency"
          placeholder="Select currency..."
          options={currencyOptions}
          defaultValue="RON"
        />
        
        <Select
          label="Payment Frequency"
          placeholder="How often?"
          options={frequencyOptions}
          hint="For recurring transactions only"
        />
        
        <Select
          label="Account Type"
          placeholder="Select account..."
          options={[
            { value: 'checking', label: 'Checking Account' },
            { value: 'savings', label: 'Savings Account' },
            { value: 'credit', label: 'Credit Card' },
            { value: 'cash', label: 'Cash' }
          ]}
        />
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Form Example</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Type"
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
              { value: 'transfer', label: 'Transfer' }
            ]}
            defaultValue="expense"
            size="sm"
          />
          
          <Select
            label="Category"
            options={categoryOptions}
            placeholder="Select category..."
            size="sm"
            required
          />
          
          <Select
            label="Account"
            options={[
              { value: 'main', label: 'Main Account (****1234)' },
              { value: 'savings', label: 'Savings (****5678)' },
              { value: 'credit', label: 'Credit Card (****9012)' }
            ]}
            defaultValue="main"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
};

/**
 * Full Width Layout
 */
export const FullWidthLayout: Story = {
  render: () => (
    <div className="space-y-6">
      <Select
        label="Full Width Select"
        placeholder="This select takes full width..."
        options={categoryOptions}
        fullWidth
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Half Width (Grid)"
          placeholder="Select option..."
          options={basicOptions}
          fullWidth
        />
        
        <Select
          label="Half Width (Grid)"
          placeholder="Select option..."
          options={basicOptions}
          fullWidth
        />
      </div>
    </div>
  )
};

/**
 * Custom Options with Children
 */
export const CustomOptions: Story = {
  render: () => (
    <div className="space-y-6">
      <Select
        label="Custom Options (JSX Children)"
        placeholder="Select a priority level..."
      >
        <option value="low">🟢 Low Priority</option>
        <option value="medium">🟡 Medium Priority</option>
        <option value="high">🔴 High Priority</option>
        <option value="urgent">⚡ Urgent</option>
      </Select>
      
      <Select
        label="Mixed Options (Props + Children)"
        placeholder="Select an option..."
        options={[
          { value: 'prop1', label: 'From Props 1' },
          { value: 'prop2', label: 'From Props 2' }
        ]}
      >
        <option value="child1">From Children 1</option>
        <option value="child2">From Children 2</option>
      </Select>
    </div>
  )
};

/**
 * Complex Financial Scenario
 */
export const ComplexFinancialScenario: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Budget Planning Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Budget Period"
            options={[
              { value: 'monthly', label: 'Monthly Budget' },
              { value: 'quarterly', label: 'Quarterly Budget' },
              { value: 'yearly', label: 'Yearly Budget' }
            ]}
            defaultValue="monthly"
            size="sm"
          />
          
          <Select
            label="Primary Category"
            options={categoryOptions}
            placeholder="Main category..."
            size="sm"
            required
          />
          
          <Select
            label="Budget Type"
            options={[
              { value: 'fixed', label: 'Fixed Budget' },
              { value: 'flexible', label: 'Flexible Budget' },
              { value: 'percentage', label: 'Percentage-based' }
            ]}
            placeholder="Budget type..."
            size="sm"
          />
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Transaction Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Time Period"
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
              { value: 'custom', label: 'Custom Range' }
            ]}
            defaultValue="month"
            size="sm"
          />
          
          <Select
            label="Category"
            options={[
              { value: 'all', label: 'All Categories' },
              ...categoryOptions
            ]}
            defaultValue="all"
            size="sm"
          />
          
          <Select
            label="Amount Range"
            options={[
              { value: 'all', label: 'All Amounts' },
              { value: 'under50', label: 'Under 50 RON' },
              { value: '50to200', label: '50-200 RON' },
              { value: '200to500', label: '200-500 RON' },
              { value: 'over500', label: 'Over 500 RON' }
            ]}
            defaultValue="all"
            size="sm"
          />
          
          <Select
            label="Sort By"
            options={[
              { value: 'date_desc', label: 'Date (Newest)' },
              { value: 'date_asc', label: 'Date (Oldest)' },
              { value: 'amount_desc', label: 'Amount (High to Low)' },
              { value: 'amount_asc', label: 'Amount (Low to High)' },
              { value: 'category', label: 'Category' }
            ]}
            defaultValue="date_desc"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}; 