naliză componente UI și clase CSS hardcodate
Mai jos enumerăm fiecare componentă UI relevantă (.tsx/.ts) din frontend/src care sunt afișate în interfață și listăm clasele CSS hardcodate (de exemplu în atributul className). Pentru fiecare clasă indicăm fișierul și linia, apoi comentăm dacă ar trebui mutată într-un CVA. Ulterior propunem extinderi ale CVA existente (noi variante, tokeni, primitive).
App (frontend/src/App.tsx)
Clase hardcodate:
min-h-screen flex items-center justify-center – apare în <div className={cn(dashboard(...), "...")}>
GitHub
.
flex flex-row gap-8 justify-start – în <div className="flex flex-row gap-8 justify-start">
GitHub
.
border-b border-gray-200 mb-6 pb-4 – tot în <div> pentru nav header
GitHub
.
Comentariu: Clasele de layout/flex pot fi migrate în CVA (ex. folosirea unei primitive flex cu props direction="row", justify="between", align="center"). Clasele de spacing (gap-8, mb-6, pb-4) și bordură (border-b border-gray-200) ar putea deveni varianta sau token pe componentele de layout. De exemplu un CVA de tip „header” sau variante pe Container/FlexLayout.
Pagina tranzacții (frontend/src/pages/TransactionsPage.tsx)
Clase hardcodate:
text-3xl font-bold text-gray-900 mb-6 – titlul paginii <h1>
GitHub
.
mb-4 – pe <Alert className="mb-4">
GitHub
.
mb-6 – repetat pe trei elemente <div className={cn(card(...),"mb-6")}> (form, filtre, export)
GitHub
.
flex flex-col space-y-4 – pe containerul <div className="flex flex-col space-y-4"> al tabelului
GitHub
.
Comentariu: Titlul (text-3xl font-bold text-gray-900) și alerta (mb-4) sunt stiluri specific tipografiei și spacing. Ar fi potrivit să le mutăm în tokeni (de exemplu tokenuri pentru culori text-carbon-900 etc.) și variante CVA (ex. heading variant). Clasele mb-6 apar frecvent pe carduri și pot deveni varianta padded sau o proprietate spacing="md" pe card. Structura tabel (flex-col + space-y) poate fi acoperită de un CVA flexLayout sau similar.
Pagina opțiuni (frontend/src/pages/OptionsPage.tsx)
Clase hardcodate:
min-h-screen pt-8 – pe containerul principal <div className={cn(dashboard(...),"min-h-screen pt-8")}> (atât pentru utilizator ne-autentificat, cât și pentru cel autentificat)
GitHub
GitHub
.
Titluri: text-3xl font-bold text-gray-900 mb-6 (pentru modul ne-autentificat)
GitHub
 și text-3xl font-bold text-gray-900 mb-8 (titlu principal)
