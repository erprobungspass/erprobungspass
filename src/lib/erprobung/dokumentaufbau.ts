// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Gemeinsamer Aufbau der drei Dokumente. Druckansicht und Markdown-Ausgabe
 * bedienen sich aus dieser einen Quelle, damit beide Fassungen nicht
 * auseinanderlaufen. Die Bausteine beschreiben nur den Inhalt; die Gestaltung
 * bleibt Sache der jeweiligen Ausgabe.
 */

import { FALLARTEN, FRAGEN, UNKLAR, UNKLAR_TEXT, type Ampel } from "@/data/regelwerk";
import {
  BETEILIGUNGSSTATUS_TEXTE,
  ausgeloesteStellen,
  beteiligungsHinweise,
} from "@/data/beteiligungen";
import {
  LANDESVORGABEN_FEHLEN,
  VORPRUEFSTAENDE,
  VORPRUEFUNG_KENNZEICHNUNG,
  VORPRUEFUNG_TITEL,
  landesvorgaben,
  vorpruefSchluessel,
} from "@/data/landesvorgaben";
import { ebeneText } from "@/data/ebenen";
import {
  ABBRUCH_LEITSATZ,
  AUSGANGSLAGE_ABSCHLUSS_TITEL,
  AUSGANGSLAGE_DOKUMENT_TITEL,
  AUSGANGSLAGE_FELDER,
  VERANTWORTUNG_FELDER,
  VERANTWORTUNG_LEITSATZ,
  VERANTWORTUNG_TITEL,
  ABSCHLUSS_FELDER,
  ABSCHLUSS_LEITSATZ,
  ABSCHLUSS_OPTIONEN,
  ABSCHLUSS_REGELBETRIEB_HINWEIS,
  ABSCHLUSS_TITEL,
  AMPEL_TEXTE,
  CHECKLISTE_EINLEITUNG,
  CHECKLISTE_LEER,
  CHECKLISTE_TITEL,
  EINORDNUNG_OFFEN_DOKUMENT,
  ENTSCHEIDUNGSOPTIONEN,
  FREIGABE_RECHTSGRUNDLAGE_TITEL,
  FREIGABE_VERANTWORTUNGSABSATZ,
  FREIGABE_ZWECKABSATZ,
  KEINE_ERHOEHTE_ANFORDERUNG,
  PROTOKOLL_ABBRUCH_TITEL,
  PROTOKOLL_EINLEITUNG,
  PROTOKOLL_FORTSETZUNG,
  PROTOKOLL_SPALTEN,
  PROTOKOLL_TITEL,
  PROTOKOLL_ZWISCHENSTAND_HINWEIS,
  PROTOKOLL_ZWISCHENSTAND_TITEL,
  PROTOKOLL_HYPOTHESE_HINWEIS,
  PROTOKOLL_HYPOTHESE_TITEL,
  PROTOKOLL_RUECKMELDUNGEN_TITEL,
  OFFENE_PUNKTE_EINLEITUNG,
  OFFENE_PUNKTE_TITEL,
  LAUFZETTEL_EINLEITUNG,
  LAUFZETTEL_KEINE_UNTERLAGEN,
  LAUFZETTEL_TITEL,
  SCHULUNG_TITEL,
  ausnahmeSatz,
  gruppierteAuflagen,
  nationalesRechtZeile,
  protokollZeilen,
} from "@/data/vorlagen";
import { einordnen, einordnungVorhanden } from "./bewertung";
import { offeneUnterlagen } from "./checkliste";
import { geltungsdauerText } from "./dauer";
import { laufzettelSeiten } from "./laufzettel";
import { datumDeutsch } from "./speicher";
import type { Einrichtungsprofil, Erprobungsdaten } from "./typen";

export const FREIGABE_TITEL = "Freigabedokument der Erprobung";

/** Eine Zelle einer Tabelle; ohne Text erscheint eine Linie zum Eintragen. */
export interface Zelle {
  text?: string;
  /** Kleiner Zusatz unter dem Text, etwa der Stand einer Beteiligung. */
  zusatz?: string;
}

