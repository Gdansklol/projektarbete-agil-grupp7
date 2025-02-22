# Frontend projekt och agila metoder
## Projektarbete - Producivity Assistant Application

### 📌 Planering
- Trello för att skapa en planering samt översikt över hur arbetet går. 

- Ni ska ha minst följande fem spalter: Backlog, Todo,In progress, Ready for test, Done

- Backlog - Börja med att fylla på backloggen med så många kort som möjligt för att tydliggöra vilka ärenden som ska utföras under hela projektets gång.

- En wireframe ska tas fram utifrån kravställning som ni utgår ifrån.

## Projektmetodik
Projektlängd: 2 sprintar (ca 2 veckor/sprint).

Sprintplanering - Påbörja varje sprint med att dra över/skapa ärenden från Backlog till Todo. Varje Trello-ärende ska ha en huvudansvarig vid utförning.

Återkommande avstämningsmöten (standups)

Ca 5-15 minuter. OBS. Dessa ska dokumenteras! Ni ska ha en samling mötesanteckningar 
där ni skriver vilken tid ni håller mötet, vilka som deltar, samt vad som sägs under mötets gång.
Ni kan ha detta i Trello eller ett Google-dokument.

Retrospektiv - Ni ska hålla ett retrospektiv efter sprint 1, där ni diskuterar 
vad som gått bra och vad som kan förbättras i arbetet.
 Detta moment ska dokumenteras. Ni kan ha detta i Trello eller ett Google-dokument.

Avstämning med kund sker efter sprint 1.

Git flow - Ni ska använda Github för att dela med er av kod och skapa branches varje gång 
ni jobbar på ny funktionalitet. Max en aktiv feature-branch per person (är ni 3 personer bör 
det finnas max 3 feature-branches). Stäng sedan branchen när ni mergat in den i develop.
Se exempel:

main

develop

feature/navigation

feature/login

Testning - Ni ska testa varandras ärenden. Man får ej markera sina egna ärenden som färdiga.

## Inloggning (Endast VG)
Man ska kunna registrera flera olika användare med användarnamn samt lösenord.

Varje användare ska kunna logga in och logga ut ur applikationen.

Vid lyckad inloggning - Ska en användare mötas av en hälsning samt ett slumpat citat 
från t.ex följande API: https://api.quotable.io/

Varje användare ska ha tillgång till alla sina ärenden, rutiner och händelser den 
skapat när den loggar in.

## Startsida
Visa ut en översikt över applikationen. Följande ska visas ut.
De tre senaste ej utförda ärenden som användaren lagt till. Länk för att navigera till lista med samtliga ärenden.

De tre rutiner med högst antal repetitioner. Länk för att navigera till lista med samtliga rutiner.

De tre nästkommande händelserna. Länk för att navigera till lista med samtliga händelser.

## Todos & Activities
 ### En fullständig todo-app med följande funktioner:
 - Lägg till nya uppgifter
 - Redigera uppgifter
 - Ta bort uppgifter
 - Filtrera efter status och kategori
 - Sortera baserat på deadline, tid eller status

 ### Använder LocalStorage
 - Data lagras per användare
 - Möjliggör beständig datalagring mellan sidladdningar.

### Automatisk uppdatering av gränssnittet (UI)
  - DOM uppdateras genom en dynamisk renderingsfunktion.
  - Säkerställer att den aktuella uppgiftslistan alltid speglas korrekt.

### Effektiv datamanipulation
 - Metoder för att hantera listuppdateringar.

### Interaktivitet genom event-lyssnare
 - addEventListener() används för att hantera användarinteraktioner såsom
   formulärinlämningar, klickhändelser och checkboxändringar.

### Effektiv DOM-hantering
- JSON-strukturerade uppgifter lagras per användare i localStorage.setItem().

<hr>

## Habits

Användare ska kunna se en lista av valda rutiner som ska kunna spåra framsteg i form av antal repetitioner.


Användaren ska kunna skapa en ny rutin och ta bort existerande rutiner.

Varje rutin ska innehålla följande:

Titel - t.ex “Träning, läsa bok, meditera etc.”

Repetitioner - En siffra på hur många gånger användaren utfört rutinen.

Prioritet - (låg,mellan,hög)

Man ska kunna öka, minska och nollställa repetitioner för varje rutin.

Filtrering - Ska kunna filtreras på prioritet.

Sortering - Ska kunna sorteras på (stigande och fallande):

Repetitioner

Prioritet

<hr>

## Event planner

Varje händelse ska innehålla följande:

Start (datum och tid)

Slut (datum och tid)

Namn på händelse

Det ska vara möjligt att lägga till, ta bort och redigera händelser.

Händelserna ska alltid vara sorterade på vilken som infaller närmast i tid.

Det ska framgå vilka händelser som redan infallit (t.ex genom utgråad text/visas i en separat lista eller liknande)

Filtrering baserat på:

Kommande händelser/Tidigare händelser