import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TransactionType, CategoryType, PAGINATION } from "@budget-app/shared-constants";
import {
  BaseStoreState,
  storeLogger,
  createDevtoolsOptions,
  createDebouncedAction,
} from "./storeUtils";

export interface TransactionFiltersState extends BaseStoreState {
  filterType?: TransactionType | "";
  filterCategory?: CategoryType | "";
  filterSubcategory?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string;
  amountMax?: string;
  searchText?: string;
  limit: number;
  offset: number;
  sort: string;
  totalItems: number;

  setFilterType: (type?: TransactionType | "") => void;
  setFilterCategory: (cat?: CategoryType | "") => void;
  setFilterSubcategory: (subcat?: string) => void;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  setAmountMin: (amount?: string) => void;
  setAmountMax: (amount?: string) => void;
  setSearchText: (text?: string) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setSort: (sort: string) => void;
  setTotalItems: (total: number) => void;
  resetFilters: () => void;

  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;

  getCurrentPage: () => number;
  getTotalPages: () => number;
  getQueryParams: () => {
    type?: TransactionType | "";
    category?: CategoryType | "";
    subcategory?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: string;
    amountMax?: string;
    searchText?: string;
    limit: number;
    offset: number;
    sort: string;
  };

  // URL persistence methods
  loadFromURL: (searchParams: URLSearchParams) => void;
  getURLSearchParams: () => URLSearchParams;
}

const STORE_NAME = "TransactionFiltersStore";

