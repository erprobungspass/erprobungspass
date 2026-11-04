<!--
SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
SPDX-License-Identifier: EUPL-1.2
-->

# Erprobungspass

Der Erprobungspass führt öffentliche Stellen durch die Prüfung eines geplanten
Technikeinsatzes. In fünf Schritten entstehen eine begründete Einordnung mit
Fundstellen und drei druckbare Dokumente: Freigabedokument, Protokollrahmen und
Abschlussvermerk.

Die Anwendung läuft vollständig im Browser. Es gibt kein Benutzerkonto und keine
Übertragung an einen Server; alle Angaben liegen im lokalen Speicher des
Browsers und können als Datei gesichert und wieder geladen werden.

## Zweck

- Einordnung eines Vorhabens nach der KI-Verordnung, dem Datenschutzrecht und
  den Anforderungen des Betriebs.
- Benennung der im Haus zu beteiligenden Stellen mit Begründung.
- Auflagen und Abbruchkriterien als vollständige Sätze, die unverändert in ein
  Dokument übernommen werden können.
- Anhang mit den Unterlagen, die die Dienststelle vor Beginn noch beibringen
  muss.
- Anonymisierter Fallsatz für eine öffentliche Fallsammlung.

## Aufbau der drei Schichten

Die fachlichen Inhalte liegen ausschließlich in `src/data`. Komponenten
enthalten keine Rechtstexte.

1. **Regelkern** — `src/data/regelwerk.ts`
   Fassung des Regelwerks, alle Prüffragen mit Erläuterung, Beispiel und
   Fundstelle, die Auslöser der Ampel, die Hinweise, die Vorschläge zur
   Umgestaltung und die Punkte der Dokumenten-Checkliste.
2. **Vorlagenschicht** — `src/data/vorlagen.ts`
   Auflagen, Abbruchkriterien, Ampeltexte und alle Abschnittstexte der drei
   Dokumente.
3. **Organisationsschicht** — `src/data/beteiligungen.ts`,
   `src/data/einrichtung.ts` und `src/data/ebenen.ts`
   Die zu beteiligenden Stellen mit Auslösebedingung, das Einrichtungsprofil, in
   dem eine Einrichtung einmal hinterlegt, was in ihrem Haus gilt, sowie die
   Bezeichnungen des nationalen Rechts je Ebene und Bundesland.

Fundstellen sind zweiteilig: ein fester unionsrechtlicher Teil und ein
optionaler nationaler Teil, der sich nach der im Einrichtungsprofil hinterlegten
Ebene richtet. Die Auflösung liegt in `src/lib/erprobung/fundstelle.ts`. Regeln
können ein Geltungsdatum tragen; liegt es in der Zukunft, erscheint die Regel im
Prüfpfad mit dem Zusatz „Gilt ab dem …“, führt aber nicht zu einer Höherstufung
der Ampel (`src/lib/erprobung/geltung.ts`).

Die Ableitung liegt in `src/lib/erprobung`: `bewertung.ts` erzeugt aus den
Antworten die Signale und die Einordnung, `checkliste.ts` die offenen
Unterlagen, `dauer.ts` die Geltungsdauer in Wochen, `kennung.ts` die
Vorgangskennung, `export.ts` die Ausgabeformate und `speicher.ts` beziehungsweise
`profil.ts` die Speicherung im Browser.

## Wie das Regelwerk geändert wird

1. Frage, Auslöser oder Auflage in der zuständigen Datei unter `src/data`
   ändern oder ergänzen. Jede Frage braucht Kennung, Erläuterung, Beispiel und
   Fundstelle.
2. Wirkt sich die Änderung auf die Einordnung aus, das abgeleitete Signal in
   `src/lib/erprobung/bewertung.ts` ergänzen.
3. `REGELWERK_VERSION` in `src/data/regelwerk.ts` auf das Datum der Änderung
   setzen. Bereits gespeicherte Vorgänge führen ihre Fassung mit; die Anwendung
   weist auf die abweichende Fassung hin und bietet eine erneute Einordnung an.
4. Die lesbare Fassung neu erzeugen:
   `npm run regelwerk` schreibt `REGELWERK.md`.

`REGELWERK.md` enthält alle Fragen, Auslöser, Fundstellen und Auflagentexte und
ist damit auch ohne den Programmcode nachnutzbar.

## Lokal starten

Voraussetzung ist Node.js 20 oder neuer.

```
npm install
npm run dev
```

Die Anwendung ist danach unter der in der Ausgabe genannten Adresse erreichbar.
Weitere Befehle:

```
npm run build     # Fassung für die Veröffentlichung erzeugen
npm run package   # Archiv für die Auslieferung unter release/ erzeugen
npm test          # Abnahmetests ausführen
npm run lint      # Programmcode prüfen
npm run format    # Quelltext formatieren
```

## Veröffentlichen

