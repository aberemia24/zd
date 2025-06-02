import React from 'react';
import Button from "../../../primitives/Button/Button";
import { modal, modalContent, flex } from "../../../../styles/cva/components/layout";
import { MESAJE, BUTTONS } from "@shared-constants";
import { LUNAR_GRID_ACTIONS } from "@shared-constants/ui";

interface DeleteSubcategoryModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  subcategoryAction: {
    type: 'edit' | 'delete';
    category: string;
    subcategory: string;
  } | null;
  validTransactions: Array<{
    category?: string;
    subcategory?: string | null | undefined;
    [key: string]: any;
  }>;
}

const DeleteSubcategoryModal: React.FC<DeleteSubcategoryModalProps> = ({ 
  onConfirm, 
  onCancel, 
  subcategoryAction, 
  validTransactions 
}) => {
  if (!subcategoryAction || subcategoryAction.type !== 'delete') return null;

  // Calculează numărul de tranzacții asociate cu această subcategorie
  const transactionsCount = validTransactions.filter(t => 
    t.category === subcategoryAction.category && 
    t.subcategory === subcategoryAction.subcategory
  ).length;

  const transactionText = transactionsCount === 0 
    ? LUNAR_GRID_ACTIONS.NO_TRANSACTIONS
    : transactionsCount === 1 
      ? "1 tranzacție"
      : `${transactionsCount} tranzacții`;

  const message = `Sigur doriți să ștergeți subcategoria "${subcategoryAction.subcategory}" din categoria "${subcategoryAction.category}" (${transactionText})? Această acțiune nu poate fi anulată${transactionsCount > 0 ? ' și toate tranzacțiile asociate vor fi șterse definitiv din baza de date' : ''}.`;

  return (
    <div className={modal({ variant: "confirmation", animation: "fade" })} data-testid="delete-subcategory-confirmation">
      <div className={modalContent()}>
        <h3 className={modalContent({ content: "header" })}>
          {MESAJE.CATEGORII.CONFIRMARE_STERGERE_TITLE}
        </h3>
        <p className={modalContent({ content: "text" })}>{message}</p>
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