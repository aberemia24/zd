import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LunarGridTanStack from '../features/LunarGrid/LunarGridTanStack';
import ProfilerContainer from './ProfilerContainer';
import { API } from '@budget-app/shared-constants/api';

/**
 * Pagină de debug pentru analiza performanței folosind React Profiler.
 * Permite testarea componentei LunarGridTanStack cu date reale,
 * dar într-un mediu izolat pentru a identifica probleme de performanță.
 */
const ProfilerDebugPage: React.FC = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2020 && value <= 2030) {
      setYear(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setMonth(value);
    }
  };

  const handleBackToApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profiler-debug-page p-4 max-w-screen-xl mx-auto">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">React Profiler Debug</h1>
        <button
          onClick={handleBackToApp}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          data-testid="back-to-app-button"
        >
          Înapoi la aplicație
        </button>
      </div>

      <div className="controls bg-white p-4 mb-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Configurare test</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm text-gray-600 mb-1">
              An:
            </label>
            <input
              id="year"
              type="number"
              min="2020"
              max="2030"
              value={year}
              onChange={handleYearChange}
              className="border rounded px-3 py-2 w-32"
              data-testid="profiler-year-input"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="month" className="text-sm text-gray-600 mb-1">
              Lună:
            </label>
            <select
              id="month"
              value={month}
              onChange={handleMonthChange}
              className="border rounded px-3 py-2 w-48"
              data-testid="month-select"
            >
              <option value="1">Ianuarie</option>
              <option value="2">Februarie</option>
              <option value="3">Martie</option>
              <option value="4">Aprilie</option>
              <option value="5">Mai</option>
              <option value="6">Iunie</option>
              <option value="7">Iulie</option>
              <option value="8">August</option>
              <option value="9">Septembrie</option>
              <option value="10">Octombrie</option>
              <option value="11">Noiembrie</option>
              <option value="12">Decembrie</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
          <p className="font-semibold">Instrucțiuni:</p>
          <ol className="list-decimal pl-5 mt-1">
            <li>Apasă "Start Recording" pentru a începe înregistrarea render-urilor</li>
            <li>Efectuează acțiuni în grid (expandează categorii, navighează, editează)</li>
            <li>Apasă "Stop Recording" pentru a opri înregistrarea</li>
            <li>Apasă "Show Results" pentru a vedea statisticile de performanță</li>
          </ol>
        </div>
      </div>

      <div className="test-container" data-testid="profiler-test-container">
        <ProfilerContainer componentName="LunarGridTanStack">
          <div className="grid-wrapper bg-white p-4 rounded-lg shadow-md overflow-auto">
            <LunarGridTanStack year={year} month={month} />
          </div>
        </ProfilerContainer>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Probleme comune de performanță:</h2>
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>
            <span className="font-medium">Re-render excesiv:</span> Componente care 
            se re-renderizează fără ca datele lor să se fi schimbat (indică lipsa de memo/useMemo).
          </li>
          <li>
            <span className="font-medium">Actual Duration mare:</span> Timp de procesare 
            ridicat pentru un render - posibil calcule costisitoare în render.
          </li>
          <li>
            <span className="font-medium">Update cascade:</span> O schimbare mică 
            declanșează re-render pentru toată ierarhia de componente.
          </li>
          <li>
            <span className="font-medium">Randări duble:</span> Componente care se 
            renderizează de mai multe ori într-o succesiune rapidă (posibile probleme cu depedențe).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilerDebugPage;
