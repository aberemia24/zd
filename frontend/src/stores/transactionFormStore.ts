import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { INITIAL_FORM_STATE, MESAJE, VALIDATION, TransactionType, FrequencyType, TransactionStatus, CATEGORIES } from "@shared-constants";
import { API } from "@shared-constants/api";
import type { TransactionFormData } from "../components/features/TransactionForm/TransactionForm";
import { CreateTransaction } from "@shared-constants/transaction.schema";
import { useAuthStore } from "./authStore";
import {
  BaseStoreState,
  storeLogger,
  createDevtoolsOptions,
  createAsyncAction,
} from "./storeUtils";

export interface TransactionFormStoreState extends BaseStoreState {
  form: TransactionFormData;
  success: string;

  // Form actions
  setForm: (form: TransactionFormData) => void;
  setField: (name: keyof TransactionFormData, value: string | boolean | number) => void;
  setSuccess: (msg: string) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;

  // Getters (pentru compatibilitate)
  getForm: () => TransactionFormData;
  getError: () => string;
  getSuccess: () => string;
  getLoading: () => boolean;
  setTransactionService: () => void; // compatibilitate UI/teste vechi
}

const STORE_NAME = "TransactionFormStore";

export const useTransactionFormStore = create<TransactionFormStoreState>()(
  devtools((set, get) => {
    // Helper pentru logging standardizat
    const logAction = (action: string, data?: Record<string, unknown>) => {
      storeLogger.info(STORE_NAME, action, data);
    };

    // Helper pentru setări standardizate
    const setLoading = (loading: boolean) => {
      set({ loading, lastUpdated: new Date() }, false, "setLoading");
    };

    const setError = (error: string | null) => {
      set({ error, lastUpdated: new Date() }, false, "setError");
      if (error) {
        storeLogger.error(STORE_NAME, "Error set", error);
      }
    };

    // Creăm acțiuni async standardizate
    const createFormAction = <T extends unknown[]>(
      actionName: string,
      action: (...args: T) => Promise<unknown>,
    ) =>
      createAsyncAction(STORE_NAME, actionName, action, setLoading, setError);

    return {
      // State inițial cu BaseStoreState
      loading: false,
      error: null,
      lastUpdated: new Date(),

      // Form state
      form: { ...INITIAL_FORM_STATE },
      success: "",

      // Form actions
      setForm: (form: TransactionFormData) => {
        set({ form: { ...form }, lastUpdated: new Date() }, false, "setForm");
        logAction("Form set", { form });
      },

      setField: (name: keyof TransactionFormData, value: string | boolean | number) => {
        const newForm = { ...get().form, [name]: value };
        set({ form: newForm, lastUpdated: new Date() }, false, "setField");
        logAction("Field updated", { field: String(name), value });
      },

      setSuccess: (msg: string) => {
        set({ success: msg, lastUpdated: new Date() }, false, "setSuccess");
        logAction("Success message set", { message: msg });
      },

      resetForm: () => {
        set(
          {
            form: { ...INITIAL_FORM_STATE },
            error: null,
            success: "",
            lastUpdated: new Date(),
          },
          false,
          "resetForm",
        );
        logAction("Form reset");
      },

      setTransactionService: () => {
        // noop (pentru compatibilitate cu UI/teste vechi)
        logAction("setTransactionService called (deprecated)");
      },

      handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
          const checked = (e.target as HTMLInputElement).checked;
          get().setField(name as keyof TransactionFormData, checked);
        } else {
          get().setField(name as keyof TransactionFormData, value);
        }
      },

      validateForm: (): boolean => {
        const { form } = get();

        if (!form.type || !form.amount || !form.category || !form.date) {
          setError(MESAJE.CAMPURI_OBLIGATORII);
          return false;
        }

        if (form.recurring && !form.frequency) {
          setError(MESAJE.FRECV_RECURENTA);
          return false;
        }

        // Validare sumă cu mesaj specific
        const amount = parseFloat(form.amount);
        if (
          isNaN(amount) ||
          amount < VALIDATION.AMOUNT_MIN ||
          amount > VALIDATION.AMOUNT_MAX
        ) {
          setError(`Suma trebuie să fie între ${VALIDATION.AMOUNT_MIN} și ${VALIDATION.AMOUNT_MAX}`);
          return false;
        }

        // Validare dată cu mesaj specific
        if (!VALIDATION.DATE_REGEX.test(form.date)) {
          setError("Data introdusă nu este validă. Folosiți formatul YYYY-MM-DD");
          return false;
        }

        // Validare categorie și subcategorie îmbunătățită
        if (form.category && form.subcategory) {
          // Debug logging pentru subcategoriile problematice
          console.log(`[DEBUG] Validez categoria: "${form.category}", subcategoria: "${form.subcategory}"`);
          
          // Verificăm dacă categoria există în CATEGORIES
          if (!Object.keys(CATEGORIES).includes(form.category)) {
            console.warn(`[DEBUG] Categoria "${form.category}" nu există în CATEGORIES`);
            setError(`Categoria "${form.category}" nu este validă`);
            return false;
          }

          // Pentru validarea subcategoriilor, acceptăm toate subcategoriile
          // deoarece utilizatorul poate avea subcategorii personalizate
          // Validarea completă se face în backend
          console.log(`[DEBUG] Subcategoria "${form.subcategory}" acceptată pentru categoria "${form.category}" (validare delegată backend-ului)`);
        }

        setError(null);
        logAction("Form validation passed");
        return true;
      },

      handleSubmit: createFormAction(
        "handleSubmit",
        async (e?: React.FormEvent<HTMLFormElement>) => {
          e?.preventDefault();

          if (!get().validateForm()) {
            throw new Error("Form validation failed");
          }

          const { form } = get();

          // Obținem userId din AuthStore
          const user = useAuthStore.getState().user;

          if (!user || !user.id) {
            throw new Error(
              "Trebuie să fiți autentificat pentru a adăuga tranzacții.",
            );
          }

          // Construim payload-ul pentru API conform CreateTransaction
          const transactionData: CreateTransaction = {
            type: form.type as TransactionType,
            amount: Number(form.amount),
            date: form.date,
            category: form.category,
            subcategory: form.subcategory || "",
            description: form.description || "",
            recurring: form.recurring || false,
            frequency:
              form.recurring && form.frequency
                ? (form.frequency as FrequencyType)
                : undefined,
            status: TransactionStatus.COMPLETED,
          };

          logAction("Submitting transaction", { transactionData });

          // Folosim supabaseService în loc de fetch direct
          const { supabaseService } = await import(
            "../services/supabaseService"
          );
          const responseData =
            await supabaseService.createTransaction(transactionData);

          logAction("Transaction submitted successfully", { responseData });

          set(
            { success: MESAJE.SUCCES_ADAUGARE },
            false,
            "handleSubmit_success",
          );

          // Resetăm formularul după adăugare reușită
          get().resetForm();

          // Pentru a notifica alte componente despre schimbare, putem emite un eveniment
          const event = new CustomEvent("transaction:created", {
            detail: responseData,
          });
          window.dispatchEvent(event);
        },
      ),

      // Getters (pentru compatibilitate)
      getForm: () => get().form,
      getError: () => get().error || "",
      getSuccess: () => get().success,
      getLoading: () => get().loading,

      // Base store actions
      setLoading,
      setError,
      clearError: () => {
        set({ error: null, lastUpdated: new Date() }, false, "clearError");
        logAction("Error cleared");
      },
      reset: () => {
        set(
          {
            loading: false,
            error: null,
            form: { ...INITIAL_FORM_STATE },
            success: "",
            lastUpdated: new Date(),
          },
          false,
          "reset",
        );
        logAction("Store reset");
      },
    };
  }, createDevtoolsOptions(STORE_NAME)),
);

// Selectori optimizați pentru performance
export const useTransactionFormData = () =>
  useTransactionFormStore((state) => ({
    form: state.form,
    loading: state.loading,
    error: state.error,
    success: state.success,
  }));

export const useTransactionFormActions = () =>
  useTransactionFormStore((state) => ({
    setForm: state.setForm,
    setField: state.setField,
    setSuccess: state.setSuccess,
    resetForm: state.resetForm,
    validateForm: state.validateForm,
    handleSubmit: state.handleSubmit,
    handleChange: state.handleChange,
  }));