GitHub
.
Carduri section: p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg – pe headerul fiecărui card (categorie, afișare, export, reset)
GitHub
GitHub
GitHub
.
Subsecțiuni head: text-lg font-semibold text-gray-900 (titlurile H2 din card)
GitHub
GitHub
.
Paragrafe de descriere: text-gray-600 mb-4 și text-gray-500 italic (descrieri și „coming soon”)
GitHub
GitHub
.
Card reset: p-4 border-b border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-t-lg (header roșu)
GitHub
; titlu reset text-lg font-semibold text-red-900 dark:text-red-100
GitHub
.
Liste și borduri: flex flex-col gap-4 pe container reset, border border-carbon-200 dark:border-carbon-700 rounded-lg p-4 bg-carbon-50 dark:bg-carbon-900 pe subcard
GitHub
.
Texte din reset: combinații de clase (e.g. text-xs text-blue-700 dark:text-blue-300, font-semibold etc.) în interiorul <div> info
GitHub
GitHub
.
Overlays/Loading în reset: mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg și flex items-center pentru indicator
GitHub
.
Setări cont (ultim card): p-4 border-b border-carbon-200 dark:border-carbon-700 bg-carbon-50 dark:bg-carbon-900 rounded-t-lg header
GitHub
; titlu cont text-lg font-semibold text-carbon-900 dark:text-carbon-100
GitHub
; liste personal și logout cu borduri colorate (ex. border border-carbon-200 ..., bg-carbon-50, border-orange-200 ..., bg-orange-50 etc.)
GitHub
GitHub
.
Comentariu: Sunt multe stiluri repetate între carduri. De exemplu, header-ul de card (p-4, border-b, border-gray-200, bg-gray-50, rounded-t-lg) ar trebui un variant CVA, cum ar fi card({ variant: "elevated", hasHeader: true }). Titlurile cardurilor (H2) sunt consecvente (text-lg font-semibold text-carbon-900), deci pot fi unificare de token/text style. Clasele de culoare (gray, red, carbon, orange) ar trebui tokenizate (ex. culori neutre vs periculoase). Clasele de spacing (mb-4, space-y-4, gap-4) pot fi varianta pe container CVA (ex. Container cu spacing). Structurile repetitive (flex, gap) pot fi acoperite de flex CVA în loc de clase manuale.
Pagini autentificare (frontend/src/components/features/Auth)
LoginForm.tsx:
<form> container: w-full max-w-md mx-auto
GitHub
.
Header <div>: px-6 py-4 border-b border-gray-200, și <h2> cu text-xl font-semibold text-gray-900
GitHub
.
Form content: <div className="p-6 space-y-4">
GitHub
.
Submit buton: className="w-full"
GitHub
.
Link to register: text-blue-600 hover:text-blue-700 pe <Link>
GitHub
.
RegisterForm.tsx:
Similar pattern: form container w-full max-w-md mx-auto
GitHub
.
Header px-6 py-4 border-b border-gray-200, <h2> cu text-xl font-semibold text-gray-900
GitHub
.
Form content p-6 space-y-4
GitHub
.
Submit buton className="w-full"
GitHub
.
Link to login: text-blue-600 hover:text-blue-700
GitHub
.
Comentariu: Layoutul comun (formular centrat, header + listă de câmpuri) indică necesitatea unui container CVA (sau o variantă pe form sau card) care să includă max-w-md mx-auto și padding. Headerul are stil consistent – poate fi un heading variant CVA. Clasele px-6 py-4 border-b border-gray-200 apar identic – ar putea fi parte dintr-un CVA CardHeader. Culorile albastru pentru link-uri ar trebui un token sau variantă pe button({variant:'ghost'}) (deja folosit în CVA la link). De asemenea w-full pentru buton se poate obține prin variante CVA.
Componente de funcționalitate
TransactionForm (features/TransactionForm.tsx):
Loading states: <div className="flex justify-center items-center p-4"> (două apariții)
GitHub
GitHub
.
Form container: className={cn(formGroup({ variant: "default" }), "space-y-6")}
GitHub
 (deci space-y-6).
Titlu form: wrapper <div className={cn("flex flex-row justify-between items-center")}> și <h3 className="text-lg font-medium text-gray-900">
GitHub
.
Grup tipuri: <div className="space-y-4"> pentru select tip tranzacție
GitHub
.
Grid de câmpuri: <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
GitHub
.
Checkbox + badge: <div className="flex items-center gap-3">
GitHub
 și <Badge> intern (nu are clase hardcodate).
Descriere: <div className="col-span-full"> pe <Input>#descriere
GitHub
.
Butoane: <div className={cn("flex flex-row justify-between items-center")}>
GitHub
.
Comentariu: Multe clase de layout flex și grid se repetă. Ar fi util să folosim componente CVA de layout: de exemplu, în loc de grid grid-cols-1 md:grid-cols-2 gap-4 am putea avea un CVA Grid cu prop cols={{ base:1, md:2 }} și gap="4". Similar, flex flex-row justify-between items-center se poate exprima cu un CVA Flex (sau Stack). Stylurile text (text-lg font-medium text-gray-900) ar putea fi tokenizate. space-y-* în formGroup poate fi convertit în proprietate spacing="md" pe FormGroup CVA.
TransactionTable (features/TransactionTable.tsx):
Card container: className={cn(card({ variant: "default" }), "w-full overflow-hidden")}
GitHub
.
Overlay fetching: <div className="absolute inset-0 bg-background/80 dark:bg-surface-dark/80 backdrop-blur-sm z-10 flex items-center justify-center">
GitHub
 și interior <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background dark:bg-surface-dark shadow-lg border border-neutral/20 dark:border-neutral-600/30">
