import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCategoryStore } from "../stores/categoryStore";
import CategoryEditor from "../components/features/CategoryEditor/CategoryEditor";
import { UI, CATEGORIES, TransactionType } from "@shared-constants";
import { Button } from "../components/primitives/Button";
import Alert from "../components/primitives/Alert";
import { ConfirmationModal, PromptModal, useConfirmationModal } from "../components/primitives/ConfirmationModal";
import { Container } from "../components/primitives";

// CVA styling imports
import { cn, dashboard, card, headingProfessional, labelProfessional, captionProfessional } from "../styles/cva-v2";

import { useDeleteTransaction } from "../services/hooks/useTransactionMutations";
import { supabaseService } from "../services/supabaseService";
import { toast } from "react-hot-toast";

/**
 * Pagina de opțiuni a aplicației
 * Conține setări și configurări pentru utilizator, inclusiv gestionarea categoriilor
 * Migrated to CVA styling system for consistency
 */
const OptionsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const categoryStore = useCategoryStore();
  const { categories, saveCategories } = categoryStore;
  const [showCategoryEditor, setShowCategoryEditor] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [showPromptModal, setShowPromptModal] = React.useState(false);
  const [promptResolver, setPromptResolver] = React.useState<((value: string | null) => void) | null>(null);


  // IMPORTANT: Folosim o referință pentru a ține minte starea anterioară a editorului
  // și pentru a preveni buclele infinite, conform memoriei e0d0698c
  const prevEditorStateRef = React.useRef(showCategoryEditor);

  // Hook pentru ștergerea tranzacțiilor
  const deleteTransactionMutation = useDeleteTransaction();

  // Modal hooks
  const { modalProps, showConfirmation } = useConfirmationModal();

  // Funcție pentru transformarea categoriilor default din CATEGORIES în formatul store-ului
  const getDefaultCategories = () => {
    const defaultCategories: Array<{
      name: string;
      type: TransactionType;
      subcategories: Array<{ name: string; isCustom: boolean }>;
      isCustom: boolean;
    }> = [];
    
    Object.entries(CATEGORIES).forEach(([categoryName, categoryData]) => {
      const subcategories: Array<{ name: string; isCustom: boolean }> = [];
      
      // Parcurgem toate grupurile din categoria
      Object.values(categoryData).forEach((group) => {
        group.forEach((subcategoryName: string) => {
          subcategories.push({
            name: subcategoryName,
            isCustom: false
          });
        });
      });
      
      defaultCategories.push({
        name: categoryName,
        type: categoryName === 'VENITURI' ? TransactionType.INCOME : categoryName === 'ECONOMII' ? TransactionType.SAVING : TransactionType.EXPENSE,
        subcategories,
        isCustom: false
      });
    });
    
    return defaultCategories;
  };

  // Funcție pentru verificarea tranzacțiilor ce vor fi șterse
  const checkTransactionsToBeDeleted = async () => {
    if (!user?.id) return null;

    try {
      // Obținem toate tranzacțiile utilizatorului
      const allTransactions = await supabaseService.fetchTransactions(user.id, { 
        limit: 10000 
      });

      // Identificăm subcategoriile custom din store
      const customSubcategories: string[] = [];
      categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          if (subcategory.isCustom) {
            customSubcategories.push(`${category.name}:${subcategory.name}`);
          }
        });
      });

      // Găsim tranzacțiile care vor fi șterse
      const transactionsToDelete = allTransactions.data.filter(transaction => {
        const key = `${transaction.category}:${transaction.subcategory}`;
        return customSubcategories.some(customKey => customKey === key);
      });

      // Grupăm pe subcategorii pentru a afișa detalii
      const subcategoryStats: { [key: string]: number } = {};
      transactionsToDelete.forEach(transaction => {
        const key = `${transaction.subcategory} (${transaction.category})`;
        subcategoryStats[key] = (subcategoryStats[key] || 0) + 1;
      });

      return {
        customSubcategories,
        transactionCount: transactionsToDelete.length,
        transactionsToDelete,
        subcategoryStats
      };
    } catch (error) {
      console.error("Eroare la verificarea tranzacțiilor:", error);
      return null;
    }
  };

  // Funcție pentru prompt modal
  const showPrompt = (message: string, expectedValue?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptResolver(() => resolve);
      setShowPromptModal(true);
    });
  };

  // Funcție pentru reset doar subcategorii (simplificată și clară)
  const handleResetSubcategories = async () => {
    if (!user?.id || isResetting) return;

    setIsResetting(true);
    
    try {
      // PASUL 1: Identificăm subcategoriile care vor fi resetate
      const customSubcategories: string[] = [];
      const modifiedSubcategories: string[] = [];
      
      categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          if (subcategory.isCustom) {
            customSubcategories.push(`${subcategory.name} (${category.name})`);
          }
        });
      });

      // Găsim subcategoriile modificate (care nu sunt în CATEGORIES default)
      const defaultCategoriesForCheck = getDefaultCategories();
      categories.forEach(category => {
        const defaultCategory = defaultCategoriesForCheck.find(def => def.name === category.name);
        if (defaultCategory) {
          category.subcategories.forEach(subcategory => {
            if (!subcategory.isCustom) {
              const existsInDefault = defaultCategory.subcategories.some(
                defSub => defSub.name === subcategory.name
              );
              if (!existsInDefault) {
                modifiedSubcategories.push(`${subcategory.name} (${category.name})`);
              }
            }
          });
        }
      });

      // PASUL 2: Verificăm ce tranzacții vor fi șterse
      const deleteInfo = await checkTransactionsToBeDeleted();
      
      if (!deleteInfo) {
        toast.error("Eroare la verificarea tranzacțiilor. Încercați din nou.");
        return;
      }

      // PASUL 3: Construim mesajul de confirmare cu toate informațiile
      let confirmationMessage = "Resetarea subcategoriilor va face următoarele:\n\n";
      
      if (customSubcategories.length > 0) {
        confirmationMessage += `🗑️ Va șterge ${customSubcategories.length} subcategorii custom:\n`;
        // Adăugăm doar primele 5 pentru a nu încarcat mesajul
        const displayCustom = customSubcategories.slice(0, 5);
        confirmationMessage += displayCustom.map(sub => `• ${sub}`).join('\n');
        if (customSubcategories.length > 5) {
          confirmationMessage += `\n• ... și încă ${customSubcategories.length - 5} subcategorii`;
        }
        confirmationMessage += "\n\n";
      }

      if (modifiedSubcategories.length > 0) {
        confirmationMessage += `🔄 Va redenumi ${modifiedSubcategories.length} subcategorii modificate la numele inițiale\n\n`;
      }

      if (deleteInfo.transactionCount > 0) {
        confirmationMessage += `⚠️ Va șterge ${deleteInfo.transactionCount} tranzacții de pe subcategoriile custom:\n`;
        // Afișăm statisticile pe subcategorii
        const topStats = Object.entries(deleteInfo.subcategoryStats).slice(0, 5);
        confirmationMessage += topStats.map(([subcategory, count]) => `• ${subcategory}: ${count} tranzacții`).join('\n');
        if (Object.keys(deleteInfo.subcategoryStats).length > 5) {
          confirmationMessage += `\n• ... și alte subcategorii`;
        }
      } else {
        confirmationMessage += "✅ Nu vor fi șterse tranzacții (nu există tranzacții pe subcategorii custom)";
      }

      // Construim lista de detalii pentru modal
      const details: string[] = [];
      if (customSubcategories.length > 0) {
        details.push(`${customSubcategories.length} subcategorii custom vor fi șterse`);
      }
      if (modifiedSubcategories.length > 0) {
        details.push(`${modifiedSubcategories.length} subcategorii vor fi redenumite`);
      }
      if (deleteInfo.transactionCount > 0) {
        details.push(`${deleteInfo.transactionCount} tranzacții vor fi șterse definitiv`);
      } else {
        details.push("0 tranzacții vor fi șterse");
      }

      const shouldContinue = await showConfirmation({
        title: deleteInfo.transactionCount > 0 ? "⚠️ Resetare Subcategorii + Ștergere Tranzacții" : "🔄 Resetare Subcategorii",
        message: confirmationMessage,
        details: details,
        recommendation: deleteInfo.transactionCount > 0 
          ? "Înainte de reset, mergeți în LunarGrid și mutați manual tranzacțiile importante pe subcategorii pe care doriți să le păstrați."
          : "Subcategoriile custom vor fi șterse și cele modificate vor fi redenumite la valorile inițiale.",
        confirmText: deleteInfo.transactionCount > 0 ? "Resetează și șterge tranzacțiile" : "Resetează subcategoriile",
        cancelText: "Anulează",
        variant: deleteInfo.transactionCount > 0 ? "warning" : "default",
        icon: deleteInfo.transactionCount > 0 ? "⚠️" : "🔄"
      });
      
      if (!shouldContinue) {
        toast(deleteInfo.transactionCount > 0 
          ? "Resetarea anulată. Mutați tranzacțiile manual din LunarGrid înainte de reset." 
          : "Resetarea anulată.", {
          icon: "💡"
        });
        return;
      }

      // PASUL 4: Dacă avem tranzacții de șters, confirmarea finală
      if (deleteInfo.transactionCount > 0) {
        const finalConfirm = await showConfirmation({
          title: "Confirmarea finală pentru ștergerea tranzacțiilor",
          message: `Sunteți sigur că doriți să ștergeți ${deleteInfo.transactionCount} tranzacții?\n\nAceastă acțiune NU poate fi anulată!`,
          confirmText: "Da, șterge tranzacțiile",
          cancelText: "Nu, anulează",
          variant: "danger",
          icon: "🗑️"
        });

        if (!finalConfirm) {
          toast("Resetarea anulată.", {
            icon: "ℹ️"
          });
          return;
        }

        // PASUL 5: Ștergem tranzacțiile de pe subcategoriile custom
        toast.loading(`Șterge ${deleteInfo.transactionCount} tranzacții...`, { duration: 3000 });
        
        for (const transaction of deleteInfo.transactionsToDelete) {
          await supabaseService.deleteTransaction(transaction.id);
        }
        
        toast.success(`${deleteInfo.transactionCount} tranzacții au fost șterse.`);
      }

      // PASUL 6: Resetăm categoriile
      const defaultCategories = getDefaultCategories();
      await saveCategories(user.id, defaultCategories);
      
      const message = deleteInfo.transactionCount > 0 
        ? `Subcategoriile au fost resetate și ${deleteInfo.transactionCount} tranzacții au fost șterse.`
        : "Subcategoriile au fost resetate la valorile implicite!";
      
      toast.success(message);
      
    } catch (error) {
      console.error("Eroare la resetarea subcategoriilor:", error);
      toast.error("Eroare la resetarea subcategoriilor. Încercați din nou.");
    } finally {
      setIsResetting(false);
    }
  };

  // Funcție pentru reset complet (subcategorii + tranzacții)
  const handleResetEverything = async () => {
    if (!user?.id || isResetting) return;

    // Verificarea inițială
    const confirmed = await showConfirmation({
      title: "⚠️ RESETARE COMPLETĂ ⚠️",
      message: "Sigur doriți să resetați TOTUL la valorile implicite?\n\nAceasta va:\n• Șterge toate subcategoriile custom\n• Redenumi subcategoriile modificate la numele inițiale\n• ȘTERGE DEFINITIV TOATE TRANZACȚIILE din baza de date\n\n⚠️ ACEASTĂ ACȚIUNE NU POATE FI ANULATĂ! ⚠️\nToate datele financiare vor fi pierdute permanent!",
      confirmText: "Continuă",
      cancelText: "Anulează",
      variant: "danger",
      icon: "💥"
    });

    if (!confirmed) return;

    // Confirmarea dublă pentru acțiuni periculoase
    const doubleConfirmed = await showConfirmation({
      title: "Ultima verificare!",
      message: "Sunteți absolut sigur că doriți să ștergeți TOATE tranzacțiile?\nScrieți 'ȘTERG TOT' în următorul câmp pentru a confirma.",
      confirmText: "Continuă la confirmarea finală",
      cancelText: "Anulează",
      variant: "danger",
      icon: "⚠️"
    });

    if (!doubleConfirmed) return;

    const finalConfirmation = await showPrompt(
      "Pentru a confirma ștergerea completă, scrieți exact: ȘTERG TOT", 
      "ȘTERG TOT"
    );

    if (finalConfirmation !== "ȘTERG TOT") {
      toast("Confirmarea nu a fost corectă. Resetarea a fost anulată.", {
        icon: "ℹ️"
      });
      return;
    }

    setIsResetting(true);
    try {
      // Pasul 1: Obținem toate tranzacțiile pentru numărătoare
      const allTransactions = await supabaseService.fetchTransactions(user.id, { 
        limit: 10000 
      });
      
      const transactionCount = allTransactions.count;
      
      toast.loading(`Șterge ${transactionCount} tranzacții...`, { duration: 3000 });
      
      // Pasul 2: Ștergem toate tranzacțiile (în batches pentru performanță)
      const batchSize = 50;
      for (let i = 0; i < allTransactions.data.length; i += batchSize) {
        const batch = allTransactions.data.slice(i, i + batchSize);
        await Promise.all(batch.map(transaction => 
          supabaseService.deleteTransaction(transaction.id)
        ));
        
        // Progress feedback
        const progress = Math.min(i + batchSize, allTransactions.data.length);
        console.log(`Șters batch ${Math.ceil(progress / batchSize)} din ${Math.ceil(allTransactions.data.length / batchSize)}`);
      }
      
      // Pasul 3: Reset categorii
      const defaultCategories = getDefaultCategories();
      await saveCategories(user.id, defaultCategories);
      
      toast.success(`Resetarea completă a fost finalizată! ${transactionCount} tranzacții au fost șterse.`);
      
      // Redirecționează utilizatorul la pagina principală
      navigate("/");
    } catch (error) {
      console.error("Eroare la resetarea completă:", error);
      toast.error("Eroare la resetarea completă. Unele date ar putea nu fi fost șterse.");
    } finally {
      setIsResetting(false);
    }
  };

  // Dacă utilizatorul nu este autentificat, afișăm un mesaj
  if (!user) {
    return (
      <Container maxWidth="7xl" padding="lg">
        <div
          className={cn(dashboard({ layout: "default" }), "min-h-screen pt-8")}
          data-testid="options-page-not-logged"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {UI.OPTIONS_PAGE_TITLE || "Opțiuni"}
          </h1>
          <Alert
            variant="warning"
            data-testid="options-alert-not-logged"
          >
            {UI.LOGIN_REQUIRED ||
              "Trebuie să fiți autentificat pentru a accesa această pagină."}
          </Alert>
        </div>
      </Container>
    );
  }

  // Funcție pentru gestionarea logout-ului
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirecționare la pagina de login după logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Aici ai putea afișa un mesaj de eroare pentru utilizator, dacă este cazul
    }
  };

  return (
    <Container maxWidth="7xl" padding="lg">
      <div
        className={cn(dashboard({ layout: "default" }), "min-h-screen pt-8")}
        data-testid="options-page"
      >
                  <h1
            className={headingProfessional({ level: "h1" })}
            data-testid="options-title"
          >
          {UI.OPTIONS_PAGE_TITLE || "Opțiuni"}
        </h1>

        {/* Secțiunea de gestionare categorii */}
        <div className={cn(card({ variant: "elevated" }), "mb-6")}>
          <div
            className={cn(
              "p-4 border-b border-gray-200 bg-gray-50",
              "rounded-t-lg",
            )}
          >
                         <h2 className={headingProfessional({ level: "h4" })}>
                {UI.CATEGORY_MANAGEMENT || "Gestionare categorii"}
              </h2>
          </div>
          <div className="p-6">
            <p className={captionProfessional({ size: "sm" })}>
              {UI.CATEGORY_MANAGEMENT_DESCRIPTION ||
                "Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare."}
            </p>
            <Button
              variant="primary"
              size="md"
              data-testid="open-category-editor-btn"
              onClick={() => setShowCategoryEditor(true)}
            >
              {UI.MANAGE_CATEGORIES || "Gestionare categorii"}
            </Button>
          </div>
        </div>

        {/* Alte secțiuni de opțiuni */}
        <div className={cn(card({ variant: "elevated" }), "mb-6")}>
          <div
            className={cn(
              "p-4 border-b border-gray-200 bg-gray-50",
              "rounded-t-lg",
            )}
          >
            <h2 className={headingProfessional({ level: "h4" })}>
              {UI.DISPLAY_OPTIONS || "Opțiuni de afișare"}
            </h2>
          </div>
          <div className="p-6">
            <p className={captionProfessional({ size: "sm" })}>
              {UI.COMING_SOON || "În curând"}
            </p>
          </div>
        </div>

        <div className={cn(card({ variant: "elevated" }), "mb-6")}>
          <div
            className={cn(
              "p-4 border-b border-gray-200 bg-gray-50",
              "rounded-t-lg",
            )}
          >
            <h2 className={headingProfessional({ level: "h4" })}>
              {UI.DATA_EXPORT || "Export date"}
            </h2>
          </div>
          <div className="p-6">
            <p className={captionProfessional({ size: "sm" })}>
              {UI.COMING_SOON || "În curând"}
            </p>
          </div>
        </div>

        {/* Secțiunea Reset to Defaults */}
        <div className={cn(card({ variant: "elevated" }), "mb-6")}>
          <div
            className={cn(
              "p-4 border-b border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20",
              "rounded-t-lg",
            )}
          >
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
              ⚠️ Reset la Setările Inițiale
            </h2>
          </div>
          <div className="p-6">
            <p className="text-carbon-600 dark:text-carbon-400 mb-4">
              Resetați aplicația la configurația inițială. Alegeți ce doriți să resetați:
            </p>
            
            <div className="flex flex-col gap-4">
              {/* Reset doar subcategorii */}
              <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4 bg-carbon-50 dark:bg-carbon-900">
                <h3 className="font-semibold text-carbon-900 dark:text-carbon-100 mb-2">
                  🔄 Reset Subcategorii
                </h3>
                <p className="text-sm text-carbon-600 dark:text-carbon-400 mb-3">
                  Șterge subcategoriile custom și redenumește toate subcategoriile la numele inițiale. 
                  <strong className="text-red-700 dark:text-red-400"> ATENȚIE:</strong> Tranzacțiile de pe subcategorii custom vor fi 
                  <strong> șterse definitiv</strong>. Veți fi informați exact câte tranzacții vor fi afectate.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-2 mb-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 <strong>Recomandare:</strong> Înainte de reset, mutați manual tranzacțiile importante 
                    din LunarGrid pe subcategorii pe care doriți să le păstrați.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetSubcategories}
                  disabled={isResetting}
                  data-testid="reset-subcategories-btn"
                >
                  {isResetting ? "Se resetează..." : "Reset Subcategorii"}
                </Button>
              </div>

              {/* Reset complet */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  💥 Reset Complet (PERICULOS)
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Resetează subcategoriile ȘI șterge <strong>TOATE tranzacțiile</strong> definitiv din baza de date. 
                  <strong> Această acțiune NU poate fi anulată!</strong>
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResetEverything}
                  disabled={isResetting}
                  data-testid="reset-everything-btn"
                >
                  {isResetting ? "Se resetează..." : "⚠️ Reset Complet"}
                </Button>
              </div>
            </div>

            {isResetting && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-800 text-sm">
                    Se procesează resetarea... Vă rugăm să așteptați.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secțiunea Cont Utilizator */}
        <div className={cn(card({ variant: "elevated" }), "mb-6")}>
          <div
            className={cn(
              "p-4 border-b border-carbon-200 dark:border-carbon-700 bg-carbon-50 dark:bg-carbon-900",
              "rounded-t-lg",
            )}
          >
            <h2 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
              {UI.ACCOUNT_SETTINGS || "Setări Cont"}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4 bg-carbon-50 dark:bg-carbon-900">
                <h3 className="font-semibold text-carbon-900 dark:text-carbon-100 mb-2">
                  👤 Informații cont
                </h3>
                <p className="text-sm text-carbon-600 dark:text-carbon-400 mb-3">
                  <strong>Email:</strong> {user.email || "Nu este disponibil"}
                </p>
                <p className="text-sm text-carbon-600 dark:text-carbon-400 mb-3">
                  <strong>ID Utilizator:</strong> {user.id || "Nu este disponibil"}
                </p>
              </div>

              <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  🚪 Delogare
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  Delogați-vă din aplicație și reveniți la pagina de autentificare.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  data-testid="logout-btn"
                >
                  Delogare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal pentru editarea categoriilor */}
        <CategoryEditor
          open={showCategoryEditor}
          onClose={() => {
            // Salvăm starea anterioară înainte de a o modifica
            prevEditorStateRef.current = showCategoryEditor;
            setShowCategoryEditor(false);

            // IMPORTANT: În loc să folosim evenimente care pot cauza bucle infinite,
            // salvăm un timestamp în localStorage pentru a notifica alte componente
            // despre schimbările în categorii. Această abordare respectă recomandările
            // din memoria critică d7b6eb4b-0702-4b0a-b074-3915547a2544 și pattern-urile
            // din memoria e0d0698c-ac6d-444f-8811-b1a3936df71b
            console.log(
              "[OptionsPage] Notificarea componentelor despre schimbări în categorii",
            );
            const timestamp = Date.now();
            localStorage.setItem(
              "budget-app-last-category-update",
              timestamp.toString(),
            );
            console.log(
              "[OptionsPage] Timestamp salvat:",
              new Date(timestamp).toISOString(),
            );
          }}
          userId={user.id}
        />

        {/* Modal-uri de confirmare */}
        <ConfirmationModal {...modalProps} />
        
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => {
            if (promptResolver) {
              promptResolver(null);
              setPromptResolver(null);
            }
            setShowPromptModal(false);
          }}
          onConfirm={(value) => {
            if (promptResolver) {
              promptResolver(value);
              setPromptResolver(null);
            }
            setShowPromptModal(false);
          }}
          title="Confirmarea finală"
          message="Pentru a confirma ștergerea completă, scrieți exact: ȘTERG TOT"
          placeholder="Scrieți aici..."
          confirmText="Confirm ștergerea"
          cancelText="Anulează"
          variant="danger"
          required={true}
        />
      </div>
    </Container>
  );
};

export default OptionsPage;
