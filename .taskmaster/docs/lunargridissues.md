 ideea e ca nu vrrau planning in vid, vreau sa ne asiguram ca avem idee despre toate constantele, functiile, parametrii, clasele etc pe care urmeaza sa le folosim nu sa le presupunem sa sa le inventam. mai mult, sa ne asiguram ca modificarile sunt safe, nu afecteaza negativ resrul aplicatiei sau mai rau sa scoatem functionalitate existenta. daia trebuie luat totul mega atent si incremental

Si sa folosim si cautam induatry best practice cand zic best practices, nu over engineering, nu enterprise level shit. sa fie robust, usor de implementat si util si performantt. suntem o aplicatie edie facut de un om cu ai. nu avem nevoie de enterprize grade sit sau academic.

Probleme gasite in urma migrarii la CVA si trebuie fixate ca sa ne putem pregati pentru development masiv pe aceasta componenta. 
Trebuie sa ne asiguram ca tinem cont de toate regulile proiectului, memorii, best practices, sistemele desvoltate gen CVA si dependinte, etc. 

Issues;
- Add Category nu mai apare in grid cand expandez categoriile, nu mai am optiunea sa adaug o subcategorie
- cand dau hover pe subcategorii apare iconita de edit, intra in edit mode dar daca modific numele si dau ok, nu se salveaza
- toate cifrele din grid nu mai sunt color coded cum trebuia. Un fel de rosu pentru cheltuieli, un verde mai deschis pentru venituri si albastru pentru investitii etc. 
- in subcategoriile custom, daca incerc sa sterg una din grid, nu merge. 
- pot da click si sa interactionez cu sumele totale ale fiecarei categorii, desi nu ar trebui sa pot face asta. nu ma refer la cele din headerul tabelului ci la cele de la fiecare categorie. fiecare face totalul sumelor din subcategoriile lor si nu ar trebui sa pot interactiona cu ele
- cand dau click pe orice celula de subcategorie, nu se mai deschide modalul. se face totul putin spre negru dar nu apare nimic si trebuie sa dau escape ca sa ies din el. deci prin urmare nu mai pot interactiona deloc cu gridul
- pare ca sunt mai multe containere ale gridului unul intr-altul. vad 3 bare de scroll cand ma uit la tabel, cee ce  este foarte ciodat. 
- in colt dreapta sus apare si o iconita de expand care flickere, este functinala dar apare peste dropdownul de luna si an si este extrem de enervanta. practic este si functionalotate dublata, ca avem deja buton de fullscreen etc. trebuie sa pastram una din ele, as merge pe iconita ca e mai subtila dar oricum, trebuie investigat. 
- apar 2 iconite sagetute > in dreptul fiecarei categorii care are ambele au si tooltip de extinde categoria. trebuie pastrata una din ele. 
- coloana de categorii nu mai este fixa la scroll orizontal cum era inainte. 
- cifrele de la balanta zilnica nu sunt centrate in grid ci sunt spre dreapta. mai mult, sunt toate verzi si pare ca au un font diferit si de dimensiune mai mica decat restul tabelului, arata urat. 
- mai sunt in nav bar inca 2 titluri care trebuie scoase ca nu mai sunt de actualitate, Enhanced Lunar Grid si Lunar Grid Enhanced.

Toate astea trebuie fixate inainte s amergem mai departe si odata ce mai deblocam functionalitate, gen modal, editare, adaugare categorie etc, sa vedem ce alte buguri mai gasim, mai mult ca sigur o sa trebuiasca sa extindem taskurile. 

Inca odata vreau sa ma repedt, trebuie lucrat cu atentie, incremental, tinand cont de toate regulile, memoriile etc. Vreau sa se faca research properly inainte de fiecare implementare si sa ne asiguram ca taskurile contin toate informatiile din acest document si nu rataam niimic, inclusiv partea cu regulile, memoriile, best practices etc. 