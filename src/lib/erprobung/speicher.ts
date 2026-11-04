// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { REGELWERK_VERSION } from "@/data/regelwerk";
import {
  ABBRUCHKRITERIEN,
  GELTUNGSDAUER_WOCHEN_VORSCHLAG,
  GRUNDAUFLAGEN,
  LADEFEHLER_FORMAT,
  LADEFEHLER_FREMD,
  LADEFEHLER_PROFIL,
  PROTOKOLL_EMPFAENGER_VORSCHLAG,
} from "@/data/vorlagen";
import type { Erprobungsdaten } from "./typen";
import { einordnen } from "./bewertung";
import { neueKennung } from "./kennung";

import { dateinamensteil, herunterladen } from "./datei";

export const SPEICHER_SCHLUESSEL = "erprobungspass.entwurf";

export function leereDaten(): Erprobungsdaten {
  return {
    version: REGELWERK_VERSION,
    vorgangKennung: neueKennung(),
    gespeichertAm: new Date().toISOString(),
    schritt: 1,
    hoechsterSchritt: 1,
    vorhaben: {
      fallart: null,
      bezeichnung: "",
      anbieter: "",
      kurzbeschreibung: "",
      behoerde: "",
      verantwortlich: "",
      kontakt: "",
      zeitraumVon: "",
      anzahlBeschaeftigte: "",
      aktenzeichen: "",
      problem: "",
      ablaufHeute: "",
      dauerHeute: "",
      fallzahl: "",
      verbesserung: "",
    },
    antworten: {},
    beteiligungen: {},
    verantwortung: { fachlich: "", technisch: "", annahmen: "", restrisiken: "" },
    auflagen: [...GRUNDAUFLAGEN],
    abbruchkriterien: [...ABBRUCHKRITERIEN],
    geltungsdauerWochen: GELTUNGSDAUER_WOCHEN_VORSCHLAG,
    ausgang: "offen",
    auflagenAngepasst: false,
    beispiel: false,
    rueckmeldungen: [],
    protokollEmpfaenger: PROTOKOLL_EMPFAENGER_VORSCHLAG,
    laufzettel: {},
  };
}

/** Ergänzt fehlende Felder älterer Stände, ohne Antworten zu verändern. */
function vervollstaendigen(daten: Erprobungsdaten): Erprobungsdaten {
  const basis = leereDaten();
  return {
    ...basis,
    ...daten,
    vorhaben: { ...basis.vorhaben, ...daten.vorhaben },
    verantwortung: { ...basis.verantwortung, ...daten.verantwortung },
    vorgangKennung: daten.vorgangKennung || basis.vorgangKennung,
    geltungsdauerWochen:
      typeof daten.geltungsdauerWochen === "number" && daten.geltungsdauerWochen > 0
        ? daten.geltungsdauerWochen
        : basis.geltungsdauerWochen,
    ausgang: daten.ausgang ?? "offen",
    rueckmeldungen: Array.isArray(daten.rueckmeldungen) ? daten.rueckmeldungen : [],
    protokollEmpfaenger:
      typeof daten.protokollEmpfaenger === "string"
        ? daten.protokollEmpfaenger
        : basis.protokollEmpfaenger,
    laufzettel: daten.laufzettel && typeof daten.laufzettel === "object" ? daten.laufzettel : {},
  };
}

export function ladenAusSpeicher(): Erprobungsdaten | null {
  if (typeof window === "undefined") return null;
  try {
    const roh = window.localStorage.getItem(SPEICHER_SCHLUESSEL);
    if (!roh) return null;
    const daten = JSON.parse(roh) as Erprobungsdaten;
    if (!daten || typeof daten !== "object" || !daten.vorhaben) return null;
    return vervollstaendigen(daten);
  } catch {
    return null;
  }
}

export function speichern(daten: Erprobungsdaten): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SPEICHER_SCHLUESSEL,
      JSON.stringify({ ...daten, gespeichertAm: new Date().toISOString() }),
    );
  } catch {
    /* Speicher nicht verfügbar */
  }
}

export function verwerfen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SPEICHER_SCHLUESSEL);
}

export function dateiname(daten: Erprobungsdaten, endung: string, zusatz = ""): string {
  const teil = dateinamensteil(daten.vorhaben.bezeichnung);
  const kennung = daten.vorgangKennung || "vorgang";
  return `erprobungspass-${teil}${zusatz ? `-${zusatz}` : ""}-${kennung}.${endung}`;
}

export function exportieren(daten: Erprobungsdaten): void {
  // Der Export enthält zusätzlich die berechnete Einstufung, damit die Datei
  // ohne die Anwendung nachvollziehbar bleibt. Beim Import wird sie verworfen
  // und aus den Antworten neu berechnet.
  const inhalt = {
    ...daten,
    regelwerksversion: daten.version,
    exportiertAm: new Date().toISOString(),
    einordnung: einordnen(daten.vorhaben.fallart, daten.antworten),
  };
  herunterladen(JSON.stringify(inhalt, null, 2), "application/json", dateiname(daten, "json"));
}

/** Grund, warum eine Datei nicht geladen werden konnte. */
export type LadefehlerArt = "format" | "fremd" | "profil";

export class Ladefehler extends Error {
  readonly art: LadefehlerArt;

  constructor(art: LadefehlerArt, nachricht: string) {
    super(nachricht);
    this.name = "Ladefehler";
    this.art = art;
  }
}

export async function importieren(datei: File): Promise<Erprobungsdaten> {
  let roh: Record<string, unknown>;
  try {
    roh = JSON.parse(await datei.text()) as Record<string, unknown>;
  } catch {
    throw new Ladefehler("format", LADEFEHLER_FORMAT);
  }
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) {
    throw new Ladefehler("format", LADEFEHLER_FORMAT);
  }
  if (!roh["vorhaben"]) {
    // Ein exportiertes Einrichtungsprofil trägt Rollen und Namen, aber kein Vorhaben.
    if (typeof roh["rollen"] === "object" && typeof roh["name"] === "string") {
      throw new Ladefehler("profil", LADEFEHLER_PROFIL);
    }
    throw new Ladefehler("fremd", LADEFEHLER_FREMD);
  }
  // Abgeleitete Angaben werden nicht übernommen, sondern neu berechnet.
  const { einordnung: _einordnung, exportiertAm: _exportiertAm, ...rest } = roh;
  return vervollstaendigen(rest as unknown as Erprobungsdaten);
}

export function datumDeutsch(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function monatJahrDeutsch(iso: string): string {
  const d = iso ? new Date(iso) : new Date();
  const gueltig = Number.isNaN(d.getTime()) ? new Date() : d;
  return gueltig.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}
