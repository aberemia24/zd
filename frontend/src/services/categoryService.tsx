// Serviciu pentru gestionarea categoriilor și subcategoriilor personalizate (CRUD + utilitare)
// Owner: echipa FE
import { supabase } from "./supabase";
import { CustomCategoriesPayload } from "../types/Category";
import { API } from "@budget-app/shared-constants/api";
import { MESAJE } from "@budget-app/shared-constants/messages";

// Helper pentru logging consistent
const logError = (context: string, error: unknown) => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
    ? error 
    : 'Unknown error';
  console.error(`[categoryService] ${context}:`, errorMessage, error);
};

// Tabelele ar trebui mutate în API.TABLES conform regulilor globale (memoria 886c7659)
// TODO: A se muta în shared-constants/api.ts după ce acest serviciu este stabil
const TABLE = "custom_categories";

// Schema tabel custom_categories pe care o expectăm în Supabase
// user_id (primary key, string)
// category_data (jsonb) - conține { categories: CustomCategory[], version: number }
// updated_at (timestamp)
// version (integer, optional)

export const categoryService = {
  async getUserCategories(
    userId: string,
  ): Promise<CustomCategoriesPayload | null> {
    if (!userId) {
      return { categories: [], version: 1 }; // Cazul demo sau neautentificat
    }

    try {
      // Evităm folosirea .single() care aruncă eroare dacă nu găsește date
      const { data, error } = await supabase
        .from(TABLE)
        .select("category_data, version")
        .eq("user_id", userId);

      if (error) {
        logError("getUserCategories", error);
        return { categories: [], version: 1 }; // Valoare implicită sigură
      }

      // Dacă nu există date sau array-ul e gol, returnează categorii goale
      if (!data || data.length === 0) {
        return { categories: [], version: 1 };
      }

      // Avem date - folosim primul rezultat
      const userCategories = data[0];

      // Validare pentru a ne asigura că avem structura așteptată
      if (
        !userCategories.category_data ||
        typeof userCategories.category_data !== "object"
      ) {
        return { categories: [], version: 1 };
      }

      // Ne asigurăm că avem array de categorii valid
      const categories = Array.isArray(userCategories.category_data.categories)
        ? userCategories.category_data.categories
        : [];

      const version =
        typeof userCategories.version === "number"
          ? userCategories.version
          : userCategories.category_data.version || 1;

      return {
        categories,
        version,
      };
    } catch (err) {
      logError("getUserCategories exception", err);
      return { categories: [], version: 1 }; // Valoare implicită sigură în caz de excepție
    }
  },

  async saveUserCategories(
    userId: string,
    categoryData: CustomCategoriesPayload,
  ): Promise<boolean> {
    try {
      // Validăm datele înainte de a le trimite
      if (!userId) {
        logError("saveUserCategories", "User ID este obligatoriu");
        return false;
      }

      // Ne asigurăm că avem obiect valid
      if (!categoryData || typeof categoryData !== "object") {
        logError(
          "saveUserCategories",
          "Datele de categorie lipsesc sau sunt invalide",
        );
        return false;
      }

      // Ne asigurăm că categories este array
      const categories = Array.isArray(categoryData.categories)
        ? categoryData.categories
        : [];

      // FORMAT CORECT TESTAT: Construim un obiect exact în structura așteptată de Supabase
      // Baza de date așteaptă:
      // 1. user_id = uuid utilizator
      // 2. category_data = jsonb cu format {categories: Array, version: Number}
      //    ATENȚIE: Pentru jsonb, nu trebuie să stringifyém manual, ci să trimitem obiectul ca atare
      // 3. version = integer (nu în category_data)
      //
      // Vezi analiza MCP pe tabela custom_categories:
      // {id, user_id, category_data (jsonb), updated_at, version}
      const currentVersion =
        typeof categoryData.version === "number" ? categoryData.version : 1;

      // ATENȚIE: Nu includem id, deoarece este generat automat de Supabase cu gen_random_uuid()
      const payload = {
        user_id: userId,
        // IMPORTANT: Supabase acceptă direct obiectul pentru câmpurile jsonb,
        // dar trebuie să fie un obiect valid cu structure {categories, version}
        category_data: {
          categories,
          version: currentVersion,
        },
        updated_at: new Date().toISOString(),
        version: currentVersion,
      };

      // Logare pentru debugging - verificăm format
      console.debug("[categoryService] Payload trimis:", payload);

      // Pentru upsert trebui să verificăm întâi dacă există deja o înregistrare pentru utilizator
      const { data: existingData, error: selectError } = await supabase
        .from(TABLE)
        .select("id")
        .eq("user_id", userId);

      if (selectError) {
        logError("saveUserCategories select", selectError);
        return false;
      }

      // Determinăm dacă trebuie să facem insert sau update
      if (!existingData || existingData.length === 0) {
        // Insert - prima dată când salvăm categorii pentru acest utilizator
        const { error: insertError } = await supabase
          .from(TABLE)
          .insert([payload]);

        if (insertError) {
          logError("saveUserCategories insert", insertError);
          return false;
        }
      } else {
        // Update - actualizăm categoriile existente folosind id-ul existent
        const { error: updateError } = await supabase
          .from(TABLE)
          .update(payload)
          .eq("user_id", userId);

        if (updateError) {
          logError("saveUserCategories update", updateError);
          return false;
        }
      }

      // Dacă am ajuns aici, înseamnă că totul a mers bine

      return true;
    } catch (err) {
      logError("saveUserCategories exception", err);
      return false;
    }
  },

  async updateTransactionsForSubcategoryRename(
    userId: string,
    category: string,
    oldName: string,
    newName: string,
  ): Promise<boolean> {
    try {
      // Validăm parametrii
      if (!userId) {
        logError(
          "updateTransactionsForSubcategoryRename",
          "User ID este obligatoriu",
        );
        return false;
      }
      if (!category || !oldName || !newName) {
        logError(
          "updateTransactionsForSubcategoryRename",
          "Categoria, numele vechi și numele nou sunt obligatorii",
        );
        return false;
      }

      // Update în batch pentru tranzacțiile cu subcategoria veche
      // Folosim numele explicit al tabelului în loc de string hardcodat
      const { error } = await supabase
        .from("transactions") // Eventual mutare în API.TABLES
        .update({ subcategory: newName.trim() })
        .eq("user_id", userId)
        .eq("category", category)
        .eq("subcategory", oldName);

      if (error) {
        logError("updateTransactionsForSubcategoryRename", error);
        return false;
      }
      return true;
    } catch (err) {
      logError("updateTransactionsForSubcategoryRename exception", err);
      return false;
    }
  },

  async handleSubcategoryDeletion(
    userId: string,
    category: string,
    subcategory: string,
    action: "migrate" | "delete",
    target?: string,
  ): Promise<boolean> {
    try {
      // Validăm parametrii
      if (!userId) {
        logError("handleSubcategoryDeletion", "User ID este obligatoriu");
        return false;
      }
      if (!category || !subcategory) {
        logError(
          "handleSubcategoryDeletion",
          "Categoria și subcategoria sunt obligatorii",
        );
        return false;
      }

      if (action === "migrate" && target) {
        // Migrare tranzacții către altă subcategorie
        const { error } = await supabase
          .from("transactions") // Eventual mutare în API.TABLES
          .update({ subcategory: target.trim() })
          .eq("user_id", userId)
          .eq("category", category)
          .eq("subcategory", subcategory);

        if (error) {
          logError("handleSubcategoryDeletion - migrate", error);
          return false;
        }
        return true;
      } else if (action === "delete") {
        // În loc să ștergem tranzacțiile, mutăm la categoria principală (subcategorie null)
        // Aceasta este mai sigură decât ștergerea completă a tranzacțiilor
        const { error } = await supabase
          .from("transactions") // Eventual mutare în API.TABLES
          .update({ subcategory: null })
          .eq("user_id", userId)
          .eq("category", category)
          .eq("subcategory", subcategory);

        if (error) {
          logError("handleSubcategoryDeletion - delete", error);
          return false;
        }
        return true;
      }

      logError("handleSubcategoryDeletion", `Action necunoscută: ${action}`);
      return false;
    } catch (err) {
      logError("handleSubcategoryDeletion exception", err);
      return false;
    }
  },

  async getAvailableSubcategoriesForMigration(
    userId: string,
    category: string,
    excludeSubcategory: string,
  ): Promise<string[]> {
    try {
      // Validăm parametrii
      if (!userId || !category || !excludeSubcategory) {
        logError(
          "getAvailableSubcategoriesForMigration",
          "Parametri insuficienți",
        );
        return [];
      }

      // Extrage subcategoriile disponibile pentru migrare (excluzând pe cea ștearsă)
      const userCats = await this.getUserCategories(userId);
      if (!userCats || !Array.isArray(userCats.categories)) {
        return [];
      }

      const cat = userCats.categories.find((c) => c.name === category);
      if (!cat || !Array.isArray(cat.subcategories)) {
        return [];
      }

      // Filtrează subcategoriile valide, asigură string-uri curate
      return cat.subcategories
        .filter((sc) => !!sc && typeof sc.name === "string")
        .map((sc) => sc.name)
        .filter((name) => name !== excludeSubcategory);
    } catch (err) {
      logError("getAvailableSubcategoriesForMigration exception", err);
      return [];
    }
  },

  async checkForDuplicateSubcategory(
    userId: string,
    category: string,
    subcategoryName: string,
  ): Promise<boolean> {
    try {
      // Validăm parametrii
      if (!userId || !category || !subcategoryName) {
        return false; // Nu e duplicat dacă parametrii sunt invalizi
      }

      // Curăţăm numele subcategoriei pentru comparație
      const cleanName = subcategoryName.trim().toLowerCase();
      if (!cleanName) {
        return false; // Nume gol, nu poate fi duplicat
      }

      // Verifică dacă există deja o subcategorie cu acest nume în categoria dată
      const userCats = await this.getUserCategories(userId);
      if (!userCats || !Array.isArray(userCats.categories)) {
        return false;
      }

      const cat = userCats.categories.find((c) => c.name === category);
      if (!cat || !Array.isArray(cat.subcategories)) {
        return false;
      }

      // Verifică dacă există subcategorie cu același nume, ignorând case și spații
      return cat.subcategories.some(
        (sc) =>
          sc &&
          typeof sc.name === "string" &&
          sc.name.trim().toLowerCase() === cleanName,
      );
    } catch (err) {
      logError("checkForDuplicateSubcategory exception", err);
      return false; // În caz de eroare, presupunem că nu e duplicat
    }
  },
};
