// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Erzeugt REGELWERK.md aus dem Regelkern und der Vorlagenschicht, damit die
 * lesbare Fassung nie vom Code abweicht.
 *
 * Aufruf: npm run regelwerk
 */

import { writeFileSync } from "node:fs";
import {
  CHECKLISTENPUNKTE,
  FALLARTEN,
  FRAGEN,
  HINWEISE,
  REGELWERK_VERSION,
  UMGESTALTUNGSVORSCHLAEGE,
} from "../src/data/regelwerk";
import { STELLEN } from "../src/data/beteiligungen";
import {
  ABBRUCHKRITERIEN,
  ABBRUCH_LEITSATZ,
  AMPEL_TEXTE,
  GELTUNGSDAUER_HINWEIS,
  GRUNDAUFLAGEN,
  ZUSATZAUFLAGEN_GELB,
  BEDINGTE_ABBRUCHKRITERIEN,
  BEDINGTE_AUFLAGEN,
} from "../src/data/vorlagen";
import { LANDESVORGABEN, VORPRUEFUNG_KENNZEICHNUNG } from "../src/data/landesvorgaben";
import { fundstelleDoku } from "../src/lib/erprobung/fundstelle";

const BEREICHE: Record<string, string> = {
  ki: "KI-Verordnung",
  datenschutz: "Datenschutz",
  it_sicherheit: "IT-Sicherheit",
  betrieb: "Betrieb und Mitbestimmung",
  finanzen: "Finanzen und Beschaffung",
  update: "Update eines vorhandenen Werkzeugs",
};

const z: string[] = [];

// REUSE-IgnoreStart
z.push(
  "<!--",
  "SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)",
  "SPDX-License-Identifier: EUPL-1.2",
  "-->",
  "",
  "# Regelwerk des Erprobungspasses",
  "",
  `Fassung ${REGELWERK_VERSION}. Diese Datei wird aus \`src/data/regelwerk.ts\`, \`src/data/beteiligungen.ts\` und \`src/data/vorlagen.ts\` erzeugt. Ändern Sie das Regelwerk im Quellcode und erzeugen Sie diese Fassung mit \`bun run scripts/regelwerk-md.ts\` neu.`,
  "",
  "## Fallarten",
  "",
);
// REUSE-IgnoreEnd

for (const fa of FALLARTEN) {
  z.push(`### ${fa.titel}`, "", fa.beschreibung, "");
  if (fa.hinweis) z.push(fa.hinweis, "");
  z.push(
    fa.kiFragenStellen
      ? "Die Fragen zur KI-Verordnung werden gestellt."
      : "Die Fragen zur KI-Verordnung entfallen.",
    "",
  );
}

z.push("## Prüffragen", "");
for (const [bereich, titel] of Object.entries(BEREICHE)) {
  const fragen = FRAGEN.filter((f) => f.bereich === bereich);
  if (fragen.length === 0) continue;
  z.push(`### ${titel}`, "");
  for (const f of fragen) {
    z.push(`#### ${f.text}`, "");
    z.push(`- Kennung: \`${f.id}\``);
    z.push(`- Fundstelle: ${fundstelleDoku(f.fundstelle)}`);
    if (f.geltungAb) z.push(`- Gilt ab dem ${f.geltungAb}`);
    if (f.einleitung) z.push(`- Einleitender Hinweis: ${f.einleitung}`);
    if (f.sichtbarWenn)
      z.push("- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt");
    if (f.nurWenn) {
      z.push(
        `- Wird nur gestellt, wenn \`${f.nurWenn.frageId}\` mit „${f.nurWenn.wert}“ beantwortet ist`,
      );
    }
    if (f.ergaenzend) z.push("- Ergänzende Frage, hält den Weiterweg nicht auf");
    if (f.typ === "ja_nein")
      z.push("- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)");
    if (f.nurFallart) z.push(`- Nur bei Fallart: ${f.nurFallart.join(", ")}`);
    z.push("", f.erlaeuterung, "", `Beispiel: ${f.beispiel}`, "");
    if (f.optionen) {
      z.push("Auswahlmöglichkeiten:", "");
      for (const o of f.optionen) {
        z.push(
          `- ${o.text}${o.geltungAb ? ` (gilt ab dem ${o.geltungAb})` : ""}${o.beispiel ? ` — Beispiel: ${o.beispiel}` : ""}`,
        );
      }
      z.push("");
    }
  }
}

