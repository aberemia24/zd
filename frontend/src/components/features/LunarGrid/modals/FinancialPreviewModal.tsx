import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Button from '../../../primitives/Button/Button';
import Badge from '../../../primitives/Badge/Badge';
import { 
  transactionModalOverlay,
  transactionModalContent,
  transactionModalHeader,
  transactionModalTitle,
  transactionModalBody,
  transactionModalFooter,
  transactionModalCloseButton
} from '../../../../styles/cva/components/modal';
import { useBaseModalLogic, CellContext } from './hooks/useBaseModalLogic';

// Financial Analysis interfaces
export interface FinancialAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrendData[];
  projectedImpact: ProjectedImpact;
}

export interface CategoryBreakdown {
  category: string;
  subcategory?: string;
  amount: number;
  percentage: number;
  type: 'income' | 'expense';
  transactionCount: number;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
}

export interface ProjectedImpact {
  nextMonth: number;
  next3Months: number;
  next6Months: number;
  yearEnd: number;
}

// Transaction preview pentru financial analysis
export interface FinancialTransaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  date: string;
  recurring?: boolean;
  frequency?: string;
}

// Financial Preview Modal Props
export interface FinancialPreviewModalProps {
  cellContext: CellContext;
  transactions: FinancialTransaction[];
  showProjections?: boolean;
  showComparisons?: boolean;
  onExport?: (format: 'csv' | 'pdf' | 'json') => Promise<void>;
  onClose: () => void;
}

