// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import {
  FALLARTEN,
  FRAGEN,
  HINWEISE,
  UMGESTALTUNGSVORSCHLAEGE,
  UNKLAR,
  type Fallart,
  type Frage,
} from "@/data/regelwerk";
import type { Antworten, Ausloeser, Einordnung, Einrichtungsprofil, Signale } from "./typen";
import { fundstelleText } from "./fundstelle";
import { betragLesen } from "./betrag";

export { betragLesen };
import { geltungshinweis, giltSchon } from "./geltung";

function liste(antworten: Antworten, id: string): string[] {
  const wert = antworten[id];
  if (!Array.isArray(wert)) return [];
  return wert.filter((w) => w !== "keines" && w !== UNKLAR);
}

function ja(antworten: Antworten, id: string): boolean {
  return antworten[id] === "ja";
}

/** „noch unklar“ wird vorsichtshalber wie „ja“ behandelt. */
function jaOderUnklar(antworten: Antworten, id: string): boolean {
  return antworten[id] === "ja" || antworten[id] === UNKLAR;
}

/** Für schützende Angaben gilt „noch unklar“ vorsichtshalber wie „nein“. */
function neinOderUnklar(antworten: Antworten, id: string): boolean {
  return antworten[id] === "nein" || antworten[id] === UNKLAR;
}

function text(antworten: Antworten, id: string): string {
  const wert = antworten[id];
  return typeof wert === "string" ? wert : "";
}

export function kiFragenAktiv(fallart: Fallart | null): boolean {
  const fa = FALLARTEN.find((f) => f.id === fallart);
  return fa ? fa.kiFragenStellen : true;
}

/** Liefert die im aktuellen Fall zu stellenden Fragen. */
export function sichtbareFragen(fallart: Fallart | null, antworten: Antworten): Frage[] {
  const kiAktiv = kiFragenAktiv(fallart);
  const nurForschung = antworten["forschung"] === "ja";
  return FRAGEN.filter((f) => {
    if (f.nurFallart && (!fallart || !f.nurFallart.includes(fallart))) return false;
    // Bei Fallarten ohne KI-Bezug entfallen alle KI-Fragen, die Vorfrage eingeschlossen.
    if ((f.bereich === "ki" || f.bereich === "update") && !kiAktiv) return false;
    // Bei reiner Forschung und Entwicklung entfallen die KI-spezifischen Fragen.
    if (nurForschung && f.id !== "forschung" && (f.bereich === "ki" || f.bereich === "update"))
      return false;
    if (
      f.bereich === "ki" &&
      f.id !== "ki_system" &&
      f.id !== "forschung" &&
      antworten["ki_system"] === "nein"
    )
      return false;
    if (f.sichtbarWenn && !f.sichtbarWenn(antworten)) return false;
    if (f.nurWenn) {
      const w = antworten[f.nurWenn.frageId];
      // Folgefragen erscheinen auch bei „noch unklar“, wenn sie an „ja“ hängen.
      return w === f.nurWenn.wert || (f.nurWenn.wert === "ja" && w === UNKLAR);
    }
    return true;
  });
}

/**
 * Prüft, ob eine Frage beantwortet ist. Freitextfelder sind keine
 * Pflichtfragen: bleibt die Rechtsgrundlage leer, ist das ein Auslöser und ein
 * Punkt der Checkliste, aber keine offene Frage.
 */
function frageBeantwortet(frage: Frage, antworten: Antworten): boolean {
  if (frage.typ === "freitext" || frage.ergaenzend) return true;
  const wert = antworten[frage.id];
  if (Array.isArray(wert)) return wert.length > 0;
  return typeof wert === "string" && wert.trim() !== "";
}

/** Sichtbare Pflichtfragen, die noch nicht beantwortet sind. */
export function offeneFragen(fallart: Fallart | null, antworten: Antworten): Frage[] {
  return sichtbareFragen(fallart, antworten).filter((f) => !frageBeantwortet(f, antworten));
}

/**
 * Erst wenn alle sichtbaren Pflichtfragen beantwortet sind, liegt eine
 * Einordnung vor. Vorher erscheint statt der Ampel ein neutraler Zustand.
 */