export interface Kaestchenpunkt {
  text: string;
  /** Weitere Zeilen unter dem Punkt, etwa Begründung und Fundstelle. */
  zusatz?: string[];
}

export interface Hinweispunkt {
  text: string;
  fundstelle?: string;
  /** Geltungsdatum; erscheint abgesetzt nach dem letzten Satz. */
  geltungAb?: string;
}

export type Block =
  | { art: "absatz"; text: string; klein?: boolean; vorformatiert?: boolean }
  | { art: "ampel"; ampel: Ampel; wort: string; text: string }
  | { art: "hinweise"; punkte: Hinweispunkt[] }
  | { art: "nummern"; punkte: string[] }
  | { art: "liste"; punkte: string[] }
  | { art: "kaestchen"; punkte: Kaestchenpunkt[] }
  | { art: "tabelle"; beschriftung?: string; spalten: string[]; zeilen: Zelle[][] }
  | { art: "leertabelle"; spalten: string[]; zeilen: number }
  | { art: "schreibfeld"; zeilen: number }
  | { art: "unterschrift"; felder: string[] }
  | { art: "unterabschnitt"; titel: string; blocks: Block[] };

export interface Abschnitt {
  titel?: string;
  blocks: Block[];
  /** Zusätzliche Klassen der Druckansicht, etwa für Seitenumbrüche. */
  klasse?: string;
}

export interface Dokument {
  titel: string;
  kopf: { begriff: string; wert: string }[];
  /** Bausteine vor dem ersten Abschnitt. */
  vorspann: Block[];
  abschnitte: Abschnitt[];
}

/** Kopfzeilen der Dokumente; leere Angaben entfallen. */
export function kopffelder(
  daten: Erprobungsdaten,
  zusatz: { begriff: string; wert: string }[] = [],
): { begriff: string; wert: string }[] {
  const { vorhaben } = daten;
  const werkzeug = vorhaben.bezeichnung
    ? `${vorhaben.bezeichnung}${vorhaben.anbieter ? ` (${vorhaben.anbieter})` : ""}`
    : "";
  return [
    { begriff: "Behörde", wert: vorhaben.behoerde },
    { begriff: "Werkzeug", wert: werkzeug },
    {
      begriff: "Geltungsdauer",
      wert: geltungsdauerText(vorhaben.zeitraumVon, daten.geltungsdauerWochen),
    },
    { begriff: "Aktenzeichen", wert: vorhaben.aktenzeichen },
    { begriff: "Vorgang", wert: daten.vorgangKennung },
    ...zusatz,
  ].filter((f) => (f.wert ?? "").trim() !== "" && f.wert.trim() !== "—");
}

/**
 * Abschnitt „Ausgangslage“ aus den fünf freiwilligen Angaben. Sind alle Felder
 * leer, entsteht kein Abschnitt; leere Einzelfelder entfallen ersatzlos.
 */
export function ausgangslageAbschnitt(daten: Erprobungsdaten, titel: string): Abschnitt | null {
  const blocks: Block[] = [];
  for (const feld of AUSGANGSLAGE_FELDER) {
    const wert = (daten.vorhaben[feld.schluessel] ?? "").trim();
    if (wert === "") continue;
    blocks.push({
      art: "unterabschnitt",
      titel: feld.beschriftung,
      blocks: [{ art: "absatz", text: wert, vorformatiert: true }],
    });
  }
  return blocks.length === 0 ? null : { titel, blocks };
}

/** Abschnitt „Verantwortlichkeiten und Restrisiken“; leere Felder entfallen. */
function verantwortungAbschnitt(daten: Erprobungsdaten, titel: string): Abschnitt {
  const blocks: Block[] = [];
  for (const feld of VERANTWORTUNG_FELDER) {
    const wert = (daten.verantwortung[feld.schluessel] ?? "").trim();
    if (wert === "") continue;
    blocks.push({
      art: "unterabschnitt",
      titel: feld.beschriftung,
      blocks: [{ art: "absatz", text: wert, vorformatiert: true }],
    });
  }
  blocks.push({ art: "absatz", text: VERANTWORTUNG_LEITSATZ, klein: true });
  return { titel, blocks };
}

