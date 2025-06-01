import React from 'react';
import { cn } from "../../../../styles/cva/shared/utils";
import { modal, modalContent, flex } from "../../../../styles/cva/components/layout";
import Button from "../../../primitives/Button/Button";

// Import constante din shared-constants
import { MESAJE, BUTTONS, LUNAR_GRID_ACTIONS } from "@shared-constants";

// Interfață pentru props-urile componentei
export interface DeleteSubcategoryModalProps {
  /** Determină dacă modal-ul este vizibil */
  isOpen: boolean;
  /** Numele subcategoriei de șters */
  subcategoryName: string;
  /** Numele categoriei părinte */
  categoryName: string;
  /** Numărul de tranzacții asociate cu subcategoria */
  transactionsCount: number;
  /** Handler pentru confirmarea ștergerii */
  onConfirm: () => void;
  /** Handler pentru anularea ștergerii */
  onCancel: () => void;
}

/**
 * Modal de confirmare pentru ștergerea unei subcategorii custom.
 * Afișează informații despre subcategoria ce va fi ștearsă și numărul de tranzacții asociate.
 * 
 * @param props - Props-urile componentei
 * @returns Modal de confirmare pentru ștergerea subcategoriei
 */
const DeleteSubcategoryModal: React.FC<DeleteSubcategoryModalProps> = ({
  isOpen,
  subcategoryName,
  categoryName,
  transactionsCount,
  onConfirm,
  onCancel,
}) => {
  // Nu renderiza modal-ul dacă nu este deschis
  if (!isOpen) return null;

  // Generează textul pentru numărul de tranzacții
  const transactionText = transactionsCount === 0 
    ? LUNAR_GRID_ACTIONS.NO_TRANSACTIONS
    : transactionsCount === 1 
      ? "1 tranzacție"
      : `${transactionsCount} tranzacții`;

  // Generează mesajul de confirmare
  const message = `Sigur doriți să ștergeți subcategoria "${subcategoryName}" din categoria "${categoryName}" (${transactionText})? Această acțiune nu poate fi anulată${transactionsCount > 0 ? ' și toate tranzacțiile asociate vor fi șterse definitiv din baza de date' : ''}.`;

  return (
    <div 
      className={modal({ variant: "confirmation", animation: "fade" })} 
      data-testid="delete-subcategory-confirmation"
    >
      <div className={modalContent()}>
        <h3 className={modalContent({ content: "header" })}>
          {MESAJE.CATEGORII.CONFIRMARE_STERGERE_TITLE}
        </h3>
        <p className={modalContent({ content: "text" })}>
          {message}
        </p>
        <div className={flex({ justify: "end", gap: "md" })}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            dataTestId="cancel-delete-subcategory"
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            dataTestId="confirm-delete-subcategory"
          >
            {BUTTONS.DELETE}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubcategoryModal; 