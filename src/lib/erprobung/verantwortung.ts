// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Vorbelegung des Abschnitts „Verantwortlichkeiten und Restrisiken“. Die
 * Felder werden aus den Antworten abgeleitet und bleiben frei änderbar.
 */

import { FRAGEN } from "@/data/regelwerk";
import { ausgeloesteStellen } from "@/data/beteiligungen";
import { KEINE_ERHOEHTE_ANFORDERUNG } from "@/data/vorlagen";
import { einordnen } from "./bewertung";
import { FEHLERTOLERANZ_VORSCHLAG } from "@/data/vorlagen";
import type { Einordnung, Einrichtungsprofil, Erprobungsdaten, Verantwortung } from "./typen";

function aufzaehlung(zeilen: string[]): string {
  return zeilen.map((z) => `- ${z}`).join("\n");
}

function optionstext(frageId: string, optionId: string): string {
  const frage = FRAGEN.find((f) => f.id === frageId);
  return frage?.optionen?.find((o) => o.id === optionId)?.text ?? optionId;
}

/** Antworten, die die Einordnung bestimmt haben. */
function annahmen(ergebnis: Einordnung): string[] {
  const s = ergebnis.signale;
  const zeilen: string[] = [];
  if (s.forschungsphase)
    zeilen.push("Der Einsatz dient allein Forschung und Entwicklung vor dem Betrieb.");
  zeilen.push(
    s.istKiSystem
      ? "Das Werkzeug ist ein KI-System im Sinne der KI-Verordnung."
      : "Das Werkzeug ist kein KI-System im Sinne der KI-Verordnung.",
  );
  if (s.istKiSystem) {
    zeilen.push(
      s.anbieterrolle
        ? "Die Dienststelle nimmt die Anbieterrolle ein."
        : "Die Dienststelle nimmt die Betreiberrolle ein.",
    );
  }
  zeilen.push(
    s.hochrisiko.length > 0
      ? `Der Einsatz liegt in folgenden Bereichen mit hohem Risiko: ${s.hochrisiko
          .map((h) => optionstext("hochrisiko", h))
          .join(", ")}.`
      : "Der Einsatz liegt in keinem Bereich mit hohem Risiko.",
  );
  if (s.hochrisikoAusnahme) {
    zeilen.push(
      `Die Dienststelle stützt sich auf die Ausnahme nach Artikel 6 Absatz 3 Buchstabe ${s.hochrisikoAusnahme}.`,
    );
  }
  zeilen.push(
    s.personenbezug
      ? "Es werden personenbezogene Daten verarbeitet."
      : "Es werden keine personenbezogenen Daten verarbeitet.",
  );
  if (s.personenbezug && s.rechtsgrundlageText)
    zeilen.push(`Die Verarbeitung stützt sich auf: ${s.rechtsgrundlageText}`);
  if (s.beschaeftigtendaten) zeilen.push("Es werden Daten der eigenen Beschäftigten verarbeitet.");
  if (s.besondereKategorien) zeilen.push("Es werden Daten besonderer Kategorien verarbeitet.");
  zeilen.push(
    s.ueberwachungseignung
      ? "Das Werkzeug ist geeignet, Verhalten oder Leistung von Beschäftigten nachvollziehbar zu machen."
      : "Das Werkzeug ist nicht geeignet, Verhalten oder Leistung von Beschäftigten nachvollziehbar zu machen.",
  );
  if (s.entscheidungVorbereitung)
    zeilen.push("Das Werkzeug bereitet Entscheidungen gegenüber Bürgerinnen und Bürgern vor.");
  if (s.entscheidungAutomatisiert)
    zeilen.push("Die Entscheidung ergeht ohne Beteiligung eines Menschen.");
  if (s.nurTestdatenMoeglich)
    zeilen.push("Die Erprobung ließe sich mit erfundenen Daten durchführen.");
  return zeilen;
}

/** Restrisiken aus den Auslösern, jeweils mit der Folge. */
function restrisiken(ergebnis: Einordnung): string[] {
  if (ergebnis.ausloeser.length === 0) return [KEINE_ERHOEHTE_ANFORDERUNG];
  return ergebnis.ausloeser.map((a) => `${a.antwort} ${a.begruendung}`);
}

export function verantwortungVorbelegen(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): Verantwortung {
  const ergebnis = einordnen(daten.vorhaben.fallart, daten.antworten, profil);
  const stellen = ausgeloesteStellen(ergebnis.signale, profil).filter((s) => s.id !== "leitung");
  const fachlich = [daten.vorhaben.verantwortlich, daten.vorhaben.kontakt]
    .map((t) => t.trim())
    .filter((t) => t !== "")
    .join(", ");
  const technisch = stellen
    .map((s) => {
      const name = daten.beteiligungen[s.id]?.name?.trim() ?? "";
      return name ? `${s.bezeichnung}: ${name}` : s.bezeichnung;
    })
    .join("\n");
  return {
    fachlich,
    technisch: aufzaehlung([
      ...(technisch ? technisch.split("\n") : []),
      "Behördenleitung: Organisationsverantwortung und Freigabe",
    ]),
    fehlertoleranz: FEHLERTOLERANZ_VORSCHLAG,
    annahmen: aufzaehlung(annahmen(ergebnis)),
    restrisiken: aufzaehlung(restrisiken(ergebnis)),
  };
}
