import React, { useState } from 'react';
import { EnhancedLunarGrid } from '../components/features/LunarGrid';
import Button from '../components/primitives/Button/Button';
import { cn } from '../styles/cva/shared/utils';
import { 
  flex as flexContainer, 
  container as gridContainer 
} from '../styles/cva/components/layout';

/**
 * Enhanced LunarGrid Test Page - Phase 4 Integration Demo
 * 
 * Această pagină demonstrează integrarea completă a tuturor componentelor
 * implementate în Phases 1-3 într-un sistem funcțional complet.
 * 
 * Features demonstrate:
 * ✅ Mathematical Foundation (Phase 1) - Calcule corecte
 * ✅ UX Interactions (Phase 2) - Editare inline, keyboard navigation
 * ✅ Recurring Transactions (Phase 3) - Template-based generation
 * 🚀 Integration & Testing (Phase 4) - Toate componentele integrate
 */

const EnhancedLunarGridPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1 // JavaScript months are 0-indexed
    };
  });

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth() + 1
    });
  };

  return (
    <div className={cn(gridContainer(), "min-h-screen bg-gray-50 py-8")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }), "mb-4")}>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Enhanced LunarGrid
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Phase 4: Integration & Testing Demo
              </p>
            </div>
            
            {/* Month Navigation */}
            <div className={cn(flexContainer({ direction: 'row', align: 'center', gap: 'md' }))}>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousMonth}
              >
                ← Anterior
              </Button>
              
              <div className="text-center min-w-[200px]">
                <h2 className="text-xl font-semibold text-gray-800">
                  {new Date(currentDate.year, currentDate.month - 1).toLocaleDateString('ro-RO', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
              >
                Următor →
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCurrentMonth}
              >
                Azi
              </Button>
            </div>
          </div>
          
          {/* Phase Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              LunarGrid Master Plan - Progress Status
            </h3>
            <div className={cn(flexContainer({ direction: 'row', gap: 'lg' }))}>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-bold">✅</span>
                <span className="text-sm text-gray-700">Phase 1: Mathematical Foundation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-bold">✅</span>
                <span className="text-sm text-gray-700">Phase 2: UX Interactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-bold">✅</span>
                <span className="text-sm text-gray-700">Phase 3: Recurring Transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-bold">🚀</span>
                <span className="text-sm text-gray-700 font-medium">Phase 4: Integration & Testing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced LunarGrid Component */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <EnhancedLunarGrid 
            year={currentDate.year} 
            month={currentDate.month} 
          />
        </div>

        {/* Features Demo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Mathematical Foundation
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Calcule corecte pentru solduri zilnice cu propagare automată
            </p>
            <div className="text-xs text-green-600 font-medium">
              ✅ Phase 1 Complete
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              UX Interactions
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Editare inline, keyboard navigation, Excel-like experience
            </p>
            <div className="text-xs text-green-600 font-medium">
              ✅ Phase 2 Complete
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Recurring Transactions
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Template-based generation cu conflict detection
            </p>
            <div className="text-xs text-green-600 font-medium">
              ✅ Phase 3 Complete
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Integration & Testing
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Toate componentele integrate într-un sistem complet
            </p>
            <div className="text-xs text-blue-600 font-medium">
              🚀 Phase 4 In Progress
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cum să testezi Enhanced LunarGrid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Editare Inline:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Double-click pe orice celulă pentru editare</li>
                <li>• Enter pentru salvare</li>
                <li>• Escape pentru anulare</li>
                <li>• Validare automată pentru numere</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Features Integrate:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Solduri calculate în timp real</li>
                <li>• Formatare monetară automată</li>
                <li>• Invalidare cache pentru sincronizare</li>
                <li>• CVA styling system complet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLunarGridPage; 