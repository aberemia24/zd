import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';
import { Search, User, DollarSign, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * 🎨 Input Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Input> = {
  title: 'CVA-v2/Primitives/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Input component cu suport pentru validare, iconuri și multiple variante, construit cu CVA-v2 system.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'error'],
      description: 'Stilul vizual al input-ului'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea input-ului'
    },
    label: {
      control: 'text',
      description: 'Label-ul input-ului'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează input-ul'
    },
    required: {
      control: 'boolean',
      description: 'Marchează input-ul ca obligatoriu'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Input Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Email',
    placeholder: 'Enter your email'
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        variant="default"
        label="Default Variant"
        placeholder="Default input styling"
      />
      
      <Input
        variant="filled"
        label="Filled Variant"
        placeholder="Filled background styling"
      />
      
      <Input
        variant="error"
        label="Error Variant"
        placeholder="Error state styling"
        error="This field has an error"
      />
    </div>
  )
};

/**
 * Toate size-urile disponibile
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        size="sm"
        label="Small Input"
        placeholder="Small size input"
      />
      
      <Input
        size="md"
        label="Medium Input"
        placeholder="Medium size input (default)"
      />
      
      <Input
        size="lg"
        label="Large Input"
        placeholder="Large size input"
      />
    </div>
  )
};

/**
 * Input cu iconuri
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        label="Search"
        placeholder="Search transactions..."
        leftIcon={<Search size={16} />}
      />
      
      <Input
        label="Username"
        placeholder="Enter username"
        leftIcon={<User size={16} />}
      />
      
      <Input
        label="Amount"
        placeholder="0.00"
        leftIcon={<DollarSign size={16} />}
        rightIcon={<span className="text-xs text-carbon-500">RON</span>}
      />
    </div>
  )
};

/**
 * Password Input interactiv
 */
export const PasswordInput: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Input
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-carbon-100 rounded dark:hover:bg-carbon-800"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
    );
  }
};

/**
 * Stări de validare
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        label="Required Field"
        placeholder="This field is required"
        required
        hint="This field must be filled out"
      />
      
      <Input
        label="Valid Input"
        placeholder="Valid input"
        success="Looks good!"
        defaultValue="valid@example.com"
      />
      
      <Input
        label="Invalid Input"
        placeholder="Invalid input"
        error="Please enter a valid email address"
        defaultValue="invalid-email"
      />
      
      <Input
        label="Disabled Input"
        placeholder="This input is disabled"
        disabled
        defaultValue="Cannot edit this"
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
      <Input
        variant="filled"
        label="Transaction Amount"
        placeholder="0.00"
        leftIcon={<DollarSign size={16} />}
        rightIcon={<span className="text-xs font-medium text-carbon-600">RON</span>}
        type="number"
        step="0.01"
      />
      
      <Input
        label="Transaction Description"
        placeholder="e.g., Coffee at Starbucks"
        hint="Describe what this transaction was for"
      />
      
      <Input
        label="Search Transactions"
        placeholder="Search by description, amount, or category..."
        leftIcon={<Search size={16} />}
        variant="filled"
      />
      
      <Input
        label="Budget Limit"
        placeholder="1000.00"
        leftIcon={<span className="text-xs text-carbon-500">Max</span>}
        rightIcon={<span className="text-xs font-medium text-copper-600">RON</span>}
        type="number"
        step="0.01"
        success="Budget set successfully"
      />
    </div>
  )
}; 