function antworttext(wert: unknown): string {
  if (typeof wert !== "string" || wert.trim() === "") return "";
  if (wert === UNKLAR) return UNKLAR_TEXT;
  return wert.trim();
}

/** Punkte, die mit „noch unklar“ beantwortet sind, samt Vorprüfung des ISB. */
export function offenePunkte(daten: Erprobungsdaten, profil: Einrichtungsprofil | null): string[] {
  const signale = einordnen(daten.vorhaben.fallart, daten.antworten).signale;
  const punkte = signale.unklar.map((id) => FRAGEN.find((f) => f.id === id)?.text ?? id);
  for (const v of landesvorgaben(profil?.bundesland)) {
    if (daten.antworten[vorpruefSchluessel(v.id)] === "unklar") {
      punkte.push(`${VORPRUEFUNG_TITEL}: ${v.titel}`);
    }
  }
  return punkte;
}

function offenePunkteAbschnitt(daten: Erprobungsdaten, profil: Einrichtungsprofil | null) {
  const punkte = offenePunkte(daten, profil);
  if (punkte.length === 0) return null;
  return {
    titel: OFFENE_PUNKTE_TITEL,
    blocks: [
      { art: "absatz", text: OFFENE_PUNKTE_EINLEITUNG, klein: true },
      {
        art: "tabelle",
        spalten: ["Offener Punkt", "Zuständigkeit", "Datum"],
        zeilen: punkte.map((p): Zelle[] => [{ text: p }, {}, {}]),
      },
    ],
  } satisfies Abschnitt;
}

/** Abschnitt „Technische Vorprüfung für den ISB“ nach den Landesvorgaben. */
export function vorpruefungAbschnitt(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): Abschnitt {
  const blocks: Block[] = [{ art: "absatz", text: VORPRUEFUNG_KENNZEICHNUNG }];
  const angaben: string[] = [];
  const zert = daten.antworten["zertifizierung"];
  if (Array.isArray(zert) && zert.length > 0) {
    const frage = FRAGEN.find((f) => f.id === "zertifizierung");
    angaben.push(
      `Nachweise des Anbieters: ${zert.map((z) => frage?.optionen?.find((o) => o.id === z)?.text ?? z).join(", ")}`,
    );
  }
  const server = antworttext(daten.antworten["serverstandort"]);
  if (server) {
    const frage = FRAGEN.find((f) => f.id === "serverstandort");
    angaben.push(
      `Serverstandort: ${frage?.optionen?.find((o) => o.id === daten.antworten["serverstandort"])?.text ?? server}`,
    );
  }
  const betrieb = antworttext(daten.antworten["betriebsanforderungen"]);
  if (betrieb) angaben.push(`Anforderungen an den Betrieb: ${betrieb}`);
  if (angaben.length > 0) blocks.push({ art: "liste", punkte: angaben });

  const vorgaben = landesvorgaben(profil?.bundesland);
  if (vorgaben.length === 0) {
    blocks.push({ art: "absatz", text: `${LANDESVORGABEN_FEHLEN}.`, klein: true });
  } else {
    blocks.push({
      art: "tabelle",
      beschriftung: `Technische Vorgaben des Landes ${profil?.bundesland ?? ""}`.trim(),
      spalten: ["Vorgabe", "Fundstelle", "Stand"],
      zeilen: vorgaben.map((v): Zelle[] => {
        const stand = VORPRUEFSTAENDE.find(
          (st) => st.id === daten.antworten[vorpruefSchluessel(v.id)],
        );
        return [
          { text: v.titel, zusatz: v.beschreibung },
          { text: v.fundstelle },
          stand
            ? { text: stand.text }
            : { text: VORPRUEFSTAENDE.map((st) => `☐ ${st.text}`).join("  ") },
        ];
      }),
    });
  }
  return { titel: VORPRUEFUNG_TITEL, blocks };
}

