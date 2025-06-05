import React from 'react';
import ConfirmationModal from '../../../primitives/ConfirmationModal/ConfirmationModal';
import { UI, BUTTONS } from "@shared-constants";
import { Transaction } from '../../../../types/Transaction';
import { 
  cn,
  modal,
  card,
  badge
} from "../../../../styles/cva-v2";

interface SubcategoryAction {
  type: 'edit' | 'delete';
  category: string;
  subcategory: string;
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
  onCancel
}) => {
  if (!subcategoryAction || subcategoryAction.type !== 'delete') {
    return null;
  }

  // Găsește tranzacțiile pentru această subcategorie
  const relatedTransactions = validTransactions.filter(transaction => 
    transaction.category === subcategoryAction.category && 
    transaction.subcategory === subcategoryAction.subcategory
  );

  const hasRelatedTransactions = relatedTransactions.length > 0;

  // Construim mesajul și detaliile
  const message = hasRelatedTransactions
    ? `Subcategoria "${subcategoryAction.subcategory}" din categoria "${subcategoryAction.category}" nu poate fi ștearsă deoarece conține ${relatedTransactions.length} tranzacții.`
    : `Sigur doriți să ștergeți subcategoria "${subcategoryAction.subcategory}" din categoria "${subcategoryAction.category}"?`;

  const details = hasRelatedTransactions
    ? relatedTransactions.map(transaction => 
        `${transaction.date}: ${transaction.amount} RON${transaction.description ? ` - ${transaction.description}` : ''}`
      )
    : undefined;

  const recommendation = hasRelatedTransactions
    ? "Pentru a șterge această subcategorie, ștergeți mai întâi toate tranzacțiile asociate sau reasignați-le la o altă subcategorie."
    : undefined;

  const handleConfirm = hasRelatedTransactions ? onCancel : onConfirm;

  return (
    <ConfirmationModal
      isOpen={true}
      title={hasRelatedTransactions ? "Eroare - Nu se poate șterge" : UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
      message={message}
      confirmText={hasRelatedTransactions ? "Înțeles" : BUTTONS.DELETE}
      cancelText={hasRelatedTransactions ? undefined : BUTTONS.CANCEL}
      variant={hasRelatedTransactions ? "warning" : "danger"}
      icon={hasRelatedTransactions ? "⚠️" : "🗑️"}
      details={details}
      recommendation={recommendation}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeleteSubcategoryModal; 