import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { CategoryEditor } from '../components/features/CategoryEditor';
import { UI } from '@shared-constants/ui';

/**
 * Pagina de opțiuni a aplicației
 * Conține setări și configurări pentru utilizator, inclusiv gestionarea categoriilor
 */
const OptionsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const categoryStore = useCategoryStore();
  const [showCategoryEditor, setShowCategoryEditor] = React.useState(false);
  
  // IMPORTANT: Folosim o referință pentru a ține minte starea anterioară a editorului
  // și pentru a preveni buclele infinite, conform memoriei e0d0698c
  const prevEditorStateRef = React.useRef(showCategoryEditor);

  // Dacă utilizatorul nu este autentificat, afișăm un mesaj
  if (!user) {
    return (
      <div className="container mx-auto px-token py-token-xl" data-testid="options-page-not-logged">
        <h1 className="text-2xl font-bold text-primary-700 mb-token">{UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}</h1>
        <div className="bg-warning-100 border-l-4 border-warning-500 text-warning-700 p-token mb-token" role="alert">
          <p>{UI.LOGIN_REQUIRED || 'Trebuie să fiți autentificat pentru a accesa această pagină.'}</p>
        </div>
      </div>
    );
  }

  // Funcție pentru gestionarea logout-ului
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirecționare la pagina de login după logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Aici ai putea afișa un mesaj de eroare pentru utilizator, dacă este cazul
    }
  };

  return (
    <div className="container mx-auto px-token py-token-xl" data-testid="options-page">
      <h1 className="text-2xl font-bold text-primary-700 mb-token">{UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}</h1>
      
      {/* Secțiunea de gestionare categorii */}
      <div className="bg-secondary-50 shadow-token rounded-token-lg p-token-lg mb-token-lg">
        <h2 className="text-xl font-semibold text-primary-600 mb-token">{UI.CATEGORY_MANAGEMENT || 'Gestionare categorii'}</h2>
        <p className="mb-token">{UI.CATEGORY_MANAGEMENT_DESCRIPTION || 'Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.'}</p>
        
        <button
          onClick={() => setShowCategoryEditor(true)}
          className="btn btn-primary"
          data-testid="open-category-editor-btn"
        >
          {UI.MANAGE_CATEGORIES || 'Gestionare categorii'}
        </button>
      </div>

      {/* Alte secțiuni de opțiuni pot fi adăugate aici */}
      <div className="bg-secondary-50 shadow-token rounded-token-lg p-token-lg mb-token-lg">
        <h2 className="text-xl font-semibold text-primary-600 mb-token">{UI.DISPLAY_OPTIONS || 'Opțiuni de afișare'}</h2>
        <p className="text-secondary-600">{UI.COMING_SOON || 'În curând'}</p>
      </div>

      <div className="bg-secondary-50 shadow-token rounded-token-lg p-token-lg mb-token-lg">
        <h2 className="text-xl font-semibold text-primary-600 mb-token">{UI.DATA_EXPORT || 'Export date'}</h2>
        <p className="text-secondary-600">{UI.COMING_SOON || 'În curând'}</p>
      </div>

      {/* Secțiunea Cont Utilizator - NOU */}
      <div className="bg-secondary-50 shadow-token rounded-token-lg p-token-lg mb-token-lg">
        <h2 className="text-xl font-semibold text-primary-600 mb-token">{UI.ACCOUNT_SETTINGS || 'Setări Cont'}</h2>
        <p className="mb-token text-neutral-600">{UI.ACCOUNT_LOGOUT_DESCRIPTION || 'Deconectează-te de la contul tău.'}</p>
        <button
          onClick={handleLogout}
          className="btn btn-danger" // Stil pentru logout, asigură-te că .btn-danger este definit în index.css
          data-testid="logout-btn"
        >
          {UI.LOGOUT_BUTTON || 'Logout'}
        </button>
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
