// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { freigabeDokument } from "@/lib/erprobung/dokumentaufbau";
import type { Einrichtungsprofil, Erprobungsdaten } from "@/lib/erprobung/typen";
import { DokumentAnsicht } from "./DokumentAnsicht";

interface Props {
  daten: Erprobungsdaten;
  profil: Einrichtungsprofil | null;
}

export function Schritt5Pass({ daten, profil }: Props) {
  return <DokumentAnsicht dokument={freigabeDokument(daten, profil)} daten={daten} />;
}
