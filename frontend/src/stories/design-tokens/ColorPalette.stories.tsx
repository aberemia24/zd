import type { Meta, StoryObj } from '@storybook/react';

/**
 * 🎨 Carbon Copper Design System - Color Palette Documentation
 */
const meta: Meta = {
  title: 'Carbon Copper Design System/Design Tokens/Color Palette',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Color Palette - Carbon Copper Design System

Sistemul de culori Carbon Copper combină **Carbon** (neutral base) cu **Copper** (brand accent) pentru a crea o paletă comprehensivă, accesibilă și aplicabilă în contextul financiar.

## 🎯 Filozofie

### Carbon - Foundation
- **Culori neutre** pentru fundal, text și elemente de bază
- **Grayscale elegant** pentru hierarhie vizuală clară
- **High contrast** pentru accesibilitate optimă

### Copper - Brand Identity  
- **Warm metallic tones** pentru accent și CTA-uri
- **Professional yet approachable** pentru aplicații fintech
- **Distinctive branding** care se diferențiază de concurență

### Semantic Colors
- **Success/Error/Warning** pentru feedback utilizator
- **Financial context** colors pentru indicatori monetari
- **Status indicators** pentru starea conturilor/tranzacțiilor`
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component pentru afișarea culorilor
const ColorSwatch = ({ color, name, hex, usage }: { color: string; name: string; hex: string; usage: string }) => (
  <div className="flex items-center gap-4 p-4 border border-carbon-200 dark:border-carbon-700 rounded-lg">
    <div 
      className="w-16 h-16 rounded-lg border border-carbon-200 dark:border-carbon-600"
      style={{ backgroundColor: color }}
    />
    <div>
      <h4 className="font-medium text-carbon-900 dark:text-carbon-100">{name}</h4>
      <p className="text-sm text-carbon-600 dark:text-carbon-400 font-mono">{hex}</p>
      <p className="text-sm text-carbon-500 dark:text-carbon-500 mt-1">{usage}</p>
    </div>
  </div>
);

const ColorPaletteDemo = () => {
  return (
    <div className="space-y-8">
      {/* Carbon Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          🖤 Carbon (Neutral Foundation)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch color="#ffffff" name="Carbon 50" hex="#ffffff" usage="Fundal principal, carduri" />
          <ColorSwatch color="#f9fafb" name="Carbon 100" hex="#f9fafb" usage="Fundal secundar" />
          <ColorSwatch color="#f3f4f6" name="Carbon 200" hex="#f3f4f6" usage="Borduri, separatori" />
          <ColorSwatch color="#e5e7eb" name="Carbon 300" hex="#e5e7eb" usage="Elementa disabled" />
          <ColorSwatch color="#9ca3af" name="Carbon 400" hex="#9ca3af" usage="Text placeholder" />
          <ColorSwatch color="#6b7280" name="Carbon 500" hex="#6b7280" usage="Text secundar" />
          <ColorSwatch color="#374151" name="Carbon 700" hex="#374151" usage="Text principal" />
          <ColorSwatch color="#111827" name="Carbon 900" hex="#111827" usage="Headings, text principal" />
        </div>
      </section>

      {/* Copper Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          🟤 Copper (Brand Accent)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch color="#fed7aa" name="Copper 200" hex="#fed7aa" usage="Fundal subtle pentru highlights" />
          <ColorSwatch color="#fdba74" name="Copper 300" hex="#fdba74" usage="Hover states, accente ușoare" />
          <ColorSwatch color="#fb923c" name="Copper 400" hex="#fb923c" usage="Primary buttons, links" />
          <ColorSwatch color="#f97316" name="Copper 500" hex="#f97316" usage="Brand principal, CTA-uri" />
          <ColorSwatch color="#ea580c" name="Copper 600" hex="#ea580c" usage="Active states, focus" />
          <ColorSwatch color="#c2410c" name="Copper 700" hex="#c2410c" usage="Dark mode accent" />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          🎯 Semantic Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch color="#10b981" name="Success 500" hex="#10b981" usage="Tranzacții reușite, profit" />
          <ColorSwatch color="#ef4444" name="Error 500" hex="#ef4444" usage="Erori, pierderi, alerte" />
          <ColorSwatch color="#f59e0b" name="Warning 500" hex="#f59e0b" usage="Avertismente, pending states" />
          <ColorSwatch color="#3b82f6" name="Info 500" hex="#3b82f6" usage="Informații, tooltips" />
        </div>
      </section>

      {/* Financial Context */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          💰 Financial Context Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch color="#16a34a" name="Income Green" hex="#16a34a" usage="Venituri, creșteri, profit" />
          <ColorSwatch color="#dc2626" name="Expense Red" hex="#dc2626" usage="Cheltuieli, scăderi, pierderi" />
          <ColorSwatch color="#2563eb" name="Transfer Blue" hex="#2563eb" usage="Transferuri, neutral moves" />
          <ColorSwatch color="#7c3aed" name="Investment Purple" hex="#7c3aed" usage="Investiții, savings" />
        </div>
      </section>
    </div>
  );
};

/**
 * Demonstrația completă a paletei de culori Carbon Copper
 */
export const AllColors: Story = {
  render: () => <ColorPaletteDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Paleta completă de culori utilizată în Carbon Copper Design System, organizată pe categorii functionale.'
      }
    }
  }
}; 
