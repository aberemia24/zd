# [2025-04-25] Importuri pentru constants: barrel & portabilitate

**Regulă:** Pentru orice cod partajat între runtime și test (mai ales constants folosite în stores/hooks/teste), folosește importuri din barrel (`index.ts`) cu cale relativă scurtă, nu import direct din fișier sau cu path mapping custom.

**Exemplu corect:**
```typescript
// În orice fișier din src/stores sau src/hooks
import { INITIAL_FORM_STATE, MESAJE } from '../constants';
```

**De ce?**
- Barrel-ul (`constants/index.ts`) re-exportă TOATE constantele relevante, deci importul e robust la schimbări de structură.
- TypeScript și Jest rezolvă corect modulele fără configurări suplimentare sau mapping custom.
- Evită probleme de rezoluție la runtime și la testare, indiferent de OS sau context.

**Atenție:**
- Actualizează barrel-ul dacă adaugi/ștergi constante!
- Nu folosi importuri absolute sau path mapping custom pentru constants (ex: `@constants/xyz`) decât dacă ai nevoie de compatibilitate cu unelte externe sau monorepo.
