// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/** Liest einen Betrag in Euro; „120.000 €“ und „120000“ ergeben 120000. */
export function betragLesen(wert: unknown): number | null {
  if (typeof wert !== "string") return null;
  const bereinigt = wert.replace(/[€\s]/g, "").replace(/\./g, "").replace(",", ".");
  if (bereinigt === "" || bereinigt === "unklar") return null;
  const zahl = Number(bereinigt);
  return Number.isFinite(zahl) && zahl >= 0 ? zahl : null;
}
