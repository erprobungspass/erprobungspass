// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Liest einen Betrag in Euro; „120.000 €“ und „120000“ ergeben 120000.
 *
 * Der Punkt ist nur dann Tausendertrennung, wenn er auch so gesetzt ist
 * (Dreiergruppen). Sonst gilt er als Dezimaltrennung, damit „1500.50“ nicht
 * als 150050 gelesen wird.
 */
export function betragLesen(wert: unknown): number | null {
  if (typeof wert !== "string") return null;
  const ohneZierde = wert.replace(/[€\s]/g, "");
  if (ohneZierde === "" || ohneZierde === "unklar") return null;

  const bereinigt = ohneZierde.includes(",")
    ? ohneZierde.replace(/\./g, "").replace(",", ".")
    : /^\d{1,3}(\.\d{3})+$/.test(ohneZierde)
      ? ohneZierde.replace(/\./g, "")
      : ohneZierde;

  // Nur einfache Dezimalzahlen; Exponentialschreibweise ist kein Betrag.
  if (!/^\d+(\.\d+)?$/.test(bereinigt)) return null;
  const zahl = Number(bereinigt);
  return Number.isFinite(zahl) ? zahl : null;
}
