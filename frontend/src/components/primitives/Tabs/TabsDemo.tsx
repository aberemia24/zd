import React, { useState } from 'react';
import { Tabs, TabItem } from './Tabs';

/**
 * Demo component pentru sistemul de Tab-uri
 * Folosit pentru development și testing
 */
export const TabsDemo: React.FC = () => {
  const [demoTabs, setDemoTabs] = useState<TabItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">Total Balance: 12,543.75 RON</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">Monthly Income: 5,200.00 RON</p>
            </div>
          </div>
        </div>
      ),
      icon: <span>📊</span>
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-2">
            <div className="border rounded-lg p-3">
              <p className="font-medium">Supermarket - 125.50 RON</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="font-medium">Fuel - 250.00 RON</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      ),
      closeable: true
    },
    {
      id: 'reports',
      label: 'Reports',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Financial Reports</h3>
          <p className="text-gray-600">Generate monthly and yearly reports here.</p>
        </div>
      ),
      closeable: true
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select className="border rounded px-3 py-2">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select className="border rounded px-3 py-2">
                <option>RON</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>
        </div>
      ),
      disabled: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabClose = (tabId: string) => {
    const newTabs = demoTabs.filter(tab => tab.id !== tabId);
    setDemoTabs(newTabs);
    
    // Dacă tab-ul închis era activ, schimbă la primul disponibil
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleTabAdd = () => {
    const newTab: TabItem = {
      id: `new-tab-${Date.now()}`,
      label: `New Tab ${demoTabs.length + 1}`,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">New Tab Content</h3>
          <p>This is a dynamically created tab.</p>
        </div>
      ),
      closeable: true
    };
    setDemoTabs([...demoTabs, newTab]);
    setActiveTab(newTab.id);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Multi-Tab System Demo</h2>
        <p className="text-gray-600 mb-6">
          Demonstrație pentru sistemul de tab-uri cu funcționalitate completă.
        </p>
      </div>

      {/* Tab System Principal */}
      <div className="border rounded-lg">
        <Tabs
          tabs={demoTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onTabClose={handleTabClose}
          onTabAdd={handleTabAdd}
          variant="underline"
          closeable={true}
          showAddButton={true}
          maxTabs={6}
          persist={true}
          persistKey="demo-tabs"
          testId="demo-tabs"
        />
      </div>

      {/* Variantele de styling */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Tab Variants</h3>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Pill Variant</h4>
          <Tabs
            tabs={demoTabs.slice(0, 3)}
            variant="pill"
            testId="pill-tabs"
          />
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Card Variant</h4>
          <Tabs
            tabs={demoTabs.slice(0, 3)}
            variant="card"
            testId="card-tabs"
          />
        </div>
      </div>

      {/* Info despre funcționalități */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Funcționalități disponibile:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Keyboard navigation: Arrow keys, Home/End, Enter/Space</li>
          <li>Tab management: Add (button), Close (X), Reorder</li>
          <li>Accessibility: ARIA roles, labels, keyboard support</li>
          <li>Persistence: localStorage pentru tab activ</li>
          <li>CVA variants: underline, pill, card</li>
          <li>Global shortcuts: Ctrl+T (new), Ctrl+W (close), Ctrl+Tab (next)</li>
        </ul>
      </div>
    </div>
  );
};

export default TabsDemo; 