`npm run build` erzeugt `dist/` — ein rein statisches Verzeichnis ohne
Serverlaufzeit. Der Inhalt wird in das Wurzelverzeichnis eines beliebigen
Webservers kopiert; `npm run package` schnürt daraus ein `tar.gz` unter
`release/`.

Jede Route hat eine eigene `index.html`, Deep Links funktionieren daher auch
ohne Umschreibregeln. Für Apache liegt eine Beispielkonfiguration mit
Umschreibregeln, Caching und einer Inhaltssicherheitsrichtlinie als
`.htaccess` im Archiv; sie wirkt nur bei `AllowOverride All`.

Soll die Anwendung in einem Unterverzeichnis laufen, muss das Präfix beim Bauen
bekannt sein:

```
VITE_BASE_PATH=/erprobungspass npm run build
```

Die Anwendung lädt zur Laufzeit keine externen Ressourcen und funktioniert
ohne Netzwerkverbindung.

### GitHub Pages

Jeder Push auf `main` baut und veröffentlicht den Stand unter
<https://erprobungspass.github.io/erprobungspass/>. Weil Pages das Projekt in
einem Unterverzeichnis ausliefert, baut der Ablauf mit
`VITE_BASE_PATH=/erprobungspass`. Voraussetzung ist, dass unter
Einstellungen → Pages als Quelle „GitHub Actions“ eingestellt ist.

### Fassungen und Veröffentlichung

Die Fassung folgt dem Kalenderschema `YYYY.MM.NN`: Jahr, Monat und eine
zweistellige Zählung der Veröffentlichungen innerhalb des Monats. Die erste
Veröffentlichung im November 2026 ist also `2026.11.01`, die zweite
`2026.11.02`.

Die nächste freie Fassung nennt:

```
npm run version:next
```

Veröffentlicht wird über ein Tag. GitHub Actions baut daraufhin das Archiv,
erzeugt die Prüfsumme und legt das Release an:

```
git tag v2026.11.01
git push origin v2026.11.01
```

Das Tag darf auch ohne führendes `v` gesetzt werden. Die Fassung in
`package.json` wird im Ablauf aus dem Tag übernommen, sie muss vorher nicht
von Hand gepflegt werden.

Jeder Push und jeder Pull Request durchläuft zusätzlich die Prüfungen aus
`.github/workflows/ci.yml`: Typprüfung, Lint, Tests, Build und der Abgleich,
dass `REGELWERK.md` zum Regelkern passt.

## Barrierefreiheit

Angestrebt wird die Konformitätsstufe AA nach BITV 2.0 beziehungsweise
EN 301 549. Umgesetzt sind unter anderem durchgängige Tastaturbedienung mit
sichtbarem Fokus, verknüpfte Beschriftungen aller Eingabefelder, angekündigte
Fehlermeldungen, ausreichende Kontraste, eine Ampel, die ihre Aussage stets
zusätzlich als Wort und über eine eigene Rahmenform trägt, ein Sprunglink zum
Hauptinhalt und Bedienbarkeit bis zu 200 Prozent Vergrößerung. Die vollständige
Erklärung zur Barrierefreiheit ist in der Anwendung über die Fußzeile
erreichbar.

## Lizenz

European Union Public Licence, Version 1.2 (EUPL-1.2). Der Lizenztext liegt in
`LICENSE`. Urheberin ist die Immersive Education Ideations uG
(haftungsbeschränkt). Jede selbst geschriebene Quelldatei trägt im Kopf eine
REUSE-konforme Angabe mit SPDX-Kennung.

Das Vorhaben folgt der [REUSE-Spezifikation](https://reuse.software) in Fassung
3.2. Die Lizenztexte liegen in `LICENSES/`; Dateien ohne eigenen Kopf, etwa
Konfigurationen und übernommene Oberflächenbausteine, sind in `REUSE.toml`
eingetragen. Prüfen lässt sich das mit `reuse lint`.

Der Build legt zusätzlich `dist/LICENSES/` an. Dort liegt der Text jeder
Lizenz, die in den ausgelieferten Paketen tatsächlich vorkommt, passend zur
Stückliste in `dist/sbom.json`.

Daneben entsteht `dist/THIRD-PARTY-LICENSES.txt` mit dem Urhebervermerk jedes
einzelnen Pakets. MIT, BSD und verwandte Lizenzen verlangen, diesen Vermerk
mitzuliefern; der Text je Lizenzkennung allein genügt dafür nicht. Beide
Angaben erzeugt `npm run sbom` aus `package-lock.json` und den installierten
Paketen; von Hand gepflegt wird dort nichts.

## Förderung

Das Vorhaben wird durch die Bundesagentur für Sprunginnovationen SPRIND im
Rahmen der Mission „Deutschland, was geht?“ gefördert.

## Hinweis

Der Erprobungspass ersetzt keine Rechtsberatung. Die Verantwortung für die
Entscheidung verbleibt bei der Dienststelle.