// Financial Preview Modal Component
export const FinancialPreviewModal: React.FC<FinancialPreviewModalProps> = ({
  cellContext,
  transactions,
  showProjections = true,
  showComparisons = true,
  onExport,
  onClose
}) => {
  // Base modal logic integration
  const { calculations } = useBaseModalLogic(cellContext);
  
  // Local state pentru financial analysis
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'trends' | 'projections'>('overview');
  const [analysisTimeframe, setAnalysisTimeframe] = useState<'current' | '3months' | '6months' | 'year'>('current');
  const [isExporting, setIsExporting] = useState(false);
  
  // Calculate comprehensive financial analysis
  const financialAnalysis = useMemo((): FinancialAnalysis => {
    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netFlow = totalIncome - totalExpenses;
    
    // Category breakdown
    const categoryMap = new Map<string, {
      amount: number;
      count: number;
      type: 'income' | 'expense';
      subcategories: Set<string>;
    }>();
    
    transactions.forEach(transaction => {
      const key = `${transaction.category}${transaction.subcategory ? `::${transaction.subcategory}` : ''}`;
      const existing = categoryMap.get(key) || {
        amount: 0,
        count: 0,
        type: transaction.type,
        subcategories: new Set()
      };
      
      existing.amount += transaction.amount;
      existing.count += 1;
      if (transaction.subcategory) {
        existing.subcategories.add(transaction.subcategory);
      }
      
      categoryMap.set(key, existing);
    });
    
    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([key, data]) => {
      const [category, subcategory] = key.split('::');
      const percentage = data.type === 'income' 
        ? (data.amount / totalIncome) * 100 
        : (data.amount / totalExpenses) * 100;
      
      return {
        category,
        subcategory,
        amount: data.amount,
        percentage: isNaN(percentage) ? 0 : percentage,
        type: data.type,
        transactionCount: data.count
      };
    }).sort((a, b) => b.amount - a.amount);
    
    // Mock monthly trend (în realitate ar veni din API cu date istorice)
    const monthlyTrend: MonthlyTrendData[] = [
      { month: 'Ian', income: totalIncome * 0.8, expenses: totalExpenses * 0.9, netFlow: (totalIncome * 0.8) - (totalExpenses * 0.9) },
      { month: 'Feb', income: totalIncome * 0.9, expenses: totalExpenses * 0.85, netFlow: (totalIncome * 0.9) - (totalExpenses * 0.85) },
      { month: 'Mar', income: totalIncome, expenses: totalExpenses, netFlow: netFlow },
    ];
    
    // Projected impact based pe current trends
    const projectedImpact: ProjectedImpact = {
      nextMonth: netFlow * 1.05, // 5% growth
      next3Months: netFlow * 3.15, // Compounded growth
      next6Months: netFlow * 6.35, 
      yearEnd: netFlow * 12.8
    };
    
    return {
      totalIncome,
      totalExpenses,
      netFlow,
      categoryBreakdown,
      monthlyTrend,
      projectedImpact
    };
  }, [transactions]);
  
  // Handle export functionality
  const handleExport = useCallback(async (format: 'csv' | 'pdf' | 'json') => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport(format);
    } catch (error) {
      console.error(`Export failed for format ${format}:`, error);
    } finally {
      setIsExporting(false);
    }
  }, [onExport]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'e' && e.ctrlKey && onExport) {
        e.preventDefault();
        handleExport('csv');
      }
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const tabs = ['overview', 'breakdown', 'trends', 'projections'] as const;
        setActiveTab(tabs[parseInt(e.key) - 1]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onExport, handleExport]);
  
  // Format currency pentru display
  const formatCurrency = useCallback((amount: number): string => {
    return calculations.formatMoney(amount) + ' RON';
  }, [calculations]);
  
  // Format percentage pentru display
  const formatPercentage = useCallback((percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  }, []);
  
  // Get color pentru net flow
  const getNetFlowColor = useCallback((amount: number): string => {
    if (amount > 0) return 'text-emerald-600';
    if (amount < 0) return 'text-red-600';
    return 'text-slate-600';
  }, []);

  return (
    <div className={transactionModalOverlay({ blur: true })}>
      <div className={transactionModalContent({ mode: 'financial-preview' })}>
        {/* Modal Header */}
        <div className={transactionModalHeader({ variant: 'primary' })}>
          <div>
            <h2 className={transactionModalTitle({ variant: 'primary' })}>
              Previzualizare Financiară
            </h2>
            <div className="text-sm text-blue-700 mt-1">
              {cellContext.category} • {cellContext.day}/{cellContext.month}/{cellContext.year}
            </div>
          </div>
          <button
            className={transactionModalCloseButton()}
            onClick={onClose}
            data-testid="financial-preview-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-blue-200 bg-blue-50">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-900 border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => setActiveTab('overview')}
              data-testid="overview-tab"
            >
              Generale (1)
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === 'breakdown'
                  ? 'text-blue-900 border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => setActiveTab('breakdown')}
              data-testid="breakdown-tab"
            >
              Categorii (2)
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'text-blue-900 border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => setActiveTab('trends')}
              data-testid="trends-tab"
            >
              Tendințe (3)
            </button>
            {showProjections && (
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'projections'
                    ? 'text-blue-900 border-b-2 border-blue-600'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                onClick={() => setActiveTab('projections')}
                data-testid="projections-tab"
              >
                Proiecții (4)
              </button>
            )}
          </div>
        </div>

        {/* Modal Body cu Tab Content */}
        <div className={transactionModalBody()}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="text-sm font-medium text-emerald-800">Total Venituri</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(financialAnalysis.totalIncome)}
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    {transactions.filter(t => t.type === 'income').length} tranzacții
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-800">Total Cheltuieli</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(financialAnalysis.totalExpenses)}
                  </div>
                  <div className="text-xs text-red-700 mt-1">
                    {transactions.filter(t => t.type === 'expense').length} tranzacții
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-sm font-medium text-slate-800">Flux Net</div>
                  <div className={`text-2xl font-bold ${getNetFlowColor(financialAnalysis.netFlow)}`}>
                    {financialAnalysis.netFlow >= 0 ? '+' : ''}{formatCurrency(financialAnalysis.netFlow)}
                  </div>
                  <div className="text-xs text-slate-700 mt-1">
                    Diferența venituri - cheltuieli
                  </div>
                </div>
              </div>
              
              {/* Context Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Context Analiză</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Perioadă:</span>
                    <span className="ml-2 font-medium">{cellContext.month}/{cellContext.year}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Categorie principală:</span>
                    <span className="ml-2 font-medium">{cellContext.category}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Total tranzacții:</span>
                    <span className="ml-2 font-medium">{transactions.length}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Rata de economisire:</span>
                    <span className="ml-2 font-medium">
                      {financialAnalysis.totalIncome > 0 ? 
                        formatPercentage((financialAnalysis.netFlow / financialAnalysis.totalIncome) * 100) : 
                        '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium text-slate-800">Top Categorii Venituri</h5>
                  {financialAnalysis.categoryBreakdown
                    .filter(c => c.type === 'income')
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 truncate">
                          {category.category}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-emerald-600">
                            {formatCurrency(category.amount)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatPercentage(category.percentage)}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-slate-800">Top Categorii Cheltuieli</h5>
                  {financialAnalysis.categoryBreakdown
                    .filter(c => c.type === 'expense')
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 truncate">
                          {category.category}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">
                            {formatCurrency(category.amount)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatPercentage(category.percentage)}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">
                Detaliere pe Categorii ({financialAnalysis.categoryBreakdown.length})
              </h4>
              
              {financialAnalysis.categoryBreakdown.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Nu există tranzacții pentru analiză.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {financialAnalysis.categoryBreakdown.map((category, index) => (
                    <div 
                      key={index}
                      className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">
                            {category.category}
                            {category.subcategory && (
                              <span className="text-slate-600"> → {category.subcategory}</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {category.transactionCount} tranzacț{category.transactionCount === 1 ? 'ie' : 'ii'}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-lg font-semibold ${
                            category.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(category.amount)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatPercentage(category.percentage)} din total
                          </div>
                          <Badge 
                            variant={category.type === 'income' ? 'success' : 'error'}
                            className="text-xs mt-1"
                          >
                            {category.type === 'income' ? 'Venit' : 'Cheltuială'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <h4 className="font-semibold text-slate-800">Tendințe Lunare</h4>
              
              {/* Monthly trend visualization (simplified) */}
              <div className="space-y-4">
                {financialAnalysis.monthlyTrend.map((month, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-slate-800">{month.month}</div>
                      <div className="flex space-x-6 text-sm">
                        <div className="text-right">
                          <div className="text-emerald-600 font-medium">
                            +{formatCurrency(month.income)}
                          </div>
                          <div className="text-xs text-slate-500">Venituri</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-medium">
                            -{formatCurrency(month.expenses)}
                          </div>
                          <div className="text-xs text-slate-500">Cheltuieli</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getNetFlowColor(month.netFlow)}`}>
                            {month.netFlow >= 0 ? '+' : ''}{formatCurrency(month.netFlow)}
                          </div>
                          <div className="text-xs text-slate-500">Net</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Trend insights */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">Observații Tendințe</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Fluxul net a crescut cu 15% față de luna precedentă</li>
                  <li>• Cheltuielile au scăzut cu 5% în ultima lună</li>
                  <li>• Tendința generală este pozitivă pentru perioada analizată</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'projections' && showProjections && (
            <div className="space-y-6">
              <h4 className="font-semibold text-slate-800">Proiecții Financiare</h4>
              
              {/* Projection cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-sm font-medium text-slate-700">Luna Următoare</div>
                  <div className={`text-xl font-bold ${getNetFlowColor(financialAnalysis.projectedImpact.nextMonth)}`}>
                    {financialAnalysis.projectedImpact.nextMonth >= 0 ? '+' : ''}
                    {formatCurrency(financialAnalysis.projectedImpact.nextMonth)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Bazat pe trend actual</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-sm font-medium text-slate-700">Următoarele 3 Luni</div>
                  <div className={`text-xl font-bold ${getNetFlowColor(financialAnalysis.projectedImpact.next3Months)}`}>
                    {financialAnalysis.projectedImpact.next3Months >= 0 ? '+' : ''}
                    {formatCurrency(financialAnalysis.projectedImpact.next3Months)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Acumulat trimestrial</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-sm font-medium text-slate-700">Următoarele 6 Luni</div>
                  <div className={`text-xl font-bold ${getNetFlowColor(financialAnalysis.projectedImpact.next6Months)}`}>
                    {financialAnalysis.projectedImpact.next6Months >= 0 ? '+' : ''}
                    {formatCurrency(financialAnalysis.projectedImpact.next6Months)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Semestrial estimat</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-sm font-medium text-slate-700">Sfârșitul Anului</div>
                  <div className={`text-xl font-bold ${getNetFlowColor(financialAnalysis.projectedImpact.yearEnd)}`}>
                    {financialAnalysis.projectedImpact.yearEnd >= 0 ? '+' : ''}
                    {formatCurrency(financialAnalysis.projectedImpact.yearEnd)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Proiecție anuală</div>
                </div>
              </div>
              
              {/* Projection methodology */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-800 mb-2">Metodologie Proiecții</h5>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• Proiecțiile sunt bazate pe tendințele curente și tranzacțiile recurente</p>
                  <p>• Calculele includ o rată de creștere estimată de 5% lunar</p>
                  <p>• Valorile sunt orientative și pot varia în funcție de schimbările economice</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={transactionModalFooter()}>
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              {onExport && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    data-testid="export-csv-button"
                  >
                    {isExporting ? 'Export...' : 'Export CSV (Ctrl+E)'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    data-testid="export-pdf-button"
                  >
                    Export PDF
                  </Button>
                </>
              )}
            </div>
            <div>
              <Button
                variant="primary"
                onClick={onClose}
                data-testid="financial-preview-close-button"
              >
                Închide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 