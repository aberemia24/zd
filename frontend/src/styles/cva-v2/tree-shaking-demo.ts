/**
 * 🌳 TREE-SHAKING DEMONSTRATION - Carbon Copper CVA System
 * Demonstrează diferența dintre importurile monolitice și modulare
 */

// =============================================================================
// ❌ IMPORT MONOLITIC (VECHIUL SISTEM) - DEPRECATED
// =============================================================================
// PROBLEMĂ: Importurile monolitice încarcă TOATE componentele (956 linii) 
// chiar dacă folosești doar câteva componente
// Bundle size impact: ~33KB pentru orice import
// Tree-shaking: INEFICIENT

// =============================================================================
// ✅ IMPORT MODULAR (NOUL SISTEM)
// =============================================================================

// Opțiunea 1: Import granular (OPTIMAL pentru tree-shaking)
import { button } from './primitives/button';
import { input } from './primitives/inputs';
import { textProfessional } from './foundations/typography';
import { ambientGlow } from './foundations/effects';

// Bundle size impact: ~150 linii (doar componentele necesare)
// Tree-shaking: MAXIM EFICIENT

// Opțiunea 2: Import prin barrel (CONVENABIL dar mai puțin eficient)
// import { button, input, textProfessional, ambientGlow } from './index';
// Bundle size impact: ~200 linii (include și barrel overhead)
// Tree-shaking: EFICIENT

// Opțiunea 3: Import pe module (ECHILIBRAT)
import { button as buttonModule } from './primitives/button';
import { textProfessional as typographyModule } from './foundations/typography';

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

// Folosirea componentelor importate
const primaryButton = button({ variant: 'primary', size: 'md' });
const defaultInput = input({ variant: 'default' });
const headingText = textProfessional({ variant: 'heading' });
const glowEffect = ambientGlow({ size: 'md', color: 'primary' });

// =============================================================================
// BUNDLE SIZE COMPARISON
// =============================================================================
/**
 * UNIFIED-CVA.TS (Monolitic):
 * - Import orice componentă: 956 linii (33KB)
 * - Tree-shaking: Ineficient
 * - Maintenance: Dificil (SRP violat)
 * 
 * CVA-V2 (Modular):
 * - Import granular: 30-50 linii per componentă
 * - Tree-shaking: Maxim eficient
 * - Maintenance: Ușor (SRP respectat)
 * 
 * IMPROVEMENT: 85-90% reducere în bundle size pentru importuri selective
 */

export {
  primaryButton,
  defaultInput,
  headingText,
  glowEffect
}; 