// Mesaje de eroare/succes/validare pentru throw sau response

export const ERROR_MESSAGES = {
  INVALID_TYPE: 'Tip de tranzacție invalid!', // Folosit pentru validarea tipului de tranzacție
  INVALID_CATEGORY: 'Categorie invalidă!', // Folosit pentru validarea categoriei
  MISSING_REQUIRED_FIELD: 'Câmp obligatoriu lipsă!', // Folosit pentru validarea câmpurilor obligatorii
  NOT_FOUND: 'Resursa nu a fost găsită!', // Folosit pentru 404/NotFound
  SERVER_ERROR: 'Eroare internă server!', // Folosit pentru 500/Internal Server Error
};

export const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Tranzacție adăugată cu succes!', // Succes la creare tranzacție
  TRANSACTION_UPDATED: 'Tranzacție actualizată cu succes!', // Succes la update tranzacție
  TRANSACTION_DELETED: 'Tranzacție ștearsă cu succes!', // Succes la ștergere tranzacție
};
