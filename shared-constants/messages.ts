// Toate mesajele de utilizator
// Mesaje de validare și succes/eroare pentru aplicație (localizabile)
export const MESAJE = {
  // Autentificare
  LOGIN_SUCCES: 'Autentificare reușită! Bine ai revenit.',
  LOGIN_ERROR: 'Eroare la autentificare. Verifică emailul și parola.',
  LOGOUT_SUCCES: 'Te-ai delogat cu succes!',
  REGISTER_SUCCES: 'Cont creat! Verifică emailul pentru confirmare.',
  REGISTER_ERROR: 'Eroare la crearea contului. Încearcă din nou.',
  PAROLE_NECORESPUNZATOARE: 'Parolele nu coincid!',
  
  // Mesaje de validare backend
  INVALID_TYPE: 'Tip de tranzacție invalid!',
  INVALID_CATEGORY: 'Categorie invalidă!',
  MISSING_REQUIRED_FIELD: 'Câmp obligatoriu lipsă!',
  NOT_FOUND: 'Resursa nu a fost găsită!',
  SERVER_ERROR: 'Eroare internă server!',

  // Mesaje de succes backend
  TRANSACTION_CREATED: 'Tranzacție adăugată cu succes!',
  TRANSACTION_UPDATED: 'Tranzacție actualizată cu succes!',
  TRANSACTION_DELETED: 'Tranzacție ștearsă cu succes!',
  
  // Mesaje formular
  CAMPURI_OBLIGATORII: 'Completează toate câmpurile obligatorii',
  FRECV_RECURENTA: 'Selectează frecvența pentru tranzacție recurentă',
  AVERTISMENT_DATE: 'Datele introduse nu sunt valide sau complete.',
  
  // Mesaje pentru operațiuni CRUD
  EROARE_ADAUGARE: 'Eroare la adăugare',
  SUCCES_ADAUGARE: 'Tranzacție adăugată cu succes',
  SUCCES_EDITARE: 'Tranzacție editată cu succes',
  SUCCES_STERGERE: 'Tranzacție ștearsă cu succes',
  CONFIRMARE_STERGERE: 'Sigur vrei să ștergi această tranzacție? Această acțiune nu poate fi anulată.',
  
  // Mesaje generale de eroare
  EROARE_GENERALA: 'A apărut o eroare neașteptată. Încearcă din nou sau contactează suportul.',
  EROARE_TITLU: 'Eroare neașteptată',
  EROARE_FORMAT_DATE: 'Format de date invalid sau neașteptat de la server.',
  EROARE_NECUNOSCUTA: 'Eroare necunoscută',
  
  // Mesaje pentru store-ul de tranzacții
  EROARE_INCARCARE_TRANZACTII: 'Eroare la încărcarea tranzacțiilor',
  EROARE_SALVARE_TRANZACTIE: 'Eroare la salvarea tranzacției',
  EROARE_STERGERE_TRANZACTIE: 'Eroare la ștergerea tranzacției',
  LOG_EROARE_INCARCARE: 'Eroare la încărcarea tranzacțiilor:',
  LOG_EROARE_SALVARE: 'Eroare la salvarea tranzacției:',
  LOG_EROARE_STERGERE: 'Eroare la ștergerea tranzacției:',
  
  // Mesaje suplimentare pentru autentificare
  EROARE_AUTENTIFICARE: 'Date de autentificare incorecte.',
  EROARE_RLS: 'Acces interzis (RLS).',
  EROARE_RETEA: 'Eroare de rețea. Încearcă din nou.',
  PAROLA_PREA_SLABA: 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.',
  
  // Validare categorii și subcategorii
  EROARE_CATEGORIE_SUBCATEGORIE_INVALIDA: 'Categoria sau subcategoria nu este validă. Verificați categoriile disponibile în aplicație.',
  
  // Validare tranzacții și sume
  VALIDARE: {
    SUMA_INVALIDA: 'Suma introdusă nu este validă. Folosiți un format numeric corect (ex: 123.45).',
    FORMAT_DATE: 'Data introdusă nu are un format valid.',
    CAMP_LIPSA: 'Completați toate câmpurile obligatorii.',
  },

  // Mesaje pentru CategoryEditor
  CATEGORII: {
    NUME_GOL: 'Numele nu poate fi gol',
    SUBCATEGORIE_EXISTENTA: 'Există deja o subcategorie cu acest nume',
    EROARE_STERGERE: 'Eroare la ștergerea subcategoriei',
    NU_SE_POT_STERGE_PREDEFINITE: 'Nu se pot șterge subcategoriile predefinite, doar cele personalizate.',
    CONFIRMARE_STERGERE: 'Sigur doriți să ștergeți subcategoria {subcategoria} din categoria {categoria}? Această acțiune nu poate fi anulată.'
  },

  // Mesaje pentru Export
  EROARE_EXPORT: 'Eroare la exportul datelor',
  SUCCES_EXPORT: 'Datele au fost exportate cu succes',
  EXPORT_IN_PROGRES: 'Exportul este în curs de desfășurare...',
  EXPORT_FINALIZAT: 'Export finalizat cu succes'
};

// Mesaje pentru LunarGrid
export const LUNAR_GRID_MESSAGES = {
  EROARE_INCARCARE: 'Eroare la încărcarea datelor',
  EROARE_CREARE_TRANZACTIE: 'Eroare la crearea tranzacției',
  EROARE_ACTUALIZARE_TRANZACTIE: 'Eroare la actualizarea tranzacției',
  EROARE_STERGERE_TRANZACTIE: 'Eroare la ștergerea tranzacției'
};

// Mesaje pentru Export
export const EXPORT_MESSAGES = {
  EROARE_GENERALA: 'Eroare la export. Vă rugăm încercați din nou.',
  EROARE_FORMAT: 'Format de export nesuportat. Formatele acceptate sunt: CSV, Excel, PDF.',
  EROARE_DATE_INVALIDE: 'Datele pentru export sunt invalide sau incomplete.',
  EROARE_TIMEOUT: 'Timpul de export a expirat. Încercați un set mai mic de date.',
  
  SUCCES: 'Export finalizat cu succes!',
  IN_PROGRES: 'Export în curs... {progress}%',
  ANULAT: 'Export anulat.',
  
  CONFIRMARE_MULTE_RANDURI: 'Sunteți pe cale să exportați {count} înregistrări. Continuați?',
  SUGESTIE_FILTRARE: 'Pentru exporturi mai rapide, filtrați datele înainte de export.',
  
  SALVARE: 'Fișierul va fi salvat în directorul de descărcări.',
  DESCHIDERE: 'Fișierul se va deschide automat după export.'
};

// Mesaje pentru URL și filtre
export const URL_PERSISTENCE = {
  LINK_COPIAT: 'Link cu filtrele curente copiat în clipboard!',
  LINK_NEGASIT: 'Nu s-au putut încărca filtrele din URL.',
  FILTRE_RESETATE: 'Filtrele au fost resetate.',
  FILTRE_INVALIDE: 'Unele filtre din URL nu sunt valide și au fost ignorate.',
  FILTRE_INCARCATE: 'Filtrele au fost încărcate din URL.',
  FILTRE_SALVATE: 'Filtrele au fost salvate în URL.'
};
