import type { Meta, StoryObj } from '@storybook/react';
import Progress from './Progress';
import { useState, useEffect } from 'react';

/**
 * 🎨 Progress Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Progress> = {
  title: 'CVA-v2/Primitives/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Progress component pentru tracking progres cu suport pentru variante financiare și animații, construit cu CVA-v2 system.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Valoarea curentă a progresului'
    },
    max: {
      control: 'number',
      description: 'Valoarea maximă'
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'financial'],
      description: 'Stilul vizual al progress bar-ului'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea progress bar-ului'
    },
    animated: {
      control: 'boolean',
      description: 'Activează animația progress bar-ului'
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'bottom', 'inline'],
      description: 'Poziția label-ului'
    },
    showPercentage: {
      control: 'boolean',
      description: 'Afișează procentajul'
    },
    showValue: {
      control: 'boolean',
      description: 'Afișează valorile numerice'
    },
    label: {
      control: 'text',
      description: 'Label-ul progress bar-ului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Progress Story
 */
export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    variant: 'default',
    size: 'md',
    label: 'Progress',
    showPercentage: true
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <Progress
        value={75}
        variant="default"
        label="Default Progress"
        showPercentage
      />
      
      <Progress
        value={90}
        variant="success"
        label="Success Progress"
        showPercentage
      />
      
      <Progress
        value={60}
        variant="warning"
        label="Warning Progress"
        showPercentage
      />
      
      <Progress
        value={25}
        variant="error"
        label="Error Progress"
        showPercentage
      />
      
      <Progress
        value={4500}
        max={6000}
        variant="financial"
        label="Financial Progress"
        showValue
        showPercentage
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
      <Progress
        value={65}
        size="sm"
        label="Small Size"
        showPercentage
      />
      
      <Progress
        value={65}
        size="md"
        label="Medium Size (Default)"
        showPercentage
      />
      
      <Progress
        value={65}
        size="lg"
        label="Large Size"
        showPercentage
      />
    </div>
  )
};

/**
 * Pozițiile label-ului
 */
export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-8">
      <Progress
        value={75}
        label="Top Label"
        labelPosition="top"
        showPercentage
      />
      
      <Progress
        value={75}
        label="Bottom Label"
        labelPosition="bottom"
        showPercentage
      />
      
      <Progress
        value={75}
        label="Inline Label"
        labelPosition="inline"
        showPercentage
      />
    </div>
  )
};

/**
 * Progress animat
 */
export const AnimatedProgress: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setValue(prev => {
          const next = prev + 2;
          return next > 100 ? 0 : next;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="space-y-6">
        <Progress
          value={value}
          variant="default"
          animated
          label="Animated Progress"
          showPercentage
        />
        
        <Progress
          value={value}
          variant="success"
          animated
          label="Animated Success"
          showPercentage
          size="lg"
        />
      </div>
    );
  }
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Budget Tracking</h3>
          
          <Progress
            value={2500}
            max={3000}
            variant="financial"
            label="Food & Dining"
            showValue
            showPercentage
          />
          
          <Progress
            value={1200}
            max={1000}
            variant="error"
            label="Entertainment (Over Budget)"
            showValue
            showPercentage
          />
          
          <Progress
            value={450}
            max={800}
            variant="success"
            label="Transportation"
            showValue
            showPercentage
          />
          
          <Progress
            value={750}
            max={1000}
            variant="warning"
            label="Shopping (75% used)"
            showValue
            showPercentage
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Savings Goals</h3>
          
          <Progress
            value={15000}
            max={20000}
            variant="financial"
            label="Emergency Fund"
            showValue
            showPercentage
            animated
          />
          
          <Progress
            value={8500}
            max={25000}
            variant="default"
            label="Vacation Fund"
            showValue
            showPercentage
          />
          
          <Progress
            value={45000}
            max={50000}
            variant="success"
            label="House Down Payment"
            showValue
            showPercentage
          />
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium">Income vs Expenses</h4>
            <Progress
              value={4200}
              max={5000}
              variant="financial"
              label="Monthly Income Used"
              showValue
              showPercentage
              labelPosition="inline"
              size="sm"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Debt Reduction</h4>
            <Progress
              value={12000}
              max={20000}
              variant="warning"
              label="Remaining Debt"
              showValue
              showPercentage
              labelPosition="inline"
              size="sm"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Investment Goal</h4>
            <Progress
              value={3500}
              max={10000}
              variant="default"
              label="Annual Investment"
              showValue
              showPercentage
              labelPosition="inline"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
};

/**
 * Display Options
 */
export const DisplayOptions: Story = {
  render: () => (
    <div className="space-y-6">
      <Progress
        value={75}
        label="Only Label"
      />
      
      <Progress
        value={75}
        label="Label + Percentage"
        showPercentage
      />
      
      <Progress
        value={75}
        max={100}
        label="Label + Values"
        showValue
      />
      
      <Progress
        value={75}
        label="Label + Values + Percentage"
        showValue
        showPercentage
      />
      
      <Progress
        value={75}
        showPercentage
      />
      
      <Progress
        value={2500}
        max={3000}
        variant="financial"
        showValue
      />
    </div>
  )
};

/**
 * Complex Financial Dashboard
 */
export const ComplexFinancialDashboard: Story = {
  render: () => {
    const [monthProgress, setMonthProgress] = useState(65);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setMonthProgress(prev => {
          const next = prev + 1;
          return next > 100 ? 65 : next;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="space-y-8">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Financial Health Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Progress
                value={monthProgress}
                variant="default"
                label="Month Progress"
                showPercentage
                animated
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <Progress
                value={85}
                variant="success"
                label="Savings Rate"
                showPercentage
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <Progress
                value={45}
                variant="warning"
                label="Debt-to-Income"
                showPercentage
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <Progress
                value={92}
                variant="error"
                label="Budget Utilization"
                showPercentage
                size="sm"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Category Spending</h3>
          
          <div className="space-y-4">
            <Progress
              value={1850}
              max={2000}
              variant="financial"
              label="Housing & Utilities"
              showValue
              showPercentage
              labelPosition="inline"
            />
            
            <Progress
              value={650}
              max={800}
              variant="financial"
              label="Food & Groceries"
              showValue
              showPercentage
              labelPosition="inline"
            />
            
            <Progress
              value={320}
              max={500}
              variant="financial"
              label="Transportation"
              showValue
              showPercentage
              labelPosition="inline"
            />
            
            <Progress
              value={480}
              max={400}
              variant="error"
              label="Entertainment (Over Budget)"
              showValue
              showPercentage
              labelPosition="inline"
            />
            
            <Progress
              value={150}
              max={300}
              variant="success"
              label="Healthcare"
              showValue
              showPercentage
              labelPosition="inline"
            />
          </div>
        </div>
      </div>
    );
  }
}; 
