import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RefreshCw, Download, Upload, Save, Database, CreditCard } from 'lucide-react';
import Loader from './Loader';
import Spinner from '../Spinner/Spinner';
import { Button } from '../Button';
import Card from '../Card/Card';

/**
 * 🎨 Loader Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Loader> = {
  title: 'CVA-v2/Primitives/Loader',
  component: Loader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Loader component pentru loading states cu overlay opțional și spinner integrat, construit cu CVA-v2 system cu Carbon Copper styling.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Mărimea spinner-ului'
    },
    message: {
      control: 'text',
      description: 'Mesajul de loading'
    },
    overlay: {
      control: 'boolean',
      description: 'Afișează ca overlay fullscreen'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Loader Story
 */
export const Default: Story = {
  args: {
    size: 'md',
    message: 'Loading...',
    overlay: false
  }
};

/**
 * All Variants Overview
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Loader Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Loader size="sm" message="Small Loading" />
          <Loader size="md" message="Medium Loading" />
          <Loader size="lg" message="Large Loading" />
          <Loader size="xl" message="Extra Large Loading" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Standalone Spinners</h3>
        <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="text-center">
              <Spinner size="sm" color="primary" />
              <p className="text-xs mt-2">Small Primary</p>
            </div>
            
            <div className="text-center">
              <Spinner size="md" color="secondary" />
              <p className="text-xs mt-2">Medium Secondary</p>
            </div>
            
            <div className="text-center">
              <Spinner size="lg" color="neutral" />
              <p className="text-xs mt-2">Large Neutral</p>
            </div>
            
            <div className="text-center bg-carbon-800 dark:bg-carbon-200 p-4 rounded">
              <Spinner size="xl" color="white" />
              <p className="text-xs mt-2 text-white dark:text-carbon-800">XL White</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Loading Messages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Loader message="Saving your changes..." />
          <Loader message="Processing transaction..." />
          <Loader message="Generating report..." />
          <Loader message="Syncing data..." />
        </div>
      </div>
    </div>
  )
};

/**
 * Interactive Features
 */
