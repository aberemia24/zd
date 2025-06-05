import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, CreditCard, DollarSign, Info, User } from 'lucide-react';
import FormGroup from './FormGroup';
import FormLabel from '../FormLabel/FormLabel';
import Input from '../Input/Input';
import Checkbox from '../Checkbox/Checkbox';
import Select from '../Select/Select';
import Textarea from '../Textarea/Textarea';

/**
 * 🎨 FormGroup Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof FormGroup> = {
  title: 'CVA-v2/Primitives/FormGroup',
  component: FormGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FormGroup component pentru organizarea logică și layout-ul formularelor, construit cu CVA-v2 system cu Carbon Copper styling și suport ARIA.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inline', 'grid'],
      description: 'Layout-ul grupului de formulare'
    },
    children: {
      control: false,
      description: 'Componentele de formular din grup'
    },
    role: {
      control: 'text',
      description: 'ARIA role pentru accesibilitate'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FormGroup Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <FormLabel htmlFor="email" required>
          Email Address
        </FormLabel>
        <Input 
          id="email"
          type="email"
          placeholder="Enter your email"
          hint="We'll never share your email with anyone"
        />
      </>
    )
  }
};

/**
 * All Variants Overview
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Layout</h3>
        <FormGroup variant="default">
          <FormLabel htmlFor="default-input" required>
            Username
          </FormLabel>
          <Input 
            id="default-input"
            placeholder="Enter username"
            hint="Must be at least 3 characters"
          />
        </FormGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Inline Layout</h3>
        <FormGroup variant="inline">
          <FormLabel htmlFor="inline-input">
            Quick Search
          </FormLabel>
          <Input 
            id="inline-input"
            placeholder="Search..."
            className="ml-3"
          />
        </FormGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Grid Layout</h3>
        <FormGroup variant="grid">
          <FormLabel htmlFor="stacked-input" required>
            Full Address
          </FormLabel>
          <Textarea 
            id="stacked-input"
            placeholder="Enter your complete address"
            hint="Include city, state, and postal code"
          />
        </FormGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Multiple Field Groups</h3>
        <div className="space-y-4">
          <FormGroup>
            <FormLabel htmlFor="first-name" required>
              First Name
            </FormLabel>
            <Input id="first-name" placeholder="John" />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="last-name" required>
              Last Name
            </FormLabel>
            <Input id="last-name" placeholder="Doe" />
          </FormGroup>
        </div>
      </div>
    </div>
  )
};

/**
 * Interactive Features
 */
export const Interactive: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Interactive Form Layout</h3>
      
      <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
        <FormGroup role="group" aria-labelledby="personal-info-heading">
          <h4 id="personal-info-heading" className="text-md font-medium mb-4">
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup>
              <FormLabel htmlFor="interactive-first" required>
                First Name
              </FormLabel>
              <Input 
                id="interactive-first"
                placeholder="Enter first name"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="interactive-last" required>
                Last Name
              </FormLabel>
              <Input 
                id="interactive-last"
                placeholder="Enter last name"
              />
            </FormGroup>
          </div>
        </FormGroup>

        <FormGroup role="group" aria-labelledby="contact-info-heading">
          <h4 id="contact-info-heading" className="text-md font-medium mb-4">
            Contact Information
          </h4>
          
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="interactive-email" required>
                Email Address
              </FormLabel>
              <Input 
                id="interactive-email"
                type="email"
                placeholder="your.email@example.com"
                hint="Primary contact email"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="interactive-phone">
                Phone Number
              </FormLabel>
              <Input 
                id="interactive-phone"
                type="tel"
                placeholder="+40 XXX XXX XXX"
                hint="Optional - for SMS notifications"
              />
            </FormGroup>
          </div>
        </FormGroup>

        <FormGroup role="group" aria-labelledby="preferences-heading">
          <h4 id="preferences-heading" className="text-md font-medium mb-4">
            Preferences
          </h4>
          
          <div className="space-y-4">
            <Checkbox 
              label="Subscribe to newsletter"
              hint="Get weekly financial tips and product updates"
            />
            
            <Checkbox 
              label="Enable SMS notifications"
              hint="Receive important account alerts via SMS"
            />
          </div>
        </FormGroup>
      </div>
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-copper-600" />
          <h3 className="text-lg font-semibold">Account Setup Form</h3>
        </div>
        
        <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
          <FormGroup role="group" aria-labelledby="account-details">
            <h4 id="account-details" className="text-md font-medium mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Account Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="account-name" required>
                  Account Name
                </FormLabel>
                <Input 
                  id="account-name"
                  placeholder="e.g., Main Checking"
                  hint="A descriptive name for this account"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="account-type" required>
                  Account Type
                </FormLabel>
                <Select 
                  id="account-type"
                  placeholder="Select account type"
                  options={[
                    { value: 'checking', label: 'Checking Account' },
                    { value: 'savings', label: 'Savings Account' },
                    { value: 'credit', label: 'Credit Card' },
                    { value: 'investment', label: 'Investment Account' }
                  ]}
                />
              </FormGroup>
            </div>
          </FormGroup>

          <FormGroup role="group" aria-labelledby="initial-balance">
            <h4 id="initial-balance" className="text-md font-medium mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Initial Balance
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="opening-balance" required>
                  Opening Balance
                </FormLabel>
                <Input 
                  id="opening-balance"
                  type="number"
                  placeholder="0.00"
                  hint="Current balance in this account"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="currency" required>
                  Currency
                </FormLabel>
                <Select 
                  id="currency"
                  defaultValue="RON"
                  options={[
                    { value: 'RON', label: 'Romanian Leu (RON)' },
                    { value: 'EUR', label: 'Euro (EUR)' },
                    { value: 'USD', label: 'US Dollar (USD)' }
                  ]}
                />
              </FormGroup>
            </div>
          </FormGroup>

          <FormGroup role="group" aria-labelledby="budget-settings">
            <h4 id="budget-settings" className="text-md font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Budget & Alerts
            </h4>
            
            <div className="space-y-4">
              <FormGroup>
                <FormLabel htmlFor="monthly-budget">
                  Monthly Budget Limit
                </FormLabel>
                <Input 
                  id="monthly-budget"
                  type="number"
                  placeholder="1000.00"
                  hint="Optional - set spending limits for this account"
                />
              </FormGroup>
              
              <div className="space-y-3">
                <Checkbox 
                  label="Enable low balance alerts"
                  hint="Get notified when balance drops below 100 RON"
                />
                
                <Checkbox 
                  label="Enable budget notifications"
                  hint="Alert when approaching monthly budget limit"
                />
                
                <Checkbox 
                  label="Include in financial reports"
                  defaultChecked
                  hint="Include this account in monthly summaries"
                />
              </div>
            </div>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="account-notes">
              Notes
            </FormLabel>
            <Textarea 
              id="account-notes"
              placeholder="Additional information about this account..."
              hint="Optional - any relevant details or reminders"
            />
          </FormGroup>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-carbon-600 dark:text-carbon-400 bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
        <Info className="w-4 h-4" />
        Form groups provide logical organization and improve accessibility for screen readers
      </div>
    </div>
  )
}; 