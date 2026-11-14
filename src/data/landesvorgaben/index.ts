// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Organisationsschicht, Teil Landesvorgaben: allgemein geltende technische
 * Vorgaben je Bundesland für die technische Vorprüfung des ISB. Jedes Land
 * steht in einer eigenen Datei; ein weiteres Land kommt hinzu, indem eine
 * Datei angelegt und hier in die Zuordnung aufgenommen wird.
 */

import { BAYERN } from "./bayern";

export interface Landesvorgabe {
  id: string;
  titel: string;
  beschreibung: string;
  fundstelle: string;
}

/** Zuordnung Bundesland → Vorgaben. Länder ohne Eintrag sind noch nicht hinterlegt. */
export const LANDESVORGABEN: Record<string, Landesvorgabe[]> = {
  Bayern: BAYERN,
};

export const LANDESVORGABEN_FEHLEN = "Landesvorgaben noch nicht hinterlegt";

export const VORPRUEFUNG_TITEL = "Technische Vorprüfung für den ISB";

export const VORPRUEFUNG_KENNZEICHNUNG = "Vorprüfung, ersetzt nicht die Stellungnahme des ISB.";

export type Vorpruefstand = "erfuellt" | "nicht_erfuellt" | "unklar";

export const VORPRUEFSTAENDE: { id: Vorpruefstand; text: string }[] = [
  { id: "erfuellt", text: "erfüllt" },
  { id: "nicht_erfuellt", text: "nicht erfüllt" },
  { id: "unklar", text: "noch unklar" },
];

export function landesvorgaben(bundesland: string | undefined | null): Landesvorgabe[] {
  return (bundesland && LANDESVORGABEN[bundesland]) || [];
}

/** Schlüssel, unter dem der Stand einer Vorgabe bei den Antworten liegt. */
export function vorpruefSchluessel(id: string): string {
  return `lv_${id}`;
}
