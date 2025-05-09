// Tipuri pentru categorii și subcategorii customizate (persistente per utilizator)
// Owner: echipa FE

export interface CustomSubcategory {
  name: string;
  isCustom?: boolean; // flag pentru subcategoriile adăugate de utilizator
}

export interface CustomCategory {
  name: string;
  subcategories: CustomSubcategory[];
  isCustom?: boolean; // flag pentru categoria custom
}

// Structura salvată în category_data din Supabase
export interface CustomCategoriesPayload {
  categories: CustomCategory[];
  version: number;
}

// Pentru preseturi (array static)
export type CategoryPreset = CustomCategoriesPayload;
