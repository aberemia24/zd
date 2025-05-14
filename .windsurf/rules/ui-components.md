---
trigger: glob
globs: frontend/src/components/**
---

<component_structure>
organizare:
components/primitives/`: Componente de bază reutilizabile 
components/features/`: Componente specifice businessului
Fiecare componentă în director propriu cu:
ComponentName.tsx`: Implementarea componentei
index.ts`: Re-export simplu
ComponentName.test.tsx`: Teste unitare
Pattern pentru componente primitive:
export default Button;
</component_structure>
<props_patterns>
Definiți explicit tipurile pentru props
Asigurați valori default pentru props opționale
Folosiți destructuring pentru props în signatura componentei
Propagați props necunoscute cu spread operator pentru elemente native
Definiți props pentru forwarding refs când e necesar
<data_testid>
Toate elementele interactive TREBUIE să aibă atribut data-testid
Valori predictibile și stabile (nu aleatorii)
Format recomandat: [component-name]-[variant]-[action]
Pentru liste: folosiți id-uri unice în format clar
<text_content>
INTERZIS textele hardcodate în componente
Folosiți constants din @shared-constants/ui.ts
Prevedeți traduceri prin constante
Asigurați că toate textele sunt centralizate și reutilizabile
<interaction_patterns>
Implementați pattern-uri consistente:
Click simplu: acțiuni principale
Double click: editare rapidă
Hover: controale secundare (afișare butoane acțiuni)
Enter: salvare / confirmare
Escape: anulare / ieșire
Keyboard navigation: toate acțiunile accesibile prin tastatură
Separați stările pentru moduri incompatibile (editare/ștergere)
</interaction_patterns>
<performance>
Folosiți React.memo pentru componente pur funcționale
Evitați callback-uri inline în render pentru componente care se re-renderizează des
Folosiți useCallback pentru funcții pasate ca props
Evitați calcule costisitoare în render; mutați-le în useMemo
Memoizați liste pentru a evita re-renderizarea inutilă
</performance>
<Styling>
TailwindCSS:
-NU folosi @import pentru fișiere cu @layer/@apply în index.css
-Utilizează DOAR clasele bazate pe token-uri de design (bg-primary-500 NU bg-red-500)
-Folosește utilitarele predefinite (.btn, .input-field, .alert) din index.css
-Clasele custom cu @layer trebuie scrise direct în index.css
-token-uri: p-token, rounded-token, shadow-token >> p-4, rounded-lg, shadow-md
</Styling>