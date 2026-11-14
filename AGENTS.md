<!--
SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
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

Kalenderschema `YYYY.MM.NN` (`NN` zählt die Veröffentlichungen des Monats,
`1` bis `9999`, ohne führende Null).
`npm run version:next` nennt die nächste freie Fassung. Ein Tag `v2026.11.1`
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
  erneut prüfen.
- Fachliche Inhalte gehören ausschließlich nach `src/data`, nicht in
  Komponenten. Siehe `REGELWERK.md`.
- Jede neue Datei braucht Lizenzangaben nach REUSE: entweder einen Kopf mit
  `SPDX-FileCopyrightText` und `SPDX-License-Identifier` oder einen Eintrag in
  `REUSE.toml`. `reuse lint` muss durchlaufen.
- Die von shadcn/ui übernommenen Dateien sind in `REUSE.toml` einzeln
  aufgeführt. Auch eine neue Datei unter `src/components/ui/` braucht deshalb
  einen eigenen EUPL-Kopf. Nur unverändert Übernommenes kommt in die Liste.
- Kommt eine Abhängigkeit mit einer bisher unbekannten Lizenz hinzu, gehört
  deren unveränderter SPDX-Text nach `vendor/spdx-licenses/`. Sonst bricht
  `npm run sbom` ab.