export function einordnungVorhanden(fallart: Fallart | null, antworten: Antworten): boolean {
  if (fallart === null) return false;
  return offeneFragen(fallart, antworten).length === 0;
}

/** Buchstabe der greifenden Ausnahme nach Artikel 6 Absatz 3, sonst null. */
function ausnahmeBuchstabe(antworten: Antworten): string | null {
  const paare: [string, string][] = [
    ["ausnahme_a", "a"],
    ["ausnahme_b", "b"],
    ["ausnahme_c", "c"],
    ["ausnahme_d", "d"],
  ];
  for (const [id, buchstabe] of paare) {
    if (antworten[id] === "ja") return buchstabe;
  }
  return null;
}

export function ableitenSignale(fallart: Fallart | null, antworten: Antworten): Signale {
  const kiAktiv = kiFragenAktiv(fallart);
  const forschungsphase = kiAktiv && ja(antworten, "forschung");
  const kiGefragt = kiAktiv && !forschungsphase;
  const istKiSystem = kiGefragt && jaOderUnklar(antworten, "ki_system");
  const istUpdate = fallart === "update" && !forschungsphase;
  const updateStillschweigend = istUpdate && antworten["update_ankuendigung"] === "stillschweigend";
  const updateStandardAktiv =
    istUpdate &&
    (antworten["update_standard_aktiv"] === "an_abschaltbar" ||
      antworten["update_standard_aktiv"] === "an_nicht_abschaltbar");
  const updateDatenabfluss = istUpdate && jaOderUnklar(antworten, "update_datenabfluss");

  const verboteneAlle = kiGefragt ? liste(antworten, "verbotene_praktiken") : [];
  const optionGeltung = (optionId: string): string | undefined =>
    FRAGEN.find((f) => f.id === "verbotene_praktiken")?.optionen?.find((o) => o.id === optionId)
      ?.geltungAb;
  const verboteneP = verboteneAlle.filter((p) => giltSchon(optionGeltung(p)));
  const verboteneKuenftig = verboteneAlle.filter((p) => !giltSchon(optionGeltung(p)));

  const hochrisiko = kiGefragt ? liste(antworten, "hochrisiko") : [];
  const ausnahmeProfilierung = hochrisiko.length > 0 && jaOderUnklar(antworten, "ausnahme_profile");
  const hochrisikoAusnahme =
    hochrisiko.length > 0 && !ausnahmeProfilierung ? ausnahmeBuchstabe(antworten) : null;

  const personenbezug = jaOderUnklar(antworten, "personenbezug");
  const rechtsgrundlageText = personenbezug ? text(antworten, "rechtsgrundlage").trim() : "";
  // Die Voreinstellung des Anbieters ist wie die übrigen Datenschutzfragen an
  // den Personenbezug gekoppelt.
  const voreinstellung = personenbezug ? text(antworten, "anbieter_voreinstellung") : "";
  const barrierefreiheitAntwort = text(antworten, "barrierefreiheit");
  const entscheidungVorbereitung = jaOderUnklar(antworten, "entscheidung_vorbereitung");
  const entscheidungAutomatisiert = jaOderUnklar(antworten, "entscheidung_automatisiert");
  const dienstvereinbarung = jaOderUnklar(antworten, "dienstvereinbarung");
  const ueberwachungseignung = jaOderUnklar(antworten, "ueberwachung");
  const beschaeftigtendaten = personenbezug && jaOderUnklar(antworten, "beschaeftigtendaten");
  const serverAusserhalbEu = antworten["serverstandort"] === "ausserhalb_eu";
  const zertifikate = antworten["zertifizierung"];
  const sichtbar = sichtbareFragen(fallart, antworten);
  const unklar = sichtbar
    .filter((f) => {
      const w = antworten[f.id];
      return Array.isArray(w) ? w.includes(UNKLAR) : w === UNKLAR;
    })
    .map((f) => f.id);
  const kostenSichtbar = sichtbar.some((f) => f.id === "kosten_erprobung");

  return {
    istKiSystem,
    forschungsphase,
    anbieterrolle: istKiSystem && antworten["rolle"] === "anbieter",
    verboteneP,
    verboteneKuenftig,
    hochrisiko,
    hochrisikoAusnahme,
    ausnahmeProfilierung,
    hochrisikoWirksam: hochrisiko.length > 0 && hochrisikoAusnahme === null,
    transparenz: kiGefragt ? liste(antworten, "transparenz") : [],
    updateStillschweigend,
    updateStandardAktiv,
    updateDatenabfluss,
    updateRisiko: updateStillschweigend && updateStandardAktiv && updateDatenabfluss,
    personenbezug,
    beschaeftigtendaten,
    besondereKategorien: personenbezug && jaOderUnklar(antworten, "besondere_kategorien"),
    rechtsgrundlageText,
    rechtsgrundlageFehlt: personenbezug && rechtsgrundlageText === "",
    auftragsverarbeitungOhneVertrag:
      personenbezug &&
      jaOderUnklar(antworten, "auftragsverarbeitung") &&
      neinOderUnklar(antworten, "avv_vorhanden"),
    drittland: personenbezug && (jaOderUnklar(antworten, "drittland") || serverAusserhalbEu),
    vvtFehlt: personenbezug && neinOderUnklar(antworten, "vvt"),
    dsfaSchwellen: personenbezug ? liste(antworten, "dsfa_schwellen") : [],
    anbieterVoreinstellungKritisch:
      voreinstellung === "nicht_abschaltbar" || voreinstellung === "unbekannt",
    ueberwachungseignung,
    entscheidungVorbereitung,
    entscheidungAutomatisiert,
    vollautomatischOhneGrundlage:
      jaOderUnklar(antworten, "vollautomatischer_erlass") &&
      neinOderUnklar(antworten, "vollautomatisch_grundlage"),
    barrierefreiheitOffen:
      barrierefreiheitAntwort === "nein" ||
      barrierefreiheitAntwort === UNKLAR ||
      barrierefreiheitAntwort === "unbekannt",
    nurTestdatenMoeglich: ja(antworten, "testdaten"),
    unterrichtungFehlt:
      (personenbezug || (hochrisiko.length > 0 && hochrisikoAusnahme === null)) &&
      neinOderUnklar(antworten, "unterrichtung"),
    arbeitsablaufwirkung:
      ueberwachungseignung ||
      beschaeftigtendaten ||
      dienstvereinbarung ||
      entscheidungVorbereitung ||
      entscheidungAutomatisiert,

    unklar,
    dienstvereinbarung,
    nutzungsvertragFehlt: neinOderUnklar(antworten, "nutzungsvertrag"),
    zertifikatFehlt:
      Array.isArray(zertifikate) &&
      (zertifikate.includes("keines") || zertifikate.includes(UNKLAR)),
    serverAusserhalbEu,
    schulungsunterlagenFehlen: neinOderUnklar(antworten, "schulungsunterlagen"),
    kostenErprobung: kostenSichtbar ? betragLesen(antworten["kosten_erprobung"]) : null,
    kostenUeberfuehrung: kostenSichtbar ? betragLesen(antworten["kosten_ueberfuehrung"]) : null,
    kostenErprobungUnklar: kostenSichtbar && antworten["kosten_erprobung"] === UNKLAR,
    kostenUeberfuehrungUnklar: kostenSichtbar && antworten["kosten_ueberfuehrung"] === UNKLAR,
  };
}