/** Angaben zu Einweisung und Schulung; entfällt ohne Angaben. */
function schulungBlock(daten: Erprobungsdaten): Block | null {
  const zeilen: string[] = [];
  const unterlagen = antworttext(daten.antworten["schulungsunterlagen"]);
  if (unterlagen) zeilen.push(`Einweisungs- und Schulungsunterlagen vorhanden: ${unterlagen}`);
  const ersteller = antworttext(daten.antworten["schulung_ersteller"]);
  if (ersteller) zeilen.push(`Erstellung und Einweisung durch: ${ersteller}`);
  const zielgruppe = antworttext(daten.antworten["schulung_zielgruppe"]);
  if (zielgruppe) zeilen.push(`Eingewiesen werden: ${zielgruppe}`);
  if (zeilen.length === 0) return null;
  return {
    art: "unterabschnitt",
    titel: SCHULUNG_TITEL,
    blocks: [{ art: "liste", punkte: zeilen }],
  };
}

/** Eine Seite je Stelle; die erste beginnt auf einer neuen Seite, wenn `umbruch`. */
export function laufzettelAbschnitte(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
  titelPraefix = "",
  ersterUmbruch = false,
): Abschnitt[] {
  return laufzettelSeiten(daten, profil).map((seite, i) => {
    const blocks: Block[] = [{ art: "absatz", text: seite.begruendung, klein: true }];
    if (seite.stelle.vorbedingung)
      blocks.push({ art: "absatz", text: `Vorbedingung: ${seite.stelle.vorbedingung}` });
    blocks.push(
      {
        art: "unterabschnitt",
        titel: "Was die Stelle prüft",
        blocks: [{ art: "absatz", text: seite.pruefgegenstand }],
      },
      {
        art: "unterabschnitt",
        titel: "Benötigte Unterlagen",
        blocks:
          seite.unterlagen.length === 0
            ? [{ art: "absatz", text: LAUFZETTEL_KEINE_UNTERLAGEN, klein: true }]
            : [{ art: "kaestchen", punkte: seite.unterlagen.map((u) => ({ text: u })) }],
      },
      {
        art: "absatz",
        text: `Frist für die Rückmeldung: ${seite.frist ? datumDeutsch(seite.frist) : "__________"}`,
      },
      {
        art: "unterabschnitt",
        titel: "Ergebnis",
        blocks: seite.ergebnis.trim()
          ? [{ art: "absatz", text: seite.ergebnis, vorformatiert: true }]
          : [{ art: "schreibfeld", zeilen: 4 }],
      },
      { art: "unterschrift", felder: ["Ort, Datum", `Unterschrift ${seite.stelle.bezeichnung}`] },
    );
    const abschnitt: Abschnitt = { titel: `${titelPraefix}${seite.stelle.bezeichnung}`, blocks };
    if (i > 0 || ersterUmbruch) abschnitt.klasse = "page-break-before";
    return abschnitt;
  });
}

/** Nummeriert die Abschnitte fortlaufend; entfallene Abschnitte zählen nicht. */
function nummeriert(abschnitte: Abschnitt[]): Abschnitt[] {
  return abschnitte.map((a, i) => ({ ...a, titel: `${i + 1}. ${a.titel ?? ""}` }));
}

/* --- 1. Freigabedokument --- */

