import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div className="flex justify-center items-center" data-testid="spinner">
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <circle
        cx="22"
        cy="22"
        r="20"
        className="stroke-primary-500"
        strokeWidth="4"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M42 22c0-11.046-8.954-20-20-20"
        className="stroke-primary-500"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Spinner;
