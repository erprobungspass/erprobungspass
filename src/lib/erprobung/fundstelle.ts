// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Auflösung der zweiteiligen Fundstellen: der unionsrechtliche Teil steht
 * fest, der nationale Teil richtet sich nach dem Einrichtungsprofil.
 */

import { FUNDSTELLE_RUECKFALL, nationaleBezeichnung } from "@/data/ebenen";
import type { Fundstelle } from "@/data/regelwerk";
import type { Einrichtungsprofil } from "./typen";

/**
 * Fundstellentext. In der Anwendung erscheint ohne Profil der Rückfalltext;
 * in den Dokumenten wird der nationale Teil dann weggelassen (rueckfall=false),
 * weil eine Aufforderung an die ausfüllende Person nicht in ein Dokument
 * gehört, das eine Behördenleitung unterschreibt.
 */
export function fundstelleText(
  fundstelle: Fundstelle,
  profil?: Einrichtungsprofil | null,
  rueckfall = true,
): string {
  const teile: string[] = [];
  if (fundstelle.fest) teile.push(fundstelle.fest);
  if (fundstelle.national) {
    const national = nationaleBezeichnung(
      fundstelle.national,
      profil?.ebene ?? "",
      profil?.bundesland ?? "",
    );
    if (national) teile.push(national);
    else if (rueckfall) teile.push(FUNDSTELLE_RUECKFALL);
  }
  return teile.join(" · ");
}

const GEBIETSNAME: Record<string, string> = {
  beschaeftigtendatenschutz: "nationales Beschäftigtendatenschutzrecht",
  verwaltungsverfahren: "nationales Verwaltungsverfahrensrecht",
  personalvertretung: "nationales Personalvertretungsrecht",
  barrierefreiheit: "nationales Barrierefreiheitsrecht",
};

/** Fassung für die lesbare Dokumentation ohne hinterlegtes Profil. */
export function fundstelleDoku(fundstelle: Fundstelle): string {
  const teile: string[] = [];
  if (fundstelle.fest) teile.push(fundstelle.fest);
  if (fundstelle.national) {
    teile.push(GEBIETSNAME[fundstelle.national] ?? "nationales Recht des Trägers");
  }
  return teile.join(" · ");
}
