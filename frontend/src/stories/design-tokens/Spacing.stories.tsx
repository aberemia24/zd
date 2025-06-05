import type { Meta, StoryObj } from '@storybook/react';

/**
 * 📏 Spacing System - Carbon Copper Design System
 */
const meta: Meta = {
  title: 'Carbon Copper Design System/Design Tokens/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Spacing System

Spacing system-ul Carbon Copper Design System este bazat pe **Tailwind CSS defaults** cu extensii minimale pentru context financiar. Filosofia noastră: **pragmatic, consistent, fintech-ready**.

## 🎯 Filozofie: Simple & Consistent

### Principii Fundamentale
- **95% Tailwind CSS defaults** pentru consistency și rapiditate
- **5% custom tokens** doar pentru spacing fintech-specific
- **Mobile-first responsive** pentru toate device-urile  
- **Semantic naming** pentru componente și layouts`
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component pentru demonstrația spacing-ului
const SpacingDemo = () => {
  const spacingScale = [
    { value: '0', pixels: '0px', usage: 'Pentru elemente lipite' },
    { value: '1', pixels: '4px', usage: 'Micro spacing, icon padding' },
    { value: '2', pixels: '8px', usage: 'Padding mic, borduri' },
    { value: '3', pixels: '12px', usage: 'Spacing standard intern' },
    { value: '4', pixels: '16px', usage: 'Padding mediu, gap-uri' },
    { value: '6', pixels: '24px', usage: 'Spacing între secțiuni' },
    { value: '8', pixels: '32px', usage: 'Margin mare, spacing extern' },
    { value: '12', pixels: '48px', usage: 'Layout spacing, header' },
    { value: '16', pixels: '64px', usage: 'Page spacing, separare mare' },
    { value: '24', pixels: '96px', usage: 'Hero sections, page margins' }
  ];

  const semanticSpacing = [
    { name: 'Card Padding', value: 'p-6', pixels: '24px', usage: 'Standard pentru carduri financiare' },
    { name: 'Form Spacing', value: 'space-y-4', pixels: '16px', usage: 'Entre input-uri în formulare' },
    { name: 'Transaction Row', value: 'py-3 px-4', pixels: '12px/16px', usage: 'Padding pentru rânduri tranzacții' },
    { name: 'Button Padding', value: 'px-4 py-2', pixels: '16px/8px', usage: 'Padding standard pentru butoane' },
    { name: 'Section Gap', value: 'gap-8', pixels: '32px', usage: 'Entre secțiuni în dashboard' }
  ];

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Tailwind Scale */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          📏 Tailwind CSS Default Scale (RECOMMENDED)
        </h2>
        <div className="space-y-4">
          {spacingScale.map((item) => (
            <div key={item.value} className="flex items-center gap-6 p-4 bg-carbon-50 dark:bg-carbon-800 rounded-lg border border-carbon-200 dark:border-carbon-700">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div 
                  className="bg-copper-500 rounded"
                  style={{ 
                    width: item.pixels === '0px' ? '2px' : item.pixels, 
                    height: item.pixels === '0px' ? '2px' : item.pixels,
                    minWidth: item.pixels === '0px' ? '2px' : '8px',
                    minHeight: item.pixels === '0px' ? '2px' : '8px'
                  }}
                />
                <div>
                  <h4 className="font-medium text-carbon-900 dark:text-carbon-100">
                    space-{item.value}
                  </h4>
                  <p className="text-sm text-carbon-600 dark:text-carbon-400 font-mono">
                    {item.pixels}
                  </p>
                </div>
              </div>
              <p className="text-sm text-carbon-500 dark:text-carbon-500 max-w-xs">
                {item.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Spacing */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          🎯 Semantic Fintech Spacing
        </h2>
        <div className="space-y-4">
          {semanticSpacing.map((item) => (
            <div key={item.name} className="p-4 bg-carbon-50 dark:bg-carbon-800 rounded-lg border border-carbon-200 dark:border-carbon-700">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-carbon-900 dark:text-carbon-100">
                  {item.name}
                </h4>
                <code className="text-sm text-copper-600 dark:text-copper-400 bg-copper-100 dark:bg-copper-900 px-2 py-1 rounded">
                  {item.value}
                </code>
              </div>
              <p className="text-sm text-carbon-600 dark:text-carbon-400 mb-2">
                {item.pixels} • {item.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive Patterns */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          📱 Responsive Spacing Patterns
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-carbon-50 dark:bg-carbon-800 rounded-lg border border-carbon-200 dark:border-carbon-700">
            <h4 className="font-medium text-carbon-900 dark:text-carbon-100 mb-2">
              Container Responsive
            </h4>
            <code className="text-sm text-copper-600 dark:text-copper-400 bg-copper-100 dark:bg-copper-900 px-2 py-1 rounded mr-2">
              px-4 md:px-6 lg:px-8
            </code>
            <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-2">
              16px → 24px → 32px • Padding responsiv pentru containere
            </p>
          </div>
          
          <div className="p-4 bg-carbon-50 dark:bg-carbon-800 rounded-lg border border-carbon-200 dark:border-carbon-700">
            <h4 className="font-medium text-carbon-900 dark:text-carbon-100 mb-2">
              Grid Gap Responsive
            </h4>
            <code className="text-sm text-copper-600 dark:text-copper-400 bg-copper-100 dark:bg-copper-900 px-2 py-1 rounded mr-2">
              gap-4 md:gap-6 lg:gap-8
            </code>
            <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-2">
              16px → 24px → 32px • Gap responsiv pentru grid-uri
            </p>
          </div>

          <div className="p-4 bg-carbon-50 dark:bg-carbon-800 rounded-lg border border-carbon-200 dark:border-carbon-700">
            <h4 className="font-medium text-carbon-900 dark:text-carbon-100 mb-2">
              Section Spacing
            </h4>
            <code className="text-sm text-copper-600 dark:text-copper-400 bg-copper-100 dark:bg-copper-900 px-2 py-1 rounded mr-2">
              space-y-8 md:space-y-12 lg:space-y-16
            </code>
            <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-2">
              32px → 48px → 64px • Spacing între secțiuni majore
            </p>
          </div>
        </div>
      </section>

      {/* Fintech Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          💼 Fintech Layout Examples
        </h2>
        
        {/* Transaction Card Example */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-carbon-900 dark:text-carbon-100 mb-3">
              Transaction Card Layout
            </h4>
            <div className="bg-white dark:bg-carbon-800 p-6 rounded-lg border border-carbon-200 dark:border-carbon-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold text-carbon-900 dark:text-carbon-100">Supermarket ABC</h5>
                <span className="font-mono text-red-600 dark:text-red-400">-245.50 RON</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-carbon-600 dark:text-carbon-400">Alimentare • 15 Nov 2024</p>
                <p className="text-sm text-carbon-600 dark:text-carbon-400">Card **** 1234</p>
              </div>
            </div>
            <p className="text-sm text-carbon-500 mt-2">
              Folosește: <code>p-6</code> pentru padding, <code>space-y-2</code> pentru detalii, <code>mb-4</code> pentru separare header
            </p>
          </div>

          {/* Dashboard Grid Example */}
          <div>
            <h4 className="font-medium text-carbon-900 dark:text-carbon-100 mb-3">
              Dashboard Grid Layout
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Sold Curent', value: '12,450.00 RON', color: 'text-green-600' },
                { label: 'Cheltuieli Luna', value: '3,250.75 RON', color: 'text-red-600' },
                { label: 'Economii', value: '45,780.25 RON', color: 'text-blue-600' },
                { label: 'Investiții', value: '8,950.00 RON', color: 'text-purple-600' }
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-carbon-800 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                  <p className="text-sm text-carbon-600 dark:text-carbon-400 mb-2">{item.label}</p>
                  <p className={`font-mono font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-carbon-500 mt-2">
              Folosește: <code>gap-4</code> pentru grid spacing, <code>p-4</code> pentru card padding, <code>mb-2</code> pentru text spacing
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          ✅ Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-green-700 dark:text-green-300">✅ DO</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Folosește Tailwind standard spacing (4, 6, 8, 12)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Aplică spacing consistent pentru componente similare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Folosește responsive spacing pentru mobile-first</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Testează pe multiple device-uri</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-red-700 dark:text-red-300">❌ DON'T</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Nu inventa spacing values custom (ex: 13px, 19px)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Nu folosește spacing inconsistent între componente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Nu uita de responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Nu ignora accessibility și touch targets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Demonstrația completă a sistemului de spacing
 */
export const AllSpacing: Story = {
  render: () => <SpacingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Sistemul complet de spacing Carbon Copper cu toate pattern-urile și exemple practice.'
      }
    }
  }
}; 