Tanstack features:
Ce este deja implementat:
- tabelul unde apar categoriile colapsavile si sub ele subcategoriile
- apar cifrele tranzactiilor corespunzatoare subcategoriilor sindatilor in care au fost facute
- un total pe categorii/zi
- un sold overall al tuturor categoriilor pentru fiecare zi, undr aduna toate sumele indiferent daca e cheltuiala, venit etc dar momentan nu apare nimic in el for some reason, bug.  
- butoabe de a expanda/colapsa toate categoriile
- o modalutate basic de a schimba luna
- header coloana unde arata zilele lunii
- tabelul este sincrobizat cu celelalte componente indiferent de unde adaugi tranzactii se reflecta peste tot 

To do's si idei de features noi:
Toata ideea aceatei aplicatii nu este de doar un tracking de buget ci este axat pe planificare pe termen scurt (luna), mediu (luni sau 1 an), lung (mai mult de un an)
Sa stii in fiecare zi si daca te uiti overall cati bani o sa ai in fiecare zi, la sf de luna, la sf de an etc. Se bazeaza mult pe estimarile oamenilor. 
Ei trebuie sa isi puna toate veniturile de care stiu ei, fie cele recurente (salarii, chirii etc) altele oncr sau ocazionale etc
Sa isi puna toate cheltuielile de care stiu in tabel si estimari de ce cheltuieli au in luna sau anul respectiv, ce economii vor sa faca daca lr mai raman bani etc si asa, in sold sau whatever sa vada in fiecare zi cati bani au sau or sa aiba, la sf de luna etc.
Cam asta e ideea de bqza. 

Implementari propriuzise:
- sub fiecare zi din luna sa ai o cifra care sa reflecte banii curenti din cont - cheltuieli, sa vezi cati bani mai ai in fircare zi
- cand pui o cheltuiala nlua in tabel, sa se updateze si urmatoarele zile, luni etc sa reflecte nlua cheltuiala
- sa poti expanda/colapsa categorii individuale nu doar butoanele generale
- sa poti adauga categorii noi direct din tabel (un buton adauga subcategorie sub uktima subcategorie din lista unei categorii), dar maxim 5 per categorie (asta fiind o limita care trebuie implementata si in Category editor)
- mesaj clar ca nu mai poti adauga dupa 5, sau sa dispara butonul efectiv
- sa poti sterge direcr din tabel subcategoriile custom
- sa poti redenumi direct din tabel toate subcategoriile
- coloana de sus a tabelului cu datele e fixa, ceea ce e ok, dar ar trebui si coloana cu subcategoriile sa fie fixa ptr navigare usoara.
- tabelul ar trebui sa fie mai mare sau sa avem un mod de marit pe latimea paginii si unul de full screen sau ceva de genul. e mult prea mic acum si ar trebui sa fie si mai compact putin

