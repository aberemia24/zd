import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

/**
 * 🎨 Button Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Button> = {
  title: 'CVA-v2/Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component cu multiple variante și size-uri, construit cu CVA-v2 system.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Stilul vizual al butonului'
    },
    size: {
      control: 'select', 
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Mărimea butonului'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează butonul'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Button Story
 */
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Default Button'
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
};

/**
 * Toate size-urile disponibile
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>  
      <Button size="lg">Large</Button>
    </div>
  )
};

/**
 * Button dezactivat
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" disabled>Primary Disabled</Button>
      <Button variant="secondary" disabled>Secondary Disabled</Button>
      <Button variant="outline" disabled>Outline Disabled</Button>
    </div>
  )
}; 
