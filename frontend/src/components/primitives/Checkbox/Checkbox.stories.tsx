import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Shield, CreditCard, AlertTriangle, Check } from 'lucide-react';
import Checkbox from './Checkbox';

/**
 * 🎨 Checkbox Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Checkbox> = {
  title: 'CVA-v2/Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Checkbox component pentru selecții și validare, construit cu CVA-v2 system cu Carbon Copper styling și suport pentru stări multiple.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      description: 'Stilul vizual al checkbox-ului'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea checkbox-ului'
    },
    label: {
      control: 'text',
      description: 'Textul label-ului'
    },
    error: {
      control: 'text', 
      description: 'Mesaj de eroare'
    },
    success: {
      control: 'text',
      description: 'Mesaj de succes'
    },
    hint: {
      control: 'text',
      description: 'Text ajutor'
    },
    required: {
      control: 'boolean',
      description: 'Marchează ca obligatoriu'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează checkbox-ul'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Checkbox Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Accept terms and conditions',
    hint: 'Please read our terms before accepting'
  }
};

/**
 * All Variants Overview
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Variant Types</h3>
        <div className="space-y-4">
          <Checkbox 
            variant="default" 
            label="Default Variant" 
            defaultChecked 
          />
          <Checkbox 
            variant="filled" 
            label="Filled Variant" 
            defaultChecked 
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="space-y-4">
          <Checkbox 
            size="sm" 
            label="Small Checkbox" 
            defaultChecked 
          />
          <Checkbox 
            size="md" 
            label="Medium Checkbox (Default)" 
            defaultChecked 
          />
          <Checkbox 
            size="lg" 
            label="Large Checkbox" 
            defaultChecked 
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="space-y-4">
          <Checkbox 
            label="Unchecked State" 
          />
          <Checkbox 
            label="Checked State" 
            defaultChecked 
          />
          <Checkbox 
            label="Required Field" 
            required 
            hint="This field is mandatory"
          />
          <Checkbox 
            label="Disabled Unchecked" 
            disabled 
          />
          <Checkbox 
            label="Disabled Checked" 
            disabled 
            defaultChecked 
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Validation States</h3>
        <div className="space-y-4">
          <Checkbox 
            label="Valid Selection" 
            success="Great choice!" 
            defaultChecked 
          />
          <Checkbox 
            label="Invalid Selection" 
            error="This option is required"
          />
          <Checkbox 
            label="With Hint" 
            hint="Additional information about this option"
          />
        </div>
      </div>
    </div>
  )
};

/**
 * Interactive Features
 */
export const Interactive: Story = {
  render: () => {
    const [preferences, setPreferences] = useState({
      notifications: true,
      marketing: false,
      analytics: false,
      required: false
    });

    const handleChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences(prev => ({
        ...prev,
        [key]: event.target.checked
      }));
    };

    return (
      <div className="space-y-6 p-6">
        <h3 className="text-lg font-semibold">Interactive Checkbox Group</h3>
        
        <div className="space-y-4 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
          <Checkbox
            label="Enable notifications"
            checked={preferences.notifications}
            onChange={handleChange('notifications')}
            hint="Receive alerts about important account activity"
          />
          
          <Checkbox
            label="Marketing communications"
            checked={preferences.marketing}
            onChange={handleChange('marketing')}
            hint="Promotional emails and product updates"
          />
          
          <Checkbox
            label="Analytics & performance"
            checked={preferences.analytics}
            onChange={handleChange('analytics')}
            hint="Help us improve our services"
          />
          
          <Checkbox
            label="Required agreement"
            checked={preferences.required}
            onChange={handleChange('required')}
            required
            error={!preferences.required ? "You must accept this agreement" : ""}
            success={preferences.required ? "Agreement accepted" : ""}
          />
        </div>

        <div className="text-sm text-carbon-600 dark:text-carbon-400">
          Current state: {JSON.stringify(preferences, null, 2)}
        </div>
      </div>
    );
  }
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      autoInvest: false,
      highRiskWarning: true,
      twoFactorAuth: true,
      marketingConsent: false,
      dataSharing: false
    });

    const handleFinancialChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings(prev => ({
        ...prev,
        [key]: event.target.checked
      }));
    };

    return (
      <div className="space-y-8 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-copper-600" />
            <h3 className="text-lg font-semibold">Security Settings</h3>
          </div>
          
          <div className="space-y-4 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
            <Checkbox
              size="md"
              label="Enable Two-Factor Authentication"
              checked={settings.twoFactorAuth}
              onChange={handleFinancialChange('twoFactorAuth')}
              success={settings.twoFactorAuth ? "Your account is more secure" : ""}
              hint="Adds an extra layer of security to your account"
            />
            
            <Checkbox
              size="md"
              label="Show high-risk investment warnings"
              checked={settings.highRiskWarning}
              onChange={handleFinancialChange('highRiskWarning')}
              hint="Display warnings for volatile investments"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-copper-600" />
            <h3 className="text-lg font-semibold">Investment Preferences</h3>
          </div>
          
          <div className="space-y-4 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
            <Checkbox
              size="md"
              label="Enable automatic investing"
              checked={settings.autoInvest}
              onChange={handleFinancialChange('autoInvest')}
              hint="Automatically invest spare change from transactions"
              error={settings.autoInvest && !settings.twoFactorAuth ? "Two-factor authentication required for auto-investing" : ""}
            />
            
            <Checkbox
              size="md"
              label="Share anonymized transaction data"
              checked={settings.dataSharing}
              onChange={handleFinancialChange('dataSharing')}
              hint="Help improve financial services (fully anonymized)"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-copper-600" />
            <h3 className="text-lg font-semibold">Communications</h3>
          </div>
          
          <div className="space-y-4 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
            <Checkbox
              size="md"
              label="Marketing communications consent"
              checked={settings.marketingConsent}
              onChange={handleFinancialChange('marketingConsent')}
              hint="Receive newsletters, product updates, and special offers"
            />
          </div>
        </div>

        <div className="text-xs text-carbon-500 bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
          <Check className="w-4 h-4 inline mr-2" />
          Settings auto-saved: {JSON.stringify(settings, null, 2)}
        </div>
      </div>
    );
  }
}; 
