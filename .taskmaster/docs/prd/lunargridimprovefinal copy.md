Implementarile toate ar trebui sa respecte best practices ale proiectului, regulile proiectului si memoriile. Sa avem grija la type errors, sa punem data-test ID, sa nu folosim texte si clase hardcodate, sa folosim shared constants si sistemul de CVA-2 pentru styling. daca nu exista un text in constante, se adauga acolo mai intai
NU DORESC PLANNING IN VID si NICI IMPLEMENTARE IN VID. Vreau o analiza thoroigh inainte de planning si dupa planning sa ne asiguram ca nu am ratat absolut nimic din documentul asta si ca este intelease extrem de bine arhitectura si ce trebuie modificat si unde fara a strica nimic aktceva in alta parte. 
La fel inainte de implementare, doresc sa se verifice thoroigh ce e acolo, ce avem nevoie din shared constants, din CVA, cum sunt implementate celelalte sisteme si sa cum sa facem sa nu le afectam sau mai rau, sa le stergem dracu din greseala. 
 ideea e ca nu vrrau planning in vid, vreau sa ne asiguram ca avem idee despre toate constantele, functiile, parametrii, clasele etc pe care urmeaza sa le folosim nu sa le presupunem sa sa le inventam. mai mult, sa ne asiguram ca modificarile sunt safe, nu afecteaza negativ resrul aplicatiei sau mai rau sa scoatem functionalitate existenta. daia trebuie luat totul mega atent si incremental
 Mai mult, s-au creat foarte multe componente noi si primitive care nu sunt inca folosite, verifica mai intai ce ai disponibil inainte sa te apuci sa creezi chestii noi. Te rog nu face water down la acest docuent, am nevoie sa prinzi absolut toate detaliile int askuri, inclusiv regulile de mai sus. 


Implementari propriuzise noi si imbunatatiri pentru componenta de grid lunar. :
-

- tabelul ar trebui sa se ajusteze la viewportul monitorului. nu sa fie cu adevarat responsive ptr mobil, doar la viewpoetul monitorului. Macar sa testam cum arata, daca e prea stramt, putem sa mai ajustam.
- de asemenea trebuie sa gasim un mod safe sa scoatem scrollul paginii intr-un fel sau altul. arata urat si scrollul containerului de grid si cel de pagina, devine enervant, mai ales ca sub containerul de tabel mai e o gramada de spatiu care nu o sa fie folosit niciodata, si nu inteleg de ce il avem. 

- la un click nornal pe celula  se deschida un modal dar la dublu click pe o celula sa poti sa scrii direct in celula sa faci inline editing, cu posibilitatea sa o poti face recurenta dupa aceea daca dai simplu click pe ea sau sa ii adaugi descriere. Trebuie investigat serios cum se poate face asta ca am incercat si in trecut si mereu se triggeruia modalul. 
- sa poti sa stergi direct o suma dintr-o celula cu delete sau backspace, eventual sa putem naviga prin tabel cu tastatura daca se poate.   
- toate randurile sau coloanele ar trebui sa fie egale intre ele, cele unde sunt cifrele, daca se poate face asta
- descrierea daca este adaugata ar trebui da se vada in tabelul de tranzagtii dar si in grid, dar nu stiu cun sa il faci sa arate frumos, poate la hover ca in excel? sa fie caun tooltip or something dar sa nu afecteze prea rau performanta, eventual sa se incarce doar atunci cand e necesar. 
- momentan avem o functionalitate care face highlight la ziua in care suntem astazi, dar e foarte simplam practic face albastra ziua, ceeea ce nici nu e in tema cu culorile noastre. as vrea sa schimbam asta si sa extindem, eventual coloana zilei curente sa fie highlighted in tot tabelul intr-un fel sa o distinga butin, sa inteleaga userul in ce zi este azi. 
- filtre pe grid? Cred ca ar fi ajutator dar nu stiu cat de grea ar fi implementarea. Piate si un search ar ajuta
- cand bifezi o tranzactie ca recurenta ar trebui sa se puna automat si pe lunile urmatoare, dar ideea fiind, lasam userul sa isi aleaga daca vrea asta sau perioada pe cat vrea? Dar si asta ar trebui da aiba o limita sa nu se faca automat pe 100 de ani sa creem milioane de tranzactii aiurea. Ar trebui sa fie o limita, si aici trebuie vazut car3 e best practice la aplicatii similare. Daca nu e ceva similar, trebuie gandit un sistem smart dar robust si nu complex. Cred ca 1 an ar fi o limita decenta.
- momentan avem recurenta zilnica, weekly, montly si anual. Lasam si custom? Sau sa il lasam sa faca odata la 3 zile sau ceva de genul? Trebuie vazut cum e cel mai simplu si best practicr la alte aplicatii similare. cred ca putem lasa momentan ce avem deja. 
- trebuie sa ne asiguram ca orice modificare se face in tabel se reflecta in toata aplicatia pentru ca or sa fie mai multe module csre or sa aiba date din asta pe langa category editor si Transaction Table. inclusiv stergerea care o sa fie implementata. 

Si cateva buguri existente gasite de mine si trebuie fixate:
- headerul tabelului, mai exact sold lunar si zilele lunii nu mai sunt sticky. erau inainte dar s-a pierdut la o regresie. trebuie implementat cum trebuie. 


