import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

/**
 * 🎨 Badge Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Badge> = {
  title: 'CVA-v2/Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component pentru status și categorii, construit cu CVA-v2 system cu Carbon Copper styling.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'neutral'],
      description: 'Stilul vizual al badge-ului'
    },
    children: {
      control: 'text',
      description: 'Conținutul badge-ului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Badge Story
 */
export const Default: Story = {
  args: {
    variant: 'neutral',
    children: 'Badge'
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  )
};

/**
 * Exemple de utilizare practică
 */
export const PracticalExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Transaction Status:</span>
        <Badge variant="success">Completed</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="neutral">Draft</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Categories:</span>
        <Badge variant="primary">Food & Dining</Badge>
        <Badge variant="secondary">Transport</Badge>
        <Badge variant="neutral">Entertainment</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Badge variant="primary">High</Badge>
        <Badge variant="warning">Medium</Badge>
        <Badge variant="neutral">Low</Badge>
      </div>
    </div>
  )
};

/**
 * Badge cu numere și text lung
 */
export const WithNumbers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="primary">12</Badge>
      <Badge variant="success">+5.2%</Badge>
      <Badge variant="warning">-2.1%</Badge>
      <Badge variant="neutral">1,234 transactions</Badge>
    </div>
  )
}; 