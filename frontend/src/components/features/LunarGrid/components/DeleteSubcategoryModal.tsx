import React from 'react';
import Button from '../../../primitives/Button/Button';
import { modal, modalContent, flex } from '../../../../styles/cva'; // Ajustează calea dacă e necesar
import { MESAJE, BUTTONS, TABLE } from '@shared-constants';

// Presupunem că tipurile pentru subcategoryAction și validTransactions sunt definite și importate undeva
// sau le definim aici sumar pentru componentă.
interface SubcategoryAction {
  type: 'delete' | 'edit' | string | null; // Poate fi și null sau alte tipuri
  category: string;
  subcategory: string;
}

interface Transaction {
  category?: string;
  subcategory?: string;
  // alte proprietăți ale tranzacției
}

interface DeleteSubcategoryModalProps {
  subcategoryAction: SubcategoryAction | null;
  validTransactions: Transaction[];
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteSubcategoryModal: React.FC<DeleteSubcategoryModalProps> = ({
  subcategoryAction,
  validTransactions,
  onConfirm,
  onCancel,
}) => {
  if (!subcategoryAction || subcategoryAction.type !== 'delete') return null;

  const transactionsCount = validTransactions.filter(t => 
    t.category === subcategoryAction.category && 
    t.subcategory === subcategoryAction.subcategory
  ).length;

  const transactionText = transactionsCount === 0 
    ? TABLE.NO_TRANSACTIONS
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