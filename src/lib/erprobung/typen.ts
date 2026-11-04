// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import type { Ampel, Fallart } from "@/data/regelwerk";
import type { Beteiligungsstatus } from "@/data/beteiligungen";
import type { Ebene } from "@/data/ebenen";

export interface Vorhaben {
  fallart: Fallart | null;
  bezeichnung: string;
  anbieter: string;
  kurzbeschreibung: string;
  behoerde: string;
  verantwortlich: string;
  kontakt: string;
  /** Startdatum der Erprobung; das Ende wird aus der Dauer in Wochen berechnet. */
  zeitraumVon: string;
  anzahlBeschaeftigte: string;
  aktenzeichen: string;
  /* Ausgangslage: fünf freiwillige Angaben zum Problem hinter dem Vorhaben. */
  problem: string;
  ablaufHeute: string;
  dauerHeute: string;
  fallzahl: string;
  verbesserung: string;
}

/** Verantwortlichkeiten und Restrisiken; vorbelegt und frei änderbar. */
export interface Verantwortung {
  fachlich: string;
  technisch: string;
  annahmen: string;
  restrisiken: string;
}

/** Antworten: Frage-Kennung auf "ja"/"nein", Optionskennung oder Liste. */
export type Antworten = Record<string, string | string[]>;

export interface Beteiligung {
  status: Beteiligungsstatus;
  name: string;
  kontakt: string;
}

/** Ausgang der Erprobung; wird für den anonymisierten Fallsatz benötigt. */
export type Ausgang = "offen" | "regelbetrieb" | "fortfuehrung" | "verlaengerung" | "beendet";

/** Ein Eintrag im Protokoll der Rückmeldungen. */
export interface Rueckmeldung {
  datum: string;
  rolle: string;
  beobachtung: string;
  folge: string;
}

/** Frist und Ergebnis einer Stelle auf dem Laufzettel. */
export interface Laufzetteleintrag {
  frist: string;
  ergebnis: string;
}

export interface Erprobungsdaten {
  /** Regelwerksversion, mit der die Einstufung erzeugt wurde. */
  version: string;
  /** Kurze Vorgangskennung aus Zeitstempel und laufender Zahl. */
  vorgangKennung: string;
  gespeichertAm: string;
  schritt: number;
  hoechsterSchritt: number;
  vorhaben: Vorhaben;
  antworten: Antworten;
  beteiligungen: Record<string, Beteiligung>;
  /** Verantwortlichkeiten und Restrisiken des Freigabedokuments. */
  verantwortung: Verantwortung;
  auflagen: string[];
  abbruchkriterien: string[];
  /** Geltungsdauer in Wochen, zulässig sind 1 bis 52. */
  geltungsdauerWochen: number;
  ausgang: Ausgang;
  auflagenAngepasst: boolean;
  /** Kennzeichnet den erfundenen Demonstrationsvorgang von der Startseite. */
  beispiel: boolean;
  /** Protokoll der Rückmeldungen während der Erprobung. */
  rueckmeldungen: Rueckmeldung[];
  /** Empfänger des Protokolls, vorbelegt mit Leitung, IT und Finanzen. */
  protokollEmpfaenger: string;
  /** Laufzettel je Stelle: Frist und Ergebnis. */
  laufzettel: Record<string, Laufzetteleintrag>;
}

/** Eine im Haus benannte Rolle des Einrichtungsprofils. */
export interface Rollenangabe {
  name: string;
  funktion: string;
  kontakt: string;
}

export interface Einrichtungsprofil {
  name: string;
  kuerzel: string;
  /** Ebene des Trägers; sie entscheidet über das anzuwendende nationale Recht. */
  ebene: Ebene | "";
  /** Bundesland; entfällt bei Bundesbehörden. */
  bundesland: string;
  rollen: Record<string, Rollenangabe>;
  personalratImmer: boolean;
  freigabeDatenschutzErforderlich: boolean;
  hoechstdauerWochen: number;
  /** Betrag in Euro, ab dem ein Gremium entscheidet; leer, wenn nicht hinterlegt. */
  gremienschwelle: string;
  /** Betrag in Euro, ab dem ausgeschrieben wird; leer, wenn nicht hinterlegt. */
  vergabeschwelle: string;
  gespeichertAm: string;
}

