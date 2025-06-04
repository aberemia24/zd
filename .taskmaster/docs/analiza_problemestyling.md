Audit al sistemului de styling
1. Modalele – implementare și comportament
În codul actual, fiecare modal este realizat ca un overlay fixed inset-0 cu conținut centrat. De exemplu, CategoryEditor folosește o div cu fixed inset-0 ... flex items-center justify-center z-50
GitHub
. Similar, TransactionModal are un overlay CVA care includă flex items-center justify-center
GitHub
, iar ExportModal (chiar dacă introduce handler-ul handleOverlayClick) nu îl atașează pe containerul overlay şi tot ia fixed inset-0 ... justify-center manual
GitHub
. În general, centrare orizontală și verticală este tratată prin clase Tailwind (ex. justify-center, items-center) fie declarativ, fie prin CVA (modal({ variant: "default" }) conține deja flex items-center justify-center
GitHub
). Cu toate acestea, există inconsistențe în comportament: only TransactionModal gestionează click pe fundal pentru închidere (onClick={handleBackgroundClick}) și apăsarea tastei Esc (onKeyDown={handleKeyDown})
GitHub
GitHub
. În schimb, CategoryEditor tratează Esc prin event listener global (în useEffect)
GitHub
, dar nu închide la click pe overlay, iar ExportModal a definit un handler pentru click pe overlay dar nu îl folosește. De asemenea, niciun modal nu blochează scroll-ul paginii din spate (nu există cod de adăugare a overflow-hidden pe body). Observații: În toate cazurile ar ajuta un wrapper comun de modal sau hook care să realizeze automat comportamentele standard: centrare (CVA modal), scroll-lock pe deschidere, închidere la Esc și la click în afara conținutului. De exemplu, TransactionModal arată modelul ideal: <div className={cn(modal({variant:"default"}))} onClick={handleBackgroundClick} onKeyDown={handleKeyDown} ...>
GitHub
GitHub
. Ar fi recomandat să implementăm un hook unificat (sau componentă Modal) care să adauge/elimine clasa overflow-hidden pe document.body, să asculte Esc și click-uri globale pentru a apela onClose, și apoi să extindă CVA (modal, modalContent) pentru stil.
2. Aliniere în CategoryEditor
Din cod, containerul modal CategoryEditor ar trebui să fie centrat pe ecran (folosește flex justify-center items-center)
GitHub
. Totuși, s-a semnalat un problema de aliniere la stânga. Analizând componenta, vedem că div-ul interior are clase max-w-4xl w-full mx-4, deci conținutul ar trebui să fie centrat și să nu depășească 4xl lățime
GitHub
. În plus, antetul modalului este un flex justify-between, cu titlul în stânga și butonul de închidere în dreapta
GitHub
, ceea ce este normal. Dacă apare o aliniere nedorită, e posibil fie un stil moștenit (e.g. un padding neuniform), fie clasa justify-center nu se aplică (deși ar trebui). Sugestii: Verificați dacă modal({ variant: "default" }) (din CVA) și clasele manuale fixed inset-0 ... justify-center nu intră în conflict. De exemplu, se pot elimina clasele manuale duplicate deoarece CVA modal deja conține fixed inset-0 flex items-center justify-center
GitHub
. Dacă tot persistă un dezechilibru (ex. pe mobile), se poate adăuga o clasă gen mx-auto pe containerul interior sau ajusta max-w și marginile la ambele părți. Altfel, dacă se refactorizează după un Modal generic, centrările se vor păstra uniform.
3. Consistența Tailwind + CVA
În multe componente se observă un mix de clase Tailwind “hardcodate” și apeluri CVA. De pildă, CategoryEditor folosește card({ variant: "elevated", size: "sm" }) pentru containerul galben de confirmare, dar adaugă manual bg-yellow-50 border-yellow-200 border-l-4 ... rounded-lg
GitHub
. Similar, header-ul listelor de categorii are <h3 className="text-lg font-semibold text-gray-900 mb-4">, direct în JSX, deși CVA ar putea furniza un stil de header consistent. Modul de a combina CVA cu clase brute duce la redundanță și inconsistență: unele nuanțe de culoare (ex. text-yellow-800 vs text-gray-900) nu sunt capturate de tokens comuni, iar diferiți autori folosesc stiluri diferite (yellow pentru avertismente, gray pentru text normal, etc.). Observații: Pentru un design coerent, ar trebui să definim stări și culori direct în sistemul de tokeni/CVA. De exemplu, card oferă variante (flat, elevated), iar textul ar trebui să fie consistent cu tokenii de tipografie. Pot fi adăugate variante noi în CVA (ex. un alert sau un message colorat) în loc să se scrie bg-yellow-50 ... manual. A se vedea stilurile CVA deja definite: în layout.ts, modal({variant:"default"}) dă bg-black/50 cu blur
GitHub
, în timp ce implementările ad-hoc în JSX folosesc bg-black bg-opacity-50. Recomandăm să migrați gradual toate stilurile fixe (padding, margin, culori) în CVA/primitives și să eliminați Tailwind hardcodate din JSX (așa cum recomandă și planul de migrare
GitHub
). De exemplu, în loc de <span className="text-primary-600 font-normal">, folosiți CVA sau un token definit pentru culoare “primary”.
4. Cod redundant și stiluri vechi
S-au identificat mai multe fragmente redundante. De exemplu, CategoryEditor definește în modalState și o proprietate animationClass care nu este folosită nicăieri
GitHub
. Structura modalState = { visible, animationClass } e inutilă dacă nu este aplicată la clasa CSS. De asemenea, multe clase Tailwind sunt dublate: apelul modal({variant:"default"}) adaugă deja fixed inset-0 flex items-center justify-center
GitHub
, dar codul reintroduce aceleași clase manual
GitHub
. Astfel, pot exista stiluri moștenite nefolosite (de pildă variante de modal.animation) și cod comentat sau definit dar neutilizat (ex. inline-ul style={{ maxHeight: 300 }} ar putea fi înlocuit cu o clasă utilitară). Pe lângă acestea, sistemul vechi de styling (menționat în doc: “componentMap”, “unified-cva” etc.) pare parțial abandonat dar încă incurcă codul: unele ghiduri interne cer eliminarea totală a claselor în JSX
GitHub
, dar codul actual le folosește încă. Se recomandă o curățenie generală: căutați clase Tailwind rămase (e.g. container, grid, text-yellow-XXX), verificați dacă există stiluri duplicat (foldere styles/ vechi) și eliminați-le sau migrați în CVA. De asemenea, dacă există fișiere CSS sau vechi tip CSS-in-JS care nu mai sunt folosite, acestea pot fi șterse.
5. Arhitectura generală de styling
Arhitectura actuală este bazată pe CVA modular (pachete separate precum layout.ts, forms.ts, etc.) și pe componente “primitive” (Button, Input, Badge). Aceasta este o abordare solidă pentru separarea preocupărilor: stilurile de bază și tokenii sunt definite în fișierele din styles/cva/, iar componentele recunoscute pot fi refolosite în întreaga aplicație. De exemplu, layout.ts definește generici precum card, container, flex
GitHub
GitHub
, iar formularele au input, button, select în styles/cva/components/forms. Cu toate acestea, există o oarecare duplicitate de abstracție: există și un set CVA mai vechi pentru “TransactionModal” (styles/cva/components/modal.ts) care definește transactionModalOverlay și transactionModalContent
GitHub
GitHub
, folosit de unele modale (e.g. QuickAddModal folosește transactionModalOverlay
GitHub
). Ideal ar fi să unificăm aceste modele, folosind un singur sistem CVA pentru toate modalurile (dacă se dorește stiluri unice la modale de tranzacții, se poate extinde modal cu variante). De asemenea, arhitectura ar fi îmbunătățită dacă definițiile CVA s-ar reflecta întotdeauna în apelurile din JSX (astfel că, de exemplu, dacă un buton primitiv schimbă paddingul, să nu mai fie nevoie de className="min-w-[90px]" în codul de conținut
GitHub
 – această clasă ar putea fi specificată în componenta Button sau printr-un prop CVA). În concluzie, separarea responsabilităților este în mare parte bună (tokenii și variațiile stau în styles/cva/, layout-ul de bază în primitives și componente), dar implementarea actuală nu este întotdeauna consistentă. S-ar putea consolida “layerizarea” astfel: (a) Tokens (culori, spațieri etc.) și cva utilities – definite central, (b) Componente primitive preconfigurate (Button, Input, Alert) care să primească props de variantă, (c) Componente de feature care să nu conțină stiluri “la mână” ci să combine componente primitive/CVA. Astfel, noile modificări vor fi mai ușor de aplicat și urmărit.
