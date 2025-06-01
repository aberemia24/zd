// Reguli și mesaje de validare partajate (folosite de FE și BE)

export const VALIDATION = {
  AMOUNT_MIN: 0.01, // Suma minimă permisă (centralizată)
  AMOUNT_MAX: 9999999, // Suma maximă permisă (centralizată) - până la 9,999,999
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/, // Format dată YYYY-MM-DD (centralizat)
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_AMOUNT: 'Suma introdusă nu este validă!',
  INVALID_DATE: 'Formatul datei nu este valid! (YYYY-MM-DD)',
  REQUIRED_FIELDS: 'Toate câmpurile obligatorii trebuie completate!',
  REQUIRED_FREQUENCY: 'Selectează frecvența pentru tranzacțiile recurente!'
} as const;
