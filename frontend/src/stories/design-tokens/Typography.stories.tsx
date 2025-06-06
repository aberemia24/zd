import type { Meta, StoryObj } from '@storybook/react';

/**
 * 🔤 Typography System - Carbon Copper Design System
 */
const meta: Meta = {
  title: 'Carbon Copper Design System/Design Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Typography System

Typography system-ul Carbon Copper Design System oferă o hierarhie clară și consistentă pentru toate textele din Budget App. Folosim **Inter** ca font principal pentru claritate și lizibilitate excelentă în contextul financiar.

## 🎯 Principii Fundamentale

### 1. **Claritate & Lizibilitate**
- **Inter font family** - Optimizat pentru interfețe digitale
- **Tabular numbers** pentru date financiare 
- **Contrast ridicat** pentru accesibilitate

### 2. **Ierarhie Vizuală**
- **6 nivele de heading** (H1-H6) pentru organizare clară
- **4 mărimi de text** pentru conținut (lg, base, sm, xs)
- **Variante semantice** pentru context (success, warning, error)

### 3. **Context Financiar**
- **Monospace numbers** pentru sume și date
- **Consistent spacing** pentru tabele și liste
- **Professional appearance** pentru credibilitate`
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Componentă pentru demonstrația tipografiei
const TypographyDemo = () => {
  return (
    <div className="space-y-12 max-w-4xl">
      {/* Headings Hierarchy */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          📐 Heading Hierarchy (H1-H6)
        </h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H1 - Main Page Title (3xl/bold)
            </h1>
            <code className="text-sm text-carbon-500">text-3xl font-bold</code>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H2 - Section Title (2xl/semibold)
            </h2>
            <code className="text-sm text-carbon-500">text-2xl font-semibold</code>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H3 - Subsection Title (xl/semibold)
            </h3>
            <code className="text-sm text-carbon-500">text-xl font-semibold</code>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H4 - Component Title (lg/semibold)
            </h4>
            <code className="text-sm text-carbon-500">text-lg font-semibold</code>
          </div>
          <div>
            <h5 className="text-base font-semibold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H5 - Card Title (base/semibold)
            </h5>
            <code className="text-sm text-carbon-500">text-base font-semibold</code>
          </div>
          <div>
            <h6 className="text-sm font-semibold text-carbon-900 dark:text-carbon-100 tracking-tight leading-tight">
              H6 - Small Title (sm/semibold)
            </h6>
            <code className="text-sm text-carbon-500">text-sm font-semibold</code>
          </div>
        </div>
      </section>

      {/* Text Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          📝 Text Variants
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-lg text-carbon-700 dark:text-carbon-300 leading-relaxed">
              Large Text - Perfect pentru introduceri și text important (text-lg)
            </p>
            <code className="text-sm text-carbon-500">text-lg leading-relaxed</code>
          </div>
          <div>
            <p className="text-base text-carbon-700 dark:text-carbon-300 leading-relaxed">
              Base Text - Mărimea standard pentru majoritatea conținutului (text-base)
            </p>
            <code className="text-sm text-carbon-500">text-base leading-relaxed</code>
          </div>
          <div>
            <p className="text-sm text-carbon-700 dark:text-carbon-300 leading-relaxed">
              Small Text - Pentru detalii secundare și metadata (text-sm)
            </p>
            <code className="text-sm text-carbon-500">text-sm leading-relaxed</code>
          </div>
          <div>
            <p className="text-xs text-carbon-700 dark:text-carbon-300 leading-relaxed">
              Extra Small Text - Pentru footnotes și caption-uri (text-xs)
            </p>
            <code className="text-sm text-carbon-500">text-xs leading-relaxed</code>
          </div>
        </div>
      </section>

      {/* Semantic Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          🎯 Semantic Variants
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-carbon-900 dark:text-carbon-100">
              Default - Text standard cu contrast optim pentru citire
            </p>
            <code className="text-sm text-carbon-500">text-carbon-900 dark:text-carbon-100</code>
          </div>
          <div>
            <p className="text-copper-600 dark:text-copper-300 font-medium">
              Primary - Text cu accent pentru elemente importante
            </p>
            <code className="text-sm text-carbon-500">text-copper-600 dark:text-copper-300</code>
          </div>
          <div>
            <p className="text-green-700 dark:text-green-300">
              Success - Pentru mesaje pozitive și confirmări
            </p>
            <code className="text-sm text-carbon-500">text-green-700 dark:text-green-300</code>
          </div>
          <div>
            <p className="text-orange-700 dark:text-orange-300">
              Warning - Pentru avertismente și atenționări
            </p>
            <code className="text-sm text-carbon-500">text-orange-700 dark:text-orange-300</code>
          </div>
          <div>
            <p className="text-red-700 dark:text-red-300">
              Danger - Pentru erori și mesaje critice
            </p>
            <code className="text-sm text-carbon-500">text-red-700 dark:text-red-300</code>
          </div>
          <div>
            <p className="text-carbon-500 dark:text-carbon-500">
              Muted - Pentru text secundar și informații suplimentare
            </p>
            <code className="text-sm text-carbon-500">text-carbon-500 dark:text-carbon-500</code>
          </div>
        </div>
      </section>

      {/* Financial Typography */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          💰 Financial Typography
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-mono tabular-nums tracking-tight text-carbon-900 dark:text-carbon-100">
              1,234.56 RON - Sume financiare cu tabular numbers
            </p>
            <code className="text-sm text-carbon-500">font-mono tabular-nums tracking-tight</code>
          </div>
          <div>
            <p className="font-mono tabular-nums tracking-tight text-green-700 dark:text-green-300 font-medium">
              +2,500.00 RON - Câștiguri și venituri
            </p>
            <code className="text-sm text-carbon-500">font-mono tabular-nums text-green-700</code>
          </div>
          <div>
            <p className="font-mono tabular-nums tracking-tight text-red-700 dark:text-red-300 font-medium">
              -890.45 RON - Pierderi și cheltuieli
            </p>
            <code className="text-sm text-carbon-500">font-mono tabular-nums text-red-700</code>
          </div>
          <div>
            <p className="font-mono tabular-nums tracking-tight text-carbon-500 dark:text-carbon-500">
              0.00 RON - Balanțe zero și placeholder-uri
            </p>
            <code className="text-sm text-carbon-500">font-mono tabular-nums text-carbon-500</code>
          </div>
        </div>
      </section>

      {/* Financial Dashboard Example */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-carbon-900 dark:text-carbon-100">
          📊 Financial Dashboard Example
        </h2>
        <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-200 dark:border-carbon-700">
          <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
            Raport Financiar - Noiembrie 2024
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-carbon-700 dark:text-carbon-300">Venituri Totale:</span>
              <span className="font-mono tabular-nums tracking-tight text-green-700 dark:text-green-300 font-medium">+15,450.00 RON</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-carbon-700 dark:text-carbon-300">Cheltuieli Totale:</span>
              <span className="font-mono tabular-nums tracking-tight text-red-700 dark:text-red-300 font-medium">-12,890.75 RON</span>
            </div>
            <hr className="border-carbon-200 dark:border-carbon-600" />
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-carbon-900 dark:text-carbon-100">Balanța Finală:</span>
              <span className="font-mono tabular-nums tracking-tight text-green-700 dark:text-green-300 text-lg font-semibold">
                +2,559.25 RON
              </span>
            </div>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Actualizat în timp real • Ultima sincronizare: acum 5 minute
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Demonstrația completă a sistemului tipografic
 */
export const AllTypography: Story = {
  render: () => <TypographyDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Sistemul complet tipografic Carbon Copper cu toate variantele și contexte de utilizare.'
      }
    }
  }
}; 
