// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Organisationsschicht, Teil Einrichtungsprofil: welche Rollen eine
 * Einrichtung einmal hinterlegt und welche Hausregeln danach für alle
 * Vorhaben gelten.
 */

import type { Einrichtungsprofil } from "@/lib/erprobung/typen";

export interface Profilrolle {
  id: string;
  bezeichnung: string;
  /** Stelle in Schritt 3, deren Felder aus dieser Rolle vorbelegt werden. */
  stelleId?: string;
}

export const PROFILROLLEN: Profilrolle[] = [
  { id: "leitung", bezeichnung: "Zeichnungsberechtigte Leitung", stelleId: "leitung" },
  {
    id: "datenschutz",
    bezeichnung: "Datenschutzbeauftragte oder Datenschutzbeauftragter",
    stelleId: "datenschutz",
  },
  {
    id: "informationssicherheit",
    bezeichnung:
      "Informationssicherheitsbeauftragte oder Informationssicherheitsbeauftragter (ISB)",
    stelleId: "informationssicherheit",
  },
  { id: "personalrat", bezeichnung: "Personalrat", stelleId: "personalrat" },
  { id: "it_betrieb", bezeichnung: "IT-Betrieb", stelleId: "it_betrieb" },
  {
    id: "schwerbehindertenvertretung",
    bezeichnung: "Schwerbehindertenvertretung",
    stelleId: "swb_gleichstellung",
  },
  { id: "gleichstellung", bezeichnung: "Gleichstellungsbeauftragte" },
  { id: "finanzen", bezeichnung: "Finanzen / Kämmerei", stelleId: "finanzen" },
  { id: "vergabe", bezeichnung: "Vergabestelle", stelleId: "vergabe" },
];

export const GREMIENSCHWELLE_BEISPIEL = "z. B. Stadtrat ab 100.000 €";
export const VERGABESCHWELLE_BEISPIEL = "z. B. Ausschreibung ab 25.000 €";

export const PROFIL_LEITSATZ =
  "Das Profil wird einmal je Einrichtung hinterlegt und gilt danach für alle Vorhaben.";

export const PROFIL_ERKLAERUNG = [
  "Hier hinterlegen Sie, was in Ihrem Haus gilt: die zu beteiligenden Stellen mit Namen und Kontakt sowie Festlegungen zum Verfahren und zu den Schwellen für Gremium und Vergabe.",
  "Die Angaben werden ausschließlich in diesem Browser gespeichert und belegen die Felder in Schritt 3 vor.",
];

export const PROFIL_HOECHSTDAUER_VORSCHLAG = 12;

export function leeresProfil(): Einrichtungsprofil {
  const rollen: Einrichtungsprofil["rollen"] = {};
  for (const r of PROFILROLLEN) {
    rollen[r.id] = { name: "", funktion: "", kontakt: "" };
  }
  return {
    name: "",
    kuerzel: "",
    ebene: "",
    bundesland: "",
    rollen,
    personalratImmer: false,
    freigabeDatenschutzErforderlich: false,
    hoechstdauerWochen: PROFIL_HOECHSTDAUER_VORSCHLAG,
    gremienschwelle: "",
    vergabeschwelle: "",
    gespeichertAm: "",
  };
}
