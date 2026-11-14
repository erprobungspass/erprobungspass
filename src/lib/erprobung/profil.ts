// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Speicherung des Einrichtungsprofils. Das Profil liegt getrennt vom
 * einzelnen Vorgang und wird als eigene Datei aus- und eingelesen.
 */

import { PROFILROLLEN, leeresProfil } from "@/data/einrichtung";
import type { Beteiligung, Einrichtungsprofil } from "./typen";
import { herunterladen } from "./datei";

export const PROFIL_SCHLUESSEL = "erprobungspass.einrichtung";

export function profilLaden(): Einrichtungsprofil | null {
  if (typeof window === "undefined") return null;
  try {
    const roh = window.localStorage.getItem(PROFIL_SCHLUESSEL);
    if (!roh) return null;
    const profil = JSON.parse(roh) as Einrichtungsprofil;
    if (!profil || typeof profil !== "object") return null;
    return { ...leeresProfil(), ...profil, rollen: { ...leeresProfil().rollen, ...profil.rollen } };
  } catch {
    return null;
  }
}

export function profilSpeichern(profil: Einrichtungsprofil): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PROFIL_SCHLUESSEL,
      JSON.stringify({ ...profil, gespeichertAm: new Date().toISOString() }),
    );
  } catch {
    /* Speicher nicht verfügbar */
  }
}

export function profilVerwerfen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFIL_SCHLUESSEL);
}

export function profilExportieren(profil: Einrichtungsprofil): void {
  herunterladen(JSON.stringify(profil, null, 2), "application/json", "einrichtungsprofil.json");
}

export async function profilImportieren(datei: File): Promise<Einrichtungsprofil> {
  const profil = JSON.parse(await datei.text()) as Einrichtungsprofil;
  if (!profil || typeof profil !== "object" || typeof profil.name !== "string") {
    throw new Error("Die Datei enthält kein gültiges Einrichtungsprofil.");
  }
  return { ...leeresProfil(), ...profil, rollen: { ...leeresProfil().rollen, ...profil.rollen } };
}

/** Belegt leere Felder der Beteiligungen aus dem Profil vor. */
export function beteiligungenVorbelegen(
  beteiligungen: Record<string, Beteiligung>,
  profil: Einrichtungsprofil | null,
): Record<string, Beteiligung> {
  if (!profil) return beteiligungen;
  const naechste = { ...beteiligungen };
  for (const rolle of PROFILROLLEN) {
    if (!rolle.stelleId) continue;
    const angabe = profil.rollen[rolle.id];
    if (!angabe || (!angabe.name && !angabe.kontakt)) continue;
    const vorhanden = naechste[rolle.stelleId];
    naechste[rolle.stelleId] = {
      status: vorhanden?.status ?? "offen",
      name: vorhanden?.name || angabe.name,
      kontakt: vorhanden?.kontakt || angabe.kontakt,
    };
  }
  return naechste;
}
