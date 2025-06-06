import React, { Profiler } from 'react';
import { API } from '@budget-app/shared-constants/api';
import useProfilingWrapper from './useProfilingWrapper';

interface ProfilerContainerProps {
  componentName: string;
  children: React.ReactNode;
}

/**
 * Componenta pentru profilarea performanței, înregistrează și afișează date despre
 * render-urile componentelor din interior.
 * 
 * Folosește pentru debug în dezvoltare și analiza sursei re-renderurilor.
 */
const ProfilerContainer: React.FC<ProfilerContainerProps> = ({ componentName, children }) => {
  // Folosim hook-ul custom pentru a gestiona logica de profiling
  const { 
    handleRender, 
    renderControls, 
    renderStatus, 
    renderResults 
  } = useProfilingWrapper();
  
  return (
    <div className="profiler-container border border-gray-300 p-4 rounded-lg">
      {renderControls()}
      {renderStatus()}
      
      <div className="profiler-content">
        {/* Utilizăm API-ul standard Profiler */}
        <Profiler id={componentName} onRender={handleRender}>
          {children}
        </Profiler>
      </div>
      
      {renderResults()}
    </div>
  );
};

export default ProfilerContainer;
