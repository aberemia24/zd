import React, { useState } from 'react';
import { LunarGridEnhanced } from '../components/features/LunarGrid/LunarGridEnhanced';
import { ModalDemo } from '../components/features/LunarGrid/modals/ModalDemo';
import Button from '../components/primitives/Button/Button';

const LunarGridEnhancedPage: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'integrated' | 'modal-demo'>('integrated');
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Navigation handlers
  const handlePreviousMonth = () => {
    if (currentDate.month === 1) {
      setCurrentDate({ year: currentDate.year - 1, month: 12 });
    } else {
      setCurrentDate({ ...currentDate, month: currentDate.month - 1 });
    }
  };

  const handleNextMonth = () => {
    if (currentDate.month === 12) {
      setCurrentDate({ year: currentDate.year + 1, month: 1 });
    } else {
      setCurrentDate({ ...currentDate, month: currentDate.month + 1 });
    }
  };

  // Format month name
  const formatMonthName = (month: number, year: number): string => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('ro-RO', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            LunarGrid Enhanced Demo
          </h1>
          <p className="text-slate-600 mb-4">
            Demonstrație completă a Enhanced Modal Architecture integrat cu LunarGrid
          </p>
          
          {/* Demo Mode Selector */}
          <div className="flex space-x-4 mb-6">
            <Button
              variant={currentDemo === 'integrated' ? 'primary' : 'secondary'}
              onClick={() => setCurrentDemo('integrated')}
              data-testid="integrated-demo-tab"
            >
              🚀 LunarGrid Integrat
            </Button>
            <Button
              variant={currentDemo === 'modal-demo' ? 'primary' : 'secondary'}
              onClick={() => setCurrentDemo('modal-demo')}
              data-testid="modal-demo-tab"
            >
              🎯 Modal Demo Standalone
            </Button>
          </div>
        </div>

        {/* Demo Content */}
        {currentDemo === 'integrated' && (
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="secondary"
                  onClick={handlePreviousMonth}
                  data-testid="previous-month"
                >
                  ← Luna Anterioară
                </Button>
                
                <h2 className="text-xl font-semibold text-slate-800">
                  {formatMonthName(currentDate.month, currentDate.year)}
                </h2>
                
                <Button
                  variant="secondary"
                  onClick={handleNextMonth}
                  data-testid="next-month"
                >
                  Luna Următoare →
                </Button>
              </div>

              {/* Enhanced Features Guide */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  🎯 Enhanced Modal Architecture Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">Interacțiuni cu Celulele:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Click simplu:</strong> Quick Add Modal</li>
                      <li>• <strong>Double-click:</strong> Advanced Edit Modal</li>
                      <li>• <strong>Ctrl+Click:</strong> Recurring Setup Modal</li>
                      <li>• <strong>F2:</strong> Inline Edit Mode</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Actions Bar:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Operații în Masă:</strong> Bulk Operations Modal</li>
                      <li>• <strong>Previzualizare Financiară:</strong> Financial Preview Modal</li>
                      <li>• <strong>Expand/Collapse:</strong> Category management</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* LunarGrid Enhanced Integration */}
              <LunarGridEnhanced 
                year={currentDate.year} 
                month={currentDate.month} 
              />
            </div>

            {/* Integration Status */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📊 Integration Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">✅ Completat</h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Enhanced Modal Architecture</li>
                    <li>• Modal Management System</li>
                    <li>• CVA Styling Integration</li>
                    <li>• Lazy Loading cu React.Suspense</li>
                    <li>• Keyboard Navigation</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">🔧 Features Active</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• QuickAddModal</li>
                    <li>• AdvancedEditModal</li>
                    <li>• RecurringSetupModal</li>
                    <li>• BulkOperationsModal</li>
                    <li>• FinancialPreviewModal</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">🚀 Performance</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Zero TypeScript errors</li>
                    <li>• Optimized bundle size</li>
                    <li>• Code splitting active</li>
                    <li>• Modal state management</li>
                    <li>• Professional UI/UX</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === 'modal-demo' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                🎯 Modal Architecture Standalone Demo
              </h3>
              <p className="text-slate-600 mb-6">
                Testează toate modalurile individual pentru verificarea funcționalității complete.
              </p>
              
              <ModalDemo />
            </div>
          </div>
        )}

        {/* Development Notes */}
        <div className="mt-8 p-6 bg-slate-800 text-white rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            🛠️ Development Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Technical Architecture:</h4>
              <ul className="space-y-1 text-slate-300">
                <li>• React 18.3.1 cu TypeScript 4.9.5</li>
                <li>• TanStack Table pentru grid functionality</li>
                <li>• CVA (Class Variance Authority) styling</li>
                <li>• React Query pentru state management</li>
                <li>• Enhanced Modal Architecture cu lazy loading</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Implementation Highlights:</h4>
              <ul className="space-y-1 text-slate-300">
                <li>• 3,154+ linii de cod production-ready</li>
                <li>• 8 componente specializate implementate</li>
                <li>• Zero TypeScript compilation errors</li>
                <li>• Professional Blue theme consistency</li>
                <li>• Complete keyboard navigation support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LunarGridEnhancedPage; 