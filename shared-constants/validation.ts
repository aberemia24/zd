// Reguli și mesaje de validare partajate (folosite de FE și BE)

/**
 * REGULI DE VALIDARE CENTRALIZATE
 * 
 * Acest fișier conține toate regulile de validare folosite în aplicație.
 * Modificările aici se reflectă automat în frontend și backend.
 */
export const VALIDATION = {
  // Validări pentru sume monetare
  AMOUNT_MIN: 0.01, // Suma minimă permisă (centralizată)
  AMOUNT_MAX: 9999999, // Suma maximă permisă (centralizată) - până la 9,999,999

  // Validări pentru date
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/, // Format dată YYYY-MM-DD (centralizat)
  
  // Validări pentru descrieri și texte
  DESCRIPTION_MAX_LENGTH: 100, // Lungime optimă pentru descrieri tranzacții (redus la standard PayPal-like)
  CATEGORY_NAME_MIN_LENGTH: 2, // Lungime minimă pentru nume categorii
  CATEGORY_NAME_MAX_LENGTH: 50, // Lungime maximă pentru nume categorii
  
  // Validări pentru subcategorii
  MAX_CUSTOM_SUBCATEGORIES: 5, // Numărul maxim de subcategorii custom per categorie
  
  // Validări pentru text general
  TEXT_MIN_LENGTH: 1, // Lungime minimă pentru text general
  TEXT_MAX_LENGTH: 255, // Lungime maximă pentru text general
  
  // Validări pentru procente
  PERCENTAGE_MIN: 0, // Procent minim
  PERCENTAGE_MAX: 100, // Procent maxim
  
  // Patterns pentru validare
  NUMERIC_PATTERN: /^\d+(\.\d{1,2})?$/, // Pattern pentru numere cu max 2 zecimale
  POSITIVE_NUMBER_PATTERN: /^(?!0*(\.0*)?$)\d+(\.\d{1,2})?$/, // Pattern pentru numere pozitive
  
  // Pattern pentru descrieri financiare - permite caractere sigure și utile
  DESCRIPTION_PATTERN: /^[a-zA-Z0-9\sÀ-ÿĂăÂâÎîȘșȚțĂăÂâÎîȘșȚț.,!?\-()&%+:;\n]*$/, // Permite litere, cifre, spații, punctuație de bază, diacritice românești
  
  // Caractere interzise în descrieri (pentru securitate)
  FORBIDDEN_DESCRIPTION_CHARS: ['<', '>', '{', '}', '[', ']', '`', '|', '\\', '"', "'"], // HTML/script tags și caractere potențial problematice
} as const;

/**
 * MESAJE DE VALIDARE CENTRALIZATE
 * 
 * Toate mesajele de eroare pentru validări sunt definite aici.
 * Folosesc interpolarea pentru valori dinamice unde este necesar.
 */
