// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Geltungsdaten des Regelkerns. Regeln mit einem Datum in der Zukunft
 * erscheinen weiterhin im Prüfpfad, führen aber nicht zu einer Höherstufung
 * der Ampel.
 */

import { datumDeutsch } from "./speicher";

export function giltSchon(geltungAb?: string, stichtag: Date = new Date()): boolean {
  if (!geltungAb) return true;
  const datum = new Date(geltungAb);
  if (Number.isNaN(datum.getTime())) return true;
  return datum.getTime() <= stichtag.getTime();
}

export function geltungshinweis(geltungAb: string): string {
  return `Gilt ab dem ${datumDeutsch(geltungAb)}`;
}
