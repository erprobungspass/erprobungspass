// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Vorlagenschicht: Textbausteine für Auflagen, Abbruchkriterien und
 * Abschnitte der drei Dokumente. Alle Texte sind vollständige Sätze, die
 * unverändert in ein Dokument übernommen werden können.
 *
 * Jede Auflage gehört zu einer Gruppe. Die Gruppen gliedern die Liste in
 * Schritt 4 und im Freigabedokument; die Nummerierung läuft je Gruppe.
 */

import type { Signale } from "@/lib/erprobung/typen";
import type { Ampel } from "./regelwerk";

export type Auflagengruppe = "grund" | "ki" | "datenschutz" | "verfahren";

export const AUFLAGENGRUPPEN: { id: Auflagengruppe; titel: string }[] = [
  { id: "grund", titel: "Grundauflagen" },
  { id: "ki", titel: "Pflichten aus der KI-Verordnung" },
  { id: "datenschutz", titel: "Datenschutz" },
  { id: "verfahren", titel: "Verwaltungsverfahren" },
];

interface Auflagenvorlage {
  text: string;
  gruppe: Auflagengruppe;
  ausloeser?: (s: Signale) => boolean;
}

const GRUND: Auflagenvorlage[] = [
  {
    text: "Die Erprobung ist zeitlich befristet und endet ohne weitere Erklärung mit Ablauf der im Freigabedokument festgelegten Geltungsdauer.",
    gruppe: "grund",
  },
  {
    text: "Während der Erprobung findet kein Wirkbetrieb statt; die Ergebnisse des Werkzeugs ersetzen keinen laufenden Vorgang und werden nicht zur Akte genommen, soweit dies nicht ausdrücklich vermerkt ist.",
    gruppe: "grund",
  },
  {
    text: "Während der Erprobung werden keine Entscheidungen gegenüber Bürgerinnen und Bürgern getroffen, die nicht zuvor von einer zuständigen Person geprüft und verantwortet wurden.",
    gruppe: "grund",
  },
  {
    // Zusammengeführt: Unterrichtung der Beschäftigten und der Beschäftigtenvertretung.
    text: "Die an der Erprobung beteiligten Beschäftigten und die Beschäftigtenvertretung werden vor Beginn schriftlich über Zweck, Umfang und Dauer der Erprobung unterrichtet.",
    gruppe: "grund",
  },
  {
    // Zusammengeführt: fortlaufende Dokumentation und Aufbewahrung der Protokolle.
    text: "Die Nutzung des Werkzeugs wird während der gesamten Erprobung fortlaufend dokumentiert; festgehalten werden mindestens Datum, Zweck der Nutzung und die beteiligte Person. Die Aufzeichnungen werden mindestens sechs Monate aufbewahrt.",
    gruppe: "grund",
  },
  {
    text: "Zum Ende der Geltungsdauer legt die verantwortliche Person eine schriftliche Auswertung mit einer begründeten Empfehlung zum weiteren Vorgehen vor.",
    gruppe: "grund",
  },
];

export const GRUNDAUFLAGEN: string[] = GRUND.map((a) => a.text);

/**
 * Die oder der Datenschutzbeauftragte berät und überwacht, entscheidet aber
 * nicht (Artikel 38 und 39 der Verordnung (EU) 2016/679). Verlangt wird daher
 * eine Stellungnahme, keine Freigabe.
 */
export const AUFLAGE_FREIGABE_DATENSCHUTZ =
  "Vor Beginn der Erprobung liegt eine dokumentierte Stellungnahme der oder des behördlichen Datenschutzbeauftragten vor. Die Behördenleitung nimmt sie zur Kenntnis und bezieht sie in ihre Abwägung ein; die Stellungnahme wird dem Freigabedokument beigefügt.";

