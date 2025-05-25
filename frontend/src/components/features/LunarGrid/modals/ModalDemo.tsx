import React from 'react';
import Button from '../../../primitives/Button/Button';
import { 
  ModalManagerProvider, 
  ModalRouter, 
  useModalRouter,
  CellContext 
} from './index';

// Demo cell context pentru testing
const demoContext: CellContext = {
  category: 'Cheltuieli',
  subcategory: 'Mâncare',
  day: 15,
  month: 12,
  year: 2024
};

// Demo transaction pentru advanced edit
const demoTransaction = {
  id: 'demo-transaction-1',
  amount: 250.75,
  description: 'Cumpărături supermarket',
  type: 'expense' as const,
  category: 'Cheltuieli',
  subcategory: 'Mâncare',
  date: '2024-12-15',
  recurring: false,
  createdAt: '2024-12-15T10:00:00Z',
  updatedAt: '2024-12-15T10:00:00Z'
};

// Demo transactions pentru financial preview
const demoTransactions = [
  {
    id: '1',
    amount: 3500,
    description: 'Salariu',
    type: 'income' as const,
    category: 'Venituri',
    subcategory: 'Salariu',
    date: '2024-12-01',
    recurring: true,
    frequency: 'MONTHLY'
  },
  {
    id: '2', 
    amount: 1200,
    description: 'Chirie',
    type: 'expense' as const,
    category: 'Cheltuieli',
    subcategory: 'Locuință',
    date: '2024-12-01',
    recurring: true,
    frequency: 'MONTHLY'
  },
  {
    id: '3',
    amount: 150,
    description: 'Cumpărături',
    type: 'expense' as const,
    category: 'Cheltuieli',
    subcategory: 'Mâncare',
    date: '2024-12-15',
    recurring: false
  }
];

// Demo selected cells pentru bulk operations
const demoSelectedCells = [
  { ...demoContext, day: 15, currentAmount: 150 },
  { ...demoContext, day: 16, currentAmount: 200 },
  { ...demoContext, day: 17, currentAmount: 75 }
];

// Demo Controls Component
const ModalDemoControls: React.FC = () => {
  const {
    openQuickAdd,
    openAdvancedEdit,
    openRecurringSetup,
    openBulkOperations,
    openFinancialPreview,
    isModalOpen,
    currentModal,
    closeModal
  } = useModalRouter();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Enhanced Modal Architecture Demo
        </h2>
        <p className="text-slate-600">
          Testează toate modalurile implementate în Enhanced Modal Architecture
        </p>
        <div className="mt-2 text-sm">
          <span className="text-slate-500">Status:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            isModalOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-slate-100 text-slate-800'
          }`}>
            {isModalOpen ? `Modal activ: ${currentModal}` : 'Niciun modal activ'}
          </span>
        </div>
      </div>

      {/* Context Information */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Cell Context Demo</h3>
        <div className="text-sm text-blue-700">
          <span className="font-medium">Categorie:</span> {demoContext.category} → {demoContext.subcategory}
          <br />
          <span className="font-medium">Dată:</span> {demoContext.day}/{demoContext.month}/{demoContext.year}
        </div>
      </div>

      {/* Modal Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Button
          variant="primary"
          onClick={() => openQuickAdd(demoContext, '100.50')}
          disabled={isModalOpen}
          data-testid="demo-quick-add"
        >
          🚀 Quick Add Modal
        </Button>

        <Button
          variant="primary"
          onClick={() => openAdvancedEdit(demoContext, demoTransaction)}
          disabled={isModalOpen}
          data-testid="demo-advanced-edit"
        >
          ✏️ Advanced Edit Modal
        </Button>

        <Button
          variant="primary"
          onClick={() => openRecurringSetup(demoContext, undefined, '500')}
          disabled={isModalOpen}
          data-testid="demo-recurring-setup"
        >
          🔄 Recurring Setup Modal
        </Button>

        <Button
          variant="primary"
          onClick={() => openBulkOperations(demoContext, 'create', demoSelectedCells)}
          disabled={isModalOpen}
          data-testid="demo-bulk-operations"
        >
          📋 Bulk Operations Modal
        </Button>

        <Button
          variant="primary"
          onClick={() => openFinancialPreview(demoContext, demoTransactions)}
          disabled={isModalOpen}
          data-testid="demo-financial-preview"
        >
          📊 Financial Preview Modal
        </Button>

        <Button
          variant="secondary"
          onClick={closeModal}
          disabled={!isModalOpen}
          data-testid="demo-close-modal"
        >
          ❌ Close Modal
        </Button>
      </div>

      {/* Features Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Features Demonstrate</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">Modal Management</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Context-based modal routing</li>
              <li>• State management cu React Context</li>
              <li>• Modal history și navigation</li>
              <li>• Loading states și error handling</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Performance Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Lazy loading cu React.Suspense</li>
              <li>• Code splitting pentru modals</li>
              <li>• Optimized re-rendering</li>
              <li>• Bundle size optimization</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2">Integration Points</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• CVA styling system integration</li>
            <li>• Professional Blue theme consistency</li>
            <li>• Keyboard shortcuts support</li>
            <li>• Real-time financial calculations</li>
            <li>• Transaction CRUD operations</li>
            <li>• Export functionality (CSV/PDF/JSON)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main Demo Component
export const ModalDemo: React.FC = () => {
  // Mock handlers pentru demo purposes
  const handleQuickAdd = async (data: any) => {
    console.log('Quick Add:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAdvancedEdit = async (data: any) => {
    console.log('Advanced Edit:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRecurringSetup = async (data: any) => {
    console.log('Recurring Setup:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBulkOperations = async (data: any) => {
    console.log('Bulk Operations:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleFinancialExport = async (format: 'csv' | 'pdf' | 'json') => {
    console.log('Financial Export:', format);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleTransactionDelete = async (transactionId: string) => {
    console.log('Transaction Delete:', transactionId);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <ModalManagerProvider>
      <div className="min-h-screen bg-slate-100 py-8">
        <ModalDemoControls />
        
        <ModalRouter
          onQuickAdd={handleQuickAdd}
          onAdvancedEdit={handleAdvancedEdit}
          onRecurringSetup={handleRecurringSetup}
          onBulkOperations={handleBulkOperations}
          onFinancialExport={handleFinancialExport}
          onTransactionDelete={handleTransactionDelete}
          transactions={demoTransactions}
          existingTransaction={demoTransaction}
          selectedCells={demoSelectedCells}
        />
      </div>
    </ModalManagerProvider>
  );
}; 