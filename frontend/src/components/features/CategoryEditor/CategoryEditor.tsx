// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
// Migrated la CVA styling system pentru consistență
import React, {
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from 'react-dom';
import { BUTTONS, PLACEHOLDERS, UI, INFO, FLAGS, MESAJE } from "@shared-constants";
import Button from "../../primitives/Button/Button";
import Input from "../../primitives/Input/Input";
import Badge from "../../primitives/Badge/Badge";
import Alert from "../../primitives/Alert/Alert";

// CVA styling imports
import { 
  cn,
  modal,
  card,
  hoverBackground
} from "../../../styles/cva-v2";
import { modalContent, modalContainer } from "../../../styles/cva-v2/primitives/modal";

import { useCategoryEditorState } from "./useCategoryEditorState";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialCategory?: string;
  initialSubcategory?: string;
  initialMode?: "edit" | "delete" | "add";
}

const CategoryEditorComponent: React.FC<Props> = ({
  open,
  onClose,
  userId,
  initialCategory,
  initialSubcategory,
  initialMode = "add",
}) => {
  // Utilizăm hook-ul personalizat pentru gestionarea stării
  const {
    selectedCategory,
    subcatAction,
    renameValue,
    newSubcat,
    error,
    categories,
    getSubcategoryCount,
    setSelectedCategory,
    setSubcatAction,
    setRenameValue,
    setNewSubcat,
    setError,
    handleAdd,
    handleRename,
    handleDelete,
    isValidDeleteRequest,
  } = useCategoryEditorState({
    open,
    userId,
    initialCategory,
    initialSubcategory,
    initialMode,
  });

  // Professional scroll lock with scrollbar compensation - same as ConfirmationModal
  useEffect(() => {
    if (!open) return;

    // Save current scroll positions for restoration
    const currentPageScrollY = window.scrollY;
    const currentPageScrollX = window.scrollX;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Save original styles for restoration
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Apply scroll lock with scrollbar compensation
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Cleanup function - restore scroll when modal closes
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      
      // Restore scroll position precisely
      window.scrollTo(currentPageScrollX, currentPageScrollY);
    };
  }, [open]);

  // Enhanced escape key handler with capture - same as ConfirmationModal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    // Use capture to ensure it fires first
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onClose]);

  // validare subcategorie - memoizată pentru a evita recrearea la fiecare render
  const isValidSubcat = useCallback(
    (txt: string): boolean =>
      txt.trim().length > 0 &&
      txt.trim().length <= 80 &&
      /^[a-zA-Z0-9ăâîșțĂÂÎȘȚ \-|]+$/.test(txt.trim()),
    [],
  );

  // Nu renderizăm nimic dacă modalul nu este deschis
  if (!open) return null;

  // Badge pentru număr de tranzacții în subcategorie
  const badge = (cat: string, subcat: string): React.ReactElement | null => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? (
      <Badge
        variant="secondary"
        data-testid={`subcat-count-${cat}-${subcat}`}
      >
        {count}
      </Badge>
    ) : null;
  };

  return createPortal(
    <div 
      className={cn(modal({ variant: "overlay" }))}
      onClick={onClose}
    >
      <div className={cn(modalContainer())}>
        <div 
          className={cn(modalContent({ size: "xl", padding: "none" }))}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={cn(
            "flex justify-between items-center p-6",
            "border-b border-carbon-200 dark:border-carbon-700",
            "bg-carbon-50 dark:bg-carbon-900 rounded-t-lg"
          )}>
            <h2
              id="category-editor-title"
              className="text-xl font-bold text-carbon-900 dark:text-carbon-100"
            >
              {UI.CATEGORY_EDITOR.TITLE}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                "text-carbon-400 dark:text-carbon-500 hover:text-carbon-600 dark:hover:text-carbon-300",
                "transition-colors duration-150",
                "p-2 rounded-md hover:bg-carbon-100 dark:hover:bg-carbon-800",
                "focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-1",
              )}
              aria-label="Închide"
              data-testid="close-category-editor"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {error && (
              <Alert
                variant="error"
                data-testid="error-message"
                className="mb-4"
              >
                {error}
              </Alert>
            )}
            <div className="flex flex-row gap-12 justify-between h-full">
              <div
                className={cn(card({ variant: "default" }), "flex-1")}
                data-testid="categories-section"
              >
                <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 mb-4">
                  {UI.CATEGORY_EDITOR.CATEGORIES_SECTION_TITLE}
                </h3>
                <div
                  style={{ maxHeight: 400 }}
                  className={cn(
                    "overflow-y-auto border border-carbon-200 dark:border-carbon-700 rounded-lg",
                    "bg-carbon-50 dark:bg-carbon-900"
                  )}
                  data-testid="categories-scroll-wrapper"
                >
                  <ul className="divide-y divide-carbon-200 dark:divide-carbon-700">
                    {categories.map((cat) => (
                      <li
                        key={cat.name}
                        className={cn(
                          "p-3 hover:bg-carbon-100 dark:hover:bg-carbon-800 transition-colors duration-150",
                          selectedCategory === cat.name &&
                            "bg-copper-50 dark:bg-copper-900/20 border-r-2 border-r-copper-500 dark:border-r-copper-400",
                        )}
                        data-testid={`category-item-${cat.name}`}
                      >
                        <button
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setError(null);
                            setNewSubcat("");
                          }}
                          aria-pressed={selectedCategory === cat.name}
                          aria-controls="subcategories-section"
                          data-testid={`cat-select-${cat.name}`}
                          className={cn(
                            "w-full text-left text-sm font-medium transition-colors duration-150",
                            selectedCategory === cat.name
                              ? "text-copper-700 dark:text-copper-300"
                              : "text-carbon-700 dark:text-carbon-300 hover:text-carbon-900 dark:hover:text-carbon-100",
                          )}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={cn(card({ variant: "default" }), "flex-1")}
                data-testid="subcategories-section"
                id="subcategories-section"
              >
                {selectedCategory ? (
                  <>
                    <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 mb-4">
                      {UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}{" "}
                      <span className="text-copper-600 dark:text-copper-400 font-normal">
                        {selectedCategory}
                      </span>
                    </h3>
                    <div
                      style={{ maxHeight: 400 }}
                      className={cn(
                        "overflow-y-auto border border-carbon-200 dark:border-carbon-700 rounded-lg mb-4",
                        "bg-carbon-50 dark:bg-carbon-900"
                      )}
                      data-testid="subcategories-scroll-wrapper"
                    >
                      <ul
                        className="divide-y divide-carbon-200 dark:divide-carbon-700"
                        aria-label={
                          UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE
                        }
                      >
                        {categories
                          .find((cat) => cat.name === selectedCategory)
                          ?.subcategories.map((sc) => (
                            <li
                              key={sc.name}
                              className={cn("p-3 group", hoverBackground({ variant: "subtle" }))}
                              data-testid={`subcat-item-${sc.name}`}
                            >
                              {subcatAction?.type === "edit" &&
                              subcatAction.cat === selectedCategory &&
                              subcatAction.subcat === sc.name ? (
                                <div
                                  className={cn(
                                    "flex flex-row gap-sm items-center",
                                  )}
                                >
                                  <Input
                                    type="text"
                                    value={renameValue}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) => setRenameValue(e.target.value)}
                                    onKeyDown={(
                                      e: KeyboardEvent<HTMLInputElement>,
                                    ) => {
                                      if (
                                        e.key === "Enter" &&
                                        isValidSubcat(renameValue)
                                      )
                                        handleRename(
                                          selectedCategory,
                                          sc.name,
                                          renameValue,
                                        );
                                      if (e.key === "Escape") {
                                        setSubcatAction(null);
                                        setRenameValue("");
                                      }
                                    }}
                                    autoFocus
                                    className="flex-grow"
                                    data-testid={`rename-input-${sc.name}`}
                                    maxLength={32}
                                  />
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={!isValidSubcat(renameValue)}
                                    data-testid={`confirm-rename-${sc.name}`}
                                    type="button"
                                    onClick={() =>
                                      handleRename(
                                        selectedCategory,
                                        sc.name,
                                        renameValue,
                                      )
                                    }
                                    className="min-w-[90px] flex-shrink-0"
                                  >
                                    {BUTTONS.DONE}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    data-testid={`cancel-rename-${sc.name}`}
                                    type="button"
                                    onClick={() => {
                                      setSubcatAction(null);
                                      setRenameValue("");
                                    }}
                                    className="min-w-[90px] flex-shrink-0"
                                  >
                                    {BUTTONS.CANCEL}
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "flex flex-row justify-between items-center",
                                  )}
                                >
                                  <span className="text-sm text-carbon-700 dark:text-carbon-300 font-medium">
                                    {sc.name}
                                  </span>
                                  <div
                                    className={cn(
                                      "flex flex-row gap-sm items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                                    )}
                                  >
                                    {sc.isCustom && (
                                      <Badge
                                        variant="success"
                                        data-testid={`custom-flag-${sc.name}`}
                                      >
                                        {FLAGS.CUSTOM}
                                      </Badge>
                                    )}
                                    {badge(selectedCategory, sc.name)}
                                    <Button
                                      variant="secondary"
                                      size="xs"
                                      data-testid={`edit-${sc.name}`}
                                      type="button"
                                      onClick={() => {
                                        setSubcatAction({
                                          type: "edit",
                                          cat: selectedCategory,
                                          subcat: sc.name,
                                        });
                                        setRenameValue(sc.name);
                                      }}
                                    >
                                      {BUTTONS.RENAME}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      data-testid={`delete-${sc.name}`}
                                      type="button"
                                      onClick={() =>
                                        setSubcatAction({
                                          type: "delete",
                                          cat: selectedCategory,
                                          subcat: sc.name,
                                        })
                                      }
                                    >
                                      {BUTTONS.DELETE}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div
                      className={cn(
                        card({ variant: "elevated" }),
                        "bg-carbon-100 dark:bg-carbon-800 border border-carbon-200 dark:border-carbon-700 p-4",
                      )}
                    >
                      <div className="flex flex-row gap-sm items-center">
                        <Input
                          type="text"
                          value={newSubcat}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setNewSubcat(e.target.value)
                          }
                          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter" && isValidSubcat(newSubcat)) {
                              const selectedCat = categories.find(
                                (cat) => cat.name === selectedCategory,
                              );
                              if (selectedCat) handleAdd(selectedCat);
                            }
                            if (e.key === "Escape") setNewSubcat("");
                          }}
                          placeholder={PLACEHOLDERS.CATEGORY_EDITOR_SUBCATEGORY}
                          className="flex-grow"
                          data-testid="add-subcat-input"
                          maxLength={32}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!isValidSubcat(newSubcat)}
                          data-testid="add-subcat-btn"
                          type="button"
                          onClick={() => {
                            const selectedCat = categories.find(
                              (cat) => cat.name === selectedCategory,
                            );
                            if (selectedCat && isValidSubcat(newSubcat))
                              handleAdd(selectedCat);
                          }}
                          className="min-w-[90px]"
                        >
                          {BUTTONS.ADD}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          data-testid="cancel-add-subcat-btn"
                          type="button"
                          onClick={() => setNewSubcat("")}
                          className="min-w-[90px]"
                        >
                          {BUTTONS.CANCEL}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert
                    variant="default"
                    data-testid="no-cat-msg"
                  >
                    {INFO.CATEGORY_EDITOR_EMPTY}
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
export const CategoryEditor = React.memo(CategoryEditorComponent, (prevProps, nextProps) => {
  // Custom comparison pentru props critice la performance
  return (
    prevProps.open === nextProps.open &&
    prevProps.userId === nextProps.userId &&
    prevProps.initialCategory === nextProps.initialCategory &&
    prevProps.initialSubcategory === nextProps.initialSubcategory &&
    prevProps.initialMode === nextProps.initialMode
    // onClose este callback și se va schimba în mod normal
  );
});

export default CategoryEditor;