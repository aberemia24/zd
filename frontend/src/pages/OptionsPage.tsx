import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { CategoryEditor } from '../components/features/CategoryEditor';
import { UI } from '@shared-constants/ui';
import { Button } from '../components/primitives/Button';
import Alert from '../components/primitives/Alert';
import { getEnhancedComponentClasses } from '../styles/themeUtils';

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
      <div className={getEnhancedComponentClasses('container', 'primary', 'lg', undefined, ['fade-in', 'page-wrapper'])} data-testid="options-page-not-logged">
        <h1 className={getEnhancedComponentClasses('form-label', 'primary', 'xl', undefined, ['gradient-text-subtle', 'mb-token'])}>
          {UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}
        </h1>
        <Alert
          type="warning"
          message={UI.LOGIN_REQUIRED || 'Trebuie să fiți autentificat pentru a accesa această pagină.'}
          data-testid="options-alert-not-logged"
          withFadeIn
          withAccentBorder
          withShadow
          withIcon
        />
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
    <div className={getEnhancedComponentClasses('container', 'primary', 'lg', undefined, ['fade-in', 'page-wrapper'])} data-testid="options-page">
      <h1 className={getEnhancedComponentClasses('form-label', 'primary', 'xl', undefined, ['gradient-text-subtle', 'mb-token'])} data-testid="options-title">
        {UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}
      </h1>
      
      {/* Secțiunea de gestionare categorii */}
      <div className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['shadow-md', 'mb-token'])}>
        <div className={getEnhancedComponentClasses('card-header', undefined, undefined, undefined, ['gradient-bg-subtle'])}>
          <h2 className={getEnhancedComponentClasses('form-label', 'secondary', 'md')}>{UI.CATEGORY_MANAGEMENT || 'Gestionare categorii'}</h2>
        </div>
        <div className={getEnhancedComponentClasses('card-body')}>
          <p className="mb-token">{UI.CATEGORY_MANAGEMENT_DESCRIPTION || 'Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.'}</p>
          <Button
            variant="primary"
            size="md"
            withShadow
            dataTestId="open-category-editor-btn"
            onClick={() => setShowCategoryEditor(true)}
          >
            {UI.MANAGE_CATEGORIES || 'Gestionare categorii'}
          </Button>
        </div>
      </div>

      {/* Alte secțiuni de opțiuni */}
      <div className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['shadow-md', 'mb-token'])}>
        <div className={getEnhancedComponentClasses('card-header')}>
          <h2 className={getEnhancedComponentClasses('form-label', 'secondary', 'md')}>{UI.DISPLAY_OPTIONS || 'Opțiuni de afișare'}</h2>
        </div>
        <div className={getEnhancedComponentClasses('card-body')}>
          <p className={getEnhancedComponentClasses('text', 'accent')}>{UI.COMING_SOON || 'În curând'}</p>
        </div>
      </div>

      <div className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['shadow-md', 'mb-token'])}>
        <div className={getEnhancedComponentClasses('card-header')}>
          <h2 className={getEnhancedComponentClasses('form-label', 'secondary', 'md')}>{UI.DATA_EXPORT || 'Export date'}</h2>
        </div>
        <div className={getEnhancedComponentClasses('card-body')}>
          <p className={getEnhancedComponentClasses('text', 'accent')}>{UI.COMING_SOON || 'În curând'}</p>
        </div>
      </div>

      {/* Secțiunea Cont Utilizator */}
      <div className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['shadow-md', 'mb-token'])}>
        <div className={getEnhancedComponentClasses('card-header')}>
          <h2 className={getEnhancedComponentClasses('form-label', 'secondary', 'md')}>{UI.ACCOUNT_SETTINGS || 'Setări Cont'}</h2>
        </div>
        <div className={getEnhancedComponentClasses('card-body')}>
          <p className={getEnhancedComponentClasses('text', 'accent')}>{UI.ACCOUNT_LOGOUT_DESCRIPTION || 'Deconectează-te de la contul tău.'}</p>
          <Button
            variant="danger"
            size="md"
            withShadow
            withGradient
            dataTestId="logout-btn"
            onClick={handleLogout}
          >
            {UI.LOGOUT_BUTTON || 'Logout'}
          </Button>
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
