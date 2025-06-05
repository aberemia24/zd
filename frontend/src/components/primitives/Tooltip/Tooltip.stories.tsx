import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';
import Button from '../Button/Button';
import { HelpCircle, Info, AlertTriangle, DollarSign } from 'lucide-react';

/**
 * 🎨 Tooltip Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Tooltip> = {
  title: 'CVA-v2/Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip component pentru informații suplimentare, construit cu CVA-v2 system cu poziționare inteligentă și variante multiple.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Poziția tooltip-ului față de element'
    },
    variant: {
      control: 'select',
      options: ['default', 'info', 'warning', 'error', 'success'],
      description: 'Stilul vizual al tooltip-ului'
    },
    content: {
      control: 'text',
      description: 'Conținutul tooltip-ului'
    },
    delay: {
      control: 'number',
      description: 'Delay în milisecunde înainte de afișare'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează tooltip-ul'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Tooltip Story
 */
export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    placement: 'top',
    variant: 'default',
    children: <Button>Hover me</Button>
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-8">
      <Tooltip content="Default tooltip styling" variant="default">
        <Button variant="outline">Default</Button>
      </Tooltip>
      
      <Tooltip content="Informational message" variant="info">
        <Button variant="outline">Info</Button>
      </Tooltip>
      
      <Tooltip content="Warning about this action" variant="warning">
        <Button variant="outline">Warning</Button>
      </Tooltip>
      
      <Tooltip content="Error or critical information" variant="error">
        <Button variant="outline">Error</Button>
      </Tooltip>
      
      <Tooltip content="Success confirmation" variant="success">
        <Button variant="outline">Success</Button>
      </Tooltip>
    </div>
  )
};

/**
 * Toate pozițiile disponibile
 */
export const AllPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-16">
      <div className="flex justify-center">
        <Tooltip content="Tooltip pe top" placement="top">
          <Button>Top</Button>
        </Tooltip>
      </div>
      
      <div className="flex justify-center">
        <Tooltip content="Tooltip pe bottom" placement="bottom">
          <Button>Bottom</Button>
        </Tooltip>
      </div>
      
      <div className="flex justify-center">
        <Tooltip content="Tooltip pe left" placement="left">
          <Button>Left</Button>
        </Tooltip>
      </div>
      
      <div className="flex justify-center">
        <Tooltip content="Tooltip pe right" placement="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
    </div>
  )
};

/**
 * Tooltip cu icoane și text complex
 */
export const WithIconsAndContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-8">
      <Tooltip 
        content="Click here to get help with this feature"
        variant="info"
      >
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <HelpCircle size={20} className="text-blue-500" />
        </button>
      </Tooltip>
      
      <Tooltip 
        content="Important: This action cannot be undone"
        variant="warning"
        placement="bottom"
      >
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <AlertTriangle size={20} className="text-amber-500" />
        </button>
      </Tooltip>
      
      <Tooltip 
        content="Additional information about this field"
        variant="default"
        placement="right"
      >
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Info size={20} className="text-gray-500" />
        </button>
      </Tooltip>
    </div>
  )
};

/**
 * Tooltip cu delay customizat
 */
export const CustomDelay: Story = {
  render: () => (
    <div className="flex gap-6 p-8">
      <Tooltip content="Instant tooltip" delay={0}>
        <Button variant="outline">No Delay</Button>
      </Tooltip>
      
      <Tooltip content="Fast tooltip" delay={100}>
        <Button variant="outline">100ms</Button>
      </Tooltip>
      
      <Tooltip content="Default delay tooltip" delay={200}>
        <Button variant="outline">200ms (default)</Button>
      </Tooltip>
      
      <Tooltip content="Slow tooltip" delay={500}>
        <Button variant="outline">500ms</Button>
      </Tooltip>
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">Total Balance</span>
        <Tooltip 
          content="Your total balance across all accounts. Updated in real-time."
          variant="info"
        >
          <HelpCircle size={16} className="text-blue-500 cursor-help" />
        </Tooltip>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-copper-600">4,523.45 RON</span>
        <Tooltip 
          content="This amount includes pending transactions that may still be processing."
          variant="warning"
          placement="right"
        >
          <AlertTriangle size={16} className="text-amber-500 cursor-help" />
        </Tooltip>
      </div>
      
      <div className="flex items-center gap-4">
        <DollarSign size={20} className="text-green-500" />
        <span>Monthly Income</span>
        <Tooltip 
          content="Average monthly income calculated from the last 3 months of data."
          variant="success"
          placement="bottom"
        >
          <Info size={16} className="text-green-500 cursor-help" />
        </Tooltip>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Budget exceeded</span>
        <Tooltip 
          content="You have exceeded your monthly budget by 125.30 RON. Consider reviewing your expenses."
          variant="error"
          placement="top"
        >
          <AlertTriangle size={14} className="text-red-600 cursor-help" />
        </Tooltip>
      </div>
    </div>
  )
};

/**
 * Tooltip disabled
 */
export const DisabledTooltip: Story = {
  render: () => (
    <div className="flex gap-6 p-8">
      <Tooltip content="This tooltip is enabled" disabled={false}>
        <Button>Enabled Tooltip</Button>
      </Tooltip>
      
      <Tooltip content="This tooltip is disabled" disabled={true}>
        <Button variant="outline">Disabled Tooltip</Button>
      </Tooltip>
    </div>
  )
}; 