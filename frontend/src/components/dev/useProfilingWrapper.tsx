import React, { useState, useCallback, ProfilerOnRenderCallback } from 'react';

type ProfilerPhase = 'mount' | 'update';

interface RenderInfo {
  id: string;
  phase: ProfilerPhase;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<any>;
}

/**
 * Hook custom pentru a simplifica utilizarea React Profiler
 * pentru analiză de performanță și identificarea re-render-urilor excesive
 */
export function useProfilingWrapper() {
  const [renders, setRenders] = useState<RenderInfo[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const maxRendersToKeep = 20;

  // Implementăm handleRender cu tipul exact din React
  const handleRender: ProfilerOnRenderCallback = useCallback((
    id, 
    phase, 
    actualDuration, 
    baseDuration, 
    startTime, 
    commitTime
  ) => {
    if (isRecording) {
      setRenders(prev => {
        const newRenders = [
          {
            id,
            phase: phase as ProfilerPhase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interactions: new Set() // Empty set pentru interactions deprecated
          },
          ...prev
        ];
        
        // Păstrăm doar ultimele N render-uri pentru a nu umple memoria
        return newRenders.slice(0, maxRendersToKeep);
      });
    }
  }, [isRecording, maxRendersToKeep]);

  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      // Resetăm și începem o nouă înregistrare
      setRenders([]);
      setShowResults(false);
    }
    setIsRecording(prev => !prev);
  }, [isRecording]);

  const toggleShowResults = useCallback(() => {
    setShowResults(prev => !prev);
  }, []);

  const clearResults = useCallback(() => {
    setRenders([]);
  }, []);

  const renderControls = useCallback(() => (
    <div className="controls flex gap-2 mb-4">
      <button 
        onClick={toggleRecording}
        className={`px-3 py-1 rounded font-medium ${
          isRecording 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        data-testid="profiler-record-button"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      <button 
        onClick={toggleShowResults}
        className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
        disabled={renders.length === 0}
        data-testid="profiler-show-results-button"
      >
        {showResults ? 'Hide Results' : 'Show Results'}
      </button>
      
      <button 
        onClick={clearResults}
        className="px-3 py-1 rounded bg-gray-500 text-white font-medium hover:bg-gray-600"
        disabled={renders.length === 0}
        data-testid="profiler-clear-button"
      >
        Clear
      </button>
    </div>
  ), [toggleRecording, toggleShowResults, clearResults, isRecording, showResults, renders.length]);

  const renderStatus = useCallback(() => (
    <div className="profiler-status text-sm mb-2">
      {isRecording && (
        <div className="recording-indicator text-red-500 font-semibold flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Recording...
        </div>
      )}
      {renders.length > 0 && (
        <div className="text-gray-600">
          Captured {renders.length} render{renders.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  ), [isRecording, renders.length]);

  const renderResults = useCallback(() => {
    if (!showResults || renders.length === 0) return null;
    
    return (
      <div className="results mt-4 border-t pt-4" data-testid="profiler-results">
        <h3 className="text-lg font-bold mb-2">Render Performance</h3>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Component</th>
              <th className="p-2 border">Phase</th>
              <th className="p-2 border">Actual Duration (ms)</th>
              <th className="p-2 border">Base Duration (ms)</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {renders.map((render, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="p-2 border">{render.id}</td>
                <td className="p-2 border">{render.phase}</td>
                <td className="p-2 border">{render.actualDuration.toFixed(2)}</td>
                <td className="p-2 border">{render.baseDuration.toFixed(2)}</td>
                <td className="p-2 border">{new Date(render.commitTime).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [showResults, renders]);

  return {
    // Statele și funcțiile expuse
    isRecording,
    renders,
    handleRender,
    toggleRecording,
    toggleShowResults,
    clearResults,
    
    // Componente UI predefinte
    renderControls,
    renderStatus,
    renderResults
  };
}

export default useProfilingWrapper;
