import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './Textarea';
import { useState } from 'react';

/**
 * 🎨 Textarea Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Textarea> = {
  title: 'CVA-v2/Primitives/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Textarea component cu suport pentru validare, character counting și multiple variante CVA-v2, optimizat pentru aplicații financiare.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      description: 'Stilul vizual al textarea-ului'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea textarea-ului'
    },
    label: {
      control: 'text',
      description: 'Label-ul textarea-ului'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Dezactivează textarea-ul'
    },
    required: {
      control: 'boolean',
      description: 'Marchează textarea-ul ca obligatoriu'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Textarea ocupă toată lățimea disponibilă'
    },
    withCharacterCount: {
      control: 'boolean',
      description: 'Afișează contorul de caractere'
    },
    maxLength: {
      control: 'number',
      description: 'Numărul maxim de caractere'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Textarea Story
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Description',
    placeholder: 'Enter your description...',
    rows: 4
  }
};

/**
 * Toate variantele disponibile
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <Textarea
        variant="default"
        label="Default Variant"
        placeholder="Default textarea styling..."
        rows={3}
      />
      
      <Textarea
        variant="filled"
        label="Filled Variant"
        placeholder="Filled background styling..."
        rows={3}
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
      <Textarea
        size="sm"
        label="Small Size"
        placeholder="Small textarea..."
        rows={2}
      />
      
      <Textarea
        size="md"
        label="Medium Size (Default)"
        placeholder="Medium textarea..."
        rows={3}
      />
      
      <Textarea
        size="lg"
        label="Large Size"
        placeholder="Large textarea..."
        rows={4}
      />
    </div>
  )
};

/**
 * Character Counter Feature
 */
export const WithCharacterCounter: Story = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('This is a sample text that shows how the character counter works.');
    const [value3, setValue3] = useState('This text is getting close to the limit and will show warning colors when approaching the maximum character count.');
    
    return (
      <div className="space-y-6">
        <Textarea
          label="Short Description"
          placeholder="Enter a brief description..."
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          withCharacterCount
          maxLength={100}
          rows={3}
          hint="Keep it concise and informative"
        />
        
        <Textarea
          label="Medium Length Text"
          placeholder="Enter your text..."
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          withCharacterCount
          maxLength={200}
          rows={4}
        />
        
        <Textarea
          label="Long Description (Near Limit)"
          placeholder="Enter detailed description..."
          value={value3}
          onChange={(e) => setValue3(e.target.value)}
          withCharacterCount
          maxLength={150}
          rows={5}
          hint="This example shows warning colors when approaching the limit"
        />
      </div>
    );
  }
};

/**
 * Stări de validare
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Textarea
        label="Required Field"
        placeholder="This field is required..."
        required
        hint="Please provide a detailed description"
        rows={3}
      />
      
      <Textarea
        label="Valid Input"
        placeholder="Valid input..."
        success="Looks great! Perfect length and content."
        defaultValue="This is a well-written description that meets all requirements."
        rows={3}
      />
      
      <Textarea
        label="Invalid Input"
        placeholder="Invalid input..."
        error="Description is too short. Please provide more details."
        defaultValue="Too short"
        rows={3}
      />
      
      <Textarea
        label="Disabled Textarea"
        placeholder="This textarea is disabled..."
        disabled
        defaultValue="This content cannot be edited because the textarea is disabled."
        rows={3}
      />
    </div>
  )
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => {
    const [transactionNote, setTransactionNote] = useState('');
    const [budgetDescription, setBudgetDescription] = useState('');
    const [reportComments, setReportComments] = useState('');
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea
            label="Transaction Notes"
            placeholder="Add notes about this transaction..."
            value={transactionNote}
            onChange={(e) => setTransactionNote(e.target.value)}
            withCharacterCount
            maxLength={200}
            rows={3}
            hint="Optional details about the transaction"
          />
          
          <Textarea
            label="Budget Description"
            placeholder="Describe your budget goals..."
            value={budgetDescription}
            onChange={(e) => setBudgetDescription(e.target.value)}
            withCharacterCount
            maxLength={300}
            rows={3}
            required
            hint="Explain the purpose and goals of this budget"
          />
        </div>
        
        <Textarea
          label="Monthly Report Comments"
          placeholder="Add your comments about this month's financial performance..."
          value={reportComments}
          onChange={(e) => setReportComments(e.target.value)}
          withCharacterCount
          maxLength={500}
          rows={5}
          fullWidth
          hint="Provide insights, observations, and plans for next month"
        />
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Form Example</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Textarea
                label="Description"
                placeholder="What was this transaction for?"
                rows={2}
                size="sm"
                required
                hint="Brief description of the transaction"
              />
              
              <Textarea
                label="Additional Notes"
                placeholder="Any additional details..."
                rows={3}
                size="sm"
                withCharacterCount
                maxLength={150}
              />
            </div>
            
            <div className="space-y-4">
              <Textarea
                label="Receipt Details"
                placeholder="Items purchased, merchant info, etc..."
                rows={4}
                size="sm"
                withCharacterCount
                maxLength={250}
                hint="Detailed breakdown for record keeping"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Full Width Layout
 */
export const FullWidthLayout: Story = {
  render: () => (
    <div className="space-y-6">
      <Textarea
        label="Full Width Textarea"
        placeholder="This textarea takes the full width of its container..."
        rows={4}
        fullWidth
        withCharacterCount
        maxLength={300}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Half Width (Grid)"
          placeholder="Grid column textarea..."
          rows={3}
          fullWidth
        />
        
        <Textarea
          label="Half Width (Grid)"
          placeholder="Grid column textarea..."
          rows={3}
          fullWidth
        />
      </div>
    </div>
  )
};

/**
 * Advanced Financial Scenario
 */
export const AdvancedFinancialScenario: Story = {
  render: () => {
    const [analysisText, setAnalysisText] = useState('');
    const [goalsText, setGoalsText] = useState('');
    const [strategyText, setStrategyText] = useState('');
    
    return (
      <div className="space-y-8">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Financial Planning Workspace</h3>
          <div className="space-y-6">
            <Textarea
              label="Current Financial Analysis"
              placeholder="Analyze your current financial situation..."
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              withCharacterCount
              maxLength={800}
              rows={6}
              fullWidth
              hint="Include income, expenses, assets, and liabilities"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                label="Short-term Goals (1-2 years)"
                placeholder="What do you want to achieve in the near future?"
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                withCharacterCount
                maxLength={400}
                rows={4}
                hint="Emergency fund, debt reduction, etc."
              />
              
              <Textarea
                label="Investment Strategy"
                placeholder="Describe your investment approach..."
                value={strategyText}
                onChange={(e) => setStrategyText(e.target.value)}
                withCharacterCount
                maxLength={400}
                rows={4}
                hint="Risk tolerance, asset allocation, timeline"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Review Template</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Textarea
              label="What Went Well"
              placeholder="Positive financial achievements..."
              rows={4}
              size="sm"
              withCharacterCount
              maxLength={200}
            />
            
            <Textarea
              label="Areas for Improvement"
              placeholder="What could be better..."
              rows={4}
              size="sm"
              withCharacterCount
              maxLength={200}
            />
            
            <Textarea
              label="Next Month's Focus"
              placeholder="Priorities for next month..."
              rows={4}
              size="sm"
              withCharacterCount
              maxLength={200}
            />
          </div>
        </div>
      </div>
    );
  }
}; 