GitHub
.
Loading/empty rows: în <td>-uri se repetă p-4 text-center border-b border-neutral/20 dark:border-neutral-600/30 (apare în loadingRow și loadingMoreRow)
GitHub
GitHub
.
Întreg tabel: <table className={cn("w-full border-collapse")}>
GitHub
.
Header <tr>: className="border-b border-neutral/20 dark:border-neutral-600/30"
GitHub
.
Fiecare <th> header: className={cn("text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10")}
GitHub
 (stânga-aliniat, fundal ușor). Apare pentru fiecare coloană.
Rânduri: <tr> cu className={hoverBackground({variant:"subtle"})} – (CVA existent!). <td> pentru date, descrieri etc: className="p-4 border-b border-neutral/20 dark:border-neutral-600/30"
GitHub
.
Celule speciale: <span className="font-medium"> pentru sumă
GitHub
. Pentru câmpurile recurente/frecvență se folosesc <Badge> fără clase hardcodate (doar variant CVA).
Footer tabel: <div className={cn("flex flex-row justify-between items-center p-4 border-t border-neutral/20 dark:border-neutral-600/30")}>
GitHub
; conține <span className="text-neutral-600 dark:text-neutral-400 text-sm">
GitHub
 și un <Button variant="ghost"> (fără clasă suplimentară).
Comentariu: Tabelul folosește deja variante CVA pentru card și background hover. Restul claselor (padding, border, text align) ar putea fi preluate în variante CVA ale componentelor de tabel. De ex. CVA Table, Tr, Th, Td cu props predefinite pentru padding și bordură. Culorile neutre (neutral-700 etc.) ar trebui tokenizate (text-carbon-700 etc.). Flex-ul din footer poate fi înlocuit cu un CVA FlexLayout.
TransactionFilters (features/TransactionFilters.tsx):
Container filtru compact: <div className={cn("flex flex-row justify-between items-center gap-4")}>
GitHub
.
Secțiune filtre principale: <div className={cn("flex flex-row justify-start items-center gap-4")}>
GitHub
 (conține Selecturi).
Secțiune acțiuni: <div className={cn("flex flex-row justify-end items-center gap-4")}>
GitHub
 (conține Input și butoane).
Filtre avansate (container CVA): <div className={cn(card({ variant: "default" }), "mt-4 p-4 space-y-4")}>
GitHub
.
Comentariu: Și aici se folosesc mult flex și gap. În loc de classNames, se poate utiliza flexLayout({ justify: "between", align: "center", gap: 4 }) sau similar. Containerul filtrului avansat ar putea fi un Card CVA cu o variantă padded. Clasa mt-4 p-4 space-y-4 ar putea fi gestionată prin props (e.g. padded, spacing).
CategoryEditor (features/CategoryEditor.tsx):
Overlay și modal: className={cn(modal({ variant: "overlay" }))} și className={cn(modalContainer())}, className={cn(modalContent({ size: "xl", padding: "none" }))}
GitHub
 (folosește deja CVA modal).
Titlu modal: <h2 className="text-xl font-bold text-carbon-900 dark:text-carbon-100">
GitHub
.
Buton închidere: <button> cu multe clase: text-carbon-400 dark:text-carbon-500 hover:text-carbon-600 dark:hover:text-carbon-300 transition-colors duration-150 p-2 rounded-md hover:bg-carbon-100 dark:hover:bg-carbon-800
GitHub
.
Conținut modal: <div className="p-6"> și <Alert className="mb-4"> pentru erori
GitHub
.
Secțiunea categorii/subcategorii: <div className="flex flex-row gap-12 justify-between h-full">
GitHub
. Apoi fiecare coloană are className={cn(card({ variant: "default" }), "flex-1")}
GitHub
. Titluri h3: text-lg font-semibold text-carbon-900 dark:text-carbon-100 mb-4
GitHub
.
Lista categorii: <ul className="divide-y divide-carbon-200 dark:divide-carbon-700">
GitHub
 și <li className={cn("p-3 hover:bg-carbon-100 dark:hover:bg-carbon-800 transition-colors duration-150", selectedCategory === cat.name && "...border-copper...")}>
