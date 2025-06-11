Cache și sincronizare
Status: Parțial implementat (mutațiile locale și actualizarea cache-ului lunii sunt corecte, dar sincronizarea listelor globale necesită atenție). Detalii:
setQueryData pentru create/update/delete: Da, toate operațiunile CRUD folosesc actualizare optimistă a cache-ului cu setQueryData. Pentru creare, în hook-ul useCreateTransactionMonthly se adaugă tranzacția nouă în cache-ul lunii curente imediat, cu un ID temporar
GitHub
. Pentru update, useUpdateTransactionMonthly modifică în cache tranzacția existentă, aplicând noile valori (și setând un timestamp nou de updated_at)
GitHub
. La ștergere, useDeleteTransactionMonthly elimină tranzacția din cache-ul local al lunii folosind filtrarea pe ID
GitHub
. Toate aceste modificări se fac imutabil (creând obiecte noi pentru datele modificate), respectând principiile React Query. Astfel, gridul lunar se actualizează instant fără a aștepta răspunsul de la server, ceea ce oferă un UX receptiv.
Cache sincronizat în view-urile dependente: Vizualizările care depind de aceleași chei de cache (în speță, grila lunară pentru aceeași lună) se actualizează automat datorită acestor update-uri optimiste. De exemplu, dacă există componente multiple care folosesc useMonthlyTransactions pentru aceeași lună, ele vor vedea schimbările (în acest proiect, de obicei doar LunarGrid folosește datele lunare, deci sincronizarea internă este asigurată). Actualizarea este imutabilă, păstrându-se celelalte tranzacții și doar adăugând/modificând/ștergând itemul vizat, cum se vede în cod
GitHub
GitHub
.
Invalidarea/actualizarea listelor globale: Aici e zona ușor deficitară. Implementarea nu invalidează automat cache-ul global al tranzacțiilor (dacă există un astfel de query global). De fapt, în noile hook-uri “monthly” s-a optat intenționat să nu se mai facă invalidateQueries global pe cheia de tranzacții, pentru a evita refetch-ul costisitor al tuturor datelor (comentariu “ELIMINAT: Nu mai facem invalidation forțat”
GitHub
 în codul onSuccess confirmă decizia). Asta înseamnă însă că, dacă aplicația are o listă globală de tranzacții (ex. un istoric general sau un dashboard care folosește useTransactions global), acea listă nu va reflecta imediat adăugarea/editarea/ștergerea făcute în modulul LunarGrid. Exemplu: dacă utilizatorul adaugă o tranzacție în LunarGrid, aceasta apare instant în grila lunară (cache-ul lunii a fost updatat optimist), dar dacă există o pagină separată cu toate tranzacțiile, acea pagină poate să nu se actualizeze până la următorul refetch manual sau expirea cache-ului.
Sugestii: Pentru coerență completă, ar fi indicat să se sincronizeze și listele globale în urma mutațiilor din LunarGrid. Soluții posibile:
Invalidează selectiv cache-ul global: de exemplu, la onSuccess în mutațiile monthly, să se apeleze queryClient.invalidateQueries(['transactions']) sau o variantă filtrată (poate doar pe query-ul global dacă e definit separat). Aceasta ar forța refetch global data viitoare când e necesar, asigurând consistență.
Alternativ, update optimist global: similar cum se face pentru cache-ul lunar, s-ar putea folosi setQueryData și pe cache-ul listei globale (dacă structura datelor permite). De pildă, la creare, inserarea tranzacției noi și în lista globală cache-uită (dacă există în memorie).
Decizia de a elimina invalidarea globală are beneficii de performanță (evită reîncărcarea inutilă a datelor care poate nu sunt vizibile), dar dezvoltatorul ar trebui să se asigure că nu există vederi neactualizate. Dacă aplicația nu utilizează deloc o listă globală sau reîncarcă oricum la navigarea către ea, atunci acest aspect nu afectează funcționalitatea. În concluzie, implementarea cache-ului este corectă pentru modulul LunarGrid în sine, dar se recomandă verificarea sincronizării cu restul aplicației și, dacă e cazul, invalidarea listelor globale pentru a evita inconsecvențe.

Ce trebuie făcut neapărat (ca să nu ai bug-uri de sincronizare mai târziu):
✅ 1. Update simultan în ambele cache-uri
La fiecare mutație (add, update, delete), actualizezi atât lista lunii curente, cât și lista globală (dacă există în cache).

🔧 Exemple:
La create:
ts
Copiază
Editează
queryClient.setQueryData(['transactionsMonthly', userId, year, month], ...);
queryClient.setQueryData(['transactions', userId], (old: Transaction[] = []) =>
  [...old, newTransaction]
);
La update:
ts
Copiază
Editează
queryClient.setQueryData(['transactionsMonthly', userId, year, month], ...);
queryClient.setQueryData(['transactions', userId], (old: Transaction[] = []) =>
  old.map((t) => t.id === updated.id ? updated : t)
);
La delete:
ts
Copiază
Editează
queryClient.setQueryData(['transactionsMonthly', userId, year, month], ...);
queryClient.setQueryData(['transactions', userId], (old: Transaction[] = []) =>
  old.filter((t) => t.id !== deleted.id)
);
✅ 2. Definește cheie globală unică pentru toate tranzacțiile
Asigură-te că ai un query global gen:

ts
Copiază
Editează
useQuery(['transactions', userId], () => fetchAllTransactions(userId))
Acesta va fi sincronizat prin update-urile de mai sus.

✅ 3. Fallback de invalidare (safety net)
În caz de inconsistență, e ok să ai și:

ts
Copiază
Editează
queryClient.invalidateQueries(['transactions', userId]);
...dar doar ca fallback, nu by default. Încetinește aplicația dacă tragi zeci de mii de tranzacții.

✅ 4. Definește o funcție comună syncGlobalCache()
Poți face o funcție:

ts
Copiază
Editează
function syncGlobalTransactions(queryClient, updateType, transaction) {
  const key = ['transactions', userId];

  queryClient.setQueryData(key, (old = []) => {
    switch (updateType) {
      case 'add': return [...old, transaction];
      case 'update': return old.map(t => t.id === transaction.id ? transaction : t);
      case 'delete': return old.filter(t => t.id !== transaction.id);
      default: return old;
    }
  });
}
...și o apelezi în fiecare onSuccess din hook-urile de mutație.

✅ 5. Testează sincronizarea end-to-end
Adaugă tranzacție din LunarGrid → vezi dacă apare instant în TransactionList

Editează în LunarGrid → vezi dacă se actualizează în Dashboard

Șterge din List → dispare din Grid?

🔚 TL;DR:
Ce e greșit acum	Ce trebuie să faci
Se actualizează doar lunar cache-ul	Actualizează și cache-ul global
Lipsă sincronizare între module	Scrie o funcție syncGlobalCache și folosește-o în toate mutațiile
Risc de inconsistență între Grid / List / Dashboard	Asigură actualizare optimistă globală sau fallback invalidateQueries