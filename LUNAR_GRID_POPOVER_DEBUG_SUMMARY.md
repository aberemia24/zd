# Sumar Debugging - Problema Popover-ului din LunarGrid

**Data:** 9 Iunie 2025
**Autor:** Gemini Assistant
**Status:** **NEREZOLVAT**. Se solicită ajutor extern.

---

## 1. Descrierea Problemei

Aplicația se confruntă cu două probleme persistente în componenta `LunarGrid`, care par a fi interconectate:

1.  **Funcționalitate Blocată:** Popover-ul de editare a tranzacțiilor, care ar trebui să apară la click pe butonul "Mai multe opțiuni" (iconița cu trei puncte) dintr-o celulă a tabelului, **nu se deschide**. Evenimentul de click pare să fie interceptat sau ignorat înainte ca librăria Radix UI Popover să poată acționa.
2.  **Glitch Vizual "Box-in-Box":** La selectarea unei celule, apare un efect vizual de "cutie în cutie", unde atât `<td>`-ul (celula tabelului), cât și `div`-ul componentei interioare (`EditableCell`) par să aibă propriul lor stil de fundal și padding, creând o aparență neplăcută și indicând un conflict de stiluri.

---

## 2. Istoricul Problemei și Arhitectura Încercată

Inițial, componenta folosea un modal centralizat care era repoziționat cu JavaScript. Această abordare a fost abandonată în favoarea unei soluții mai moderne cu un popover per-celulă, folosind Radix UI, pentru o experiență utilizator superioară. Toate problemele au apărut în timpul acestei refactorizări.

Au fost implementate și abandonate succesiv mai multe arhitecturi:

1.  **Popover la nivel de Rând (`LunarGridRow`):** Prima tentativă a fost să înfășurăm `LunarGridCell` într-un `<TransactionPopover>` direct în `LunarGridRow`.
    *   **Teorie:** Părintele (rândul) controlează popover-ul.
    *   **Problemă:** A cauzat conflicte de evenimente și nu a rezolvat problema de `z-index` cu elementele `sticky`.

2.  **Popover la nivel de Celulă (`EditableCell`):** Arhitectura actuală, unde logica popover-ului a fost mutată direct în interiorul celei mai granulare componente, `EditableCell`.
    *   **Teorie:** Componenta se auto-gestionează, iar trigger-ul (butonul "More") este în proximitatea conținutului său. Aceasta este, teoretic, abordarea corectă.
    *   **Problemă:** Chiar și cu această arhitectură, popover-ul tot nu se deschide.

---

## 3. Soluții Încercate și Rezultatele Lor

Aceasta este o listă cronologică a tentativelor de debugging:

| #   | Soluție Încercată                                                                                               | Teoria din Spatele Încercării                                                                                                  | Rezultat                                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Management `e.stopPropagation()`**                                                                              | Un handler `onClick` superior "fură" evenimentul. Oprirea propagării la nivelul corect ar trebui să izoleze click-ul.       | Eșec. Indiferent unde a fost plasat `stopPropagation()`, fie oprea prea devreme (înainte de Radix), fie nu avea efect.                                                                           |
| 2   | **Ridicarea `z-index` pe `<td>`**                                                                                 | (Bazat pe research) Elementele `sticky` creează un "stacking context". Ridicarea `z-index`-ului pe `<td>` ar trebui să-l aducă în față. | Eșec. Nu a avut niciun efect vizibil, sugerând că problema este mai complexă decât un simplu conflict de `z-index`.                                                                            |
| 3   | **Utilizarea `<Popover.Portal>`**                                                                                 | Scoaterea conținutului popover-ului din fluxul DOM al tabelului și randarea lui la `<body>` ar trebui să elimine orice conflict de stil/stacking. | Eșec. Chiar și cu portal, popover-ul tot nu s-a deschis, indicând că problema nu este la randarea conținutului, ci la **declanșarea** lui.                                                         |
| 4   | **Izolarea cu "Butonul de Test"**                                                                                 | Înlocuirea `EditableCell` cu un `<button>` simplu pentru a vedea dacă trigger-ul funcționează într-un mediu complet curat.           | **Semi-Succes**. Testul a arătat că popover-ul în sine este funcțional, dar un `onClick` pe un container superior (`div`-ul principal al grid-ului) oprea evenimentul.                               |
| 5   | **Eliminarea `onClick` de pe Container**                                                                          | S-a eliminat `onClick={(e) => e.stopPropagation()}` de pe containerul principal al `LunarGridTanStack`.                         | **Progres.** Mesajul "Container Clicked" a dispărut, dar popover-ul tot nu se deschide, iar problema "box-in-box" persistă.                                                                    |
| 6   | **Refactorizarea `EditableCell`**                                                                                 | S-a încercat izolarea trigger-ului într-un `div` cu `stopPropagation` sau verificarea `e.target !== e.currentTarget`.             | Eșec. Toate încercările de a gestiona manual propagarea în interiorul `EditableCell` au eșuat, fie blocând trigger-ul Radix, fie permițând propagarea nedorită.                                    |
| 7   | **Stil `!p-0` pe `<td>` și `w-full h-full` pe `EditableCell`**                                                       | Forțarea `<td>`-ului să nu aibă padding și a `EditableCell` să umple tot spațiul ar trebui să rezolve problema "box-in-box".    | Eșec. Problema vizuală persistă, ceea ce indică faptul că `<td>`-ul în sine este randat cu o dimensiune mai mare decât conținutul său, chiar și fără padding.                                 |

