// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Allgemein geltende technische Vorgaben für Kommunen und Behörden in Bayern.
 * Die Einträge sind als zu prüfende Punkte gefasst; sie bilden eine
 * Vorprüfung und ersetzen nicht die Freigabe des ISB.
 */

import type { Landesvorgabe } from "./index";

export const BAYERN: Landesvorgabe[] = [
  {
    id: "by_isk",
    titel: "Informationssicherheitskonzept",
    beschreibung:
      "Zu prüfen ist, ob das Werkzeug im Informationssicherheitskonzept der Behörde berücksichtigt ist oder vor dem Start aufgenommen wird.",
    fundstelle: "Art. 11 des Bayerischen Digitalgesetzes (BayDiG, Informationssicherheit)",
  },
  {
    id: "by_grundschutz",
    titel: "Orientierung am IT-Grundschutz und an den Empfehlungen des LSI",
    beschreibung:
      "Zu prüfen ist, ob die Maßnahmen dem BSI-IT-Grundschutz oder den Empfehlungen des Landesamts für Sicherheit in der Informationstechnik (LSI) entsprechen.",
    fundstelle:
      "Art. 11 BayDiG · BSI-Standards 200-1 bis 200-3 (IT-Grundschutz) · Empfehlungen des LSI für Kommunen",
  },
  {
    id: "by_testat",
    titel: "Zertifizierung oder Testat des Anbieters",
    beschreibung:
      "Zu prüfen ist, ob der Anbieter ein Zertifikat nach ISO/IEC 27001 auf der Basis von IT-Grundschutz oder bei Cloud-Diensten ein Testat nach BSI C5 vorlegt.",
    fundstelle:
      "ISO/IEC 27001 auf der Basis von IT-Grundschutz · BSI-Kriterienkatalog C5 (Cloud Computing Compliance Criteria Catalogue)",
  },
  {
    id: "by_eu",
    titel: "Datenhaltung in der Europäischen Union",
    beschreibung:
      "Zu prüfen ist, ob die Daten einschließlich Sicherungen und Unterauftragnehmern ausschließlich in der Europäischen Union gehalten werden.",
    fundstelle:
      "Kapitel V, Art. 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung an Drittländer)",
  },
  {
    id: "by_rechte",
    titel: "Rollen- und Rechtekonzept",
    beschreibung:
      "Zu prüfen ist, ob Zugriffe nach Rollen vergeben, dokumentiert und auf die an der Erprobung beteiligten Personen beschränkt sind.",
    fundstelle:
      "Art. 32 Abs. 1 der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein ORP.4 (Identitäts- und Berechtigungsmanagement)",
  },
  {
    id: "by_protokoll",
    titel: "Protokollierung",
    beschreibung:
      "Zu prüfen ist, ob sicherheitsrelevante Ereignisse und Zugriffe protokolliert und die Protokolle geschützt aufbewahrt werden.",
    fundstelle:
      "Art. 32 Abs. 1 der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein OPS.1.1.5 (Protokollierung)",
  },
  {
    id: "by_verschluesselung",
    titel: "Verschlüsselung bei Übertragung und Speicherung",
    beschreibung:
      "Zu prüfen ist, ob Daten bei der Übertragung und bei der Speicherung nach dem Stand der Technik verschlüsselt werden.",
    fundstelle:
      "Art. 32 Abs. 1 Buchst. a der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein CON.1 (Kryptokonzept)",
  },
  {
    id: "by_sicherung",
    titel: "Datensicherung und Löschkonzept",
    beschreibung:
      "Zu prüfen ist, ob Datensicherung, Wiederherstellung und die Löschung nach Ende der Erprobung geregelt sind.",
    fundstelle:
      "Art. 17 und Art. 32 Abs. 1 Buchst. c der Verordnung (EU) 2016/679 · IT-Grundschutz-Bausteine CON.3 (Datensicherungskonzept) und CON.6 (Löschen und Vernichten)",
  },
];
