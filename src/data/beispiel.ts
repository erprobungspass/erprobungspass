// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Vollständig ausgefüllter Demonstrationsvorgang. Er wird von der
 * Startseite aus geladen und springt direkt in Schritt 5. Alle Angaben
 * sind erfunden.
 */

import { leereDaten } from "@/lib/erprobung/speicher";
import type { Erprobungsdaten } from "@/lib/erprobung/typen";

export function beispielDaten(): Erprobungsdaten {
  const basis = leereDaten();
  return {
    ...basis,
    beispiel: true,
    schritt: 5,
    hoechsterSchritt: 5,
    geltungsdauerWochen: 4,
    vorhaben: {
      ...basis.vorhaben,
      fallart: "neu",
      bezeichnung: "Assistenz für interne Textentwürfe",
      anbieter: "Beispielanbieter (Demo)",
      kurzbeschreibung:
        "Ein Fachbereich möchte erste Entwürfe für interne Informationstexte aus öffentlich zugänglichen Quellen erstellen lassen. Die Beschäftigten prüfen jeden Entwurf vor der Verwendung.",
      behoerde: "Musterbehörde, Fachbereich Organisation",
      verantwortlich: "Sachgebietsleitung (Demo)",
      zeitraumVon: new Date().toISOString().slice(0, 10),
      anzahlBeschaeftigte: "5",
      problem:
        "Informationstexte für das Intranet werden von mehreren Personen nebeneinander verfasst; die Entwürfe unterscheiden sich stark in Aufbau und Sprache.",
      ablaufHeute:
        "Der Fachbereich sammelt Angaben aus Quellen im Intranet und schreibt den Entwurf von Hand. Eine zweite Person liest gegen, danach folgt die Freigabe.",
      dauerHeute: "etwa 40 Minuten",
      fallzahl: "rund 900 im Jahr",
      verbesserung:
        "Ein erster Entwurf soll schneller vorliegen, sodass mehr Zeit für die inhaltliche Prüfung bleibt. Der Aufbau der Texte soll einheitlicher werden.",
    },
    antworten: {
      ki_system: "ja",
      rolle: "betreiber",
      verbotene_praktiken: ["keines"],
      hochrisiko: ["keines"],
      transparenz: ["synthetisch"],
      personenbezug: "nein",
      ueberwachung: "nein",
      forschung: "nein",
      entscheidung_vorbereitung: "nein",
      entscheidung_automatisiert: "nein",
      vollautomatischer_erlass: "nein",
      anbieter_voreinstellung: "abgeschaltet",
      barrierefreiheit: "ja",
      testdaten: "ja",
      unterrichtung: "ja",
    },
  };
}
