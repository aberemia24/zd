import { TransactionType, FrequencyType } from "@budget-app/shared-constants";

export interface TransactionData {
  id?: string;
  amount: number;
  type: TransactionType;
  description: string;
  isRecurring: boolean;
  frequency?: FrequencyType;
  category: string;
  subcategory?: string;
  date: string;
} 