GitHub
.
Butoane și câmpuri: <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 mb-4"> pentru subtitluri secțiuni
GitHub
, texte colorate condiționat.
Comentariu: În mare parte, elementele modale și de listă sunt deja acoperite de CVA (modal, card). Clasele precum text-xl font-bold, text-lg font-semibold pot fi în tokenuri. Comportamentele de hover și culoare din lista categorii sugerează adăugarea de variante CVA la elementele de listă sau folosirea repetată a clasei hoverBackground. Diviziunea cu divide-y poate fi un token sau variantă CVA. Colturile rotunjite și padding-urile cardurilor sunt în CVA.
Propuneri CVA și tokeni
Variante noi CVA:
Card/Form Variant: un variant card({ variant: "form" }) care include w-full max-w-md mx-auto și padding intern, folosit de formularele de Login/Registru și poate de cardurile din TransactionForm.
Card Header: un variant header pe card care să includă padding și border-b sau fundal (p-4 border-b border-gray-200 bg-gray-50).
Flex/Stack: mai mulți aliasuri CVA pentru contenitore flexibile. De exemplu flexLayout({ justify: "between", align: "center", gap: 4 }) în loc de flex flex-row justify-between items-center gap-4. Sau un primitive Stack pentru space-y.
Typographic Variants: definirea de variante CVA pentru titluri (text-3xl, text-xl, font-bold etc.) și paragrafe (text-gray-600, text-xs, italic), eventual ca tokenuri sau textProfessional existente.
Background/Border Variants: în loc de repetarea claselor border-b border-neutral/20 dark:border-neutral-600/30, se pot crea variante CVA pe elemente de tabel și card cu același border și culoare background (e.g. hoverBackground({ variant:"subtle" }) există deja pentru rând, la fel poate fi făcut pentru header).
Button/Link Colors: clasele text-blue-600 hover:text-blue-700 utilizate la link-uri indică nevoia unui token de culoare primară (primary) sau un variant button({ variant:"ghost" }) (folosit deja). La nevoie, se pot defini tokeni de culoare blue-600, blue-700.
Tokeni de culoare/font:
Unificarea claselor de culoare: multe apariții de text-gray-900, text-carbon-900, text-gray-600, text-gray-500. Ideal ar fi folosirea tokenilor designului (carbon-900, carbon-600 etc.) peste tot. Class variance și CVA ar trebui să accepte acești tokeni.
Culoarea roșie de reset (text-red-900, bg-red-50, border-red-200) poate fi tokenizată (danger-900, danger-50). Similar portocaliul de logout poate fi token warn-900, warn-50.
Pentru fonturi și spacing, unde sunt repeated (ex. text-xl, text-lg, margini mb-4, gap-4), putem asocia tokeni sau scale (ex. fontSize="xl", spacing="md").
Primitive noi/îmbunătățite:
Posibil un Grid CVA cu breakpoint-uri, pentru layout-ul formularului de tranzacții, în loc de manual grid-cols-1 md:grid-cols-2.
Un Stack/Space CVA (vertical layout) pentru space-y-4/6, pentru formulare, carduri etc.
Input/Select CVA – deja există, dar tokenizarea placeholder-urilor și label-urilor poate fi îmbunătățită (ex. clasă pentru input cu tip date care să ascundă iconița de calendar, etc.).
Badge CVA – deja folosit cu variante primary, secondary, warning. Dacă apar frecvent poziționări absolute (ca în LunarGrid), ar putea fi creată o variantă de „popup” sau utilitar poziționare în container.
Alert CVA – în loc să scriem className="mb-4", putem adăuga o variantă spacing="md" pe Alert.
În concluzie, multe din clasele hardcodate repetate pot fi acoperite de sistemul CVA existent sau extins. De exemplu, în loc de hardcodarea layout-urilor flex și grid, folosim componente CVA de layout cu props; pentru culoare și font folosim tokeni (carbon-###, danger-### etc.); marginile și paddingurile frecvente devin variante CVA.