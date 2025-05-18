import React from 'react';
import { LOADER } from '@shared-constants';
import { getComponentClasses } from '../../../styles/themeUtils';

const Loader: React.FC = () => (
  <div className={getComponentClasses('loader-container')}>
    <svg className={getComponentClasses('loader-svg')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className={getComponentClasses('loader-circle')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className={getComponentClasses('loader-path')} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <span className={getComponentClasses('loader-text')} data-testid="loader-text">{LOADER.TEXT}</span>
  </div>
);

export default Loader;
