import React, { forwardRef } from 'react';

// Components and types
import LunarGridContainer, { type LunarGridContainerRef } from './LunarGridContainer';
import LunarGridStateManager, { type LunarGridStateResult } from './LunarGridStateManager';
import LunarGridEventHandler, { type LunarGridHandlers } from './LunarGridEventHandler';

// CVA styling
import { cn } from "../../../../styles/cva-v2";

// Props for the main LunarGrid component (external interface)
export interface LunarGridRendererProps {
  year: number;
  month: number;
  isFullscreen?: boolean;
  className?: string;
}

/**
 * LunarGridRenderer - Pure rendering component for LunarGrid
 * 
 * Responsibilities:
 * - Assemble all 4 components (Container, StateManager, EventHandler, Renderer)
 * - Coordinate component integration and props flow
 * - Provide the final LunarGrid component interface
 * 
 * This is the main export component that users will import
 * Note: Simplified version for testing component architecture
 */
const LunarGridRenderer = forwardRef<LunarGridContainerRef, LunarGridRendererProps>(
  ({ year, month, isFullscreen = false, className }, ref) => {
    return (
      <LunarGridStateManager year={year} month={month} expandedCategories={{}}>
        {(stateManager: LunarGridStateResult) => (
          <LunarGridEventHandler stateManager={stateManager} year={year} month={month}>
            {(handlers: LunarGridHandlers) => (
              <LunarGridContainer
                ref={ref}
                isLoading={stateManager.isLoading}
                error={stateManager.error}
                hasData={Boolean(stateManager.table?.getRowModel?.()?.rows?.length)}
                isFullscreen={isFullscreen}
                className={className}
                onSubmit={handlers.onContainerSubmit}
                onClick={handlers.onContainerClick}
                onWheel={handlers.onContainerWheel}
              >
                {/* Simplified rendering - architecture testing version */}
                <div className={cn("w-full h-full flex items-center justify-center bg-background")}>
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">
                      🏗️ LunarGrid V3 Architecture
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h3 className="font-medium text-primary">✅ Container</h3>
                        <p className="text-muted-foreground">Layout & States</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h3 className="font-medium text-primary">✅ StateManager</h3>
                        <p className="text-muted-foreground">Hooks & Data</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h3 className="font-medium text-primary">✅ EventHandler</h3>
                        <p className="text-muted-foreground">User Interactions</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h3 className="font-medium text-primary">✅ Renderer</h3>
                        <p className="text-muted-foreground">Component Assembly</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      4-Component Architecture: {year}/{month}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Build Status: {stateManager.isLoading ? 'Loading...' : 'Ready'}
                    </p>
                  </div>
                </div>
              </LunarGridContainer>
            )}
          </LunarGridEventHandler>
        )}
      </LunarGridStateManager>
    );
  }
);

LunarGridRenderer.displayName = 'LunarGridRenderer';

export default LunarGridRenderer;
export type { LunarGridContainerRef }; 