function optionstext(frageId: string, optionId: string): string {
  const frage = FRAGEN.find((f) => f.id === frageId);
  return frage?.optionen?.find((o) => o.id === optionId)?.text ?? optionId;
}

function optionGeltungAb(frageId: string, optionId: string): string | undefined {
  return FRAGEN.find((f) => f.id === frageId)?.optionen?.find((o) => o.id === optionId)?.geltungAb;
}

function quelle(frageId: string, profil?: Einrichtungsprofil | null, rueckfall = true): string {
  const frage = FRAGEN.find((f) => f.id === frageId);
  return frage ? fundstelleText(frage.fundstelle, profil, rueckfall) : "";
}

export interface Einordnungsoptionen {
  /**
   * Für die drei Dokumente und die Exporte: Liegt kein Einrichtungsprofil vor,
   * entfällt der nationale Teil der Fundstelle ohne Rückfalltext.
   */
  fuerDokument?: boolean;
}

export function einordnen(
  fallart: Fallart | null,
  antworten: Antworten,
  profil?: Einrichtungsprofil | null,
  optionen?: Einordnungsoptionen,
): Einordnung {
  const s = ableitenSignale(fallart, antworten);
  const ausloeser: Ausloeser[] = [];
  const hinweise: Ausloeser[] = [];
  const umgestaltung: string[] = [];
  const q = (frageId: string) => quelle(frageId, profil, !optionen?.fuerDokument);

  for (const p of s.verboteneP) {
    ausloeser.push({
      antwort: optionstext("verbotene_praktiken", p),
      begruendung:
        "Verbotene Praktik. Eine Erprobung ist ausgeschlossen. Das Vorhaben ist neu zuzuschneiden; ohne Änderung darf es der Behördenleitung nicht zur Freigabe vorgelegt werden.",
      fundstelle: q("verbotene_praktiken"),
    });
    if (UMGESTALTUNGSVORSCHLAEGE[p]) umgestaltung.push(UMGESTALTUNGSVORSCHLAEGE[p]);
  }

  for (const p of s.verboteneKuenftig) {
    const datum = optionGeltungAb("verbotene_praktiken", p);
    hinweise.push({
      antwort: optionstext("verbotene_praktiken", p),
      begruendung:
        `Dieser Tatbestand wird untersagt. Ein Vorhaben in diesem Zuschnitt ist spätestens ab diesem Zeitpunkt nicht mehr zulässig und sollte schon jetzt anders geschnitten werden. ${datum ? geltungshinweis(datum) : ""}`.trim(),
      fundstelle: q("verbotene_praktiken"),
    });
    if (UMGESTALTUNGSVORSCHLAEGE[p]) umgestaltung.push(UMGESTALTUNGSVORSCHLAEGE[p]);
  }

  if (s.vollautomatischOhneGrundlage) {
    ausloeser.push({
      antwort:
        "Eine verbindliche Entscheidung soll ohne Prüfung durch eine zuständige Person ergehen, ohne dass eine Rechtsvorschrift dies zulässt.",
      begruendung:
        "Eine Erprobung in diesem Zuschnitt ist ausgeschlossen. Eine verbindliche Entscheidung darf ohne Prüfung durch eine zuständige Person nur ergehen, wenn eine Rechtsvorschrift dies für Ihr Verfahren ausdrücklich zulässt. Denkbar ist eine Erprobung, bei der das Werkzeug die Entscheidung nur vorbereitet.",
      fundstelle: q("vollautomatischer_erlass"),
    });
    const vorschlag = UMGESTALTUNGSVORSCHLAEGE["vollautomatischer_erlass"];
    if (vorschlag) umgestaltung.push(vorschlag);
  }

  if (s.hochrisikoWirksam) {
    for (const h of s.hochrisiko) {
      ausloeser.push({
        antwort: optionstext("hochrisiko", h),
        begruendung:
          "Der Einsatz liegt in einem Bereich, für den besondere Anforderungen gelten werden. Die Erprobung ist unter Auflagen möglich; die besonderen Anforderungen an Hochrisiko-Systeme sind ab dem 2. Dezember 2027 einzuhalten.",
        fundstelle: q("hochrisiko"),
      });
    }
  }

  if (s.ausnahmeProfilierung && s.hochrisiko.length > 0) {
    hinweise.push({
      antwort: "Das Werkzeug erstellt Profile von Personen.",
      begruendung:
        "Es greift keine Ausnahme nach Artikel 6 Absatz 3. Die Einordnung bleibt hochriskant.",
      fundstelle: q("ausnahme_profile"),
    });
  }

  if (s.besondereKategorien) {
    ausloeser.push({
      antwort: "Daten besonderer Kategorien werden verarbeitet.",
      begruendung:
        "Erhöhtes Risiko für die Rechte betroffener Personen. Die Verarbeitung ist auf das Notwendige zu beschränken; wo möglich, wird mit erfundenen Daten erprobt.",
      fundstelle: q("besondere_kategorien"),
    });
  }

  for (const d of s.dsfaSchwellen) {
    ausloeser.push({
      antwort: optionstext("dsfa_schwellen", d),
      begruendung:
        "Die Schwelle für eine Datenschutz-Folgenabschätzung ist erreicht; sie ist vor Beginn durchzuführen. Ohne abgeschlossene Folgenabschätzung darf die Erprobung nicht beginnen; das Ergebnis wird dem Freigabedokument beigefügt.",
      fundstelle: q("dsfa_schwellen"),
    });
  }

  if (s.anbieterVoreinstellungKritisch) {
    ausloeser.push({
      antwort: optionstext("anbieter_voreinstellung", text(antworten, "anbieter_voreinstellung")),
      begruendung:
        "Eingaben werden vom Anbieter weiterverwendet oder es ist unbekannt, ob dies geschieht. Vor Beginn ist die Weiterverwendung auszuschließen.",
      fundstelle: q("anbieter_voreinstellung"),
    });
  }

  if (s.ueberwachungseignung) {
    ausloeser.push({
      antwort: "Das System ist geeignet, Verhalten oder Leistung von Beschäftigten zu überwachen.",
      begruendung:
        "Mitbestimmung des Personalrats und erhöhte Anforderungen. Der Personalrat ist vor Beginn zu beteiligen; ohne abgeschlossene Beteiligung darf die Erprobung nicht beginnen.",
      fundstelle: q("ueberwachung"),
    });
  }

  if (s.entscheidungAutomatisiert) {
    ausloeser.push({
      antwort:
        "Die Entscheidung ergeht ohne Beteiligung eines Menschen und hat rechtliche Wirkung oder erhebliche Nachteile.",
      begruendung:
        "Es gelten die besonderen Anforderungen an automatisierte Einzelentscheidungen. Betroffene Personen können eine Überprüfung durch einen Menschen verlangen; dieser Weg ist vor Beginn einzurichten und im Freigabedokument festzuhalten.",
      fundstelle: q("entscheidung_automatisiert"),
    });
  }

  if (s.rechtsgrundlageFehlt) {
    ausloeser.push({
      antwort: "Es ist keine Vorschrift benannt, auf die sich die Verarbeitung stützt.",
      begruendung:
        "Vor Beginn der Erprobung ist die Vorschrift zu benennen. Bis dahin darf die Verarbeitung personenbezogener Daten nicht beginnen; die benannte Vorschrift wird in das Freigabedokument aufgenommen.",
      fundstelle: q("rechtsgrundlage"),
    });
  }

  if (s.auftragsverarbeitungOhneVertrag) {
    ausloeser.push({
      antwort: "Auftragsverarbeitung ohne Vertrag nach Artikel 28 DSGVO.",
      begruendung:
        "Der Vertrag ist vor Beginn der Erprobung zu schließen. Ohne Vertrag darf der Anbieter die Daten nicht verarbeiten; die Erprobung beginnt erst nach der Unterzeichnung.",
      fundstelle: q("avv_vorhanden"),
    });
  }

  if (s.drittland) {
    ausloeser.push({
      antwort: "Daten werden außerhalb der Europäischen Union verarbeitet.",
      begruendung:
        "Zusätzliche Grundlagen für die Übermittlung sind erforderlich. Ohne dokumentierte Grundlage ist die Übermittlung unzulässig; andernfalls ist die Verarbeitung auf die Europäische Union zu begrenzen.",
      fundstelle: q("drittland"),
    });
  }

  if (s.vvtFehlt) {
    ausloeser.push({
      antwort: "Die Verarbeitung ist nicht im Verzeichnis der Verarbeitungstätigkeiten erfasst.",
      begruendung:
        "Der Eintrag ist vor Beginn der Erprobung nachzuholen. Ohne Eintrag fehlt der Nachweis über Zweck, Datenarten und Löschfrist der Verarbeitung.",
      fundstelle: q("vvt"),
    });
  }

  if (s.updateRisiko) {
    ausloeser.push({
      antwort:
        "Die neue Funktion ist ohne Ankündigung erschienen, standardmäßig aktiv und lässt zusätzlich Daten das Haus verlassen.",
      begruendung: HINWEISE.updateStillschweigend.text,
      fundstelle: HINWEISE.updateStillschweigend.fundstelle,
    });
  }

  if (s.forschungsphase) {
    hinweise.push({
      antwort: "Einsatz allein zu Forschung und Entwicklung",
      begruendung: HINWEISE.forschungsphase.text,
      fundstelle: HINWEISE.forschungsphase.fundstelle,
    });
  }

  for (const t of s.transparenz) {
    hinweise.push({
      antwort: optionstext("transparenz", t),
      begruendung:
        "Es bestehen Transparenzpflichten. Betroffene Personen sind zu unterrichten, erzeugte Inhalte sind zu kennzeichnen.",
      fundstelle: q("transparenz"),
    });
    if (t === "synthetisch") {
      hinweise.push({
        antwort: "Maschinenlesbare Kennzeichnung erzeugter Inhalte",
        begruendung: `${HINWEISE.kennzeichnungMaschinenlesbar.text} ${geltungshinweis(HINWEISE.kennzeichnungMaschinenlesbar.geltungAb)}`,
        fundstelle: HINWEISE.kennzeichnungMaschinenlesbar.fundstelle,
      });
    }
  }

  if (s.istKiSystem) {
    hinweise.push({
      antwort: "Es handelt sich um ein KI-System.",
      begruendung: HINWEISE.kiKompetenz.text,
      fundstelle: HINWEISE.kiKompetenz.fundstelle,
    });
  }

  if (s.anbieterrolle) {
    hinweise.push({
      antwort: "Anbieterrolle",
      begruendung: HINWEISE.anbieterrolle.text,
      fundstelle: HINWEISE.anbieterrolle.fundstelle,
    });
  }

  if (s.entscheidungVorbereitung) {
    hinweise.push({
      antwort: "Das Werkzeug bereitet Entscheidungen vor.",
      begruendung: HINWEISE.entscheidungVorbereitung.text,
      fundstelle: q("entscheidung_vorbereitung"),
    });
  }

  if (s.hochrisikoWirksam) {
    // Grundrechte-Folgenabschätzung und Registrierung in einem Hinweis. Das
    // Geltungsdatum steht abgesetzt und nicht zwischen Satz und Fundstelle.
    hinweise.push({
      antwort: "Hochrisiko-Einsatz durch eine öffentliche Stelle",
      begruendung: `${HINWEISE.grundrechteFolgenabschaetzung.text} ${HINWEISE.registrierung.text}`,
      fundstelle: `${HINWEISE.grundrechteFolgenabschaetzung.fundstelle} · ${HINWEISE.registrierung.fundstelle}`,
      geltungAb: HINWEISE.grundrechteFolgenabschaetzung.geltungAb,
    });
  }

  if (
    s.personenbezug &&
    (s.besondereKategorien || s.hochrisikoWirksam || s.dsfaSchwellen.length > 0)
  ) {
    hinweise.push({
      antwort: "Erhöhtes Risiko der Verarbeitung",
      begruendung: HINWEISE.datenschutzfolgenabschaetzung.text,
      fundstelle: HINWEISE.datenschutzfolgenabschaetzung.fundstelle,
    });
  }

  // Grundsatz: Jeder Eintrag unter „Ausgelöst durch" trägt die Ampelstufe.
  const ampel =
    s.verboteneP.length > 0 || s.vollautomatischOhneGrundlage
      ? "rot"
      : s.hochrisikoWirksam ||
          s.besondereKategorien ||
          s.ueberwachungseignung ||
          s.entscheidungAutomatisiert ||
          s.dsfaSchwellen.length > 0 ||
          s.anbieterVoreinstellungKritisch ||
          s.updateRisiko ||
          s.rechtsgrundlageFehlt ||
          s.auftragsverarbeitungOhneVertrag ||
          s.drittland ||
          s.vvtFehlt
        ? "gelb"
        : "gruen";

  return { ampel, ausloeser, hinweise, umgestaltung, signale: s };
}
