# shared-constants

Toate enums/constants partajate între frontend și backend se află aici.

## Exemplu de import:
```typescript
import { TransactionType, UI, MESAJE, INITIAL_FORM_STATE } from '../../shared-constants';
```

- Orice modificare la enums/constants se face DIRECT aici.
- Sincronizarea este manuală, fără build, alias sau barrel workspace.