export function freigabeDokument(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): Dokument {
  const { vorhaben } = daten;
  // Ohne Profil entfällt in den Dokumenten der nationale Teil der Fundstelle.
  const ergebnis = einordnen(vorhaben.fallart, daten.antworten, profil, { fuerDokument: true });
  const vorhandenerBefund = einordnungVorhanden(vorhaben.fallart, daten.antworten);
  const ampeltext = AMPEL_TEXTE[ergebnis.ampel];
  const fallart = FALLARTEN.find((f) => f.id === vorhaben.fallart);
  const stellen = ausgeloesteStellen(ergebnis.signale, profil);
  const unterlagen = offeneUnterlagen(ergebnis.signale);
  const traeger = profil ? ebeneText(profil.ebene, profil.bundesland) : "";
  const ausnahme = ergebnis.signale.hochrisikoAusnahme;
  const begruendung = daten.antworten["ausnahme_begruendung"];

  const ausgangslage = ausgangslageAbschnitt(daten, AUSGANGSLAGE_DOKUMENT_TITEL);

  const vorspann: Block[] = [];
  if (traeger) vorspann.push({ art: "absatz", text: nationalesRechtZeile(traeger), klein: true });

  const einordnungsblocks: Block[] = [];
  if (!vorhandenerBefund) {
    einordnungsblocks.push({ art: "absatz", text: EINORDNUNG_OFFEN_DOKUMENT, klein: true });
  } else {
    einordnungsblocks.push({
      art: "ampel",
      ampel: ergebnis.ampel,
      wort: ampeltext.wort,
      text: `${ampeltext.satz} ${ampeltext.vorgehen}`,
    });
    if (ergebnis.ausloeser.length > 0) {
      einordnungsblocks.push({
        art: "tabelle",
        beschriftung: "Auslösende Antworten mit Fundstelle",
        spalten: ["Antwort", "Begründung", "Fundstelle"],
        zeilen: ergebnis.ausloeser.map((a) => [
          { text: a.antwort },
          { text: a.begruendung },
          { text: a.fundstelle },
        ]),
      });
    } else {
      einordnungsblocks.push({ art: "absatz", text: KEINE_ERHOEHTE_ANFORDERUNG, klein: true });
    }
    if (ergebnis.hinweise.length > 0) {
      einordnungsblocks.push({
        art: "unterabschnitt",
        titel: "Weitere Hinweise",
        blocks: [
          {
            art: "hinweise",
            punkte: ergebnis.hinweise.map((h) => ({
              text: h.begruendung,
              fundstelle: h.fundstelle,
              ...(h.geltungAb ? { geltungAb: h.geltungAb } : {}),
            })),
          },
        ],
      });
    }
    if (ergebnis.umgestaltung.length > 0) {
      einordnungsblocks.push({
        art: "unterabschnitt",
        titel: "Vorschläge zur Umgestaltung",
        blocks: [{ art: "liste", punkte: ergebnis.umgestaltung }],
      });
    }
    if (ausnahme) {
      einordnungsblocks.push({
        art: "absatz",
        klein: true,
        text: ausnahmeSatz(ausnahme, typeof begruendung === "string" ? begruendung : ""),
      });
    }
    if (ergebnis.signale.personenbezug) {
      einordnungsblocks.push({
        art: "unterabschnitt",
        titel: FREIGABE_RECHTSGRUNDLAGE_TITEL,
        blocks: [
          {
            art: "absatz",
            klein: true,
            vorformatiert: true,
            text: ergebnis.signale.rechtsgrundlageText || "—",
          },
        ],
      });
    }
    einordnungsblocks.push({ art: "absatz", text: FREIGABE_ZWECKABSATZ, klein: true });
  }

  const kurzbeschreibung: Block[] = [
    { art: "absatz", text: vorhaben.kurzbeschreibung || "—", vorformatiert: true },
  ];
  if (vorhaben.anzahlBeschaeftigte) {
    kurzbeschreibung.push({
      art: "absatz",
      klein: true,
      text: `Beteiligte Beschäftigte: ${vorhaben.anzahlBeschaeftigte}`,
    });
  }

  const checkliste: Block[] =
    unterlagen.length === 0
      ? [{ art: "absatz", text: CHECKLISTE_LEER, klein: true }]
      : [
          { art: "absatz", text: CHECKLISTE_EINLEITUNG, klein: true },
          {
            art: "kaestchen",
            punkte: unterlagen.map((p) => ({ text: p.was, zusatz: [p.warum, p.fundstelle] })),
          },
        ];

  return {
    titel: FREIGABE_TITEL,
    kopf: kopffelder(daten, [
      { begriff: "Fallart", wert: fallart?.titel ?? "—" },
      {
        begriff: "Verantwortliche Person",
        wert: `${vorhaben.verantwortlich || "—"}${vorhaben.kontakt ? `, ${vorhaben.kontakt}` : ""}`,
      },
    ]),
    vorspann,
    abschnitte: [
      ...nummeriert(
        [
          { titel: "Kurzbeschreibung des Vorhabens", blocks: kurzbeschreibung },
          ausgangslage,
          { titel: "Einordnung", blocks: einordnungsblocks },
          offenePunkteAbschnitt(daten, profil),
          {
            titel: "Beteiligte Stellen",
            klasse: "page-break-before",
            blocks: [
              {
                art: "tabelle",
                spalten: ["Stelle", "Datum", "Name", "Vorbehalte", "Unterschrift"],
                zeilen: stellen.map((s): Zelle[] => {
                  const e = daten.beteiligungen[s.id];
                  const name = e?.name?.trim() ?? "";
                  return [
                    {
                      text: s.bezeichnung,
                      zusatz: `Stand: ${BETEILIGUNGSSTATUS_TEXTE[e?.status ?? "offen"]}${
                        s.vorbedingung ? ` · Vorbedingung: ${s.vorbedingung}` : ""
                      }`,
                    },
                    {},
                    name ? { text: name } : {},
                    {},
                    {},
                  ];
                }),
              },
              ...beteiligungsHinweise(ergebnis.signale, profil).map((h): Block => ({
                art: "absatz",
                text: h,
                klein: true,
              })),
            ],
          },
          vorpruefungAbschnitt(daten, profil),
          {
            titel: "Auflagen",
            blocks: [
              ...gruppierteAuflagen(daten.auflagen.filter((a) => a.trim() !== "")).map(
                (gruppe): Block => ({
                  art: "unterabschnitt",
                  titel: gruppe.titel,
                  blocks: [{ art: "nummern", punkte: gruppe.eintraege.map((e) => e.text) }],
                }),
              ),
              ...(schulungBlock(daten) ? [schulungBlock(daten) as Block] : []),
            ],
          },
          verantwortungAbschnitt(daten, VERANTWORTUNG_TITEL),
          {
            titel: "Abbruchkriterien",
            blocks: [
              { art: "absatz", text: ABBRUCH_LEITSATZ, klein: true },
              {
                art: "nummern",
                punkte: daten.abbruchkriterien.filter((a) => a.trim() !== ""),
              },
            ],
          },
          {
            titel: "Entscheidung der Behördenleitung",
            blocks: [
              { art: "absatz", text: FREIGABE_VERANTWORTUNGSABSATZ, klein: true },
              ...stellen
                .filter((s) => s.vorbedingung)
                .map((s): Block => ({ art: "absatz", text: `Vorbedingung: ${s.vorbedingung}` })),
              { art: "kaestchen", punkte: ENTSCHEIDUNGSOPTIONEN.map((o) => ({ text: o })) },
              { art: "unterschrift", felder: ["Ort, Datum", "Unterschrift der Behördenleitung"] },
            ],
          },
        ].filter((a): a is Abschnitt => a !== null),
      ),
      { titel: CHECKLISTE_TITEL, blocks: checkliste },
      ...laufzettelAbschnitte(daten, profil, `Anhang: ${LAUFZETTEL_TITEL} — `, true),
    ],
  };
}