z.push("## Einordnung", "");
z.push(
  "Rot, sobald eine bereits geltende verbotene Praktik gewählt ist oder eine verbindliche Entscheidung ohne Prüfung durch eine zuständige Person und ohne Rechtsvorschrift ergehen soll. Gelb, sobald besondere Datenkategorien, eine Überwachungseignung, eine automatisierte Einzelentscheidung mit rechtlicher Wirkung, eine Schwelle der Datenschutz-Folgenabschätzung, eine kritische Voreinstellung des Anbieters oder das Zusammentreffen der drei Update-Merkmale vorliegt. Sonst Grün. Regeln mit einem Geltungsdatum in der Zukunft erscheinen im Prüfpfad, führen aber nicht zu einer Höherstufung.",
  "",
);
for (const [stufe, text] of Object.entries(AMPEL_TEXTE)) {
  z.push(`### ${text.wort} (\`${stufe}\`)`, "", `${text.satz} ${text.vorgehen}`, "");
}

z.push("## Vorschläge zur Umgestaltung bei Rot", "");
for (const [id, text] of Object.entries(UMGESTALTUNGSVORSCHLAEGE)) {
  z.push(`- \`${id}\`: ${text}`);
}
z.push("");

z.push("## Zusätzliche Hinweise", "");
for (const [id, h] of Object.entries(HINWEISE)) {
  const geltung = "geltungAb" in h && h.geltungAb ? ` — gilt ab dem ${h.geltungAb}` : "";
  z.push(`- \`${id}\`: ${h.text} (${h.fundstelle})${geltung}`);
}
z.push("");

z.push("## Zu beteiligende Stellen", "");
for (const s of STELLEN) {
  z.push(`- ${s.bezeichnung}${s.hinweis ? ` — ${s.hinweis}` : ""}`);
  z.push(`  Prüft: ${s.pruefgegenstand}`);
  if (s.vorbedingung) z.push(`  Vorbedingung: ${s.vorbedingung}`);
}
z.push("");
z.push("## Technische Landesvorgaben", "", VORPRUEFUNG_KENNZEICHNUNG, "");
for (const [land, vorgaben] of Object.entries(LANDESVORGABEN)) {
  z.push(`### ${land}`, "");
  for (const v of vorgaben) z.push(`- ${v.titel}: ${v.beschreibung} (${v.fundstelle})`);
  z.push("");
}
z.push("Für alle übrigen Länder: Landesvorgaben noch nicht hinterlegt.");
z.push("");

z.push("## Grundauflagen", "");
GRUNDAUFLAGEN.forEach((a, i) => z.push(`${i + 1}. ${a}`));
z.push("", "## Zusätzliche Auflagen bei Gelb und Rot", "");
ZUSATZAUFLAGEN_GELB.forEach((a, i) => z.push(`${i + 1}. ${a}`));
z.push("", "## Auflagen mit Auslösebedingung", "");
BEDINGTE_AUFLAGEN.forEach((a, i) => z.push(`${i + 1}. ${a.text}`));
z.push("", "## Abbruchkriterien", "", ABBRUCH_LEITSATZ, "");
ABBRUCHKRITERIEN.forEach((a, i) => z.push(`${i + 1}. ${a}`));
BEDINGTE_ABBRUCHKRITERIEN.forEach((a, i) =>
  z.push(`${ABBRUCHKRITERIEN.length + i + 1}. ${a.text} (nur bei personenbezogenen Daten)`),
);
z.push("", "## Geltungsdauer", "", GELTUNGSDAUER_HINWEIS, "");

z.push("## Dokumenten-Checkliste", "");
for (const p of CHECKLISTENPUNKTE) {
  z.push(`### ${p.was}`, "", p.warum, "", `Fundstelle: ${p.fundstelle}`, "");
}

writeFileSync("REGELWERK.md", `${z.join("\n").trimEnd()}\n`, "utf8");
console.log("REGELWERK.md erzeugt.");