- la un click nornal pe celula sa se deschida un modal sau ceva unde ai dat click unde sa ai camp cu suma, descriere, bifa de recurent sau nu, cu butonul de adauga disabled pana nu este corect tot ce faci acolo. Sa mearga sa dai ok si cu tasta enter
- tranzactia sa se adauge instant, fara refresh si sa ramai in locul unde ai adaugat, sa nu se reseteze pagina (e implementat deja )
- la dublu click pe o celula sa poti sa scrii direct in celula, cu posibilitatea sa o poti face recurenta dupa aceea daca dai simplu click pe ea sau sa ii adaugi descriere. acum aceasta implementare este la single click, nu avem modal deloc.  
- sa poti sa stergi direct o suma dintr-o celula, ori dand click si sa ai si o optiune de delete sau clear sau apasand delete sau backspace.  
- datile de sus ar trebui sa aiba si ziua dar si luna incluse, sa fie 1 - Iunie sau ceva de genul
- toate randurile sau coloanele ar trebui sa fie egale intre ele
- descrierea daca este adaugata ar trebui da se vada in tabelul de tranzagtii dar si in grid, dar nu stiu cun sa il faci sa arate frumos, poate la hover ca in excel? E prea complicat?
- tot ce e venit ar trebui sa fie cu verde in grid
- cheltuielile cu rosu. cand faci collapse in sold ar trebui sa iti arate totalul pe care il mai ai in cont dupa ce au fost sczute cheltuielile si adaugate veniturile pana atunci. 
- nu stiu cum sa pui economiile, ca teoretic tot o cheltuiala sunt dar nu pierzi banii, ii ai acolo, nu stou inca sigur cum ar trebui tratate, am nevoie de guidance aici
- investitiile ar trebui tratate ca o cheltuiala c apana la urma asta sunt
o sa trebuiasca sa iti poti pune soldul curent undeva si de acolo sa inceapa bugetul si toate operatiunile viitoare. practic soludl ala se v=a pune in sold in fiecare zi din luna si dupa aia incepi sa pui venituri si cheltuieli anticipate si soldul ala se v-a schimba, si asa vei vedea in fiecare zi din luna cati bani teoretic o sa mai ai, sau o sa fii pe minus deci tre sa ai grija cum iti pui cheltuielile in luna aia.  
- filtre pe grid? Cred ca ar fi ajutator dar nu stiu cat de grea ar fi implementarea. Piate si un search ar ajuta
- cand bifezi o tranzactie ca recurenta ar trebui sa se puna automat si pe lunile urmatoare, dar ideea fiind, lasam userul sa isi aleaga daca vrea asta sau perioada pe cat vrea? Dar si asta ar trebui da aiba o limita sa nu se faca automat pe 100 de ani sa creem milioane de tranzactii aiurea. Ar trebui da fie o limita, si aici trebuie vazut car3 e best practice la aplicatii similare. Daca nu e ceva similar, trebuie gandit un sistem smart. 
- momentan avem recurenta zilnica, weekly, montly si anual. Lasam si custom? Sau sa il lasam sa faca odata la 3 zile sau ceva de genul? Trebuie vazut cum e cel mai simplu si best practicr la alte aplicatii similare
- trebuie sa ne asiguram ca orice modificare se face in tabel se reflecta in toata aplicatia pentru ca or sa fie mai multe module csre or sa aiba date din asta pe langa category editor si Transaction Table. 
- tabelul trebuie sa fie cat mai curat, sa nu fie incarcat, usor de citit, celulele sa fie distincte si ovdrall sa fie clean dar sa arate profesionist si sa inspire incredere. 

- o sa mai fie un modul care o sa fie vizualizare pe ziua on curs sau ceva de genul, unde o sa bifezi daca ai facut cheltuielile estimate sau ai incadat banii planificati, daca ai facur o cheltuiala o bifezi acolo si o sa se taie, o sa trebuiasca sa se reflecte asta si in tabel. 
- la fel o sa ai posibikitatea sa spui cat a fost defapt cheltuiala vs cat ai estimat tu, eventual sa aratam si undeva daca se poate la sf de zi sau de luna cat de mult ai cheltuit sau nu vs cat ai estimat. Asa o sa te ajute sa o faci mai bine luna viitoare. Deci trebuie gandit si in tabel cum o sa arate asta
- daca o cheltuiala nu a fost facuta dar amanata, in tabel la fel trebuie sa se reflecte asta, sa de mute automat pe alta zi
- ar mai trebui si in functir de ce zi esti din luna, sa se reflecte si asta in tabel, ori sa highligtam in tabel coloana cu ziua curenta, ori sa facem ca un fade out la zilele trecute din tabelul lunar, sa le facem un greyed out ceva dar inca da se mai inteleaga cheltuielile facute.

Astea e wishlistul meu pentru tanstack, combinat cu pagina noua de care ziceam mai sus, cam asta o sa fie toata aplicatia more ror less. 
Dar ideea e ca sunt cam multe si nu stiu in ce ordine logica sa le fac, ce complexitate ar avea si ce merita si nu merita sa fac. eu m-as baga la toate sincer. 
De asmenea nu stiu dac aimi lipsesc alte chestii esentiale de care eu nu stiu. ma ajuti cu o cercetare aprofundata pe ce am deja acum si ce parere ai despre ce am zis mai sus?

Idea e ca nu stiu daca ar trebui sa implementez totul deodata sau sa o iau pe bucati logice. 
Am nevoie de o parere