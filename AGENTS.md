<!--
SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
SPDX-License-Identifier: EUPL-1.2
-->

# Hinweise für Agenten

## Aufbau

Die Anwendung ist eine reine Client-Anwendung: React, TanStack Router, Vite.
Es gibt keinen Server, keine Server-Funktionen und keine Netzwerkaufrufe zur
Laufzeit. Alle Daten liegen im `localStorage` des Browsers.

`npm run build` erzeugt `dist/` als vollständig statisches Verzeichnis. Jede
Route bekommt eine eigene `index.html`, damit Deep Links auch auf einem
einfachen Dateiserver funktionieren. `npm run package` legt daraus ein
Archiv unter `release/` ab.

Asset-Pfade sind relativ. Für die Auslieferung in einem Unterverzeichnis muss
zusätzlich das Routing-Präfix gesetzt werden:

```
VITE_BASE_PATH=/erprobungspass npm run build
```

## Fassungen

Kalenderschema `YYYY.MM.NN` (`NN` zählt die Veröffentlichungen des Monats).
`npm run version:next` nennt die nächste freie Fassung. Ein Tag `v2026.11.01`
löst den Release-Ablauf aus; die Fassung in `package.json` wird dabei aus dem
Tag gesetzt.

## Regeln

- Keine Abhängigkeit zu einem Hosting-Anbieter einführen, weder im Build noch
  zur Laufzeit.
- Keine externen Ressourcen zur Laufzeit laden (keine CDN-Skripte, keine
  Web-Fonts von fremden Servern). Die Auslieferung muss offline funktionieren.
- `xlsx` liegt bewusst als geprüftes Archiv unter `vendor/`. Es ist die
  SheetJS **Community Edition** unter Apache-2.0; die Pro-Variante ist
  lizenzrechtlich ausgeschlossen. Beim Aktualisieren Prüfsumme und Lizenz
  erneut prüfen und `public/THIRD-PARTY-LICENSES.txt` nachziehen.
- Fachliche Inhalte gehören ausschließlich nach `src/data`, nicht in
  Komponenten. Siehe `REGELWERK.md`.
