# Frontend projekt och agila metoder
## Projektarbete - Producivity Assistant Application

<<<<<<< HEAD
=======
---

## 📌 Planering

### Arbetsmetodik

- Vårt team använde **Trello** och **Git** för att organisera och strukturera arbetet. Trello användes för att skapa en planering samt ge en översikt över hur arbetet gick.

- Vi hade fem huvudsakliga spalter i Trello:
  - **Backlog**: Lista över alla uppgifter som ska utföras under projektets gång.
  - **ToDo**: Uppgifter som prioriterats att påbörjas inom sprinten.
  - **In progress**: Uppgifter som teammedlemmar arbetade aktivt med.
  - **Ready for test**: Uppgifter som var klara för testning och granskning.
  - **Done**: Slutförda uppgifter.

- En **wireframe** togs fram baserat på kravspecifikationen 
och användes som grund för utvecklingen.

- **GitHub** användes för versionshantering:
  - Varje teammedlem arbetade med en **feature-branch** för ny funktionalitet.
  - Efter kodgranskning mergades ändringarna till **develop**.
  - Max en aktiv feature-branch per person.

## 📌 Projektmetodik / Agilt arbete

- Vi arbetade enligt **SCRUM-metoden** och höll regelbundna sprintmöten (varannan vecka).
- Varje dag höll vi **15-minuters stand-up-möten** via Discord och på plats i skolan.
- Scrum-master-rollen roterade mellan teammedlemmarna, och mötesanteckningar dokumenterades på Trello.
- **Retrospektiv** hölls efter varje sprint för att diskutera förbättringar.
- **Avstämning** med produktägaren (läraren) skedde efter sprint 1.

## 📌 Funktionalitet och Tekniker

### 🔐 Inloggning (Endast VG)
- Man ska kunna registrera flera olika användare med användarnamn samt lösenord.
- **SessionStorage** används för att lagra information om inloggade användare   
    och hålla kvar sessionen.
- Vid inloggning valideras användarnamn och användar-ID genom 
    en **credentials check** för att se om de matchar sparade användare.
- Varje användare har sin egen data lagrad i **LocalStorage**, 
    så att deras ärenden, rutiner och händelser är tillgängliga vid inloggning.

### 🏠 Startsida
- **SessionStorage** används för att hämta information om den inloggade användaren 
    och visa personliga data.
- Ett **slumpat citat** hämtas från API:t `https://dummyjson.com/quotes/random` 
    vid varje sidladdning för att visa inspirerande innehåll.
- Visa en översikt över applikationen:
  - **De tre senaste ej utförda ärenden**.
  - **De tre rutiner med högst antal repetitioner**.
  - **De tre nästkommande händelserna**.
- Varje sektion innehåller länkar för att navigera till fullständiga listor.

### 📝 Todos & Aktiviteter
- **CRUD**-operationer: Skapa, läsa, uppdatera och ta bort uppgifter.
- **Filtrering** efter status och kategori.
- **Sortering** baserat på deadline, tid eller status.
- **LocalStorage** används för att lagra användarens data.
- **SessionStorage** används för att hantera aktuell användarsession och identifiera om en användare är inloggad eller ej.
- Dynamisk rendering av UI genom att manipulera **DOM**.
- **Font Awesome**-ikoner användes för **edit**, **delete** och **add** knappar för att göra gränssnittet mer intuitivt.

### 🔄 Habits (Rutiner)
- **CRUD**-operationer: Skapa, ta bort och uppdatera rutiner.
- Spåra framsteg i form av **repetitioner**.
- **Filtrering och sortering** efter prioritet och antal repetitioner.
- Användare kan markera en rutin som slutförd och nollställa dess progress.

### 📅 Event Planner
-**CRUD**-operationer: Skapa, redigera och ta bort händelser.
Start (datum och tid),Slut (datum och tid) & Namn på händelse.

- Händelser sorteras efter närmast kommande tid.

- **Filtrering:**
  Växla mellan kommande, tidigare och alla event.

- Händelser som redan infallit visas i en separat lista.

-**LocalStorage & Autentisering:**
  Eventdata sparas per inloggad användare via *localStorage*; *sessionStorage* säkerställer att endast inloggade användare får åtkomst.

-Teknisk Översikt
HTML:
Strukturerad med header, main och footer. Inkluderar externa CSS/JS och Font Awesome-ikoner.
CSS:
Ansvarar för layout, animationer och responsiv design med stöd från en global stilfil.
JavaScript:
Hanterar **DOM-manipulering**, eventlogik, sortering och modaler för användarfeedback.

## 📌 Använda Teknologier

- **HTML, CSS, JavaScript** - Grundläggande frontend-teknologier.
- **LocalStorage och SessionStorage** - Permanent och sessionsbaserad datalagring.
- **CRUD-funktionalitet** - Hantering av användardata.
- **Event Listeners** - Interaktivitet via `addEventListener()`.
- **fetch API** - Används för att hämta och skicka data.
- **Global Style** - Enhetligt utseende genom gemensamma CSS-regler.
- **Font Awesome** - Användes för att inkludera intuitiva ikoner i gränssnittet.
- **GitHub & Git Flow** - Versionshantering och samarbete.
>>>>>>> dev
