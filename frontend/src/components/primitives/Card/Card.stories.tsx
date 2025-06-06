import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

/**
 * 🎨 Card Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Card> = {
  title: 'CVA-v2/Primitives/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card component pentru gruparea conținutului, optimizat pentru date financiare cu CVA-v2 styling.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'interactive', 'financial', 'compact', 'highlight'],
      description: 'Stilul vizual al card-ului'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea textului din card'
    },
    title: {
      control: 'text',
      description: 'Titlul card-ului'
    },
    loading: {
      control: 'boolean',
      description: 'Starea de loading'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Card Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    title: 'Card Title',
    children: (
      <div className="space-y-2">
        <p className="text-carbon-600 dark:text-carbon-400">
          This is the default card with basic content.
        </p>
        <p className="text-sm text-carbon-500 dark:text-carbon-500">
          Additional information can be placed here.
        </p>
      </div>
    )
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card variant="default" title="Default">
        <p className="text-carbon-600 dark:text-carbon-400">Standard card styling</p>
      </Card>
      
      <Card variant="elevated" title="Elevated">
        <p className="text-carbon-600 dark:text-carbon-400">Card with shadow elevation</p>
      </Card>
      
      <Card variant="interactive" title="Interactive">
        <p className="text-carbon-600 dark:text-carbon-400">Hover effects for clickable content</p>
      </Card>
      
      <Card variant="financial" title="Financial">
        <p className="text-copper-600 dark:text-copper-400">Optimized for financial data</p>
      </Card>
      
      <Card variant="compact" title="Compact">
        <p className="text-carbon-600 dark:text-carbon-400">Reduced padding for dense layouts</p>
      </Card>
      
      <Card variant="highlight" title="Highlight">
        <p className="text-copper-600 dark:text-copper-400">Highlighted for important content</p>
      </Card>
    </div>
  )
};

/**
 * Card sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card variant="default" size="sm" title="Small Size">
        <p className="text-carbon-600 dark:text-carbon-400">Smaller text size for compact layouts</p>
      </Card>
      
      <Card variant="default" size="md" title="Medium Size">
        <p className="text-carbon-600 dark:text-carbon-400">Default text size for most use cases</p>
      </Card>
      
      <Card variant="default" size="lg" title="Large Size">
        <p className="text-carbon-600 dark:text-carbon-400">Larger text size for emphasis</p>
      </Card>
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card variant="financial" title="Total Balance">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-copper-600 dark:text-copper-400">
            4,523.45 RON
          </div>
          <div className="text-sm text-carbon-500 dark:text-carbon-400">
            +12.3% this month
          </div>
        </div>
      </Card>
      
      <Card variant="highlight" title="Monthly Expenses">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-carbon-900 dark:text-carbon-100">
            1,890.20 RON
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">
            +5.7% vs last month
          </div>
        </div>
      </Card>
      
      <Card variant="elevated" title="Savings Goal">
        <div className="space-y-3">
          <div className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
            Vacation Fund
          </div>
          <div className="w-full bg-carbon-200 rounded-full h-2 dark:bg-carbon-700">
            <div className="bg-copper-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="text-sm text-carbon-600 dark:text-carbon-400">
            2,600 / 4,000 RON (65%)
          </div>
        </div>
      </Card>
      
      <Card variant="compact" title="Quick Stats">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm">Transactions</span>
            <span className="text-sm font-medium">47</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Categories</span>
            <span className="text-sm font-medium">8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Avg/day</span>
            <span className="text-sm font-medium">152.30 RON</span>
          </div>
        </div>
      </Card>
    </div>
  )
};

/**
 * Loading State
 */
export const LoadingState: Story = {
  args: {
    loading: true,
    variant: 'default'
  }
};

/**
 * Error State
 */
export const ErrorState: Story = {
  args: {
    error: 'Failed to load card data',
    variant: 'default'
  }
}; 
