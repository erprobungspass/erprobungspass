// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Laufzettel: eine Seite je ausgelöster Stelle. Er führt keine neuen Regeln
 * ein, sondern ordnet die vorhandenen Ergebnisse nach Stellen.
 */

import { ausgeloesteStellen, beteiligungsBegruendung, type Stelle } from "@/data/beteiligungen";
import { STELLEN } from "@/data/beteiligungen";
import { LAUFZETTEL_FRIST_TAGE } from "@/data/vorlagen";
import { VORPRUEFUNG_TITEL } from "@/data/landesvorgaben";
import { ableitenSignale } from "./bewertung";
import { offeneUnterlagen } from "./checkliste";
import type { Einrichtungsprofil, Erprobungsdaten } from "./typen";

export interface LaufzettelSeite {
  stelle: Stelle;
  begruendung: string;
  pruefgegenstand: string;
  unterlagen: string[];
  /** Frist als ISO-Datum; leer, wenn kein Beginn erfasst ist. */
  frist: string;
  ergebnis: string;
}

/** Erprobungsbeginn minus 14 Tage als ISO-Datum, sonst leer. */
export function standardFrist(startIso: string): string {
  if (!startIso) return "";
  const d = new Date(`${startIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() - LAUFZETTEL_FRIST_TAGE);
  return d.toISOString().slice(0, 10);
}

export function laufzettelSeiten(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): LaufzettelSeite[] {
  const signale = ableitenSignale(daten.vorhaben.fallart, daten.antworten);
  const stellen = ausgeloesteStellen(signale, profil);
  const ids = new Set(stellen.map((s) => s.id));
  const unterlagen = offeneUnterlagen(signale);

  return stellen.map((stelle) => {
    const liste: string[] = [];
    for (const p of unterlagen) {
      // Ist die zuständige Stelle nicht beteiligt, landet die Unterlage bei der Leitung.
      const ziel = ids.has(p.zustaendig) ? p.zustaendig : "leitung";
      if (ziel === stelle.id) liste.push(`${p.was} (${p.fundstelle})`);
    }
    if (stelle.id === "informationssicherheit") {
      liste.push(`Ergebnis der ${VORPRUEFUNG_TITEL} aus dem Freigabedokument`);
    }
    liste.push(...(stelle.unterlagen ?? []));
    const eintrag = daten.laufzettel[stelle.id];
    return {
      stelle,
      begruendung: beteiligungsBegruendung(stelle, signale, profil),
      pruefgegenstand: stelle.pruefgegenstand,
      unterlagen: liste,
      frist: eintrag?.frist || standardFrist(daten.vorhaben.zeitraumVon),
      ergebnis: eintrag?.ergebnis ?? "",
    };
  });
}

/** Für die Prüfung der Vollständigkeit: alle bekannten Stellenkennungen. */
export const STELLEN_IDS = STELLEN.map((s) => s.id);
