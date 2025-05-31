Implementarile toate ar trebui sa respecte best practices ale proiectului, regulile proiectului. Sa avem grija la type errors, sa punem data-test ID, sa nu folosim texte si clase hardcodate, sa folosim shared constants si sistemul de CVA pentru styling. daca nu exista un text in constante, se adauga acolo mai intai
NU DORESC PLANNING IN VID si NICI IMPLEMENTARE IN VID. Vreau o analiza thoroigh inainte de planning si dupa planning sa ne asiguram ca nu am ratat absolut nimic din documentul asta si ca este intelease extrem de bine arhitectura si ce trebuie modificat si unde fara a strica nimic aktceva in alta parte. 
La fel inainte de implementare, doresc sa se verifice thoroigh ce e acolo, ce avem nevoie din shared constants, din CVA, cum sunt implementate celelalte sisteme si sa cum sa facem sa nu le afectam sau mai rau, sa le stergem dracu din greseala. 


Implementari propriuzise noi si imbunatatiri pentru componenta de grid lunar. :
-
- sa poti adauga categorii noi direct din tabel (un buton adauga subcategorie sub uktima subcategorie din lista unei categorii), dar maxim 5 per categorie (asta fiind o limita care trebuie implementata si in Category editor)
- mesaj clar ca nu mai poti adauga dupa 5, sau sa dispara butonul efectiv
- sa poti sterge direcr din tabel subcategoriile custom
- sa poti redenumi direct din tabel toate subcategoriile
- tabelul ar trebui sa fie mai mare sau sa avem un mod de marit pe latimea paginii si unul de full screen sau ceva de genul. e mult prea mic acum si ar trebui sa fie si mai compact putin

- la un click nornal pe celula sa se deschida un modal sau ceva unde ai dat click unde sa ai camp cu suma, descriere, bifa de recurent sau nu, cu butonul de adauga diVAN fa reset la memory bank, vreau sa fac altcevasabled pana nu este corect tot ce faci acolo. Sa mearga sa dai ok si cu tasta enter
- la dublu click pe o celula sa poti sa scrii direct in celula, cu posibilitatea sa o poti face recurenta dupa aceea daca dai simplu click pe ea sau sa ii adaugi descriere. acum aceasta implementare este la single click, nu avem modal deloc.  
- sa poti sa stergi direct o suma dintr-o celula, ori dand click si sa ai si o optiune de delete sau clear sau apasand delete sau backspace.  
- toate randurile sau coloanele ar trebui sa fie egale intre ele
- descrierea daca este adaugata ar trebui da se vada in tabelul de tranzagtii dar si in grid, dar nu stiu cun sa il faci sa arate frumos, poate la hover ca in excel? E prea complicat?
o sa trebuiasca sa iti poti pune cati bani ai in conturile bancare undeva si de acolo sa inceapa bugetul si toate operatiunile viitoare. practic cifra aia cat ai in cunturi  se v=a pune in sold in fiecare zi din luna si dupa aia incepi sa pui venituri si cheltuieli anticipate si soldul ala se v-a schimba, si asa vei vedea in fiecare zi din luna cati bani teoretic o sa mai ai, sau o sa fii pe minus deci tre sa ai grija cum iti pui cheltuielile in luna aia.   cand pui o cheltuiala nlua in tabel, sa se updateze si urmatoarele zile, luni etc sa reflecte nlua cheltuiala
- filtre pe grid? Cred ca ar fi ajutator dar nu stiu cat de grea ar fi implementarea. Piate si un search ar ajuta
- cand bifezi o tranzactie ca recurenta ar trebui sa se puna automat si pe lunile urmatoare, dar ideea fiind, lasam userul sa isi aleaga daca vrea asta sau perioada pe cat vrea? Dar si asta ar trebui da aiba o limita sa nu se faca automat pe 100 de ani sa creem milioane de tranzactii aiurea. Ar trebui sa fie o limita, si aici trebuie vazut car3 e best practice la aplicatii similare. Daca nu e ceva similar, trebuie gandit un sistem smart dar robust si nu complex. Cred ca 1 an ar fi o limita decenta.
- momentan avem recurenta zilnica, weekly, montly si anual. Lasam si custom? Sau sa il lasam sa faca odata la 3 zile sau ceva de genul? Trebuie vazut cum e cel mai simplu si best practicr la alte aplicatii similare. cred ca putem lasa momentan ce avem deja. 
- trebuie sa ne asiguram ca orice modificare se face in tabel se reflecta in toata aplicatia pentru ca or sa fie mai multe module csre or sa aiba date din asta pe langa category editor si Transaction Table. inclusiv stergerea care o sa fie implementata. 
- tabelul trebuie sa fie cat mai curat, sa nu fie incarcat, usor de citit, celulele sa fie distincte si ovdrall sa fie clean dar sa arate profesionist si sa inspire incredere. 


De asmenea nu stiu dac aimi lipsesc alte chestii esentiale de care eu nu stiu. ma ajuti cu o cercetare aprofundata pe ce am deja acum si ce parere ai despre ce am zis mai sus? am nevoie de o parere. 