export const useTransactionFiltersStore = create<TransactionFiltersState>()(
  devtools((set, get) => {
    // Helper pentru logging standardizat
    const logAction = (action: string, data?: Record<string, unknown>) => {
      storeLogger.info(STORE_NAME, action, data);
    };

    // Debounced search pentru performanță
    const debouncedSearchUpdate = createDebouncedAction((text: string) => {
      set({ searchText: text, offset: 0 }, false, "setSearchText_debounced");
      logAction("Search text updated (debounced)", { text });
    }, 300);

    return {
      // State inițial cu BaseStoreState
      loading: false,
      error: null,
      lastUpdated: new Date(),

      // Filter state
      filterType: "",
      filterCategory: "",
      filterSubcategory: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      searchText: "",
      limit: PAGINATION.DEFAULT_LIMIT,
      offset: PAGINATION.DEFAULT_OFFSET,
      sort: PAGINATION.DEFAULT_SORT,
      totalItems: 0,

      // Filter setters cu logging standardizat
      setFilterType: (type) => {
        set(
          { filterType: type, offset: 0, lastUpdated: new Date() },
          false,
          "setFilterType",
        );
        logAction("Filter type changed", { type });
      },

      setFilterCategory: (cat) => {
        set(
          { filterCategory: cat, offset: 0, lastUpdated: new Date() },
          false,
          "setFilterCategory",
        );
        logAction("Filter category changed", { category: cat });
      },

      setFilterSubcategory: (subcat) => {
        set(
          { filterSubcategory: subcat, offset: 0, lastUpdated: new Date() },
          false,
          "setFilterSubcategory",
        );
        logAction("Filter subcategory changed", { subcategory: subcat });
      },

      setDateFrom: (date) => {
        set(
          { dateFrom: date, offset: 0, lastUpdated: new Date() },
          false,
          "setDateFrom",
        );
        logAction("Date from changed", { dateFrom: date });
      },

      setDateTo: (date) => {
        set(
          { dateTo: date, offset: 0, lastUpdated: new Date() },
          false,
          "setDateTo",
        );
        logAction("Date to changed", { dateTo: date });
      },

      setAmountMin: (amount) => {
        set(
          { amountMin: amount, offset: 0, lastUpdated: new Date() },
          false,
          "setAmountMin",
        );
        logAction("Amount min changed", { amountMin: amount });
      },

      setAmountMax: (amount) => {
        set(
          { amountMax: amount, offset: 0, lastUpdated: new Date() },
          false,
          "setAmountMax",
        );
        logAction("Amount max changed", { amountMax: amount });
      },

      setSearchText: (text) => {
        // Folosim debounced update pentru search
        debouncedSearchUpdate(text || "");
      },

      setLimit: (limit) => {
        set({ limit, lastUpdated: new Date() }, false, "setLimit");
        logAction("Limit changed", { limit });
      },

      setOffset: (offset) => {
        set({ offset, lastUpdated: new Date() }, false, "setOffset");
        logAction("Offset changed", { offset });
      },

      setSort: (sort) => {
        set({ sort, lastUpdated: new Date() }, false, "setSort");
        logAction("Sort changed", { sort });
      },

      setTotalItems: (total) => {
        set(
          { totalItems: total, lastUpdated: new Date() },
          false,
          "setTotalItems",
        );
        logAction("Total items updated", { total });
      },

      resetFilters: () => {
        set(
          {
            filterType: "",
            filterCategory: "",
            filterSubcategory: "",
            dateFrom: "",
            dateTo: "",
            amountMin: "",
            amountMax: "",
            searchText: "",
            limit: PAGINATION.DEFAULT_LIMIT,
            offset: PAGINATION.DEFAULT_OFFSET,
            sort: PAGINATION.DEFAULT_SORT,
            lastUpdated: new Date(),
          },
          false,
          "resetFilters",
        );
        logAction("Filters reset");
      },

      // Pagination methods cu logging
      nextPage: () => {
        const { offset, limit, totalItems } = get();
        const newOffset = offset + limit;
        if (newOffset < totalItems) {
          set(
            { offset: newOffset, lastUpdated: new Date() },
            false,
            "nextPage",
          );
          logAction("Next page", {
            newOffset,
            page: Math.floor(newOffset / limit) + 1,
          });
        }
      },

      prevPage: () => {
        const { offset, limit } = get();
        const newOffset = Math.max(0, offset - limit);
        set({ offset: newOffset, lastUpdated: new Date() }, false, "prevPage");
        logAction("Previous page", {
          newOffset,
          page: Math.floor(newOffset / limit) + 1,
        });
      },

      goToPage: (page) => {
        const { limit, totalItems } = get();
        const totalPages = Math.ceil(totalItems / limit) || 1;
        const newPage = Math.max(1, Math.min(page, totalPages));
        const newOffset = (newPage - 1) * limit;
        set({ offset: newOffset, lastUpdated: new Date() }, false, "goToPage");
        logAction("Go to page", { page: newPage, offset: newOffset });
      },

      // Utility methods
      getCurrentPage: () => {
        const { offset, limit } = get();
        return Math.floor(offset / limit) + 1;
      },

      getTotalPages: () => {
        const { totalItems, limit } = get();
        return Math.ceil(totalItems / limit) || 1;
      },

      getQueryParams: () => {
        const {
          filterType,
          filterCategory,
          filterSubcategory,
          dateFrom,
          dateTo,
          amountMin,
          amountMax,
          searchText,
          limit,
          offset,
          sort,
        } = get();
        return {
          type: filterType,
          category: filterCategory,
          subcategory: filterSubcategory,
          dateFrom,
          dateTo,
          amountMin,
          amountMax,
          searchText,
          limit,
          offset,
          sort,
        };
      },

      // URL persistence cu logging
      loadFromURL: (searchParams: URLSearchParams) => {
        const type = searchParams.get("type") || "";
        const category = searchParams.get("category") || "";
        const subcategory = searchParams.get("subcategory") || "";
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo = searchParams.get("dateTo") || "";
        const amountMin = searchParams.get("amountMin") || "";
        const amountMax = searchParams.get("amountMax") || "";
        const searchText = searchParams.get("search") || "";
        const limit = parseInt(
          searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT),
        );
        const offset = parseInt(
          searchParams.get("offset") || String(PAGINATION.DEFAULT_OFFSET),
        );
        const sort = searchParams.get("sort") || PAGINATION.DEFAULT_SORT;

        set(
          {
            filterType: type as TransactionType | "",
            filterCategory: category as CategoryType | "",
            filterSubcategory: subcategory,
            dateFrom,
            dateTo,
            amountMin,
            amountMax,
            searchText,
            limit: isNaN(limit) ? PAGINATION.DEFAULT_LIMIT : limit,
            offset: isNaN(offset) ? PAGINATION.DEFAULT_OFFSET : offset,
            sort,
            lastUpdated: new Date(),
          },
          false,
          "loadFromURL",
        );

        logAction("Filters loaded from URL", {
          type,
          category,
          subcategory,
          dateFrom,
          dateTo,
          amountMin,
          amountMax,
          searchText,
          limit,
          offset,
          sort,
        });
      },

      getURLSearchParams: () => {
        const {
          filterType,
          filterCategory,
          filterSubcategory,
          dateFrom,
          dateTo,
          amountMin,
          amountMax,
          searchText,
          limit,
          offset,
          sort,
        } = get();

        const params = new URLSearchParams();

        // Only add non-empty values to URL
        if (filterType) params.set("type", filterType);
        if (filterCategory) params.set("category", filterCategory);
        if (filterSubcategory) params.set("subcategory", filterSubcategory);
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
        if (amountMin) params.set("amountMin", amountMin);
        if (amountMax) params.set("amountMax", amountMax);
        if (searchText) params.set("search", searchText);
        if (limit !== PAGINATION.DEFAULT_LIMIT)
          params.set("limit", limit.toString());
        if (offset !== PAGINATION.DEFAULT_OFFSET)
          params.set("offset", offset.toString());
        if (sort !== PAGINATION.DEFAULT_SORT) params.set("sort", sort);

        return params;
      },

      // Base store actions
      setLoading: (loading: boolean) => {
        set({ loading, lastUpdated: new Date() }, false, "setLoading");
        logAction("Loading state changed", { loading });
      },

      setError: (error: string | null) => {
        set({ error, lastUpdated: new Date() }, false, "setError");
        if (error) {
          storeLogger.error(STORE_NAME, "Error set", error);
        } else {
          logAction("Error cleared");
        }
      },

      clearError: () => {
        set({ error: null, lastUpdated: new Date() }, false, "clearError");
        logAction("Error cleared");
      },

      reset: () => {
        set(
          {
            loading: false,
            error: null,
            filterType: "",
            filterCategory: "",
            filterSubcategory: "",
            dateFrom: "",
            dateTo: "",
            amountMin: "",
            amountMax: "",
            searchText: "",
            limit: PAGINATION.DEFAULT_LIMIT,
            offset: PAGINATION.DEFAULT_OFFSET,
            sort: PAGINATION.DEFAULT_SORT,
            totalItems: 0,
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
export const useFiltersState = () =>
  useTransactionFiltersStore((state) => ({
    filterType: state.filterType,
    filterCategory: state.filterCategory,
    filterSubcategory: state.filterSubcategory,
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    amountMin: state.amountMin,
    amountMax: state.amountMax,
    searchText: state.searchText,
  }));

export const usePaginationState = () =>
  useTransactionFiltersStore((state) => ({
    limit: state.limit,
    offset: state.offset,
    sort: state.sort,
    totalItems: state.totalItems,
    currentPage: state.getCurrentPage(),
    totalPages: state.getTotalPages(),
  }));
