import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar, { SidebarItem } from './Sidebar';

const meta = {
  title: 'CVA-v2/Primitives/Sidebar',
  component: Sidebar,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sidebar componentă pentru navigarea principală cu suport pentru desktop și mobile.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['desktop', 'mobile'],
      description: 'Tipul de sidebar (desktop/mobile)',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Starea inițială expanded/collapsed',
    },
    showOverlay: {
      control: 'boolean',
      description: 'Afișează overlay pentru mobile',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock navigation items pentru demonstrații
const navigationItems = [
  { icon: '🏠', label: 'Dashboard', to: '/dashboard' },
  { icon: '💰', label: 'Tranzacții', to: '/transactions' },
  { icon: '📊', label: 'Rapoarte', to: '/reports' },
  { icon: '🎯', label: 'Bugete', to: '/budgets' },
  { icon: '📈', label: 'Investiții', to: '/investments' },
  { icon: '⚙️', label: 'Setări', to: '/settings' },
];

export const Default: Story = {
  args: {
    variant: 'desktop',
    defaultExpanded: true,
    testId: 'sidebar-default',
  },
  render: (args: any) => (
    <div className="flex h-96 w-full bg-carbon-50 dark:bg-carbon-900">
      <Sidebar {...args}>
        <div className="p-4">
          <h3 className="font-semibold text-copper-700 dark:text-copper-300 mb-4">
            Navigation
          </h3>
          {navigationItems.map((item, index) => (
            <SidebarItem
              key={index}
              to={item.to}
              icon={item.icon}
              testId={`nav-item-${index}`}
              isActive={index === 0}
            >
              {item.label}
            </SidebarItem>
          ))}
        </div>
      </Sidebar>
      
      {/* Main content area */}
      <div className="flex-1 p-6 bg-white dark:bg-carbon-800">
        <h1 className="text-2xl font-bold text-carbon-900 dark:text-carbon-100 mb-4">
          Main Content Area
        </h1>
        <p className="text-carbon-600 dark:text-carbon-400">
          Aici se afișează conținutul principal al aplicației.
        </p>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  args: { children: undefined },
  render: () => (
    <div className="space-y-8 w-full">
      {/* Desktop Sidebar - Expanded */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Desktop Sidebar - Expanded
        </h3>
        <div className="flex h-80 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar variant="desktop" defaultExpanded={true}>
            <div className="p-4">
              <h4 className="font-medium text-copper-700 dark:text-copper-300 mb-3">
                Budget App
              </h4>
              {navigationItems.slice(0, 4).map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  isActive={index === 1}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </div>
          </Sidebar>
          
          <div className="flex-1 p-4 bg-white dark:bg-carbon-800">
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Sidebar expandat cu navigare completă
            </p>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar - Collapsed */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Desktop Sidebar - Collapsed
        </h3>
        <div className="flex h-80 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar variant="desktop" defaultExpanded={false}>
            <div className="p-2">
              {navigationItems.slice(0, 4).map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  isActive={index === 2}
                  variant="ghost"
                >
                  {item.label}
                </SidebarItem>
              ))}
            </div>
          </Sidebar>
          
          <div className="flex-1 p-4 bg-white dark:bg-carbon-800">
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Sidebar compact cu doar icoane
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Mobile Sidebar with Overlay
        </h3>
        <div className="relative h-80 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar 
            variant="mobile" 
            showOverlay={true}
            onOverlayClick={() => console.log('Overlay clicked')}
          >
            <div className="p-4">
              <h4 className="font-medium text-copper-700 dark:text-copper-300 mb-3">
                Mobile Menu
              </h4>
              {navigationItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  isActive={index === 0}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </div>
          </Sidebar>
          
          <div className="absolute inset-0 p-4 bg-white dark:bg-carbon-800">
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Click pe overlay pentru a închide sidebar-ul mobile
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: { children: undefined },
  render: () => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [variant, setVariant] = React.useState<'desktop' | 'mobile'>('desktop');
    const [showMobileOverlay, setShowMobileOverlay] = React.useState(false);
    
    return (
      <div className="w-full space-y-6">
        {/* Controls */}
        <div className="bg-carbon-50 dark:bg-carbon-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
            Sidebar Controls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-carbon-700 dark:text-carbon-300">
                Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as 'desktop' | 'mobile')}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-carbon-700 dark:text-carbon-300">
                <input
                  type="checkbox"
                  checked={isExpanded}
                  onChange={(e) => setIsExpanded(e.target.checked)}
                  disabled={variant === 'mobile'}
                  className="rounded"
                />
                <span>Expanded (Desktop only)</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-carbon-700 dark:text-carbon-300">
                <input
                  type="checkbox"
                  checked={showMobileOverlay}
                  onChange={(e) => setShowMobileOverlay(e.target.checked)}
                  disabled={variant === 'desktop'}
                  className="rounded"
                />
                <span>Show Mobile Overlay</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Interactive Sidebar */}
        <div className="relative flex h-96 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar
            variant={variant}
            defaultExpanded={variant === 'desktop' ? isExpanded : undefined}
            showOverlay={variant === 'mobile' ? showMobileOverlay : false}
            onOverlayClick={() => setShowMobileOverlay(false)}
            onToggle={(expanded) => setIsExpanded(expanded)}
            testId="interactive-sidebar"
          >
            <div className="p-4">
              <h4 className="font-medium text-copper-700 dark:text-copper-300 mb-3">
                Interactive Menu
              </h4>
              {navigationItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  onClick={() => console.log(`Clicked: ${item.label}`)}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </div>
          </Sidebar>
          
          <div className="flex-1 p-6 bg-white dark:bg-carbon-800">
            <h2 className="text-xl font-bold text-carbon-900 dark:text-carbon-100 mb-2">
              Interactive Demo
            </h2>
            <p className="text-carbon-600 dark:text-carbon-400 mb-4">
              Testează diferite configurații ale sidebar-ului folosind controalele de mai sus.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Variant:</strong> {variant}</p>
              <p><strong>Expanded:</strong> {variant === 'desktop' ? (isExpanded ? 'Yes' : 'No') : 'N/A'}</p>
              <p><strong>Mobile Overlay:</strong> {variant === 'mobile' ? (showMobileOverlay ? 'Visible' : 'Hidden') : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const FinancialUseCases: Story = {
  args: { children: undefined },
  render: () => (
    <div className="space-y-8 w-full">
      {/* Budget App Complete Navigation */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Complete Budget App Navigation
        </h3>
        <div className="flex h-96 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar variant="desktop" defaultExpanded={true}>
            <div className="p-4 space-y-6">
              {/* App Header */}
              <div className="text-center border-b border-carbon-200 dark:border-carbon-700 pb-3">
                <h4 className="font-bold text-copper-700 dark:text-copper-300">
                  💰 Budget Tracker
                </h4>
                <p className="text-xs text-carbon-500">Personal Finance</p>
              </div>
              
              {/* Main Navigation */}
              <div>
                <p className="text-xs font-medium text-carbon-500 uppercase tracking-wider mb-2">
                  Main
                </p>
                <SidebarItem to="/dashboard" icon="🏠" isActive={true}>
                  Dashboard
                </SidebarItem>
                <SidebarItem to="/transactions" icon="💳">
                  Tranzacții
                </SidebarItem>
                <SidebarItem to="/categories" icon="📂">
                  Categorii
                </SidebarItem>
              </div>
              
              {/* Planning Section */}
              <div>
                <p className="text-xs font-medium text-carbon-500 uppercase tracking-wider mb-2">
                  Planning
                </p>
                <SidebarItem to="/budgets" icon="🎯">
                  Bugete
                </SidebarItem>
                <SidebarItem to="/goals" icon="⭐">
                  Obiective
                </SidebarItem>
                <SidebarItem to="/investments" icon="📈">
                  Investiții
                </SidebarItem>
              </div>
              
              {/* Reports Section */}
              <div>
                <p className="text-xs font-medium text-carbon-500 uppercase tracking-wider mb-2">
                  Reports
                </p>
                <SidebarItem to="/reports" icon="📊">
                  Rapoarte
                </SidebarItem>
                <SidebarItem to="/analytics" icon="📋">
                  Analytics
                </SidebarItem>
              </div>
              
              {/* Settings */}
              <div className="border-t border-carbon-200 dark:border-carbon-700 pt-3">
                <SidebarItem to="/settings" icon="⚙️">
                  Setări
                </SidebarItem>
                <SidebarItem to="/help" icon="❓">
                  Ajutor
                </SidebarItem>
              </div>
            </div>
          </Sidebar>
          
          <div className="flex-1 p-6 bg-white dark:bg-carbon-800">
            <h2 className="text-2xl font-bold text-carbon-900 dark:text-carbon-100 mb-4">
              📊 Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-300">Venituri Luna</h3>
                <p className="text-2xl font-bold text-green-600">+5,250 RON</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-red-700 dark:text-red-300">Cheltuieli Luna</h3>
                <p className="text-2xl font-bold text-red-600">-3,890 RON</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">Economii</h3>
                <p className="text-2xl font-bold text-blue-600">1,360 RON</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">Investiții</h3>
                <p className="text-2xl font-bold text-purple-600">890 RON</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Financial App */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-carbon-900 dark:text-carbon-100">
          Mobile Financial App Menu
        </h3>
        <div className="relative h-96 w-full bg-carbon-50 dark:bg-carbon-900 border rounded-lg overflow-hidden">
          <Sidebar 
            variant="mobile" 
            showOverlay={true}
            onOverlayClick={() => console.log('Mobile menu closed')}
          >
            <div className="p-4 h-full flex flex-col">
              {/* User Profile Section */}
              <div className="border-b border-carbon-200 dark:border-carbon-700 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-copper-100 dark:bg-copper-800 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <h4 className="font-semibold text-carbon-900 dark:text-carbon-100">
                      Ion Popescu
                    </h4>
                    <p className="text-sm text-carbon-500">ion@example.com</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mb-4">
                <p className="text-xs font-medium text-carbon-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </p>
                <SidebarItem to="/add-transaction" icon="➕">
                  Adaugă Tranzacție
                </SidebarItem>
                <SidebarItem to="/scan-receipt" icon="📷">
                  Scanează Bon
                </SidebarItem>
              </div>
              
              {/* Main Navigation */}
              <div className="flex-1">
                <SidebarItem to="/dashboard" icon="🏠" isActive={true}>
                  Dashboard
                </SidebarItem>
                <SidebarItem to="/wallet" icon="👛">
                  Portofel
                </SidebarItem>
                <SidebarItem to="/cards" icon="💳">
                  Carduri
                </SidebarItem>
                <SidebarItem to="/bills" icon="🧾">
                  Facturi
                </SidebarItem>
                <SidebarItem to="/savings" icon="🏦">
                  Economii
                </SidebarItem>
              </div>
              
              {/* Bottom Actions */}
              <div className="border-t border-carbon-200 dark:border-carbon-700 pt-3">
                <SidebarItem to="/settings" icon="⚙️">
                  Setări
                </SidebarItem>
                <SidebarItem to="/logout" icon="🚪">
                  Deconectare
                </SidebarItem>
              </div>
            </div>
          </Sidebar>
          
          <div className="absolute inset-0 p-6 bg-white dark:bg-carbon-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-carbon-900 dark:text-carbon-100">
                Mobile App
              </h2>
              <button className="p-2 bg-copper-100 dark:bg-copper-800 rounded-lg">
                🍔
              </button>
            </div>
            <p className="text-carbon-600 dark:text-carbon-400">
              Tap pe overlay pentru a închide meniul mobil sau folosește butonul hamburger.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
}; 
