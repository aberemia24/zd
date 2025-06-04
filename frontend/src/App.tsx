// Componenta principală a aplicației - orchestrator pentru rutare între pagini
import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Importuri react-router-dom

// Lazy imports pentru pagini mari - optimizare performanță
import { lazyLoad } from "./utils/lazyLoading";

// Auth components - păstrate normale pentru încărcare rapidă
import LoginForm from "./components/features/Auth/LoginForm";
import RegisterForm from "./components/features/Auth/RegisterForm";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/primitives/Spinner";
import NavLink from "./components/primitives/NavLink";
import { CommandPaletteProvider } from "./components/primitives/CommandPalette";
import { TITLES } from "@shared-constants";

// Dark mode integration
import { useDarkMode } from "./hooks/useDarkMode";

// CVA styling imports
import { cn, dashboard } from "./styles/cva/unified-cva";

// Import store Zustand pentru autentificare
import { useAuthStore } from "./stores/authStore";
// Import pentru inițializarea categoriilor
import { useCategoryStore } from "./stores/categoryStore";
import { CATEGORIES } from "@shared-constants/categories";

// Lazy loaded pages cu loading states optimizate
const TransactionsPage = lazyLoad(() => import("./pages/TransactionsPage"), {
  minDelay: 200, // Prevent loading flashes
  withErrorBoundary: true,
});

const LunarGridPage = lazyLoad(() => import("./pages/LunarGridPage"), {
  minDelay: 200, // Prevent loading flashes  
  withErrorBoundary: true,
});

const OptionsPage = lazyLoad(() => import("./pages/OptionsPage"), {
  minDelay: 200, // Prevent loading flashes
  withErrorBoundary: true,
});

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * Migrated la CVA styling system pentru consistență
 * ✅ OPTIMIZAT: Lazy loading pentru pagini mari pentru reducerea bundle-ului inițial
 *
 * Structura:
 *
 * Această structură separă clar logica de business de UI, crescând testabilitatea,
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  // ✅ FIX: Elimin log-ul repetitiv care cauzează spam în consolă
  // console.log("🔜 App render using react-router-dom");

  const { user, loading, checkUser } = useAuthStore();
  const { toggleDarkMode } = useDarkMode();

  // Inițializarea categoriilor la nivel global
  const loadCategories = useCategoryStore((state) => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(
    (state) => state.mergeWithDefaults,
  );

  // Verificăm dacă utilizatorul este autentificat
  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Inițializăm categoriile după autentificare
  useEffect(() => {
    // Nu încărcăm categoriile dacă utilizatorul nu este autentificat
    if (!user) return;

    console.log("[App] Inițializare categorii globală");

    const initializeCategories = async () => {
      try {
        // 1. Mai întâi încărcăm categoriile personalizate din DB
        await loadCategories(user.id);

        // 2. Apoi fuzionăm cu cele predefinite din CATEGORIES (shared-constants)
        // Conversia e necesară pentru că CATEGORIES are un format ușor diferit de CustomCategory[]
        const defaultCategories = Object.entries(CATEGORIES).map(
          ([name, subcats]) => ({
            name,
            subcategories: Object.values(subcats)
              .flat()
              .map((subcatName) => ({
                name: subcatName,
                isCustom: false,
              })),
            isCustom: false,
          }),
        );

        // 3. Fuziune - prioritate pentru cele personalizate
        mergeWithDefaults(defaultCategories);

        console.log("[App] Categorii inițializate cu succes");
      } catch (error) {
        console.error("[App] Eroare la inițializarea categoriilor:", error);
      }
    };

    initializeCategories();
  }, [user?.id]);

  // Afișează spinner în timpul încărcării stării de autentificare
  if (loading) {
    return (
      <div
        className={cn(
          dashboard({ layout: "single" }),
          "min-h-screen flex items-center justify-center",
        )}
      >
        {" "}
        <Spinner size="xl" />{" "}
      </div>
    );
  }

  // Rute protejate și publice
  // Dacă utilizatorul nu este autentificat, și încearcă să acceseze o rută protejată, va fi redirecționat
  // la /login. Pagina de login va fi ruta implicită dacă nu e logat.

  return (
    <CommandPaletteProvider
      onToggleDarkMode={toggleDarkMode}
      onSidebarToggle={() => {
        // TODO: Implement sidebar toggle when sidebar is added
        console.log('Sidebar toggle requested');
      }}
      onNewTab={() => {
        // TODO: Implement new tab functionality when tabs are added
        console.log('New tab requested');
      }}
      onShowHelp={() => {
        // TODO: Implement help modal when help system is added
        console.log('Help requested');
      }}
    >
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className={dashboard({ layout: "single" })}>
        {user /* Afișează navigarea doar dacă utilizatorul este logat */ && (
          <div
            className={cn(
              "flex flex-row gap-8 justify-start",
              "border-b border-gray-200 mb-6 pb-4",
            )}
          >
            <NavLink to="/transactions" testId="transactions-tab">
              {TITLES.TRANZACTII}
            </NavLink>
            <NavLink to="/lunar-grid" testId="lunar-grid-tab">
              {" "}
              {TITLES.GRID_LUNAR}{" "}
            </NavLink>{" "}
            <NavLink to="/enhanced-lunar-grid" testId="enhanced-lunar-grid-tab">
              {" "}
              Enhanced LunarGrid (Phase 4){" "}
            </NavLink>{" "}
            <NavLink to="/lunar-grid-enhanced" testId="lunar-grid-enhanced-tab">
              {" "}
              🚀 LunarGrid Enhanced (Modal Architecture){" "}
            </NavLink>{" "}
            <NavLink to="/options" testId="options-tab">
              {" "}
              {TITLES.OPTIUNI || "Opțiuni"}{" "}
            </NavLink>
            {/* ❌ ELIMINAT TEMPORAR: ProfilerDebugPage cauzează crash
            <NavLink to="/profiler-debug" testId="profiler-debug-tab">
              {" "}
              🔍 Profiler Debug{" "}
            </NavLink>
            */}
          </div>
        )}

        <Routes>
          {user ? (
            <>
              <Route
                path="/"
                element={<Navigate to="/transactions" replace />}
              />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/lunar-grid" element={<LunarGridPage />} />
              <Route path="/options" element={<OptionsPage />} />
              {/* ❌ ELIMINAT TEMPORAR: ProfilerDebugPage cauzează crash
              <Route path="/profiler-debug" element={<ProfilerDebugPage />} />
              */}
              {/* Orice altă rută pentru utilizator logat, redirecționează la tranzacții */}
              <Route
                path="*"
                element={<Navigate to="/transactions" replace />}
              />
            </>
          ) : (
            <>
              {/* Rute publice pentru login și register */}
              <Route path="/login" element={<LoginForm />} />{" "}
              {/* Simplificat: LoginForm va avea link către /register */}
              <Route path="/register" element={<RegisterForm />} />{" "}
              {/* Simplificat: RegisterForm va avea link către /login */}
              {/* Orice altă rută, inclusiv rădăcina, redirecționează la login dacă nu e logat */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </CommandPaletteProvider>
  );
};

export default App;
