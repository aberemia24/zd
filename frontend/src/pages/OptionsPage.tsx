import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { CategoryEditor } from '../components/features/CategoryEditor';
import { UI } from '@shared-constants/ui';

/**
 * Pagina de opțiuni a aplicației
 * Conține setări și configurări pentru utilizator, inclusiv gestionarea categoriilor
 */
const OptionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const categoryStore = useCategoryStore();
  const [showCategoryEditor, setShowCategoryEditor] = React.useState(false);
  
  // IMPORTANT: Folosim o referință pentru a ține minte starea anterioară a editorului
  // și pentru a preveni buclele infinite, conform memoriei e0d0698c
  const prevEditorStateRef = React.useRef(showCategoryEditor);

  // Dacă utilizatorul nu este autentificat, afișăm un mesaj
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="options-page-not-logged">
        <h1 className="text-2xl font-bold mb-4">{UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{UI.LOGIN_REQUIRED || 'Trebuie să fiți autentificat pentru a accesa această pagină.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="options-page">
      <h1 className="text-2xl font-bold mb-4">{UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}</h1>
      
      {/* Secțiunea de gestionare categorii */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{UI.CATEGORY_MANAGEMENT || 'Gestionare categorii'}</h2>
        <p className="mb-4">{UI.CATEGORY_MANAGEMENT_DESCRIPTION || 'Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.'}</p>
        
        <button
          onClick={() => setShowCategoryEditor(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          data-testid="open-category-editor-btn"
        >
          {UI.MANAGE_CATEGORIES || 'Gestionare categorii'}
        </button>
      </div>

      {/* Alte secțiuni de opțiuni pot fi adăugate aici */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{UI.DISPLAY_OPTIONS || 'Opțiuni de afișare'}</h2>
        <p className="text-gray-500">{UI.COMING_SOON || 'În curând'}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{UI.DATA_EXPORT || 'Export date'}</h2>
        <p className="text-gray-500">{UI.COMING_SOON || 'În curând'}</p>
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
          console.log('[OptionsPage] Notificarea componentelor despre schimbări în categorii');
          const timestamp = Date.now();
          localStorage.setItem('budget-app-last-category-update', timestamp.toString());
          console.log('[OptionsPage] Timestamp salvat:', new Date(timestamp).toISOString());
        }}
        userId={user.id}
      />
    </div>
  );
};

export default OptionsPage;
