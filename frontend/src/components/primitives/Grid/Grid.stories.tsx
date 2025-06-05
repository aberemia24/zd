import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Grid from './Grid';
import Button from '../Button/Button';
import Card from '../Card/Card';

const meta = {
  title: 'CVA-v2/Primitives/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Grid component pentru Tailwind grid layouts cu suport pentru responsive design și diverse configurații de coloane.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 'auto', 'none'],
      description: 'Numărul de coloane pentru grid layout',
    },
    gap: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20],
      description: 'Spațiul între elementele grid',
    },
    responsive: {
      control: 'boolean',
      description: 'Activează comportament responsive pentru grid',
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'main', 'article'],
      description: 'HTML element tag pentru grid container',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample grid items pentru demonstrații
const GridItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 bg-copper-100 dark:bg-copper-800 rounded-lg border border-copper-200 dark:border-copper-700 text-center text-sm font-medium ${className}`}>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    cols: 3,
    gap: 4,
    responsive: false,
    dataTestId: 'grid-default',
    children: undefined,
  },
  render: (args: any) => (
    <div className="w-full max-w-4xl">
      <Grid {...args}>
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
        <GridItem>Item 4</GridItem>
        <GridItem>Item 5</GridItem>
        <GridItem>Item 6</GridItem>
      </Grid>
    </div>
  ),
};

export const AllVariants: Story = {
  args: { children: undefined },
  render: () => (
    <div className="space-y-8 w-full max-w-6xl">
      {/* Diferite configurații de coloane */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Column Configurations
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm mb-2 text-carbon-600 dark:text-carbon-400">2 Columns</p>
            <Grid cols={2} gap={4}>
              <GridItem>Col 1</GridItem>
              <GridItem>Col 2</GridItem>
              <GridItem>Col 3</GridItem>
              <GridItem>Col 4</GridItem>
            </Grid>
          </div>
          
          <div>
            <p className="text-sm mb-2 text-carbon-600 dark:text-carbon-400">4 Columns</p>
            <Grid cols={4} gap={4}>
              <GridItem>1</GridItem>
              <GridItem>2</GridItem>
              <GridItem>3</GridItem>
              <GridItem>4</GridItem>
            </Grid>
          </div>
          
          <div>
            <p className="text-sm mb-2 text-carbon-600 dark:text-carbon-400">6 Columns</p>
            <Grid cols={6} gap={2}>
              <GridItem>1</GridItem>
              <GridItem>2</GridItem>
              <GridItem>3</GridItem>
              <GridItem>4</GridItem>
              <GridItem>5</GridItem>
              <GridItem>6</GridItem>
            </Grid>
          </div>
        </div>
      </div>
      
      {/* Diferite gap sizes */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Gap Sizes
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm mb-2 text-carbon-600 dark:text-carbon-400">No Gap (0)</p>
            <Grid cols={3} gap={0}>
              <GridItem>No Gap</GridItem>
              <GridItem>Items</GridItem>
              <GridItem>Touch</GridItem>
            </Grid>
          </div>
          
          <div>
            <p className="text-sm mb-2 text-carbon-600 dark:text-carbon-400">Large Gap (12)</p>
            <Grid cols={3} gap={12}>
              <GridItem>Large</GridItem>
              <GridItem>Gap</GridItem>
              <GridItem>Space</GridItem>
            </Grid>
          </div>
        </div>
      </div>
      
      {/* Responsive behavior */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Responsive Grid
        </h3>
        <p className="text-sm mb-4 text-carbon-600 dark:text-carbon-400">
          Resize viewport to see responsive behavior: sm:1 col → md:2 cols → lg:3 cols → xl:4 cols
        </p>
        <Grid responsive={true} gap={4}>
          <GridItem>Responsive 1</GridItem>
          <GridItem>Responsive 2</GridItem>
          <GridItem>Responsive 3</GridItem>
          <GridItem>Responsive 4</GridItem>
          <GridItem>Responsive 5</GridItem>
          <GridItem>Responsive 6</GridItem>
          <GridItem>Responsive 7</GridItem>
          <GridItem>Responsive 8</GridItem>
        </Grid>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [cols, setCols] = React.useState(3);
    const [gap, setGap] = React.useState(4);
    const [responsive, setResponsive] = React.useState(false);
    
    return (
      <div className="w-full max-w-5xl space-y-6">
        {/* Controls */}
        <div className="bg-carbon-50 dark:bg-carbon-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
            Grid Controls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-carbon-700 dark:text-carbon-300">
                Columns: {cols}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-carbon-700 dark:text-carbon-300">
                Gap: {gap}
              </label>
              <input
                type="range"
                min="0"
                max="12"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-carbon-700 dark:text-carbon-300">
                <input
                  type="checkbox"
                  checked={responsive}
                  onChange={(e) => setResponsive(e.target.checked)}
                  className="rounded"
                />
                <span>Responsive</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Dynamic Grid */}
        <Grid 
          cols={responsive ? undefined : cols} 
          gap={gap} 
          responsive={responsive}
          dataTestId="interactive-grid"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <GridItem key={i}>
              Item {i + 1}
            </GridItem>
          ))}
        </Grid>
      </div>
    );
  },
};

export const FinancialUseCases: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-6xl">
      {/* Budget Categories Dashboard */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Budget Categories Overview
        </h3>
        <Grid cols={4} gap={6} responsive={true}>
          <Card className="p-4">
            <h4 className="font-semibold text-copper-700 dark:text-copper-300 mb-2">Venituri</h4>
            <p className="text-2xl font-bold text-green-600">+5,250 RON</p>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">+12% față de luna trecută</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold text-copper-700 dark:text-copper-300 mb-2">Cheltuieli</h4>
            <p className="text-2xl font-bold text-red-600">-3,890 RON</p>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">-5% față de luna trecută</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold text-copper-700 dark:text-copper-300 mb-2">Economii</h4>
            <p className="text-2xl font-bold text-blue-600">1,360 RON</p>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">Progres foarte bun!</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold text-copper-700 dark:text-copper-300 mb-2">Investiții</h4>
            <p className="text-2xl font-bold text-purple-600">890 RON</p>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">Portfolio diversificat</p>
          </Card>
        </Grid>
      </div>
      
      {/* Transaction Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Categorii de Cheltuieli
        </h3>
        <Grid cols={3} gap={4}>
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                🛒
              </div>
              <div>
                <h4 className="font-semibold">Cumpărături</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-1,240 RON</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                🏠
              </div>
              <div>
                <h4 className="font-semibold">Casă & Utilitați</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-890 RON</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                🚗
              </div>
              <div>
                <h4 className="font-semibold">Transport</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-420 RON</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                🎮
              </div>
              <div>
                <h4 className="font-semibold">Divertisment</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-210 RON</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                💊
              </div>
              <div>
                <h4 className="font-semibold">Sănătate</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-130 RON</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                ➕
              </div>
              <div>
                <h4 className="font-semibold">Altele</h4>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">-120 RON</p>
              </div>
            </div>
          </Card>
        </Grid>
      </div>
      
      {/* Action Buttons Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Acțiuni Rapide
        </h3>
        <Grid cols={2} gap={4} responsive={true}>
          <Button variant="default" size="lg" className="h-16">
            📝 Adaugă Tranzacție
          </Button>
          <Button variant="outline" size="lg" className="h-16">
            📊 Vezi Rapoarte
          </Button>
          <Button variant="ghost" size="lg" className="h-16">
            🎯 Setează Buget
          </Button>
          <Button variant="secondary" size="lg" className="h-16">
            📤 Exportă Date
          </Button>
        </Grid>
      </div>
    </div>
  ),
}; 