6. Recomandări pentru îmbunătățiri
Modal Wrapper Comun: Implementați o componentă sau hook generic Modal care să realizeze comportamentul standard (centrare cu CVA, lock scroll, închidere la Esc/overlay). Aceasta poate primi visible, onClose și conținutul copil. Înlocuiți codul dublat din CategoryEditor, ExportModal etc. cu acest wrapper. (Exemplu: TransactionModal demonstrează cum se poate face un modal complet închis la Esc și click pe fundal
GitHub
GitHub
.)
Eliminați clasele redundante: În CategoryEditor și altele, scăpați de clasele “manuale” deja acoperite de CVA. De pildă, nu mai combinați modal({variant}) cu fixed inset-0 ...; folosiți doar una. În layout.ts, modal({variant:"default"}) include deja fundalul întunecat și blur
GitHub
. Automatizați culorile (ex. în loc de bg-black bg-opacity-50, preferați bg-black/50 sau o clasă de CVA).
Refactorizați CategoryEditor: Extrageți segmentele declarative în componente/pachete reutilizabile. De exemplu, DeleteConfirmation ar putea fi un modal propriu cu centrare, în loc să apară în layout-ul fix al editorului. Dacă rămâne inline, asigurați-vă că e poziționat clar (de ex. centrat în card-ul de subcategorii, sau ca un overlay intern cu flex items-center justify-center), altfel această “aliniere la stânga” semnalată rămâne nerezolvată.
Consistență în stiluri: Aduceți toate componentele în CVA. Dacă există stiluri similare (lista de categorii, butoane, bannere de avertizare etc.), definiți-le ca variante în CVA card, alert sau alt modul. De exemplu, bordura galbenă de avertisment din confirmarea ștergerii ar putea fi o variantă alert({ color: 'warning' }) în loc de bg-yellow-50 border-yellow-200 border-l-4 manual
GitHub
. Astfel codul JSX rămâne curat (<Alert variant="warning">...</Alert>).
Utilizați tokens și CVA integrat: Încercați să înlocuiți directivele CSS inline (ex. style={{ maxHeight: 300 }}) cu clase utilitare sau CVA. De asemenea, alegeți cu atenție paletele: fie rămâneți la gri/brand (“primary”) definite în Tailwind configurat, fie migrați complet la paleta “Carbon Copper” din design system (dacă s-a convenit schimbarea). Asigurați un limbaj de design consistent (toate direcțiile UI în @shared-constants/ui, mesajele din @shared-constants/messages, culori din tokens).
Curățare și prioritizare: Porniți o rundă de linting stilistic sau revizuire de cod pentru clase CSS. Marcați componentele implementate incomplet (ex. cele bifate ca TODO în planul de migrare
GitHub
) și rezolvați-le treptat. Prioritizați fixuri mici, cu impact mare: e.g. implementarea scroll-lock, fixarea centrelor de modal și eliminarea componentelor neutilizate. Documentați convenții interne (de ex. “toate modalele folosesc ModalWrapper”, “nu se mai folosesc culori inline”).
Prin aceste măsuri se va obține un sistem de styling mai previzibil și mai ușor de menținut. În rezumat, recomandăm coerență CVA/utility, deduplicare a stilurilor, unificarea comportamentului modal, și apoi rafinarea treptată a componentelor existente în conformitate cu ghidul de design al proiectului.