import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, CreditCard, Shield, Star } from 'lucide-react';
import FormLabel from './FormLabel';
import Input from '../Input/Input';
import Textarea from '../Textarea/Textarea';
import Select from '../Select/Select';

/**
 * 🎨 FormLabel Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof FormLabel> = {
  title: 'CVA-v2/Primitives/FormLabel',
  component: FormLabel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FormLabel component pentru labeling consistent și accesibil, construit cu CVA-v2 system cu Carbon Copper styling și suport pentru validare.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error'],
      description: 'Stilul vizual al label-ului'
    },
    required: {
      control: 'boolean',
      description: 'Marchează ca obligatoriu'
    },
    htmlFor: {
      control: 'text',
      description: 'ID-ul input-ului asociat'
    },
    children: {
      control: 'text',
      description: 'Textul label-ului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FormLabel Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    required: false,
    htmlFor: 'example-input',
    children: 'Email Address'
  }
};

/**
 * All Variants Overview
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Labels</h3>
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="default1">
              Optional Field
            </FormLabel>
            <Input id="default1" placeholder="This field is optional" />
          </div>
          
          <div>
            <FormLabel htmlFor="default2" required>
              Required Field
            </FormLabel>
            <Input id="default2" placeholder="This field is required" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Success Labels</h3>
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="success1" variant="success">
              Valid Field
            </FormLabel>
            <Input 
              id="success1" 
              defaultValue="valid@example.com"
              success="Great! This email is available"
            />
          </div>
          
          <div>
            <FormLabel htmlFor="success2" variant="success" required>
              Valid Required Field
            </FormLabel>
            <Input 
              id="success2" 
              defaultValue="Strong password"
              success="Password meets all requirements"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Error Labels</h3>
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="error1" variant="error">
              Invalid Field
            </FormLabel>
            <Input 
              id="error1" 
              defaultValue="invalid-email"
              error="Please enter a valid email address"
            />
          </div>
          
          <div>
            <FormLabel htmlFor="error2" variant="error" required>
              Missing Required Field
            </FormLabel>
            <Input 
              id="error2" 
              placeholder="This field is required"
              error="This field is required and cannot be empty"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Different Form Elements</h3>
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="textarea-label" required>
              Description
            </FormLabel>
            <Textarea id="textarea-label" placeholder="Enter description..." />
          </div>
          
          <div>
            <FormLabel htmlFor="select-label" required>
              Category
            </FormLabel>
            <Select 
              id="select-label" 
              placeholder="Select category..."
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
              ]}
            />
          </div>
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
      <h3 className="text-lg font-semibold">Interactive Form with Dynamic Labels</h3>
      
      <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="interactive-name" required>
              Full Name
            </FormLabel>
            <Input 
              id="interactive-name"
              placeholder="Enter your full name"
              hint="As it appears on your official documents"
            />
          </div>
          
          <div>
            <FormLabel htmlFor="interactive-phone">
              Phone Number
            </FormLabel>
            <Input 
              id="interactive-phone"
              type="tel"
              placeholder="+40 XXX XXX XXX"
              hint="We'll use this for important notifications only"
            />
          </div>
        </div>

        <div>
          <FormLabel htmlFor="interactive-bio">
            Bio
          </FormLabel>
          <Textarea 
            id="interactive-bio"
            placeholder="Tell us about yourself..."
            hint="Optional - this will appear on your profile"
          />
        </div>

        <div>
          <FormLabel htmlFor="interactive-country" required>
            Country
          </FormLabel>
          <Select 
            id="interactive-country"
            placeholder="Select your country..."
            options={[
              { value: 'ro', label: 'Romania' },
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'de', label: 'Germany' }
            ]}
          />
        </div>
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
          <CreditCard className="w-5 h-5 text-copper-600" />
          <h3 className="text-lg font-semibold">Financial Information Form</h3>
        </div>
        
        <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="account-holder" required>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Account Holder Name
                </div>
              </FormLabel>
              <Input 
                id="account-holder"
                placeholder="Full legal name"
                hint="Must match your official documents"
              />
            </div>
            
            <div>
              <FormLabel htmlFor="account-number" required>
                Account Number
              </FormLabel>
              <Input 
                id="account-number"
                type="password"
                placeholder="••••••••••••"
                hint="Your information is encrypted and secure"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="monthly-income" required>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Monthly Income
                </div>
              </FormLabel>
              <Input 
                id="monthly-income"
                type="number"
                placeholder="0.00"
                hint="Gross monthly income in RON"
              />
            </div>
            
            <div>
              <FormLabel htmlFor="expense-category" required>
                Primary Expense Category
              </FormLabel>
              <Select 
                id="expense-category"
                placeholder="Select category..."
                options={[
                  { value: 'housing', label: 'Housing & Utilities' },
                  { value: 'transport', label: 'Transportation' },
                  { value: 'food', label: 'Food & Dining' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'entertainment', label: 'Entertainment' }
                ]}
              />
            </div>
          </div>

          <div>
            <FormLabel htmlFor="investment-goals" variant="default">
              Investment Goals
            </FormLabel>
            <Textarea 
              id="investment-goals"
              placeholder="Describe your financial goals and investment preferences..."
              hint="This helps us provide better recommendations"
            />
          </div>

          <div>
            <FormLabel htmlFor="risk-tolerance" required>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Risk Tolerance
              </div>
            </FormLabel>
            <Select 
              id="risk-tolerance"
              placeholder="Select your risk tolerance..."
              hint="This affects investment recommendations"
              options={[
                { value: 'conservative', label: 'Conservative - Low Risk, Stable Returns' },
                { value: 'moderate', label: 'Moderate - Balanced Risk and Growth' },
                { value: 'aggressive', label: 'Aggressive - High Risk, High Potential' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-carbon-600 dark:text-carbon-400 bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
        <Shield className="w-4 h-4" />
        All financial information is encrypted and stored securely
      </div>
    </div>
  )
}; 