/** Aus den Antworten abgeleitete Signale für Ampel und Beteiligungen. */
export interface Signale {
  istKiSystem: boolean;
  /** Einsatz ausschließlich zu Forschung und Entwicklung vor dem Betrieb. */
  forschungsphase: boolean;
  anbieterrolle: boolean;
  /** Verbotene Praktiken, die bereits gelten. */
  verboteneP: string[];
  /** Verbotene Praktiken, die erst zu einem künftigen Datum gelten. */
  verboteneKuenftig: string[];
  hochrisiko: string[];
  /** Buchstabe der greifenden Ausnahme nach Artikel 6 Absatz 3 oder null. */
  hochrisikoAusnahme: string | null;
  /** Rückausnahme: das Werkzeug erstellt Profile von Personen. */
  ausnahmeProfilierung: boolean;
  /** Hochrisiko-Einordnung nach Prüfung der Ausnahmen. */
  hochrisikoWirksam: boolean;
  transparenz: string[];
  updateStillschweigend: boolean;
  updateStandardAktiv: boolean;
  updateDatenabfluss: boolean;
  updateRisiko: boolean;

  personenbezug: boolean;
  beschaeftigtendaten: boolean;
  besondereKategorien: boolean;
  /** Freitext der benannten Vorschrift. */
  rechtsgrundlageText: string;
  rechtsgrundlageFehlt: boolean;
  auftragsverarbeitungOhneVertrag: boolean;
  drittland: boolean;
  vvtFehlt: boolean;
  /** Erfüllte Schwellen der Datenschutz-Folgenabschätzung. */
  dsfaSchwellen: string[];
  /** Eingaben werden vom Anbieter weiterverwendet und nicht abgeschaltet. */
  anbieterVoreinstellungKritisch: boolean;
  ueberwachungseignung: boolean;
  /** Das Werkzeug bereitet Entscheidungen vor. */
  entscheidungVorbereitung: boolean;
  /** Entscheidung ohne Beteiligung eines Menschen mit rechtlicher Wirkung. */
  entscheidungAutomatisiert: boolean;
  /** Erlass einer verbindlichen Entscheidung ohne Prüfung und ohne Rechtsvorschrift. */
  vollautomatischOhneGrundlage: boolean;
  /** Barrierefreiheit des Werkzeugs ist nicht gegeben oder unbekannt. */
  barrierefreiheitOffen: boolean;
  nurTestdatenMoeglich: boolean;
  unterrichtungFehlt: boolean;
  arbeitsablaufwirkung: boolean;

  /** Kennungen der sichtbaren Fragen, die mit „noch unklar“ beantwortet sind. */
  unklar: string[];
  /** Eine Dienstvereinbarung ist erforderlich oder besteht (oder noch unklar). */
  dienstvereinbarung: boolean;
  /** Ein Nutzungs- oder Lizenzvertrag liegt nicht vor oder ist noch unklar. */
  nutzungsvertragFehlt: boolean;
  /** Kein Nachweis nach ISO 27001, BSI C5 oder IT-Grundschutz angegeben. */
  zertifikatFehlt: boolean;
  /** Die Server stehen außerhalb der Europäischen Union. */
  serverAusserhalbEu: boolean;
  /** Einweisungs- und Schulungsunterlagen fehlen oder sind noch unklar. */
  schulungsunterlagenFehlen: boolean;
  /** Erwartete Kosten in Euro; null, wenn nicht angegeben oder noch unklar. */
  kostenErprobung: number | null;
  kostenUeberfuehrung: number | null;
  kostenErprobungUnklar: boolean;
  kostenUeberfuehrungUnklar: boolean;
}

export interface Ausloeser {
  antwort: string;
  begruendung: string;
  fundstelle: string;
  /** Geltungsdatum der Regel; wird abgesetzt nach dem letzten Satz ausgegeben. */
  geltungAb?: string;
}

export interface Einordnung {
  ampel: Ampel;
  ausloeser: Ausloeser[];
  hinweise: Ausloeser[];
  umgestaltung: string[];
  signale: Signale;
}