const GELB: Auflagenvorlage[] = [
  {
    text: "Die Erprobung wird ausschließlich mit erfundenen oder wirksam anonymisierten Daten durchgeführt; die Verwendung echter personenbezogener Daten bedarf einer vorherigen schriftlichen Begründung und der Zustimmung der Behördenleitung.",
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
  {
    text: "Für jeden Arbeitstag der Erprobung ist eine namentlich benannte verantwortliche Person bestimmt, die für Rückfragen erreichbar ist und den Abbruch veranlassen kann.",
    gruppe: "grund",
  },
  {
    text: "Zur Halbzeit der Geltungsdauer legt die verantwortliche Person einen schriftlichen Zwischenbericht über Verlauf, Auffälligkeiten und bereits erkennbare Risiken vor.",
    gruppe: "grund",
  },
  {
    text: AUFLAGE_FREIGABE_DATENSCHUTZ,
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
  {
    text: "Die Ergebnisse des Werkzeugs werden vor jeder Verwendung von einer fachkundigen Person geprüft; erkannte Fehler werden schriftlich festgehalten.",
    gruppe: "grund",
  },
];

/** Ersetzt das frühere Kriterium der freiwilligen Teilnahme. */
export const AUFLAGE_SCHULUNG =
  "Die Dienststelle stellt sicher, dass die Nutzenden vor Beginn ausreichend geschult sind (Artikel 4 der Verordnung (EU) 2024/1689), und kann die Teilnahme an der Schulung anordnen.";

export const AUFLAGE_AVV =
  "Vor dem Start der Erprobung ist mit dem Anbieter ein Vertrag zur Auftragsverarbeitung geschlossen (Artikel 28 Absatz 3 der Verordnung (EU) 2016/679); ohne diesen Vertrag beginnt die Erprobung nicht.";

export const AUFLAGE_DSFA =
  "Vor dem Start der Erprobung ist eine Datenschutz-Folgenabschätzung durchgeführt und dem Freigabedokument beigefügt (Artikel 35 der Verordnung (EU) 2016/679).";

export const AUFLAGE_BARRIEREFREIHEIT =
  "Die barrierefreie Nutzbarkeit des Werkzeugs wird vor dem Start geprüft (BITV 2.0; bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die BayBITV). Bis zum Nachweis steht ein gleichwertiger Weg zur Verfügung, der ohne das Werkzeug auskommt.";

export const ZUSATZAUFLAGEN_GELB: string[] = GELB.map((a) => a.text);

/** Auflage mit Auslösebedingung; sie wird vorbelegt und bleibt editierbar. */
export interface Zusatzauflage {
  text: string;
  gruppe: Auflagengruppe;
  ausloeser: (s: Signale) => boolean;
}

export const BEDINGTE_AUFLAGEN: Zusatzauflage[] = [
  // Sobald ein KI-System vorliegt.
  {
    text: "Die Aufsicht über das Werkzeug liegt bei einer namentlich benannten Person, die über die nötige Kenntnis verfügt und die Ergebnisse überstimmen oder den Einsatz beenden kann.",
    gruppe: "ki",
    ausloeser: (s) => s.istKiSystem,
  },
  {
    text: "Auffälligkeiten und Fehlfunktionen werden dem Anbieter und der zuständigen Stelle im Haus unverzüglich mitgeteilt.",
    gruppe: "ki",
    ausloeser: (s) => s.istKiSystem,
  },
  {
    text: "Es werden nur Eingabedaten verwendet, die für den erprobten Zweck geeignet und aussagekräftig sind.",
    gruppe: "ki",
    ausloeser: (s) => s.istKiSystem,
  },
  {
    text: AUFLAGE_SCHULUNG,
    gruppe: "ki",
    ausloeser: (s) => s.istKiSystem,
  },
  // Bei Verarbeitung personenbezogener Daten.
  {
    text: "Betroffene Personen werden vor Beginn über die Verarbeitung informiert, oder die Erprobung läuft ausschließlich mit Testdaten.",
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
  {
    text: "Der Zugriff ist auf die am Versuch beteiligten Personen beschränkt; die Übertragung erfolgt verschlüsselt.",
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
  {
    text: AUFLAGE_AVV,
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug && s.auftragsverarbeitungOhneVertrag,
  },
  {
    text: AUFLAGE_DSFA,
    gruppe: "datenschutz",
    ausloeser: (s) =>
      s.personenbezug &&
      (s.besondereKategorien || s.hochrisikoWirksam || s.dsfaSchwellen.length > 0),
  },
  {
    text: "Ein Datenschutzvorfall wird unverzüglich der oder dem Datenschutzbeauftragten gemeldet; die Meldung an die Aufsichtsbehörde erfolgt binnen 72 Stunden ab Kenntnis, sofern ein Risiko nicht ausgeschlossen werden kann.",
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
  // Bei vorbereiteten Entscheidungen.
  {
    text: "Die Vorbereitung durch das Werkzeug ersetzt keine Sachverhaltsermittlung; jeder Vorgang bleibt vollständig prüfbar.",
    gruppe: "verfahren",
    ausloeser: (s) => s.entscheidungVorbereitung,
  },
  {
    text: "Die Begründung einer Entscheidung wird von der zuständigen Person verantwortet und ist ohne Kenntnis des Werkzeugs nachvollziehbar.",
    gruppe: "verfahren",
    ausloeser: (s) => s.entscheidungVorbereitung,
  },
  // Bei fehlender oder unbekannter Barrierefreiheit.
  {
    text: AUFLAGE_BARRIEREFREIHEIT,
    gruppe: "verfahren",
    ausloeser: (s) => s.barrierefreiheitOffen,
  },
];

const GRUPPE_JE_TEXT = new Map<string, Auflagengruppe>(
  [...GRUND, ...GELB, ...BEDINGTE_AUFLAGEN].map((a) => [a.text, a.gruppe]),
);

/** Gruppe einer Auflage; selbst ergänzte Einträge zählen zu den Grundauflagen. */
export function auflagengruppe(text: string): Auflagengruppe {
  return GRUPPE_JE_TEXT.get(text.trim()) ?? "grund";
}

export interface Auflagengruppierung {
  id: Auflagengruppe;
  titel: string;
  /** Eintrag mit seiner Stelle in der gesamten Liste. */
  eintraege: { text: string; index: number }[];
}

/** Gliedert die Auflagen in Gruppen; leere Gruppen entfallen. */
export function gruppierteAuflagen(auflagen: string[]): Auflagengruppierung[] {
  const mitIndex = auflagen.map((text, index) => ({ text, index }));
  return AUFLAGENGRUPPEN.map((g) => ({
    ...g,
    eintraege: mitIndex.filter((e) => auflagengruppe(e.text) === g.id),
  })).filter((g) => g.eintraege.length > 0);
}

/** Abbruchkriterien mit Auslösebedingung. */
export const BEDINGTE_ABBRUCHKRITERIEN: Zusatzauflage[] = [
  {
    text: "Es tritt ein Datenschutzvorfall ein, der eine Meldung an die Aufsichtsbehörde erforderlich machen könnte.",
    gruppe: "datenschutz",
    ausloeser: (s) => s.personenbezug,
  },
];

export const ABBRUCHKRITERIEN: string[] = [
  "Die Erprobung wird abgebrochen, wenn personenbezogene Daten verarbeitet werden, die im Freigabedokument nicht vorgesehen sind.",
  "Die Erprobung wird abgebrochen, wenn das Werkzeug fehlerhafte Ergebnisse über die im Freigabedokument festgelegte Fehlertoleranz hinaus liefert oder wenn ein fehlerhaftes Ergebnis nach außen wirksam geworden ist.",
  "Die Erprobung wird abgebrochen, wenn der Personalrat oder die Schwerbehindertenvertretung der Fortführung schriftlich widerspricht. Einwände anderer beteiligter Stellen legt die verantwortliche Person der Behördenleitung vor; diese entscheidet binnen fünf Arbeitstagen über die Fortführung und hält ihre Entscheidung schriftlich fest.",
  "Die Erprobung endet mit Ablauf der Geltungsdauer. Ändert sich während der Laufzeit die Einordnung nach dem Regelwerk, ruht die Erprobung bis zur erneuten Zeichnung durch die Behördenleitung.",
  "Die Erprobung wird abgebrochen, wenn sich Funktionsumfang oder Datenverarbeitung des Werkzeugs während der Laufzeit ändern und die Informationssicherheit, bei personenbezogenen Daten zusätzlich die oder der Datenschutzbeauftragte, die Änderung nicht vor ihrem Einsatz geprüft und dies schriftlich festgehalten hat.",
  "Die Erprobung wird abgebrochen, wenn eine Auflage nicht bis zu der im Freigabedokument genannten Frist umgesetzt ist.",
];

export const ABBRUCH_LEITSATZ =
  "Ein Abbruch ist ein reguläres Ergebnis der Erprobung und wird nicht als Fehlschlag bewertet.";

/** Verfahren beim Eintritt eines Abbruchkriteriums: wer feststellt, wer entscheidet, Frist, Dokumentation. */
export const ABBRUCH_VERFAHREN =
  "Den Eintritt eines Abbruchkriteriums stellt die verantwortliche Person fest und meldet ihn unverzüglich, spätestens am folgenden Arbeitstag, der Behördenleitung. Bis zur Entscheidung ruht die Nutzung des Werkzeugs. Die Behördenleitung entscheidet über den Abbruch; Feststellung, Entscheidung und Datum werden im Protokollrahmen festgehalten.";

/** Geltungsdauer wird in Wochen angegeben. */
export const GELTUNGSDAUER_WOCHEN_VORSCHLAG = 12;
export const GELTUNGSDAUER_WOCHEN_MIN = 1;
export const GELTUNGSDAUER_WOCHEN_MAX = 52;

export const GELTUNGSDAUER_HINWEIS =
  "Eine Verlängerung der Geltungsdauer setzt eine erneute Einordnung nach dem Regelwerk und eine erneute Zeichnung durch die Behördenleitung voraus. Zulässig sind 1 bis 52 Wochen.";

export const HAFTUNGSHINWEIS =
  "Der Erprobungspass ersetzt keine Rechtsberatung. Die Verantwortung für die Entscheidung verbleibt bei der Dienststelle.";

export const DATENSCHUTZHINWEIS_ANWENDUNG =
  "Die Daten dieses Vorhabens verlassen Ihren Rechner nicht. Es findet keine Übertragung an einen Server statt.";

export const AMPEL_TEXTE: Record<Ampel, { wort: string; satz: string; vorgehen: string }> = {
  rot: {
    wort: "Rot",
    satz: "Eine Erprobung in diesem Zuschnitt ist ausgeschlossen.",
    vorgehen:
      "Schneiden Sie das Vorhaben anhand der Vorschläge zur Umgestaltung neu zu und führen Sie die Einordnung erneut durch; ohne Änderung ist das Vorhaben nicht der Behördenleitung vorzulegen.",
  },
  gelb: {
    wort: "Gelb",
    satz: "Eine Erprobung ist unter Auflagen möglich.",
    vorgehen:
      "Holen Sie die im nächsten Schritt genannten Beteiligungen ein, übernehmen Sie die zusätzlichen Auflagen in das Freigabedokument und beginnen Sie erst nach schriftlicher Freigabe durch die Behördenleitung.",
  },
  gruen: {
    wort: "Grün",
    satz: "Eine Erprobung ist mit den Grundauflagen möglich.",
    vorgehen:
      "Lassen Sie das Freigabedokument durch die genannten Stellen mitzeichnen und legen Sie es der Behördenleitung zur Unterschrift vor; beginnen Sie erst nach ihrer schriftlichen Freigabe. Halten Sie die Grundauflagen ein und werten Sie die Erprobung zum Ende der Geltungsdauer schriftlich aus.",
  },
};

/* --- Noch nicht abgeschlossene Einordnung --- */

export const EINORDNUNG_OFFEN_TITEL = "Einordnung noch nicht möglich";

export function einordnungOffenText(zahl: number): string {
  return `Es sind noch ${zahl} ${zahl === 1 ? "Frage" : "Fragen"} offen. Die Einordnung erscheint, sobald alle Fragen beantwortet sind.`;
}

export const EINORDNUNG_OFFEN_LISTE = "Offene Fragen";

export const EINORDNUNG_OFFEN_DOKUMENT = "Die Einordnung ist noch nicht abgeschlossen.";

export const EINORDNUNG_OFFEN_DRUCK =
  "Die Dokumente lassen sich erst drucken, wenn alle Fragen der Einordnung beantwortet sind.";

export function einordnungOffenWeiter(zahl: number): string {
  return `Bitte beantworten Sie zuerst die ${zahl === 1 ? "noch offene Frage" : `noch ${zahl} offenen Fragen`} der Einordnung.`;
}

export const KEINE_ERHOEHTE_ANFORDERUNG =
  "Keine der gegebenen Antworten löst eine erhöhte Anforderung aus.";

export const ENTSCHEIDUNGSOPTIONEN = [
  "freigegeben",
  "freigegeben mit Auflagen",
  "nicht freigegeben",
] as const;

export function auflagenVorlage(ampel: Ampel, signale?: Signale): string[] {
  // Bei Rot findet keine Erprobung statt; Auflagen für den laufenden Betrieb entfallen.
  if (ampel === "rot") return [];
  const liste =
    ampel === "gelb"
      ? [
          ...GRUNDAUFLAGEN,
          ...GELB.filter((a) => !a.ausloeser || !signale || a.ausloeser(signale)).map(
            (a) => a.text,
          ),
        ]
      : [...GRUNDAUFLAGEN];
  if (signale) {
    for (const a of BEDINGTE_AUFLAGEN) {
      if (a.ausloeser(signale) && !liste.includes(a.text)) liste.push(a.text);
    }
  }
  return liste;
}

export function abbruchkriterienVorlage(signale?: Signale): string[] {
  const liste = [...ABBRUCHKRITERIEN];
  if (signale) {
    for (const a of BEDINGTE_ABBRUCHKRITERIEN) {
      if (a.ausloeser(signale) && !liste.includes(a.text)) liste.push(a.text);
    }
  }
  return liste;
}

/* --- Textbausteine des Freigabedokuments --- */

export const FREIGABE_ZWECKABSATZ =
  "Dieses Dokument hält fest, auf welcher Grundlage die Dienststelle die Zulässigkeit der Erprobung beurteilt hat, welche Stellen beteiligt wurden und unter welchen Auflagen der Versuch stattfindet.";

/** Nur bei Verarbeitung personenbezogener Daten an den Zweckabsatz angehängt. */
export const FREIGABE_ZWECKABSATZ_DATENSCHUTZ =
  "Es trägt zum Nachweis nach Artikel 5 Absatz 2 der Datenschutz-Grundverordnung bei.";

export const FREIGABE_VERANTWORTUNGSABSATZ =
  "Die Verantwortung für den Einsatz und für Entscheidungen, die während der Erprobung getroffen werden, verbleibt bei der Dienststelle; die Organisationsverantwortung liegt bei der Behördenleitung. Sie wird durch die Beteiligung eines Anbieters nicht berührt. Eine eigenständige zivilrechtliche Haftung des Anbieters bleibt bestehen.";

export const FREIGABE_RECHTSGRUNDLAGE_TITEL = "Vorschrift, auf die sich die Verarbeitung stützt";

export function nationalesRechtZeile(bezeichnung: string): string {
  return `Angewandtes nationales Recht: ${bezeichnung}. Grundlage ist das im Einrichtungsprofil hinterlegte Trägerverhältnis.`;
}

export function ausnahmeSatz(buchstabe: string, begruendung: string): string {
  const eingetragen = begruendung.trim();
  // Das Satzzeichen wird nur gesetzt, wenn der eingetragene Text keines hat.
  const abschluss = eingetragen
    ? /[.!?…]$/.test(eingetragen)
      ? eingetragen
      : `${eingetragen}.`
    : "—";
  return `Die Dienststelle stützt sich auf die Ausnahme nach Artikel 6 Absatz 3 Buchstabe ${buchstabe}. Begründung: ${abschluss} Die Bewertung ist zu dokumentieren; die Registrierungspflicht bleibt davon unberührt.`;
}

/* --- Dokumenten-Checkliste --- */

export const CHECKLISTE_TITEL = "Anhang: Beizubringende Unterlagen";

export const CHECKLISTE_EINLEITUNG =
  "Die folgenden Unterlagen ergeben sich aus den erfassten Angaben und sind vor Beginn der Erprobung beizubringen.";

export const CHECKLISTE_LEER =
  "Nach den erfassten Angaben sind keine weiteren Unterlagen beizubringen.";

/* --- Protokollrahmen --- */

export const PROTOKOLL_TITEL = "Protokollrahmen zur Erprobung";

export const PROTOKOLL_EINLEITUNG =
  "Dieser Rahmen begleitet die Erprobung. Halten Sie jede Rückmeldung mit Datum, Rolle, Beobachtung und Folge fest.";

export const PROTOKOLL_SPALTEN = ["Datum", "Rolle", "Beobachtung", "Folge"] as const;

export const PROTOKOLL_RUECKMELDUNGEN_TITEL = "Protokoll der Rückmeldungen";

export const PROTOKOLL_EMPFAENGER_VORSCHLAG = "Leitung, IT, Finanzen";

export const PROTOKOLL_ABLAGE_HINWEIS =
  "Legen Sie die Datei in Ihrer gemeinsamen Ablage ab (Netzlaufwerk, Teams, SharePoint), damit alle Beteiligten darauf zugreifen können.";

export const PROTOKOLL_HYPOTHESE_TITEL = "Zu prüfende Hypothese";

export const PROTOKOLL_HYPOTHESE_HINWEIS =
  "Die erwartete Wirkung ist eine Annahme, keine Voraussetzung. Die Erprobung soll prüfen, ob sie eintritt.";

export const PROTOKOLL_ZEILEN_MINDESTENS = 12;

export function protokollZeilen(geltungsdauerWochen: number): number {
  return Math.max(PROTOKOLL_ZEILEN_MINDESTENS, geltungsdauerWochen);
}

export const PROTOKOLL_FORTSETZUNG =
  "Reicht der Platz nicht aus, setzen Sie die Aufzeichnung auf einem weiteren Ausdruck dieses Rahmens fort.";

export const PROTOKOLL_ABBRUCH_TITEL = "Abbruchkriterien zum Abhaken";

export const PROTOKOLL_ZWISCHENSTAND_TITEL = "Zwischenstand zur Halbzeit";

export const PROTOKOLL_ZWISCHENSTAND_HINWEIS =
  "Halten Sie zur Halbzeit der Geltungsdauer fest, wie die Erprobung verläuft, welche Auffälligkeiten aufgetreten sind und ob eine Fortführung vertretbar ist.";

/* --- Abschlussvermerk --- */

export const ABSCHLUSS_TITEL = "Abschlussvermerk zur Erprobung";

export const ABSCHLUSS_FELDER = [
  "Tatsächliche Dauer der Erprobung",
  "Zahl der beteiligten Personen",
  "Aufgetretene Auffälligkeiten",
  "Ist ein Abbruchkriterium eingetreten? Wenn ja, welches?",
] as const;

export const ABSCHLUSS_LEITSATZ =
  "Die Beendigung ohne Fortführung ist ein reguläres Ergebnis der Erprobung.";

export const ABSCHLUSS_REGELBETRIEB_HINWEIS =
  "Die Überführung in den Regelbetrieb erfordert eine erneute Einordnung nach dem Regelwerk. Die während der Erprobung geltenden Auflagen entfallen mit dem Ende der Geltungsdauer und ersetzen keine dauerhafte Prüfung.";

export const ABSCHLUSS_OPTIONEN: { id: string; text: string }[] = [
  { id: "regelbetrieb", text: "Überführung in den Regelbetrieb" },
  {
    id: "fortfuehrung",
    text: "Überführung in ein Projekt bzw. Fortführung mit weiteren Schritten",
  },
  { id: "verlaengerung", text: "Verlängerung mit erneuter Einordnung" },
  { id: "beendet", text: "Beendigung ohne Fortführung" },
];

export const AUSGANG_TEXTE: Record<string, string> = {
  offen: "noch offen",
  regelbetrieb: "Überführung in den Regelbetrieb",
  fortfuehrung: "Überführung in ein Projekt bzw. Fortführung mit weiteren Schritten",
  verlaengerung: "Verlängerung mit erneuter Einordnung",
  beendet: "Beendigung ohne Fortführung",
};

/* --- Fallsammlung --- */

export const FALLSATZ_TITEL = "Anonymisierter Fallsatz für die öffentliche Fallsammlung";

export const FALLSATZ_ERKLAERUNG =
  "Die Datei enthält ausschließlich die folgenden Angaben. Prüfen Sie sie vor dem Herunterladen und bestätigen Sie die Weitergabe.";

export const FALLSATZ_ENTHALTEN = [
  "Fallart",
  "Kurzbeschreibung des Anwendungsfalls, höchstens 300 Zeichen",
  "Einordnung mit auslösenden Merkmalen",
  "Auflagen",
  "Geltungsdauer in Wochen",
  "Ausgang der Erprobung",
  "Regelwerksversion",
  "Monat und Jahr",
];

export const FALLSATZ_NICHT_ENTHALTEN = [
  "Behörde und Organisationseinheit",
  "Namen und Funktionen von Personen",
  "Kontaktdaten",
  "Aktenzeichen",
  "Produkt- und Anbietername",
];

/* --- Startseite und Versionierung --- */

export const STARTSEITE_ERKLAERUNG = [
  "Der Erprobungspass führt Sie durch die Prüfung eines geplanten Technikeinsatzes in Ihrer Dienststelle.",
  "Sie beantworten Fragen zu Einordnung, Datenschutz und Betrieb und erhalten eine begründete Einschätzung mit Fundstellen.",
  "Am Ende stehen drei druckbare Dokumente — Freigabedokument, Protokollrahmen und Abschlussvermerk — sowie ein Laufzettel für die beteiligten Stellen.",
];

export const BEARBEITUNGSDAUER = "etwa fünfzehn Minuten";

export function versionshinweis(alt: string, neu: string): string {
  return `Dieser Vorgang wurde mit Regelwerksversion ${alt} erstellt, aktuell ist ${neu}.`;
}

/* --- Beispielfall und Ladefehler --- */

export const BEISPIEL_HINWEIS =
  "Beispielfall zur Demonstration. Die Angaben sind erfunden und ersetzen keine Prüfung eines echten Vorhabens.";

export const LADEFEHLER_FORMAT =
  "Diese Datei lässt sich nicht laden. Hier kann nur die JSON-Datei geöffnet werden, die über „Als Datei sichern“ erzeugt wurde. PDF-, Word- und Bilddateien enthalten keine Antworten, die sich zurücklesen lassen.";

export const LADEFEHLER_FREMD =
  "Diese JSON-Datei stammt nicht aus dem Erprobungspass. Bitte die Datei verwenden, die über „Als Datei sichern“ erzeugt wurde.";

export const LADEFEHLER_PROFIL =
  "Diese Datei enthält ein Einrichtungsprofil, keinen Vorgang. Sie können das Profil stattdessen für Ihre Einrichtung übernehmen.";

export const PROFIL_UEBERNOMMEN = "Das Einrichtungsprofil wurde übernommen.";

/* --- Ausgangslage (Schritt 1 und Dokumente) --- */

export const AUSGANGSLAGE_TITEL = "Das Problem dahinter";

export const AUSGANGSLAGE_EINLEITUNG =
  "Diese Angaben beschreiben, warum Sie überhaupt etwas erproben wollen. Sie erscheinen im Freigabedokument und dienen später dem Vergleich, ob sich etwas verbessert hat. Schätzwerte genügen.";

export const AUSGANGSLAGE_DOKUMENT_TITEL = "Ausgangslage";

export const AUSGANGSLAGE_ABSCHLUSS_TITEL = "Ausgangslage vor der Erprobung";

/** Die fünf freiwilligen Felder zur Ausgangslage in ihrer Reihenfolge. */
export const AUSGANGSLAGE_FELDER = [
  { schluessel: "problem", beschriftung: "Welches Problem soll gelöst werden?", mehrzeilig: true },
  { schluessel: "ablaufHeute", beschriftung: "Wie läuft der Vorgang heute ab?", mehrzeilig: true },
  {
    schluessel: "dauerHeute",
    beschriftung: "Wie lange dauert die Bearbeitung eines Falls heute?",
    mehrzeilig: false,
    platzhalter: "zum Beispiel: etwa 40 Minuten",
  },
  {
    schluessel: "fallzahl",
    beschriftung: "Wie viele Fälle dieser Art fallen an?",
    mehrzeilig: false,
    platzhalter: "zum Beispiel: rund 900 im Jahr",
  },
  {
    schluessel: "verbesserung",
    beschriftung: "Welche Wirkung erwarten Sie?",
    mehrzeilig: true,
    hinweis: "Die Erprobung soll genau das messen.",
  },
] as const;

/* --- Zeitanzeige und neu erschienene Fragen (Schritt 2) --- */

export function zeitanzeige(nummer: number, gesamt: number, offen: number): string {
  const minuten = Math.round(offen * 0.5);
  const rest = minuten < 1 ? "weniger als eine Minute" : `etwa ${minuten} Minuten`;
  return `Frage ${nummer} von ${gesamt} — noch ${rest}`;
}

export function zusatzfragenHinweis(zahl: number): string {
  return `Ihre Antwort hat ${zahl} zusätzliche ${zahl === 1 ? "Frage" : "Fragen"} ergeben.`;
}

/**
 * Rückmeldung unter einer Antwort, die Fragen ein- oder ausblendet. Nennt, wie
 * viele Fragen neu erscheinen und wie viele entfallen, und in welchen anderen
 * Abschnitten neue Fragen stehen.
 */
export function fragenAenderungHinweis(
  neu: number,
  entfallen: number,
  andereAbschnitte: string[],
): string {
  const teile: string[] = [];
  if (neu > 0) {
    teile.push(
      `Durch Ihre Antwort ${neu === 1 ? "erscheint 1 weitere Frage" : `erscheinen ${neu} weitere Fragen`}, farbig markiert.`,
    );
  }
  if (andereAbschnitte.length > 0) {
    teile.push(
      `${andereAbschnitte.length === 1 ? "Im Abschnitt" : "In den Abschnitten"} ${andereAbschnitte.map((t) => `„${t}“`).join(", ")} kommen Fragen hinzu.`,
    );
  }
  if (entfallen > 0) {
    teile.push(
      `${entfallen === 1 ? "1 Frage entfällt" : `${entfallen} Fragen entfallen`}, weil sie nach dieser Antwort nicht mehr nötig ${entfallen === 1 ? "ist" : "sind"}.`,
    );
  }
  return teile.join(" ");
}

export const NEU_DURCH_ANTWORT = "Neu durch Ihre letzte Antwort";

export function folgefrageText(frage: string): string {
  return `Folgefrage zu „${frage}“`;
}

export const OFFEN_SPRUNG_HINWEIS =
  "Ein Klick auf eine Frage öffnet den passenden Abschnitt und springt direkt zur Frage.";

/* --- Verantwortlichkeiten und Restrisiken (Freigabedokument) --- */

export const VERANTWORTUNG_TITEL = "Verantwortlichkeiten und Restrisiken";

export const VERANTWORTUNG_FELDER = [
  { schluessel: "fachlich", beschriftung: "Wer entscheidet fachlich" },
  {
    schluessel: "technisch",
    beschriftung:
      "Wer prüft technisch und organisatorisch (die Organisationsverantwortung bleibt bei der Behördenleitung)",
  },
  {
    schluessel: "fehlertoleranz",
    beschriftung: "Was als fehlerhaftes Ergebnis gilt und welche Fehlertoleranz hingenommen wird",
  },
  { schluessel: "annahmen", beschriftung: "Annahmen, auf denen diese Einordnung beruht" },
  {
    schluessel: "restrisiken",
    beschriftung: "Erkannte Risiken und Restrisiken, die bei der Dienststelle verbleiben",
  },
] as const;

export const FEHLERTOLERANZ_VORSCHLAG =
  "Als fehlerhaft gilt ein Ergebnis, das eine fachkundige Person bei der Prüfung verwerfen oder wesentlich berichtigen muss. Hingenommen wird ein Anteil von höchstens 10 Prozent der geprüften Ergebnisse; die Dienststelle legt den Wert vor dem Start fest.";

export const VERANTWORTUNG_LEITSATZ =
  "Diese Aufstellung ersetzt keine Rechtsberatung. Sie macht nachvollziehbar, worauf die Entscheidung beruht und welche Risiken bewusst in Kauf genommen werden.";

export const VERANTWORTUNG_HINWEIS =
  "Die Felder sind aus Ihren Antworten vorbelegt. Sie können jedes Feld ändern und ergänzen.";

/* --- „noch unklar“ und offene Punkte (Schritt 2 und Freigabedokument) --- */

export const UNKLAR_HINWEIS =
  "Bei jeder Ja-Nein-Frage können Sie „noch unklar“ wählen. Für die Ableitung der Stellen gilt das vorsichtshalber wie „ja“; die Frage erscheint im Freigabedokument unter „Offene Punkte vor der Inbetriebnahme“.";

export const OFFENE_PUNKTE_TITEL = "Offene Punkte vor der Inbetriebnahme";

export const OFFENE_PUNKTE_EINLEITUNG =
  "Die folgenden Punkte sind mit „noch unklar“ beantwortet. Die Einordnung legt für sie vorsichtshalber die strengere Antwort zugrunde; das Freigabedokument kann deshalb unterschrieben werden. Das Werkzeug wird erst in Betrieb genommen, wenn alle Punkte geklärt sind. Tragen Sie die Zuständigkeit und das Datum der Klärung ein.";

/* --- Laufzettel --- */

export const LAUFZETTEL_TITEL = "Laufzettel";

export const LAUFZETTEL_EINLEITUNG =
  "Der Laufzettel führt je beteiligter Stelle auf, was sie prüft, welche Unterlagen sie braucht und bis wann sie ihr Ergebnis zurückmeldet. Er ist eine andere Sicht auf die Ergebnisse der Einordnung.";

export const LAUFZETTEL_KEINE_UNTERLAGEN =
  "Nach den erfassten Angaben sind dieser Stelle keine besonderen Unterlagen vorzulegen.";

/** Vorbelegte Frist: Tage vor dem Erprobungsbeginn. */
export const LAUFZETTEL_FRIST_TAGE = 14;

/* --- Einweisung und Schulung (Freigabedokument) --- */

export const SCHULUNG_TITEL = "Einweisung und Schulung";
