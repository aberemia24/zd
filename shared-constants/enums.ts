// Exportă aici toate enums partajate
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}

export enum TransactionStatus {
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
}

export enum FrequencyType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}

// 🆕 Balance System Enums - pentru sistem conturi multiple și sold zilnic
export enum AccountType {
  CHECKING = 'CHECKING',     // Cont curent/principal 
  SAVINGS = 'SAVINGS',       // Cont de economii
  INVESTMENT = 'INVESTMENT', // Cont investiții
  CASH = 'CASH',            // Numerar
  CREDIT = 'CREDIT',        // Card/credit
}

export enum BalanceImpactType {
  AVAILABLE_ONLY = 'AVAILABLE_ONLY',     // Afectează doar soldul disponibil (cheltuieli, venituri)
  SAVINGS_TRANSFER = 'SAVINGS_TRANSFER', // Transfer către economii (reduce disponibil, crește economii)
  INVESTMENT_TRANSFER = 'INVESTMENT_TRANSFER', // Transfer către investiții
  NEUTRAL = 'NEUTRAL',                   // Nu afectează soldul (transferuri între conturi)
}