/* --- Laufzettel als eigene Ansicht --- */

export function laufzettelDokument(
  daten: Erprobungsdaten,
  profil: Einrichtungsprofil | null,
): Dokument {
  return {
    titel: LAUFZETTEL_TITEL,
    kopf: kopffelder(daten),
    vorspann: [{ art: "absatz", text: LAUFZETTEL_EINLEITUNG, klein: true }],
    abschnitte: laufzettelAbschnitte(daten, profil),
  };
}

/* --- 2. Protokollrahmen --- */

export function protokollDokument(daten: Erprobungsdaten): Dokument {
  const kriterien = daten.abbruchkriterien.filter((a) => a.trim() !== "");
  const eintraege = daten.rueckmeldungen.filter((r) =>
    [r.datum, r.rolle, r.beobachtung, r.folge].some((t) => t.trim() !== ""),
  );
  const leer = Math.max(protokollZeilen(daten.geltungsdauerWochen) - eintraege.length, 4);
  const hypothese = daten.vorhaben.verbesserung.trim();
  return {
    titel: PROTOKOLL_TITEL,
    kopf: kopffelder(daten, [{ begriff: "Empfänger", wert: daten.protokollEmpfaenger }]),
    vorspann: [{ art: "absatz", text: PROTOKOLL_EINLEITUNG, klein: true }],
    abschnitte: [
      ...(hypothese
        ? [
            {
              titel: PROTOKOLL_HYPOTHESE_TITEL,
              blocks: [
                { art: "absatz", text: hypothese, vorformatiert: true },
                { art: "absatz", text: PROTOKOLL_HYPOTHESE_HINWEIS, klein: true },
              ] satisfies Block[],
            },
          ]
        : []),
      {
        titel: PROTOKOLL_RUECKMELDUNGEN_TITEL,
        klasse: "protokoll-verlauf",
        blocks: [
          ...(eintraege.length > 0
            ? [
                {
                  art: "tabelle",
                  spalten: [...PROTOKOLL_SPALTEN],
                  zeilen: eintraege.map((r): Zelle[] => [
                    { text: r.datum ? datumDeutsch(r.datum) : "—" },
                    { text: r.rolle || "—" },
                    { text: r.beobachtung || "—" },
                    { text: r.folge || "—" },
                  ]),
                } satisfies Block,
              ]
            : []),
          { art: "leertabelle", spalten: [...PROTOKOLL_SPALTEN], zeilen: leer },
          { art: "absatz", text: PROTOKOLL_FORTSETZUNG, klein: true },
        ],
      },
      {
        titel: PROTOKOLL_ABBRUCH_TITEL,
        blocks: [
          { art: "absatz", text: ABBRUCH_LEITSATZ, klein: true },
          { art: "kaestchen", punkte: kriterien.map((a) => ({ text: a })) },
        ],
      },
      {
        titel: PROTOKOLL_ZWISCHENSTAND_TITEL,
        blocks: [
          { art: "absatz", text: PROTOKOLL_ZWISCHENSTAND_HINWEIS, klein: true },
          { art: "schreibfeld", zeilen: 6 },
          {
            art: "unterschrift",
            felder: ["Ort, Datum", "Unterschrift der verantwortlichen Person"],
          },
        ],
      },
    ],
  };
}

