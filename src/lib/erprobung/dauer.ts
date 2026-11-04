// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/** Berechnung und Beschriftung der Geltungsdauer in Wochen. */

import { GELTUNGSDAUER_WOCHEN_MAX, GELTUNGSDAUER_WOCHEN_MIN } from "@/data/vorlagen";
import { datumDeutsch } from "./speicher";

export function wochenGueltig(wochen: number): boolean {
  return (
    Number.isInteger(wochen) &&
    wochen >= GELTUNGSDAUER_WOCHEN_MIN &&
    wochen <= GELTUNGSDAUER_WOCHEN_MAX
  );
}

/** Enddatum als ISO-Datum (JJJJ-MM-TT) oder leer, wenn kein Start vorliegt. */
export function endDatumIso(startIso: string, wochen: number): string {
  if (!startIso || !wochenGueltig(wochen)) return "";
  const start = new Date(`${startIso}T00:00:00`);
  if (Number.isNaN(start.getTime())) return "";
  const ende = new Date(start.getTime());
  ende.setDate(ende.getDate() + wochen * 7);
  return ende.toISOString().slice(0, 10);
}

/** „12 Wochen, Ende am 27.12.2026“ oder „12 Wochen“ ohne Startdatum. */
export function geltungsdauerText(startIso: string, wochen: number): string {
  const wort = wochen === 1 ? "1 Woche" : `${wochen} Wochen`;
  const ende = endDatumIso(startIso, wochen);
  return ende ? `${wort}, Ende am ${datumDeutsch(ende)}` : wort;
}
