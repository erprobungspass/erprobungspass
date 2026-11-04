// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { abschlussDokument } from "@/lib/erprobung/dokumentaufbau";
import type { Erprobungsdaten } from "@/lib/erprobung/typen";
import { DokumentAnsicht } from "./DokumentAnsicht";

export function Abschlussvermerk({ daten }: { daten: Erprobungsdaten }) {
  return <DokumentAnsicht dokument={abschlussDokument(daten)} daten={daten} />;
}
