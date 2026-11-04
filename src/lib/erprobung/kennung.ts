// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Vorgangskennung: kurze Kennung aus Zeitstempel und laufender Zahl. Sie
 * erscheint in allen drei Dokumenten und in allen Exporten und macht eine
 * Einstufung nachvollziehbar.
 */

const ZAEHLER_SCHLUESSEL = "erprobungspass.laufendeZahl";

function laufendeZahl(): number {
  if (typeof window === "undefined") return 1;
  try {
    const alt = Number(window.localStorage.getItem(ZAEHLER_SCHLUESSEL) ?? "0");
    const neu = Number.isFinite(alt) && alt > 0 ? alt + 1 : 1;
    window.localStorage.setItem(ZAEHLER_SCHLUESSEL, String(neu));
    return neu;
  } catch {
    return 1;
  }
}

export function neueKennung(zeitpunkt: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const stempel =
    `${zeitpunkt.getFullYear()}${p(zeitpunkt.getMonth() + 1)}${p(zeitpunkt.getDate())}` +
    `-${p(zeitpunkt.getHours())}${p(zeitpunkt.getMinutes())}`;
  return `EP-${stempel}-${String(laufendeZahl()).padStart(3, "0")}`;
}
