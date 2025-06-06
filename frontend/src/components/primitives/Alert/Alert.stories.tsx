import type { Meta, StoryObj } from '@storybook/react';
import Alert from './Alert';
import { AlertTriangle, CheckCircle, Info, XCircle, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

/**
 * 🎨 Alert Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Alert> = {
  title: 'CVA-v2/Primitives/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Alert component pentru notificări și mesaje importante, construit cu CVA-v2 system cu Carbon Copper styling și variante semantice.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Stilul vizual al alert-ului'
    },
    title: {
      control: 'text',
      description: 'Titlul alert-ului'
    },
    children: {
      control: 'text',
      description: 'Conținutul alert-ului'
    },
    icon: {
      control: false,
      description: 'Icon custom (React element)'
    },
    onClose: {
      control: false,
      description: 'Callback pentru închiderea alert-ului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Basic Stories
export const Default: Story = {
  args: {
    title: 'Information',
    children: 'This is a default alert with some important information about your account status.'
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Transaction Successful',
    children: 'Your payment of 150.00 RON has been processed successfully.'
  }
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Account Warning',
    children: 'Your account balance is running low. Consider adding funds to avoid service interruption.'
  }
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Payment Failed',
    children: 'Unable to process your payment. Please check your card details and try again.'
  }
};

// All Variants Overview
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default" title="Default Alert">
        This is a default alert for general information and updates.
      </Alert>
      
      <Alert variant="success" title="Success Alert">
        Operation completed successfully! Your data has been saved.
      </Alert>
      
      <Alert variant="warning" title="Warning Alert">
        Please review your settings before continuing with this action.
      </Alert>
      
      <Alert variant="error" title="Error Alert">
        Something went wrong. Please try again or contact support.
      </Alert>
    </div>
  )
};

// With Custom Icons
export const WithCustomIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert 
        variant="default" 
        title="Account Info"
        icon={<Info className="h-5 w-5 text-copper-600" />}
      >
        Your account details have been updated with new security settings.
      </Alert>
      
      <Alert 
        variant="success" 
        title="Payment Confirmed"
        icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
      >
        Payment of 245.50 RON has been successfully processed.
      </Alert>
      
      <Alert 
        variant="warning" 
        title="Budget Alert"
        icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
      >
        You've exceeded 80% of your monthly budget for dining expenses.
      </Alert>
      
      <Alert 
        variant="error" 
        title="Transaction Failed"
        icon={<XCircle className="h-5 w-5 text-red-600" />}
      >
        Unable to process transaction. Insufficient funds in account.
      </Alert>
    </div>
  )
};

// Financial Context Examples
export const FinancialAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert 
        variant="success" 
        title="Budget Goal Achieved"
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
      >
        Congratulations! You've saved 300.00 RON this month, reaching your savings goal.
      </Alert>
      
      <Alert 
        variant="warning" 
        title="Unusual Spending Pattern"
        icon={<TrendingDown className="h-5 w-5 text-amber-600" />}
      >
        Your spending on entertainment is 150% higher than usual this month. Review your transactions.
      </Alert>
      
      <Alert 
        variant="default" 
        title="Monthly Report Ready"
        icon={<DollarSign className="h-5 w-5 text-copper-600" />}
      >
        Your financial report for December 2024 is ready for download. Total expenses: 2,450.75 RON
      </Alert>
      
      <Alert 
        variant="error" 
        title="Subscription Payment Failed"
        icon={<XCircle className="h-5 w-5 text-red-600" />}
      >
        Netflix subscription renewal failed. Update your payment method to avoid service interruption.
      </Alert>
    </div>
  )
};

// Closeable Alerts
export const CloseableAlert: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'default' as const, title: 'System Update', message: 'New features available in your dashboard.' },
      { id: 2, variant: 'success' as const, title: 'Backup Complete', message: 'Your data has been safely backed up.' },
      { id: 3, variant: 'warning' as const, title: 'Maintenance Notice', message: 'Scheduled maintenance tomorrow at 2 AM.' }
    ]);

    const closeAlert = (id: number) => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
      <div className="space-y-4">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            onClose={() => closeAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-carbon-500">
            All alerts have been dismissed. Click "Refresh" in Storybook to reset.
          </div>
        )}
      </div>
    );
  }
};

// Without Title
export const WithoutTitle: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default">
        Simple alert message without a title. Useful for inline notifications.
      </Alert>
      
      <Alert variant="success">
        Transaction completed successfully.
      </Alert>
      
      <Alert variant="warning">
        Please verify your email address.
      </Alert>
      
      <Alert variant="error">
        Connection timeout. Please try again.
      </Alert>
    </div>
  )
};

// Complex Financial Dashboard Alert
export const DashboardAlert: Story = {
  render: () => (
    <Alert 
      variant="warning" 
      title="Monthly Budget Analysis"
      icon={<DollarSign className="h-5 w-5 text-amber-600" />}
    >
      <div className="space-y-3">
        <p>You're approaching your monthly spending limit:</p>
        <div className="bg-white/50 dark:bg-carbon-800/50 p-3 rounded-md">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Spent:</span>
              <div className="font-mono text-amber-700 dark:text-amber-300">1,847.50 RON</div>
            </div>
            <div>
              <span className="font-medium">Budget:</span>
              <div className="font-mono text-carbon-700 dark:text-carbon-300">2,000.00 RON</div>
            </div>
            <div>
              <span className="font-medium">Remaining:</span>
              <div className="font-mono text-emerald-700 dark:text-emerald-300">152.50 RON</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Consider reviewing your spending categories to stay within budget.
        </p>
      </div>
    </Alert>
  )
}; 