---

## 4. Starea Curentă a Codului și Misterul Central

**Arhitectura Curentă:**
*   Logica popover-ului (`AdvancedEditPopover`) este o sub-componentă locală în `EditableCell.tsx`.
*   Trigger-ul este butonul cu iconița `MoreHorizontal`.
*   S-a încercat eliminarea conflictelor de `z-index` și de `onClick`.

**Misterul Central:**
De ce **nu se deschide popover-ul** la click pe butonul trigger, chiar și atunci când:
a) Evenimentele de click ajung la buton (confirmat cu `console.log`).
b) Nu există handlere `onClick` conflictuale evidente pe elementele părinte.
c) S-a folosit `<Popover.Portal>` pentru a elimina conflictele de randare.

Pare că ceva, fie în structura DOM a tabelului generat de `@tanstack/react-table`, fie într-un stil CSS subtil, interceptează sau anulează evenimentul într-un mod pe care nu l-am putut depista.

---

## 5. Fragmente de Cod Relevante (Starea Actuală)

### `frontend/src/components/features/LunarGrid/inline-editing/EditableCell.tsx`
*Componenta centrală a problemei. Conține atât celula, cât și logica popover-ului.*
\`\`\`tsx
// EditableCell.tsx - Starea actuală
import React, { useState, useCallback, useMemo } from "react";
import { Edit2, MoreHorizontal } from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import { cn, cva, /* ... */ } from "../../../../styles/cva-v2";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { TransactionData } from "../modals/types";
import { TransactionType } from "@budget-app/shared-constants";

// +++ Popover-ul este o sub-componentă locală +++
interface AdvancedEditPopoverProps {
  onSave: (transaction: Omit<TransactionData, "id">) => Promise<void>;
  existingTransaction?: TransactionData;
  date: string;
  cellPosition: { category: string; subcategory?: string };
  children: React.ReactNode;
}

const AdvancedEditPopover: React.FC<AdvancedEditPopoverProps> = ({ onSave, existingTransaction, date, cellPosition, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState<string>(existingTransaction?.amount?.toString() || "");
    const [description, setDescription] = useState<string>(existingTransaction?.description || "");
    const [isRecurring, setIsRecurring] = useState<boolean>(existingTransaction?.isRecurring || false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                amount: parseFloat(amount),
                type: getTransactionTypeForCategory(cellPosition.category),
                description,
                isRecurring,
                category: cellPosition.category,
                subcategory: cellPosition.subcategory,
                date,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Transaction save error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>{children}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Content side="bottom" align="start" sideOffset={5} className="z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none dark:bg-neutral-900 dark:border-neutral-700">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... conținutul formularului ... */}
                    </form>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};


export interface EditableCellProps {
  // ... props ...
  date: string;
  existingTransaction?: TransactionData;
  onSaveTransaction: (transaction: Omit<TransactionData, "id">) => Promise<void>;
  onTogglePopover: () => void;
}

const EditableCellComponent: React.FC<EditableCellProps> = ({ /* ... */ }) => {
  // ...
  return (
    <div
      className="relative w-full h-full flex items-center justify-center px-2 py-1 /* ... */"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      }}
    >
      <span>{displayValue}</span>
      <div className="absolute right-1 top-1 flex gap-1">
        <button onClick={handleEditButtonClick}><Edit2 size={14} /></button>
        <AdvancedEditPopover
          onSave={onSaveTransaction}
          existingTransaction={existingTransaction}
          date={date}
          cellPosition={{ category: cellId.split('-')[0], subcategory: cellId.split('-')[1] }}
        >
          <button className="p-1 rounded hover:bg-gray-100">
            <MoreHorizontal size={14} />
          </button>
        </AdvancedEditPopover>
      </div>
    </div>
  );
};

export const EditableCell = React.memo(EditableCellComponent);
\`\`\`

### `frontend/src/components/features/LunarGrid/components/LunarGridRow.tsx`
*Componenta care randează rândul și unde se aplică stilul pe `<td>`.*
\`\`\`tsx
// ...
const LunarGridRowComponent: React.FC<LunarGridRowProps> = ({ /* ... */ }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // ...
  return (
    // ...
    {row.getVisibleCells().map((cell) => (
      <td
        key={cell.id}
        className={cn(
          gridCell({ /* ... */ }),
          isDayCell && isSubcategory && "!p-0", // Încercarea de a elimina padding-ul
          { 'z-20': isPopoverOpen } // Încercarea de a ridica z-index
        )}
      >
        {isDayCell && isSubcategory ? (
            <LunarGridCell
              // ...
              onTogglePopover={() => setIsPopoverOpen(prev => !prev)}
            />
        ) : ( /* ... */ )}
      </td>
    ))}
    // ...
  );
};
\`\`\`

Sper ca acest document să fie de ajutor. Orice perspectivă nouă este binevenită. 