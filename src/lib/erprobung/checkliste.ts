// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/** Ableitung der Dokumenten-Checkliste aus den Antworten in Schritt 2. */

import { CHECKLISTENPUNKTE, type Checklistenpunkt } from "@/data/regelwerk";
import type { Signale } from "./typen";

export function offeneUnterlagen(signale: Signale): Checklistenpunkt[] {
  return CHECKLISTENPUNKTE.filter((p) => p.ausloeser(signale));
}
