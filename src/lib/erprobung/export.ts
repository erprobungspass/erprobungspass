// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Ausgabeformate: Markdown mit allen drei Dokumenten, der vollständige
 * Vorgang als JSON und der anonymisierte Fallsatz für die Fallsammlung.
 *
 * Der Inhalt der Dokumente stammt aus dem gemeinsamen Aufbau in
 * `dokumentaufbau.ts`; hier wird er nur nach Markdown übertragen. So bleiben
 * Druckansicht und Markdown-Fassung deckungsgleich.
 */

import { FALLARTEN, REGELWERK_VERSION } from "@/data/regelwerk";
import { AMPEL_TEXTE, AUSGANG_TEXTE, BEISPIEL_HINWEIS, HAFTUNGSHINWEIS } from "@/data/vorlagen";
import { einordnen } from "./bewertung";
import {
  abschlussDokument,
  freigabeDokument,
  protokollDokument,
  type Abschnitt,
  type Block,
  type Dokument,
  type Zelle,
} from "./dokumentaufbau";
import { geltungshinweis } from "./geltung";
import { dateiname, datumDeutsch, monatJahrDeutsch } from "./speicher";
import { herunterladen } from "./datei";
import type { Einrichtungsprofil, Erprobungsdaten } from "./typen";

const LINIE = "______________________________________________________________";
const KURZE_LINIE = "______________________";

function fussnote(daten: Erprobungsdaten): string[] {
  return [
    "---",
    "",
    HAFTUNGSHINWEIS,
    "",
    `Regelwerksversion ${daten.version || REGELWERK_VERSION} · Erstellt am ${datumDeutsch(new Date().toISOString())} · Vorgang ${daten.vorgangKennung}`,
  ];
}

function zelleText(zelle: Zelle): string {
  const text = zelle.text ?? KURZE_LINIE;
  return zelle.zusatz ? `${text} — ${zelle.zusatz}` : text;
}

function baustein(block: Block, ebene: number): string[] {
  const z: string[] = [];
  switch (block.art) {
    case "absatz":
      z.push(block.text, "");
      break;

    case "ampel":
      z.push(`Ergebnis: ${block.wort}. ${block.text}`, "");
      break;

    case "hinweise":
      for (const h of block.punkte) {
        z.push(`- ${h.text}${h.fundstelle ? ` (${h.fundstelle})` : ""}`);
        if (h.geltungAb) z.push(`  ${geltungshinweis(h.geltungAb)}`);
      }
      z.push("");
      break;

    case "liste":
      for (const p of block.punkte) z.push(`- ${p}`);
      z.push("");
      break;

    case "nummern":
      block.punkte.forEach((p, i) => z.push(`${i + 1}. ${p}`));
      z.push("");
      break;

    case "kaestchen":
      for (const p of block.punkte) {
        z.push(`- [ ] ${p.text}`);
        for (const zusatz of p.zusatz ?? []) z.push(`  ${zusatz}`);
      }
      z.push("");
      break;

    case "tabelle":
      if (block.beschriftung) z.push(block.beschriftung, "");
      z.push(`| ${block.spalten.join(" | ")} |`);
      z.push(`| ${block.spalten.map(() => "---").join(" | ")} |`);
      for (const zeile of block.zeilen) z.push(`| ${zeile.map(zelleText).join(" | ")} |`);
      z.push("");
      break;

    case "leertabelle":
      z.push(`| ${block.spalten.join(" | ")} |`);
      z.push(`| ${block.spalten.map(() => "---").join(" | ")} |`);
      for (let i = 0; i < block.zeilen; i++) {
        z.push(`| ${block.spalten.map(() => "").join(" | ")} |`);
      }
      z.push("");
      break;

    case "schreibfeld":
      for (let i = 0; i < block.zeilen; i++) z.push(LINIE, "");
      break;

    case "unterschrift":
      for (const f of block.felder) z.push(`${f}: ${KURZE_LINIE}`, "");
      break;

    case "unterabschnitt":
      z.push(`${"#".repeat(ebene)} ${block.titel}`, "");
      for (const b of block.blocks) z.push(...baustein(b, ebene + 1));
      break;
  }
  return z;
}

function abschnitt(a: Abschnitt, ebene: number): string[] {
  const z: string[] = [];
  if (a.titel) z.push(`${"#".repeat(ebene)} ${a.titel}`, "");
  for (const b of a.blocks) z.push(...baustein(b, ebene + 1));
  return z;
}

function dokumentMarkdown(dokument: Dokument, daten: Erprobungsdaten, ebene = 2): string[] {
  const z: string[] = [`${"#".repeat(ebene)} ${dokument.titel}`, ""];
  for (const f of dokument.kopf) z.push(`- ${f.begriff}: ${f.wert}`);
  z.push("");
  if (daten.beispiel) z.push(BEISPIEL_HINWEIS, "");
  for (const b of dokument.vorspann) z.push(...baustein(b, ebene + 1));
  for (const a of dokument.abschnitte) z.push(...abschnitt(a, ebene + 1));
  z.push(...fussnote(daten), "");
  return z;
}

export function alsMarkdown(daten: Erprobungsdaten, profil: Einrichtungsprofil | null): string {
  const z: string[] = [`# Erprobungspass — Vorgang ${daten.vorgangKennung}`, ""];
  z.push(...dokumentMarkdown(freigabeDokument(daten, profil), daten));
  z.push(...dokumentMarkdown(protokollDokument(daten), daten));
  z.push(...dokumentMarkdown(abschlussDokument(daten), daten));
  return z
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

export function markdownHerunterladen(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): void {
  herunterladen(alsMarkdown(daten, profil), "text/markdown", dateiname(daten, "md"));
}

/** Anonymisierter Fallsatz für die öffentliche Fallsammlung. */
export interface Fallsatz {
  fallart: string;
  anwendungsfall: string;
  einordnung: { ampel: string; auslösendeMerkmale: string[] };
  auflagen: string[];
  geltungsdauerWochen: number;
  ausgang: string;
  regelwerksversion: string;
  monat: number;
  jahr: number;
}

export function fallsatzErzeugen(daten: Erprobungsdaten): Fallsatz {
  const ergebnis = einordnen(daten.vorhaben.fallart, daten.antworten);
  const fallart = FALLARTEN.find((f) => f.id === daten.vorhaben.fallart);
  const jetzt = new Date();
  return {
    fallart: fallart?.titel ?? "nicht angegeben",
    anwendungsfall: daten.vorhaben.kurzbeschreibung.trim().slice(0, 300),
    einordnung: {
      ampel: AMPEL_TEXTE[ergebnis.ampel].wort,
      auslösendeMerkmale: ergebnis.ausloeser.map((a) => a.antwort),
    },
    auflagen: daten.auflagen.filter((a) => a.trim() !== ""),
    geltungsdauerWochen: daten.geltungsdauerWochen,
    ausgang: AUSGANG_TEXTE[daten.ausgang] ?? "noch offen",
    regelwerksversion: daten.version || REGELWERK_VERSION,
    monat: jetzt.getMonth() + 1,
    jahr: jetzt.getFullYear(),
  };
}

export function fallsatzHerunterladen(daten: Erprobungsdaten): void {
  herunterladen(
    JSON.stringify(fallsatzErzeugen(daten), null, 2),
    "application/json",
    dateiname(daten, "json", "fallsatz"),
  );
}

export function monatJahrText(): string {
  return monatJahrDeutsch(new Date().toISOString());
}
