// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Tabellenexport des Protokolls der Rückmeldungen und des Laufzettels als
 * XLSX oder ODS. Die Datei lässt sich wieder einlesen und fortschreiben.
 * Die Bibliothek wird erst bei Bedarf im Browser geladen.
 */

import { PROTOKOLL_SPALTEN } from "@/data/vorlagen";
import { REGELWERK_VERSION } from "@/data/regelwerk";
import { laufzettelSeiten } from "./laufzettel";
import { dateiname } from "./speicher";
import type { Einrichtungsprofil, Erprobungsdaten, Rueckmeldung } from "./typen";

export type Tabellenformat = "xlsx" | "ods";

const BLATT_VORGANG = "Vorgang";
const BLATT_PROTOKOLL = "Protokoll";
const BLATT_LAUFZETTEL = "Laufzettel";

const MIME: Record<Tabellenformat, string> = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
};

export class Tabellenfehler extends Error {}

export const TABELLENFEHLER_TEXT =
  "Diese Datei lässt sich nicht als Protokoll einlesen. Bitte die XLSX- oder ODS-Datei verwenden, die über „Protokoll speichern“ erzeugt wurde.";

/** Erzeugt die Arbeitsmappe mit den Blättern Vorgang, Protokoll und Laufzettel. */
export async function protokollArbeitsmappe(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
  format: Tabellenformat,
): Promise<ArrayBuffer> {
  const XLSX = await import("xlsx");
  const mappe = XLSX.utils.book_new();

  const vorgang = [
    ["Angabe", "Wert"],
    ["Vorgang", daten.vorgangKennung],
    ["Werkzeug", daten.vorhaben.bezeichnung],
    ["Behörde", daten.vorhaben.behoerde],
    ["Empfänger", daten.protokollEmpfaenger],
    ["Regelwerksversion", daten.version || REGELWERK_VERSION],
  ];
  XLSX.utils.book_append_sheet(mappe, XLSX.utils.aoa_to_sheet(vorgang), BLATT_VORGANG);

  const protokoll = [
    [...PROTOKOLL_SPALTEN],
    ...daten.rueckmeldungen.map((r) => [r.datum, r.rolle, r.beobachtung, r.folge]),
  ];
  const blatt = XLSX.utils.aoa_to_sheet(protokoll);
  blatt["!cols"] = [{ wch: 12 }, { wch: 20 }, { wch: 60 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(mappe, blatt, BLATT_PROTOKOLL);

  const laufzettel = [
    ["Stelle", "Was die Stelle prüft", "Benötigte Unterlagen", "Frist", "Ergebnis"],
    ...laufzettelSeiten(daten, profil).map((s) => [
      s.stelle.bezeichnung,
      s.pruefgegenstand,
      s.unterlagen.join("\n"),
      s.frist,
      s.ergebnis,
    ]),
  ];
  XLSX.utils.book_append_sheet(mappe, XLSX.utils.aoa_to_sheet(laufzettel), BLATT_LAUFZETTEL);

  return XLSX.write(mappe, { bookType: format, type: "array" }) as ArrayBuffer;
}

function zelle(wert: unknown): string {
  if (wert === null || wert === undefined) return "";
  return String(wert).trim();
}

/** Liest Rückmeldungen und Empfänger aus einer zuvor gespeicherten Arbeitsmappe. */
export async function protokollAusArbeitsmappe(inhalt: ArrayBuffer): Promise<{
  rueckmeldungen: Rueckmeldung[];
  empfaenger: string | null;
  vorgangKennung: string | null;
}> {
  const XLSX = await import("xlsx");
  let mappe;
  try {
    mappe = XLSX.read(inhalt, { type: "array" });
  } catch {
    throw new Tabellenfehler(TABELLENFEHLER_TEXT);
  }
  const blatt = mappe.Sheets[BLATT_PROTOKOLL];
  if (!blatt) throw new Tabellenfehler(TABELLENFEHLER_TEXT);
  const zeilen = XLSX.utils.sheet_to_json<unknown[]>(blatt, { header: 1, raw: false, defval: "" });
  const kopf = (zeilen[0] ?? []).map(zelle);
  if (kopf[0] !== PROTOKOLL_SPALTEN[0] || kopf[2] !== PROTOKOLL_SPALTEN[2]) {
    throw new Tabellenfehler(TABELLENFEHLER_TEXT);
  }
  const rueckmeldungen = zeilen
    .slice(1)
    .map((z) => ({
      datum: zelle(z[0]),
      rolle: zelle(z[1]),
      beobachtung: zelle(z[2]),
      folge: zelle(z[3]),
    }))
    .filter((r) => [r.datum, r.rolle, r.beobachtung, r.folge].some((t) => t !== ""));

  let empfaenger: string | null = null;
  let vorgangKennung: string | null = null;
  const vorgang = mappe.Sheets[BLATT_VORGANG];
  if (vorgang) {
    for (const z of XLSX.utils.sheet_to_json<unknown[]>(vorgang, { header: 1, raw: false })) {
      if (zelle(z[0]) === "Empfänger") empfaenger = zelle(z[1]);
      if (zelle(z[0]) === "Vorgang") vorgangKennung = zelle(z[1]);
    }
  }
  return { rueckmeldungen, empfaenger, vorgangKennung };
}

/** Speichert das Protokoll als Datei im Browser. */
export async function protokollSpeichern(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
  format: Tabellenformat,
): Promise<void> {
  if (typeof document === "undefined") return;
  const inhalt = await protokollArbeitsmappe(daten, profil, format);
  const url = URL.createObjectURL(new Blob([inhalt], { type: MIME[format] }));
  const a = document.createElement("a");
  a.href = url;
  a.download = dateiname(daten, format, "protokoll");
  a.click();
  URL.revokeObjectURL(url);
}