/* --- 3. Abschlussvermerk --- */

export function abschlussDokument(daten: Erprobungsdaten): Dokument {
  const ergebnis = einordnen(daten.vorhaben.fallart, daten.antworten);
  const einordnung = einordnungVorhanden(daten.vorhaben.fallart, daten.antworten)
    ? AMPEL_TEXTE[ergebnis.ampel].wort
    : "noch nicht abgeschlossen";
  const dauer = geltungsdauerText(daten.vorhaben.zeitraumVon, daten.geltungsdauerWochen);

  const felder: Abschnitt[] = ABSCHLUSS_FELDER.map((feld, i) => {
    const blocks: Block[] = [{ art: "schreibfeld", zeilen: i < 2 ? 1 : 3 }];
    if (i === 3) {
      blocks.push(
        { art: "absatz", text: "Datum des Eintritts:", klein: true },
        { art: "schreibfeld", zeilen: 1 },
        { art: "absatz", text: "Getroffene Maßnahme:", klein: true },
        { art: "schreibfeld", zeilen: 2 },
      );
    }
    return {
      titel: `${i + 1}. ${feld}${i === 0 ? ` (festgelegt waren ${dauer})` : ""}`,
      blocks,
    };
  });

  const ausgangslage = ausgangslageAbschnitt(daten, AUSGANGSLAGE_ABSCHLUSS_TITEL);

  return {
    titel: ABSCHLUSS_TITEL,
    kopf: kopffelder(daten, [{ begriff: "Einordnung", wert: einordnung }]),
    vorspann: [],
    abschnitte: [
      ...(ausgangslage ? [ausgangslage] : []),
      ...felder,
      {
        titel: `${ABSCHLUSS_FELDER.length + 1}. Entscheidung der Leitung`,
        blocks: [
          { art: "absatz", text: ABSCHLUSS_LEITSATZ, klein: true },
          { art: "kaestchen", punkte: ABSCHLUSS_OPTIONEN.map((o) => ({ text: o.text })) },
          { art: "absatz", text: ABSCHLUSS_REGELBETRIEB_HINWEIS, klein: true },
          { art: "unterschrift", felder: ["Ort, Datum", "Unterschrift der Leitung"] },
        ],
      },
    ],
  };
}