export const VALIDATION_MESSAGES = {
  // Mesaje pentru sume
  INVALID_AMOUNT: 'Suma introdusă nu este validă!',
  AMOUNT_REQUIRED: 'Suma este obligatorie',
  AMOUNT_MUST_BE_NUMBER: 'Suma trebuie să fie un număr valid',
  AMOUNT_MUST_BE_POSITIVE: 'Suma trebuie să fie pozitivă',
  AMOUNT_TOO_SMALL: `Suma trebuie să fie cel puțin ${VALIDATION.AMOUNT_MIN} RON`,
  AMOUNT_TOO_LARGE: `Suma nu poate depăși ${VALIDATION.AMOUNT_MAX.toLocaleString('ro-RO')} RON`,
  
  // Mesaje pentru date
  INVALID_DATE: 'Formatul datei nu este valid! (YYYY-MM-DD)',
  DATE_REQUIRED: 'Data este obligatorie',
  
  // Mesaje pentru descrieri și texte
  DESCRIPTION_TOO_LONG: `Descrierea nu poate depăși ${VALIDATION.DESCRIPTION_MAX_LENGTH} de caractere`,
  DESCRIPTION_INVALID_CHARS: 'Descrierea conține caractere interzise (< > { } [ ] ` | \\ " \')',
  DESCRIPTION_VALIDATION_HINT: 'Folosiți doar litere, cifre, spații și punctuația de bază (. , ! ? - ( ) & % + : ;)',
  TEXT_TOO_LONG: `Textul nu poate depăși ${VALIDATION.TEXT_MAX_LENGTH} de caractere`,
  TEXT_TOO_SHORT: `Textul trebuie să aibă minim ${VALIDATION.TEXT_MIN_LENGTH} caractere`,
  
  // Mesaje pentru categorii și subcategorii
  CATEGORY_NAME_REQUIRED: 'Numele categoriei este obligatoriu',
  CATEGORY_NAME_TOO_SHORT: `Numele categoriei trebuie să aibă minim ${VALIDATION.CATEGORY_NAME_MIN_LENGTH} caractere`,
  CATEGORY_NAME_TOO_LONG: `Numele categoriei nu poate depăși ${VALIDATION.CATEGORY_NAME_MAX_LENGTH} de caractere`,
  SUBCATEGORY_LIMIT_EXCEEDED: `Nu poți avea mai mult de ${VALIDATION.MAX_CUSTOM_SUBCATEGORIES} subcategorii custom per categorie`,
  SUBCATEGORY_ALREADY_EXISTS: 'Subcategoria există deja în această categorie',
  
  // Mesaje pentru procente
  INVALID_PERCENTAGE: 'Procentul trebuie să fie un număr valid',
  PERCENTAGE_OUT_OF_RANGE: `Procentul trebuie să fie între ${VALIDATION.PERCENTAGE_MIN} și ${VALIDATION.PERCENTAGE_MAX}`,
  
  // Mesaje pentru frecvență și recurență
  REQUIRED_FREQUENCY: 'Selectează frecvența pentru tranzacțiile recurente!',
  
  // Mesaje generale
  REQUIRED_FIELDS: 'Toate câmpurile obligatorii trebuie completate!',
  EMPTY_VALUE: 'Valoarea nu poate fi goală',
  
  // Mesaje pentru validări complexe
  NEGATIVE_VALUE: 'Valoarea nu poate fi negativă',
  INVALID_NUMBER: 'Valoarea trebuie să fie un număr valid',
} as const;

/**
 * TIPURI DE VALIDARE SUPORTATE
 * 
 * Enumerarea tuturor tipurilor de validare disponibile în sistem.
 */
export const VALIDATION_TYPES = {
  AMOUNT: 'amount',
  TEXT: 'text', 
  PERCENTAGE: 'percentage',
  DATE: 'date',
  DESCRIPTION: 'description',
  CATEGORY_NAME: 'category_name',
} as const;

/**
 * HELPER FUNCTIONS PENTRU VALIDARE
 * 
 * Funcții utilitare care pot fi folosite pentru validări comune.
 */
export const VALIDATION_HELPERS = {
  /**
   * Verifică dacă o valoare este un număr valid
   */
  isValidNumber: (value: string | number): boolean => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && isFinite(num);
  },
  
  /**
   * Verifică dacă o sumă este în intervalul valid
   */
  isValidAmount: (amount: string | number): boolean => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return VALIDATION_HELPERS.isValidNumber(num) && 
           num >= VALIDATION.AMOUNT_MIN && 
           num <= VALIDATION.AMOUNT_MAX;
  },
  
  /**
   * Verifică dacă un procent este valid
   */
  isValidPercentage: (percentage: string | number): boolean => {
    const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    return VALIDATION_HELPERS.isValidNumber(num) && 
           num >= VALIDATION.PERCENTAGE_MIN && 
           num <= VALIDATION.PERCENTAGE_MAX;
  },
  
  /**
   * Verifică dacă o dată este în format valid
   */
  isValidDate: (date: string): boolean => {
    if (!VALIDATION.DATE_REGEX.test(date)) return false;
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  },
  
  /**
   * Formatează o sumă pentru afișare
   */
  formatAmount: (amount: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },
} as const;
