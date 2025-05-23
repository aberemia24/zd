import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { CategoryEditor } from '../components/features/CategoryEditor';
import { UI } from '@shared-constants/ui';
import { Button } from '../components/primitives/Button';
import Alert from '../components/primitives/Alert';
import { cn } from '../styles/new/shared/utils';
import { container, card, flex } from '../styles/new/components/layout';

/**
 * Pagina de opțiuni a aplicației
 * Conține setări și configurări pentru utilizator, inclusiv gestionarea categoriilor
 * Migrated to CVA styling system for consistency
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
      <div className={cn(container({ size: 'lg' }), 'min-h-screen pt-8')} data-testid="options-page-not-logged">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}
        </h1>
        <Alert
          type="warning"
          message={UI.LOGIN_REQUIRED || 'Trebuie să fiți autentificat pentru a accesa această pagină.'}
          dataTestId="options-alert-not-logged"
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
    <div className={cn(container({ size: 'lg' }), 'min-h-screen pt-8')} data-testid="options-page">
      <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="options-title">
        {UI.OPTIONS_PAGE_TITLE || 'Opțiuni'}
      </h1>
      
      {/* Secțiunea de gestionare categorii */}
      <div className={cn(card({ variant: 'elevated', size: 'lg' }), 'mb-6')}>
        <div className={cn(
          'p-4 border-b border-gray-200 bg-gray-50',
          'rounded-t-lg'
        )}>
          <h2 className="text-lg font-semibold text-gray-900">{UI.CATEGORY_MANAGEMENT || 'Gestionare categorii'}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{UI.CATEGORY_MANAGEMENT_DESCRIPTION || 'Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.'}</p>
          <Button
            variant="primary"
            size="md"
            dataTestId="open-category-editor-btn"
            onClick={() => setShowCategoryEditor(true)}
          >
            {UI.MANAGE_CATEGORIES || 'Gestionare categorii'}
          </Button>
        </div>
      </div>

      {/* Alte secțiuni de opțiuni */}
      <div className={cn(card({ variant: 'elevated', size: 'lg' }), 'mb-6')}>
        <div className={cn(
          'p-4 border-b border-gray-200 bg-gray-50',
          'rounded-t-lg'
        )}>
          <h2 className="text-lg font-semibold text-gray-900">{UI.DISPLAY_OPTIONS || 'Opțiuni de afișare'}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 italic">{UI.COMING_SOON || 'În curând'}</p>
        </div>
      </div>

      <div className={cn(card({ variant: 'elevated', size: 'lg' }), 'mb-6')}>
        <div className={cn(
          'p-4 border-b border-gray-200 bg-gray-50',
          'rounded-t-lg'
        )}>
          <h2 className="text-lg font-semibold text-gray-900">{UI.DATA_EXPORT || 'Export date'}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 italic">{UI.COMING_SOON || 'În curând'}</p>
        </div>
      </div>

      {/* Secțiunea Cont Utilizator */}
      <div className={cn(card({ variant: 'elevated', size: 'lg' }), 'mb-6')}>
        <div className={cn(
          'p-4 border-b border-gray-200 bg-gray-50',
          'rounded-t-lg'
        )}>
          <h2 className="text-lg font-semibold text-gray-900">{UI.ACCOUNT_SETTINGS || 'Setări Cont'}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{UI.ACCOUNT_LOGOUT_DESCRIPTION || 'Deconectează-te de la contul tău.'}</p>
          <Button
            variant="danger"
            size="md"
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
