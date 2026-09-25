# Personal Startpage

Een zeer uitgebreide persoonlijke Firefox-startpagina met meerdere losse pagina's.

## Pagina's
- Overzicht met live klok, datum, zoeken, weer en widgets
- Agenda met maandkalender
- Taken
- Huiswerk
- Doelen
- Notities
- Snelle links
- Gewoontes
- Focus
- Statistieken
- Widgets
- Instellingen

De gegevens worden lokaal in de browser opgeslagen. Er is geen eigen database of backend nodig.

## GitHub Pages
Deze repository bevat een GitHub Actions workflow voor GitHub Pages. GitHub Pages ondersteunt statische HTML, CSS en JavaScript en kan meerdere pagina's uit dezelfde publicatiebron publiceren. 

Ga naar Settings > Pages en controleer dat GitHub Actions als bron is ingesteld.

## Privacy
Agenda, taken, huiswerk, doelen, notities, links en gewoontes worden lokaal in localStorage bewaard. Het weer wordt via Open-Meteo opgehaald nadat de browser locatie toestemming geeft.

## Back-up
De instellingenpagina bevat een exportfunctie zodat je je lokale dashboardgegevens als JSON kunt bewaren.
