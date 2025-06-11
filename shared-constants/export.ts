/**
 * 📤 EXPORT TYPES & CONSTANTS - Unified Export System
 * 
 * Consolidates all export-related types, formats, and constants from multiple files
 * into a single source of truth. This eliminates duplications across:
 * - lazyExportUtils.tsx
 * - types/financial.tsx
 * - shared/utils/exportUtils.ts
 * - types/charts.tsx
 */

import type { UnifiedExportOptions } from './types';

// =============================================================================
// EXPORT FORMAT TYPES (Consolidated)
// =============================================================================

/**
 * Unified export format type covering all export scenarios
 * Replaces multiple scattered definitions
 */
export type ExportFormat = 'csv' | 'pdf' | 'excel' | 'png' | 'svg';

/**
 * Document export formats (financial reports, transactions)
 */
export type DocumentExportFormat = 'csv' | 'pdf' | 'excel';

/**
 * Image export formats (charts, screenshots, visualizations)
 */
export type ImageExportFormat = 'png' | 'svg' | 'pdf';

/**
 * Chart-specific export formats
 * @deprecated Use ImageExportFormat instead
 */
export type ChartExportFormat = ImageExportFormat;

// =============================================================================
// EXPORT OPTIONS & INTERFACES
// =============================================================================

// ExportOptions moved to types.ts - import from there for better organization

/**
 * Export progress tracking
 */
export interface ExportProgress {
  /** Current stage of export */
  stage: 'preparing' | 'processing' | 'generating' | 'downloading' | 'complete' | 'error';
  /** Progress percentage (0-100) */
  progress: number;
  /** Current operation description */
  message?: string;
  /** Error details if stage is 'error' */
  error?: string;
}

/**
 * Export progress callback type
 */
export type ExportProgressCallback = (progress: ExportProgress) => void;

// =============================================================================
// EXPORT CONSTANTS
// =============================================================================

/**
 * Supported export formats with metadata
 */
export const EXPORT_FORMATS = {
  CSV: {
    key: 'csv' as const,
    label: 'CSV',
    description: 'Comma Separated Values - pentru Excel și alte aplicații',
    extension: '.csv',
    mimeType: 'text/csv',
    category: 'document'
  },
  PDF: {
    key: 'pdf' as const,
    label: 'PDF', 
    description: 'Portable Document Format - pentru vizualizare și printare',
    extension: '.pdf',
    mimeType: 'application/pdf',
    category: 'document'
  },
  EXCEL: {
    key: 'excel' as const,
    label: 'Excel',
    description: 'Microsoft Excel format - cu formatare avansată',
    extension: '.xlsx', 
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'document'
  },
  PNG: {
    key: 'png' as const,
    label: 'PNG',
    description: 'Portable Network Graphics - imagine de înaltă calitate',
    extension: '.png',
    mimeType: 'image/png',
    category: 'image'
  },
  SVG: {
    key: 'svg' as const,
    label: 'SVG',
    description: 'Scalable Vector Graphics - imagine vectorială',
    extension: '.svg',
    mimeType: 'image/svg+xml',
    category: 'image'
  }
} as const;

/**
 * Helper to get format metadata
 */
export const getExportFormatMetadata = (format: ExportFormat) => {
  const formatKey = format.toUpperCase() as keyof typeof EXPORT_FORMATS;
  return EXPORT_FORMATS[formatKey];
};

/**
 * Check if format is supported
 */
export const isExportFormatSupported = (format: string): format is ExportFormat => {
  return Object.values(EXPORT_FORMATS).some(f => f.key === format);
};

/**
 * Get document export formats
 */
export const getDocumentFormats = (): DocumentExportFormat[] => {
  return Object.values(EXPORT_FORMATS)
    .filter(f => f.category === 'document')
    .map(f => f.key) as DocumentExportFormat[];
};

/**
 * Get image export formats
 */
export const getImageFormats = (): ImageExportFormat[] => {
  return Object.values(EXPORT_FORMATS)
    .filter(f => f.category === 'image')
    .map(f => f.key) as ImageExportFormat[];
};

// =============================================================================
// EXPORT DEFAULTS
// =============================================================================

/**
 * Default export options
 */
export const DEFAULT_EXPORT_OPTIONS: Required<Pick<UnifiedExportOptions, 'includeHeaders' | 'filename'>> = {
  includeHeaders: true,
  filename: 'export'
};

/**
 * Default export progress
 */
export const DEFAULT_EXPORT_PROGRESS: ExportProgress = {
  stage: 'preparing',
  progress: 0,
  message: 'Pregătire export...'
}; 