export const Interactive: Story = {
  render: () => {
    const [loadingStates, setLoadingStates] = useState({
      save: false,
      download: false,
      upload: false,
      refresh: false
    });

    const handleAction = (action: keyof typeof loadingStates) => {
      setLoadingStates(prev => ({ ...prev, [action]: true }));
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [action]: false }));
      }, 2000);
    };

    return (
      <div className="space-y-6 p-6">
        <h3 className="text-lg font-semibold">Interactive Loading States</h3>
        
        <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleAction('save')}
              disabled={loadingStates.save}
              className="flex items-center gap-2"
            >
              {loadingStates.save ? (
                <>
                  <Spinner size="sm" color="white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Document
                </>
              )}
            </Button>

            <Button
              onClick={() => handleAction('download')}
              disabled={loadingStates.download}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {loadingStates.download ? (
                <>
                  <Spinner size="sm" color="primary" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Report
                </>
              )}
            </Button>

            <Button
              onClick={() => handleAction('upload')}
              disabled={loadingStates.upload}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loadingStates.upload ? (
                <>
                  <Spinner size="sm" color="primary" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload File
                </>
              )}
            </Button>

            <Button
              onClick={() => handleAction('refresh')}
              disabled={loadingStates.refresh}
              variant="ghost"
              className="flex items-center gap-2"
            >
              {loadingStates.refresh ? (
                <>
                  <Spinner size="sm" color="primary" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {loadingStates.save && (
              <Card className="border-copper-200">
                <Loader size="sm" message="Saving your document..." />
              </Card>
            )}
            
            {loadingStates.download && (
              <Card className="border-blue-200">
                <Loader size="sm" message="Preparing your download..." />
              </Card>
            )}
            
            {loadingStates.upload && (
              <Card className="border-green-200">
                <Loader size="sm" message="Processing uploaded file..." />
              </Card>
            )}
            
            {loadingStates.refresh && (
              <Card className="border-gray-200">
                <Loader size="sm" message="Refreshing data from server..." />
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Financial Use Cases
 */
export const FinancialUseCases: Story = {
  render: () => {
    const [activeLoaders, setActiveLoaders] = useState<Record<string, boolean>>({});

    const startLoader = (id: string) => {
      setActiveLoaders(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setActiveLoaders(prev => ({ ...prev, [id]: false }));
      }, 3000);
    };

    return (
      <div className="space-y-8 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-copper-600" />
            <h3 className="text-lg font-semibold">Financial Data Processing</h3>
          </div>
          
          <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Transaction Import</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => startLoader('import')}
                    disabled={activeLoaders.import}
                  >
                    {activeLoaders.import ? 'Processing...' : 'Import CSV'}
                  </Button>
                </div>
                
                {activeLoaders.import && (
                  <Loader 
                    size="sm" 
                    message="Processing bank transactions..."
                    className="bg-blue-50 dark:bg-blue-900/20"
                  />
                )}
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">Account Sync</span>
                  </div>
                  <Button 
                    size="sm"
                    variant="secondary"
                    onClick={() => startLoader('sync')}
                    disabled={activeLoaders.sync}
                  >
                    {activeLoaders.sync ? 'Syncing...' : 'Sync Now'}
                  </Button>
                </div>
                
                {activeLoaders.sync && (
                  <Loader 
                    size="sm" 
                    message="Synchronizing account balances..."
                    className="bg-green-50 dark:bg-green-900/20"
                  />
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Financial Operations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => startLoader('report')}
                    disabled={activeLoaders.report}
                    className="w-full mb-3"
                  >
                    Generate Report
                  </Button>
                  
                  {activeLoaders.report && (
                    <div className="space-y-2">
                      <Spinner size="md" color="primary" />
                      <p className="text-sm text-carbon-600 dark:text-carbon-400">
                        Calculating monthly summary...
                      </p>
                    </div>
                  )}
                </Card>

                <Card className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => startLoader('backup')}
                    disabled={activeLoaders.backup}
                    className="w-full mb-3"
                  >
                    Backup Data
                  </Button>
                  
                  {activeLoaders.backup && (
                    <div className="space-y-2">
                      <Spinner size="md" color="secondary" />
                      <p className="text-sm text-carbon-600 dark:text-carbon-400">
                        Creating secure backup...
                      </p>
                    </div>
                  )}
                </Card>

                <Card className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => startLoader('export')}
                    disabled={activeLoaders.export}
                    className="w-full mb-3"
                  >
                    Export to Excel
                  </Button>
                  
                  {activeLoaders.export && (
                    <div className="space-y-2">
                      <Spinner size="md" color="neutral" />
                      <p className="text-sm text-carbon-600 dark:text-carbon-400">
                        Preparing Excel file...
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="mt-6 p-4 bg-copper-50 dark:bg-copper-900/20 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Batch Processing Status
              </h4>
              
              <div className="space-y-3">
                <Loader 
                  size="lg" 
                  message="Processing 1,247 transactions... This may take a few minutes."
                  className="bg-white dark:bg-carbon-800"
                />
                
                <div className="text-sm text-carbon-600 dark:text-carbon-400 space-y-1">
                  <p>• Categorizing transactions automatically</p>
                  <p>• Detecting recurring payments</p>
                  <p>• Updating account balances</p>
                  <p>• Generating insights and recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-carbon-600 dark:text-carbon-400 bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
          <Spinner size="sm" color="primary" />
          Processing times may vary based on data volume and server load
        </div>
      </div>
    );
  }
};

/**
 * Overlay Loader Demo
 */
export const OverlayLoader: Story = {
  render: () => {
    const [showOverlay, setShowOverlay] = useState(false);

    const handleShowOverlay = () => {
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 3000);
    };

    return (
      <div className="space-y-6 p-6">
        <h3 className="text-lg font-semibold">Overlay Loader Demo</h3>
        
        <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg">
          <Button onClick={handleShowOverlay} disabled={showOverlay}>
            {showOverlay ? 'Loading...' : 'Show Overlay Loader'}
          </Button>
          
          <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-2">
            Click to demonstrate fullscreen overlay loader (3 seconds)
          </p>
        </div>

        {showOverlay && (
          <Loader 
            overlay
            size="xl"
            message="Processing your request... Please wait."
          />
        )}
      </div>
    );
  }
}; 