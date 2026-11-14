// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Regelkern des Erprobungspasses.
 * Alle Prüffragen, Auslöseregeln, Fundstellen, Erläuterungen und Beispiele
 * stehen ausschließlich hier. Komponentencode enthält keine Rechtstexte.
 *
 * Fundstellen sind zweiteilig: ein fester unionsrechtlicher Teil und ein
 * optionaler nationaler Teil, der sich nach dem Einrichtungsprofil richtet.
 */

import type { NationaleFundstelle } from "@/data/ebenen";
import type { Antworten, Signale } from "@/lib/erprobung/typen";

export const REGELWERK_VERSION = "2026-11-13";

/** Datum, ab dem die Anforderungen an Hochrisiko-Systeme einzuhalten sind. */
export const GELTUNG_HOCHRISIKO = "2027-12-02";

/** Datum, ab dem die zweite Stufe der Verbote und Kennzeichnungspflichten gilt. */
export const GELTUNG_ZWEITE_STUFE = "2026-12-02";

export type Fallart = "neu" | "update" | "nachtraeglich" | "ohne_ki";

export type Ampel = "rot" | "gelb" | "gruen";

export type FrageTyp = "ja_nein" | "mehrfach" | "einfach" | "freitext" | "betrag";

/** Antwortwert „noch unklar“; gilt für die Ableitung der Stellen wie „ja“. */
export const UNKLAR = "unklar";
export const UNKLAR_TEXT = "noch unklar";

/** Bereich, dem eine Frage zugeordnet ist. */
export type Bereich = "ki" | "datenschutz" | "it_sicherheit" | "betrieb" | "finanzen" | "update";

/** Zweiteilige Fundstelle: fester Teil und ebenenabhängiger nationaler Teil. */
export interface Fundstelle {
  fest?: string;
  national?: NationaleFundstelle;
}

export interface Auswahloption {
  id: string;
  text: string;
  /** Beispiel aus dem Verwaltungsalltag, in der Oberfläche eingeklappt. */
  beispiel?: string;
  /** Kennzeichnet die Option „keines davon“, die alle anderen ausschließt. */
  keinesDavon?: boolean;
  /** Datum, ab dem diese Option greift; vorher ohne Höherstufung der Ampel. */
  geltungAb?: string;
}

export interface Frage {
  id: string;
  bereich: Bereich;
  typ: FrageTyp;
  /** Frage in Alltagssprache, ohne juristisches Vorwissen beantwortbar. */
  text: string;
  /** Erläuterung in ein bis zwei Sätzen. */
  erlaeuterung: string;
  /** Konkretes Beispiel aus dem Verwaltungsalltag. */
  beispiel: string;
  fundstelle: Fundstelle;
  optionen?: Auswahloption[];
  /** Einleitung, die über der Frage steht. */
  einleitung?: string;
  /** Frage wird nur gestellt, wenn diese Bedingung zutrifft. */
  nurWenn?: { frageId: string; wert: string };
  /** Freie Bedingung für Fälle, die sich nicht aus einer Antwort allein ergeben. */
  sichtbarWenn?: (antworten: Antworten) => boolean;
  /** Frage wird nur bei diesen Fallarten gestellt. */
  nurFallart?: Fallart[];
  /** Datum, ab dem die Regel greift; vorher ohne Höherstufung der Ampel. */
  geltungAb?: string;
  /**
   * Ergänzende Frage: Sie wird gestellt, hält den Weiterweg aber nicht auf.
   * Bleibt sie unbeantwortet, entfällt die zugehörige Ableitung.
   */
  ergaenzend?: boolean;
}

export interface Fallartoption {
  id: Fallart;
  titel: string;
  beschreibung: string;
  hinweis?: string;
  /** Bei „ohne_ki“ entfallen die KI-spezifischen Fragen. */
  kiFragenStellen: boolean;
}

export const FALLARTEN: Fallartoption[] = [
  {
    id: "neu",
    titel: "Neues Werkzeug einführen",
    beschreibung: "Eine Software oder ein Gerät soll neu beschafft und zunächst erprobt werden.",
    kiFragenStellen: true,
  },
  {
    id: "update",
    titel: "Vorhandenes Werkzeug erhält eine KI-Funktion durch ein Update",
    beschreibung:
      "Ein bereits eingesetztes Werkzeug bekommt durch eine Aktualisierung neue Funktionen.",
    hinweis: "Es gibt keinen Beschaffungsvorgang, die rechtliche Lage ändert sich trotzdem.",
    kiFragenStellen: true,
  },
  {
    id: "nachtraeglich",
    titel: "Werkzeug wird bereits genutzt und soll nachträglich geordnet werden",
    beschreibung: "Der Einsatz läuft bereits und soll nun geprüft und dokumentiert werden.",
    hinweis:
      "Die nachträgliche Ordnung ist ausdrücklich vorgesehen und wird nicht als Verstoß dokumentiert.",
    kiFragenStellen: true,
  },
  {
    id: "ohne_ki",
    titel: "Technik ohne KI (Sensorik, Robotik, Automatisierung)",
    beschreibung: "Technik, die keine Verfahren der künstlichen Intelligenz einsetzt.",
    kiFragenStellen: false,
  },
];

/** Prüft, ob mindestens ein Bereich aus Anhang III angekreuzt wurde. */
function anhangDreiGewaehlt(antworten: Antworten): boolean {
  const wert = antworten["hochrisiko"];
  return Array.isArray(wert) && wert.filter((w) => w !== "keines").length > 0;
}

/** Prüft, ob mindestens eine der vier Ausnahmen bejaht wurde. */
function ausnahmeBejaht(antworten: Antworten): boolean {
  return ["ausnahme_a", "ausnahme_b", "ausnahme_c", "ausnahme_d"].some(
    (id) => antworten[id] === "ja",
  );
}

export const AUSNAHME_EINLEITUNG =
  "Ihr Vorhaben liegt in einem Bereich, der grundsätzlich als hochriskant gilt. Es gibt jedoch Ausnahmen. Die folgenden vier Fragen klären, ob eine davon greift.";

export const FRAGEN: Frage[] = [
  // --- Vorfrage zur Forschung und Entwicklung ---
  {
    id: "forschung",
    bereich: "ki",
    typ: "ja_nein",
    text: "Wird das Werkzeug ausschließlich zur Forschung oder Entwicklung eingesetzt, bevor es überhaupt in den Betrieb geht?",
    erlaeuterung:
      "Wer ein System nur erprobt, um herauszufinden, ob es funktioniert, und dabei keine echten Vorgänge bearbeitet, fällt in vielen Fällen noch nicht unter die Pflichten der KI-Verordnung.",
    beispiel:
      "Ein Team probiert ein Werkzeug an erfundenen Fällen aus, um zu entscheiden, ob sich eine Beschaffung lohnt.",
    fundstelle: {
      fest: "Artikel 2 Absatz 6 und 8 der Verordnung (EU) 2024/1689 (Ausnahme für Forschung, Test und Entwicklung vor dem Inverkehrbringen)",
    },
  },

  // --- KI-Verordnung ---
  {
    id: "ki_system",
    bereich: "ki",
    typ: "ja_nein",
    text: "Erzeugt das Werkzeug aus Eingaben eigenständig Vorschläge, Texte, Einstufungen oder Vorhersagen, statt nur festen Regeln zu folgen?",
    erlaeuterung:
      "Eine Tabellenkalkulation mit festen Formeln ist nicht gemeint, denn sie rechnet immer gleich. Ein Textgenerator oder eine automatische Vorsortierung ist gemeint, weil das Ergebnis aus den Eingaben abgeleitet wird.",
    beispiel: "Ein Assistent, der Antwortentwürfe auf Bürgeranfragen erzeugt.",
    fundstelle: {
      fest: "Artikel 3 Nummer 1 der Verordnung (EU) 2024/1689 (Begriff des KI-Systems)",
    },
  },
  {
    id: "rolle",
    bereich: "ki",
    typ: "einfach",
    text: "Nutzen Sie ein fertiges Werkzeug, oder geben Sie es unter eigenem Namen weiter beziehungsweise verändern Sie es wesentlich?",
    erlaeuterung:
      "Wer ein fertiges Werkzeug nur einsetzt, hat die Pflichten einer betreibenden Stelle. Wer es umbenennt, wesentlich anpasst oder anderen zur Verfügung stellt, trägt die deutlich weitergehenden Pflichten einer anbietenden Stelle.",
    beispiel:
      "Das Werkzeug wird umbenannt, angepasst oder anderen Behörden zur Verfügung gestellt.",
    fundstelle: {
      fest: "Artikel 3 Nummer 3 und 4 sowie Artikel 25 der Verordnung (EU) 2024/1689 (Anbieter, Betreiber und Wechsel der Rolle)",
    },
    optionen: [
      { id: "betreiber", text: "Nur Nutzung eines fertigen Werkzeugs (Betreiberrolle)" },
      {
        id: "anbieter",
        text: "Weitergabe unter eigenem Namen oder wesentliche Veränderung (Anbieterrolle)",
      },
    ],
  },
  {
    id: "verbotene_praktiken",
    bereich: "ki",
    typ: "mehrfach",
    text: "Soll das Werkzeug eine der folgenden Aufgaben übernehmen?",
    erlaeuterung:
      "Diese Anwendungen sind in der Europäischen Union untersagt. Eine Erprobung ist in diesen Zuschnitten nicht möglich, das Vorhaben muss anders geschnitten werden.",
    beispiel:
      "Eine Software, die die Stimmung in Telefonaten des Bürgerservice auswertet, fällt unter die Emotionserkennung am Arbeitsplatz.",
    fundstelle: {
      fest: "Artikel 5 Absatz 1 der Verordnung (EU) 2024/1689 (verbotene Praktiken im Bereich der künstlichen Intelligenz)",
    },
    optionen: [
      {
        id: "emotion",
        text: "Gefühlslage von Beschäftigten erkennen oder bewerten",
        beispiel: "Eine Software, die die Stimmung in Telefonaten des Bürgerservice auswertet.",
      },
      {
        id: "social_scoring",
        text: "Personen anhand ihres allgemeinen Verhaltens bewerten oder einstufen",
        beispiel:
          "Ein Punktesystem, das Antragstellende nach früherem Verhalten in andere Verfahren einsortiert.",
      },
      {
        id: "biometrie",
        text: "Personen anhand körperlicher Merkmale in sensible Gruppen einteilen",
        beispiel:
          "Eine Auswertung von Kamerabildern im Foyer, die Besucherinnen und Besucher nach Herkunft gruppiert.",
      },
      {
        id: "gesichtsbilder",
        text: "Gesichtsbilder ungezielt aus dem Internet oder aus Videoaufnahmen sammeln",
        beispiel:
          "Der Aufbau einer eigenen Bilddatenbank aus öffentlich zugänglichen Fotos zur späteren Wiedererkennung.",
      },
      {
        id: "praediktion",
        text: "Vorhersagen, ob eine bestimmte Person eine Straftat begehen wird",
        beispiel:
          "Eine Bewertung einzelner Personen im Ordnungsamt nach vermuteter künftiger Auffälligkeit.",
      },
      {
        id: "unterschwellig",
        text: "Das Werkzeug beeinflusst Menschen mit Mitteln, die sie nicht bemerken, und bringt sie so zu Entscheidungen, die sie sonst nicht träfen.",
        beispiel:
          "Eine Oberfläche, die durch kaum wahrnehmbare Hinweise zu einer bestimmten Antragsvariante drängt.",
      },
      {
        id: "schutzbeduerftig",
        text: "Das Werkzeug nutzt aus, dass jemand wegen Alter, Behinderung oder einer schwierigen Lebenslage besonders leicht zu beeinflussen ist.",
        beispiel:
          "Ein Dialog, der eine Notlage erkennt und daraufhin besonders drängend zu einer Entscheidung auffordert.",
      },
      {
        id: "biometrische_echtzeit",
        text: "Das Werkzeug identifiziert Personen in Echtzeit anhand biometrischer Merkmale im öffentlich zugänglichen Raum.",
        beispiel:
          "Eine Kamera am Eingang, die Gesichter unmittelbar mit einer Datenbank vergleicht.",
      },
      {
        id: "intime_darstellungen",
        text: "Das Werkzeug erzeugt intime Darstellungen von Personen ohne deren Einvernehmen.",
        beispiel: "Eine Bildfunktion, die Aufnahmen von Personen entkleidet darstellt.",
        geltungAb: GELTUNG_ZWEITE_STUFE,
      },
      {
        id: "missbrauchsdarstellungen",
        text: "Das Werkzeug erzeugt Missbrauchsdarstellungen Minderjähriger.",
        beispiel: "Eine Bildfunktion, die entsprechende Darstellungen erzeugen kann.",
        geltungAb: GELTUNG_ZWEITE_STUFE,
      },
      { id: "keines", text: "Keines davon", keinesDavon: true },
    ],
  },
  {
    id: "hochrisiko",
    bereich: "ki",
    typ: "mehrfach",
    text: "In welchem dieser Aufgabenbereiche soll das Werkzeug eingesetzt werden?",
    erlaeuterung:
      "Für diese Bereiche gelten zusätzliche Pflichten, weil Entscheidungen dort erhebliche Folgen für Menschen haben. Eine Erprobung bleibt unter Auflagen möglich.",
    beispiel:
      "Ein Werkzeug, das Bewerbungen für eine Stellenbesetzung vorsortiert, fällt unter Beschäftigung und Personalauswahl.",
    fundstelle: {
      fest: "Anhang III in Verbindung mit Artikel 6 Absatz 2 der Verordnung (EU) 2024/1689 (Bereiche mit hohem Risiko)",
    },
    geltungAb: GELTUNG_HOCHRISIKO,
    optionen: [
      {
        id: "beschaeftigung",
        text: "Beschäftigung und Personalauswahl",
        beispiel: "Vorsortierung eingehender Bewerbungen nach Passung.",
      },
      {
        id: "leistungen",
        text: "Zugang zu öffentlichen Leistungen",
        beispiel: "Vorprüfung von Anträgen auf Wohngeld oder Sozialleistungen.",
      },
      {
        id: "bildung",
        text: "Bildung und Prüfungen",
        beispiel: "Unterstützung bei der Bewertung von Prüfungsleistungen.",
      },
      {
        id: "strafverfolgung",
        text: "Strafverfolgung",
        beispiel: "Auswertung von Ermittlungsakten nach Auffälligkeiten.",
      },
      {
        id: "migration",
        text: "Migration und Asyl",
        beispiel: "Unterstützung bei der Prüfung von Aufenthaltsanträgen.",
      },
      {
        id: "justiz",
        text: "Justizverwaltung",
        beispiel: "Erzeugung von Entwürfen für gerichtliche Entscheidungen.",
      },
      {
        id: "kritis",
        text: "Kritische Infrastruktur",
        beispiel: "Steuerung der Wasserversorgung oder der Verkehrsleittechnik.",
      },
      { id: "keines", text: "Keines davon", keinesDavon: true },
    ],
  },

  // --- Ausnahmen nach Artikel 6 Absatz 3 ---
  {
    id: "ausnahme_a",
    bereich: "ki",
    typ: "ja_nein",
    text: "Erfüllt das Werkzeug nur eine eng umgrenzte Aufgabe im Verfahren, ohne den Vorgang inhaltlich zu bewerten?",
    erlaeuterung:
      "Gemeint sind Hilfsschritte, die den Ablauf ordnen, aber nichts über den Fall aussagen.",
    beispiel:
      "Ein Werkzeug erkennt, um welche Antragsart es sich handelt, und legt den Vorgang im richtigen Ordner ab.",
    fundstelle: {
      fest: "Artikel 6 Absatz 3 Buchstabe a der Verordnung (EU) 2024/1689 (eng umgrenzte Aufgabe im Verfahren)",
    },
    einleitung: AUSNAHME_EINLEITUNG,
    sichtbarWenn: anhangDreiGewaehlt,
  },
  {
    id: "ausnahme_b",
    bereich: "ki",
    typ: "ja_nein",
    text: "Verbessert das Werkzeug nur das Ergebnis einer Arbeit, die ein Mensch bereits abgeschlossen hat?",
    erlaeuterung:
      "Entscheidend ist die Reihenfolge: Der Mensch entscheidet zuerst, das Werkzeug arbeitet danach am fertigen Ergebnis.",
    beispiel:
      "Ein fertig formulierter Bescheid wird sprachlich geglättet, ohne dass sich der Inhalt ändert.",
    fundstelle: {
      fest: "Artikel 6 Absatz 3 Buchstabe b der Verordnung (EU) 2024/1689 (Verbesserung des Ergebnisses einer abgeschlossenen menschlichen Tätigkeit)",
    },
    sichtbarWenn: anhangDreiGewaehlt,
  },
  {
    id: "ausnahme_c",
    bereich: "ki",
    typ: "ja_nein",
    text: "Zeigt das Werkzeug nur Muster oder Abweichungen an, ohne die Bewertung durch die zuständige Person zu ersetzen?",
    erlaeuterung:
      "Das Werkzeug weist auf etwas hin; bewerten und entscheiden tut weiterhin die zuständige Person.",
    beispiel:
      "Eine Auswertung zeigt an, dass ein Antrag von der üblichen Bearbeitungsdauer abweicht.",
    fundstelle: {
      fest: "Artikel 6 Absatz 3 Buchstabe c der Verordnung (EU) 2024/1689 (Erkennung von Mustern ohne Ersetzen der menschlichen Bewertung)",
    },
    sichtbarWenn: anhangDreiGewaehlt,
  },
  {
    id: "ausnahme_d",
    bereich: "ki",
    typ: "ja_nein",
    text: "Erfüllt das Werkzeug nur eine vorbereitende Aufgabe für eine spätere Bewertung?",
    erlaeuterung:
      "Vorbereitend heißt: Es stellt zusammen, was für die Entscheidung gebraucht wird, trifft sie aber nicht.",
    beispiel: "Unterlagen werden nach Themen sortiert und als Übersicht zusammengestellt.",
    fundstelle: {
      fest: "Artikel 6 Absatz 3 Buchstabe d der Verordnung (EU) 2024/1689 (vorbereitende Aufgabe für eine spätere Bewertung)",
    },
    sichtbarWenn: anhangDreiGewaehlt,
  },
  {
    id: "ausnahme_profile",
    bereich: "ki",
    typ: "ja_nein",
    text: "Erstellt das Werkzeug dabei Profile von Personen?",
    erlaeuterung:
      "Ein Profil entsteht, wenn Angaben zu einer Person ausgewertet werden, um etwas über sie vorherzusagen oder zu bewerten — etwa Verhalten, Zuverlässigkeit oder wirtschaftliche Lage.",
    beispiel:
      "Aus früheren Anträgen wird abgeleitet, wie wahrscheinlich eine Person erneut einen Antrag stellt.",
    fundstelle: {
      fest: "Artikel 6 Absatz 3 letzter Unterabsatz der Verordnung (EU) 2024/1689 (Rückausnahme bei Erstellung von Profilen)",
    },
    sichtbarWenn: anhangDreiGewaehlt,
  },
  {
    id: "ausnahme_begruendung",
    bereich: "ki",
    typ: "freitext",
    text: "Womit begründet die Dienststelle die Ausnahme?",
    erlaeuterung:
      "Die Begründung wird unverändert in das Freigabedokument übernommen. Die Bewertung ist zu dokumentieren; die Registrierungspflicht bleibt davon unberührt.",
    beispiel:
      "Das Werkzeug ordnet eingehende Unterlagen nur den Antragsarten zu und bewertet den Inhalt nicht.",
    fundstelle: {
      fest: "Artikel 6 Absatz 4 der Verordnung (EU) 2024/1689 (Dokumentation der Bewertung und Registrierungspflicht)",
    },
    sichtbarWenn: (a) =>
      anhangDreiGewaehlt(a) && ausnahmeBejaht(a) && a["ausnahme_profile"] !== "ja",
  },

  {
    id: "transparenz",
    bereich: "ki",
    typ: "mehrfach",
    text: "Sprechen Menschen unmittelbar mit dem Werkzeug, oder erzeugt es Inhalte, die echt wirken?",
    erlaeuterung:
      "Menschen müssen erkennen können, dass sie mit einem maschinellen Gegenüber sprechen oder dass ein Inhalt maschinell erzeugt wurde. Erzeugte Inhalte sind zusätzlich maschinenlesbar zu kennzeichnen.",
    beispiel:
      "Ein Chatfenster auf der Internetseite der Behörde beantwortet Fragen zu Öffnungszeiten.",
    fundstelle: {
      fest: "Artikel 50 Absatz 1 bis 4 der Verordnung (EU) 2024/1689 (Transparenzpflichten bei Interaktion und erzeugten Inhalten)",
    },
    optionen: [
      {
        id: "interaktion",
        text: "Menschen schreiben oder sprechen unmittelbar mit dem Werkzeug",
        beispiel: "Ein Chatfenster im Bürgerportal beantwortet Fragen selbst.",
      },
      {
        id: "synthetisch",
        text: "Das Werkzeug erzeugt Texte, Bilder oder Tonaufnahmen",
        beispiel: "Erzeugte Bilder für eine Informationsbroschüre der Dienststelle.",
      },
      { id: "keines", text: "Keines davon", keinesDavon: true },
    ],
  },

  // --- Fragen nur bei einem Update eines vorhandenen Werkzeugs ---
  {
    id: "update_ankuendigung",
    bereich: "update",
    typ: "einfach",
    text: "Hat der Anbieter die neue Funktion angekündigt, oder ist sie ohne Ankündigung erschienen?",
    erlaeuterung:
      "Eine angekündigte Funktion lässt sich vor der Aktivierung prüfen. Eine stillschweigend erschienene Funktion ist bereits im Haus, bevor eine Prüfung stattfinden konnte.",
    beispiel:
      "Die Textverarbeitung zeigt nach einer Aktualisierung plötzlich eine Schaltfläche für Textvorschläge, ohne dass darüber informiert wurde.",
    fundstelle: {
      fest: "Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Sorgfaltspflichten der betreibenden Stelle)",
    },
    nurFallart: ["update"],
    optionen: [
      { id: "angekuendigt", text: "Die Funktion wurde vorab angekündigt" },
      { id: "stillschweigend", text: "Die Funktion ist ohne Ankündigung erschienen" },
    ],
  },
  {
    id: "update_standard_aktiv",
    bereich: "update",
    typ: "einfach",
    text: "Ist die neue Funktion von sich aus eingeschaltet, und lässt sie sich abschalten?",
    erlaeuterung:
      "Eine von sich aus eingeschaltete Funktion wird genutzt, ohne dass jemand sie bewusst gewählt hat. Fehlt zusätzlich die Möglichkeit zum Abschalten, lässt sich der Einsatz nicht begrenzen.",
    beispiel:
      "Die Zusammenfassung von Besprechungen läuft nach dem Update automatisch mit und muss in jeder Sitzung einzeln beendet werden.",
    fundstelle: {
      fest: "Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Einsatz nach der Betriebsanleitung) · Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)",
    },
    nurFallart: ["update"],
    optionen: [
      { id: "aus", text: "Die Funktion ist standardmäßig ausgeschaltet" },
      {
        id: "an_abschaltbar",
        text: "Die Funktion ist standardmäßig aktiv, lässt sich aber abschalten",
      },
      {
        id: "an_nicht_abschaltbar",
        text: "Die Funktion ist standardmäßig aktiv und lässt sich nicht abschalten",
      },
    ],
  },
  {
    id: "update_datenabfluss",
    bereich: "update",
    typ: "ja_nein",
    text: "Verlassen durch die neue Funktion Daten den Rechner oder das Haus, die vorher dort geblieben sind?",
    erlaeuterung:
      "Viele neue Funktionen rechnen nicht auf dem Gerät, sondern beim Anbieter. Dadurch ändert sich, wohin Inhalte aus der täglichen Arbeit übertragen werden.",
    beispiel:
      "Entwürfe aus der Textverarbeitung werden für die Vorschläge an ein Rechenzentrum des Anbieters übertragen.",
    fundstelle: {
      fest: "Artikel 28 und Kapitel V der Verordnung (EU) 2016/679 (Verarbeitung im Auftrag und Übermittlung an Drittländer)",
    },
    nurFallart: ["update"],
  },

  // --- Datenschutz ---
  {
    id: "personenbezug",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Werden Angaben verarbeitet, die sich einer bestimmten Person zuordnen lassen?",
    erlaeuterung:
      "Dazu zählen Namen, Aktenzeichen mit Personenbezug, Sprachaufnahmen und Freitexte aus Vorgängen. Es genügt, dass eine Zuordnung mit vertretbarem Aufwand möglich ist.",
    beispiel: "Ein Werkzeug wertet eingegangene Widersprüche samt Namen und Anschrift aus.",
    fundstelle: {
      fest: "Artikel 4 Nummer 1 der Verordnung (EU) 2016/679 (Begriff der personenbezogenen Daten)",
    },
  },
  {
    id: "beschaeftigtendaten",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Sind darunter auch Daten der eigenen Beschäftigten?",
    erlaeuterung:
      "Gemeint sind Anmeldedaten, Bearbeitungszeiten und die Inhalte der täglichen Arbeit der Kolleginnen und Kollegen. Für solche Daten gelten zusätzliche Anforderungen aus dem Beschäftigtendatenschutz.",
    beispiel: "Auswertung von Postfächern oder Kalendern.",
    fundstelle: { national: "beschaeftigtendatenschutz" },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },
  {
    id: "besondere_kategorien",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Werden besondere Kategorien personenbezogener Daten verarbeitet, etwa zu Gesundheit, ethnischer Herkunft oder religiöser Überzeugung?",
    erlaeuterung:
      "Dazu zählen auch Angaben zur Gewerkschaftszugehörigkeit, zum Sexualleben sowie biometrische Daten zur eindeutigen Erkennung einer Person. Solche Angaben stehen unter besonderem Schutz; bei „ja“ ist vor dem Start eine Datenschutz-Folgenabschätzung durchzuführen.",
    beispiel: "Gesundheitsangaben in Anträgen, Angaben zur Gewerkschaftszugehörigkeit.",
    fundstelle: {
      fest: "Artikel 9 Absatz 1 der Verordnung (EU) 2016/679 (besondere Kategorien personenbezogener Daten)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },
  {
    id: "rechtsgrundlage",
    bereich: "datenschutz",
    typ: "freitext",
    text: "Auf welche Vorschrift stützt sich die Verarbeitung?",
    erlaeuterung:
      "Öffentliche Stellen brauchen dafür in aller Regel eine Vorschrift im Fachrecht. Eine Einwilligung trägt hier meist nicht, weil zwischen Behörde und betroffener Person kein Verhältnis auf Augenhöhe besteht.",
    beispiel: "Das Fachgesetz, nach dem der Antrag bearbeitet wird.",
    fundstelle: {
      fest: "Artikel 6 Absatz 1 Buchstabe e und Absatz 3 der Verordnung (EU) 2016/679 (Rechtsgrundlage für die Wahrnehmung öffentlicher Aufgaben)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },
  {
    id: "dsfa_schwellen",
    bereich: "datenschutz",
    typ: "mehrfach",
    text: "Trifft einer dieser drei Punkte auf Ihr Vorhaben zu?",
    erlaeuterung:
      "Die Datenschutz-Folgenabschätzung ist unabhängig von der KI-Verordnung zu prüfen. Die Aufsichtsbehörden führen zusätzlich Listen von Verarbeitungen, bei denen sie immer erforderlich ist.",
    beispiel:
      "Eine Auswertung, die viele Personen zugleich betrifft und Folgen für ihre Ansprüche haben kann.",
    fundstelle: {
      fest: "Artikel 35 Absatz 3 und 4 der Verordnung (EU) 2016/679 (Fälle mit zwingender Datenschutz-Folgenabschätzung)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
    optionen: [
      {
        id: "bewertung",
        text: "umfassende Bewertung persönlicher Aspekte als Grundlage für Entscheidungen",
        beispiel: "Eine Einstufung von Antragstellenden, die über die Bearbeitung entscheidet.",
      },
      {
        id: "besondere_umfangreich",
        text: "umfangreiche Verarbeitung von Daten besonderer Kategorien",
        beispiel: "Auswertung von Gesundheitsangaben aus einer großen Zahl von Vorgängen.",
      },
      {
        id: "ueberwachung_oeffentlich",
        text: "systematische weiträumige Überwachung öffentlich zugänglicher Bereiche",
        beispiel: "Dauerhafte Auswertung von Kamerabildern in einem Bürgerzentrum.",
      },
      { id: "keines", text: "keines davon", keinesDavon: true },
    ],
  },
  {
    id: "anbieter_voreinstellung",
    bereich: "datenschutz",
    typ: "einfach",
    text: "Werden Ihre Eingaben vom Anbieter weiterverwendet, etwa zur Verbesserung seines Systems — und lässt sich das abschalten?",
    erlaeuterung:
      "Viele Werkzeuge sind ab Werk so eingestellt, dass Eingaben weiterverwendet werden. In einer Behörde ist das selten gewollt und häufig unzulässig.",
    beispiel:
      "In den Einstellungen findet sich ein Schalter zur Verwendung von Eingaben für das Training.",
    fundstelle: {
      fest: "Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
    optionen: [
      { id: "nein", text: "nein" },
      { id: "abgeschaltet", text: "ja, abgeschaltet" },
      { id: "nicht_abschaltbar", text: "ja, nicht abschaltbar" },
      { id: "unbekannt", text: "unbekannt" },
    ],
  },
  {
    id: "auftragsverarbeitung",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Verarbeitet der Anbieter die Daten für Sie auf seinen eigenen Systemen?",
    erlaeuterung:
      "Das ist der Fall, wenn das Werkzeug nicht bei Ihnen im Haus läuft, sondern beim Anbieter. Er darf die Daten dann nur nach Ihren Weisungen verwenden.",
    beispiel: "Das Werkzeug läuft als Webdienst beim Anbieter, Eingaben werden dort verarbeitet.",
    fundstelle: {
      fest: "Artikel 28 Absatz 1 der Verordnung (EU) 2016/679 (Verarbeitung im Auftrag)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },
  {
    id: "avv_vorhanden",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Liegt ein unterschriebener Vertrag zur Auftragsverarbeitung nach Artikel 28 DSGVO vor?",
    erlaeuterung:
      "Der Vertrag zur Auftragsverarbeitung legt fest, was der Anbieter mit den Daten tun darf und welche Sicherheitsmaßnahmen gelten. Er ist vom Nutzungs- oder Lizenzvertrag zu unterscheiden, der nach diesem Vertrag gesondert erfragt wird, und muss vor Beginn der Erprobung geschlossen sein.",
    beispiel:
      "Eine vom Anbieter und von Ihrer Dienststelle unterzeichnete Vereinbarung zur Auftragsverarbeitung liegt in der Akte.",
    fundstelle: {
      fest: "Artikel 28 Absatz 3 der Verordnung (EU) 2016/679 (Vertrag zur Auftragsverarbeitung)",
    },
    nurWenn: { frageId: "auftragsverarbeitung", wert: "ja" },
  },
  {
    id: "drittland",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Werden die Daten außerhalb der Europäischen Union verarbeitet oder gespeichert?",
    erlaeuterung:
      "Eine Verarbeitung außerhalb der Union setzt zusätzliche Grundlagen voraus, etwa Standardvertragsklauseln. Maßgeblich ist auch, wo Unterauftragnehmer des Anbieters sitzen.",
    beispiel: "Server oder Unterauftragnehmer außerhalb der EU.",
    fundstelle: {
      fest: "Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },
  {
    id: "vvt",
    bereich: "datenschutz",
    typ: "ja_nein",
    text: "Ist die Verarbeitung bereits im Verzeichnis Ihrer Dienststelle eingetragen?",
    erlaeuterung:
      "Das Verzeichnis der Verarbeitungstätigkeiten ist die interne Übersicht aller Verarbeitungen. Auch eine befristete Erprobung gehört hinein.",
    beispiel: "Ein Eintrag mit Zweck, Datenarten und Löschfrist für die geplante Erprobung.",
    fundstelle: {
      fest: "Artikel 30 Absatz 1 der Verordnung (EU) 2016/679 (Verzeichnis der Verarbeitungstätigkeiten)",
    },
    nurWenn: { frageId: "personenbezug", wert: "ja" },
  },

  // --- IT-Sicherheit ---
  {
    id: "zertifizierung",
    bereich: "it_sicherheit",
    typ: "mehrfach",
    text: "Welche Nachweise zur Informationssicherheit legt der Anbieter vor, jeweils mit Testat?",
    erlaeuterung:
      "Ein Testat oder Zertifikat belegt, dass ein unabhängiger Prüfer die Sicherheitsmaßnahmen des Anbieters geprüft hat. Bei Cloud-Diensten ist der Kriterienkatalog C5 des BSI üblich.",
    beispiel: "Der Anbieter legt ein aktuelles C5-Testat (Typ 2) seines Rechenzentrums vor.",
    fundstelle: {
      fest: "Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung) · BSI-Kriterienkatalog C5 · ISO/IEC 27001 auf der Basis von IT-Grundschutz",
    },
    ergaenzend: true,
    optionen: [
      { id: "iso27001", text: "ISO/IEC 27001 mit Zertifikat" },
      { id: "c5", text: "BSI C5 mit Testat" },
      {
        id: "grundschutz",
        text: "BSI IT-Grundschutz (ISO 27001 auf der Basis von IT-Grundschutz) mit Testat",
      },
      { id: "keines", text: "keiner dieser Nachweise", keinesDavon: true },
      { id: UNKLAR, text: UNKLAR_TEXT, keinesDavon: true },
    ],
  },
  {
    id: "serverstandort",
    bereich: "it_sicherheit",
    typ: "einfach",
    text: "Wo stehen die Server, auf denen das Werkzeug betrieben wird?",
    erlaeuterung:
      "Maßgeblich sind auch Ausweich- und Sicherungsstandorte sowie die Standorte von Unterauftragnehmern.",
    beispiel: "Rechenzentrum des Anbieters in Frankfurt am Main, Sicherung in Amsterdam.",
    fundstelle: {
      fest: "Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)",
    },
    ergaenzend: true,
    optionen: [
      { id: "deutschland", text: "in Deutschland" },
      { id: "eu", text: "in der Europäischen Union" },
      { id: "ausserhalb_eu", text: "außerhalb der Europäischen Union" },
      { id: UNKLAR, text: UNKLAR_TEXT },
    ],
  },
  {
    id: "betriebsanforderungen",
    bereich: "it_sicherheit",
    typ: "freitext",
    text: "Welche Anforderungen gelten für den Betrieb?",
    erlaeuterung:
      "Etwa Anbindung an die eigene Anmeldung, Netzbereich, Verfügbarkeit oder Vorgaben des Rechenzentrums. Die Angabe geht in die technische Vorprüfung für den ISB ein.",
    beispiel: "Anmeldung über das zentrale Verzeichnis, Zugriff nur aus dem Verwaltungsnetz.",
    fundstelle: {
      fest: "Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung)",
    },
    ergaenzend: true,
  },

  // --- Finanzen und Beschaffung ---
  {
    id: "nutzungsvertrag",
    bereich: "finanzen",
    typ: "ja_nein",
    text: "Liegt ein unterschriebener Nutzungs- oder Lizenzvertrag mit dem Anbieter vor?",
    erlaeuterung:
      "Der Nutzungs- oder Lizenzvertrag regelt, ob und wie die Dienststelle das Werkzeug nutzen darf. Er ersetzt nicht den Vertrag zur Auftragsverarbeitung.",
    beispiel:
      "Eine kostenfreie Testlizenz für drei Monate mit den Nutzungsbedingungen des Anbieters.",
    fundstelle: {
      fest: "§§ 31 und 69d des Urheberrechtsgesetzes (Einräumung von Nutzungsrechten an Software)",
    },
    ergaenzend: true,
  },
  {
    id: "kosten_erprobung",
    bereich: "finanzen",
    typ: "betrag",
    text: "Welche Kosten erwarten Sie während der Erprobung?",
    erlaeuterung:
      "Betrag in Euro, Schätzwerte genügen. Sobald Kosten anfallen, ist die Finanzverwaltung zu beteiligen.",
    beispiel: "0 Euro bei einer kostenfreien Testlizenz.",
    fundstelle: { fest: "Haushaltsrecht des Trägers (Bewirtschaftung der Haushaltsmittel)" },
    ergaenzend: true,
  },
  {
    id: "kosten_ueberfuehrung",
    bereich: "finanzen",
    typ: "betrag",
    text: "Welche Kosten erwarten Sie bei einer Überführung in den Regelbetrieb?",
    erlaeuterung:
      "Betrag in Euro für die gesamte Laufzeit, Schätzwerte genügen. Der Betrag wird mit den Schwellen aus dem Einrichtungsprofil verglichen.",
    beispiel: "120.000 Euro für Lizenzen über drei Jahre.",
    fundstelle: {
      fest: "Haushaltsrecht des Trägers · Vergaberecht (Teil 4 des Gesetzes gegen Wettbewerbsbeschränkungen oberhalb der EU-Schwellenwerte, darunter Unterschwellenvergabeordnung oder Landesvergaberecht)",
    },
    ergaenzend: true,
  },

  // --- Betrieb ---
  {
    id: "ueberwachung",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ließe sich mit dem Werkzeug nachvollziehen, wer wie schnell oder wie viel gearbeitet hat?",
    erlaeuterung:
      "Es genügt die technische Eignung, eine Absicht zur Überwachung ist nicht erforderlich. Schon Protokolle über Bearbeitungszeiten können ausreichen.",
    beispiel:
      "Das Werkzeug protokolliert, wer wann welche Vorgänge bearbeitet hat, auch wenn das gar nicht der Zweck ist.",
    fundstelle: { national: "personalvertretung" },
  },
  {
    id: "entscheidung_vorbereitung",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Bereitet das Werkzeug Entscheidungen gegenüber Bürgerinnen und Bürgern vor?",
    erlaeuterung:
      "Vorbereiten heißt: Das Ergebnis fließt in die Entscheidung ein, die eine zuständige Person trifft.",
    beispiel: "Eingehende Anträge werden nach Dringlichkeit vorsortiert.",
    fundstelle: { national: "verwaltungsverfahren" },
  },
  {
    id: "entscheidung_automatisiert",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ergeht die Entscheidung ohne Beteiligung eines Menschen und hat sie rechtliche Wirkung oder erhebliche Nachteile?",
    erlaeuterung:
      "Nur diese Kombination löst die besonderen Anforderungen an automatisierte Einzelentscheidungen aus.",
    beispiel: "Eine Leistung wird ohne menschliche Prüfung abgelehnt.",
    fundstelle: {
      fest: "Artikel 22 Absatz 1 der Verordnung (EU) 2016/679 (automatisierte Entscheidungen im Einzelfall)",
    },
  },
  {
    id: "vollautomatischer_erlass",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Soll das Werkzeug verbindliche Entscheidungen erlassen, ohne dass eine zuständige Person sie prüft?",
    erlaeuterung:
      "Gemeint ist nicht die Vorbereitung, sondern der Erlass selbst: Am Ende geht etwas nach außen, das niemand angesehen hat.",
    beispiel: "Ein Antrag wird automatisch beschieden, sobald alle Felder ausgefüllt sind.",
    fundstelle: { national: "verwaltungsverfahren" },
  },
  {
    id: "vollautomatisch_grundlage",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Gibt es eine Rechtsvorschrift, die das für Ihr Verfahren ausdrücklich zulässt?",
    erlaeuterung:
      "Der vollständig automatisierte Erlass ist nur zulässig, wenn eine Vorschrift ihn für das jeweilige Verfahren ausdrücklich vorsieht.",
    beispiel:
      "Eine Vorschrift im Fachrecht, die den automatisierten Erlass für dieses Verfahren zulässt.",
    fundstelle: { national: "verwaltungsverfahren" },
    nurWenn: { frageId: "vollautomatischer_erlass", wert: "ja" },
  },
  {
    id: "barrierefreiheit",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ist das Werkzeug für alle Beschäftigten barrierefrei nutzbar?",
    erlaeuterung:
      "Öffentliche Stellen dürfen digitale Anwendungen nur barrierefrei einsetzen. Das gilt auch für ein Werkzeug, das nur erprobt wird. Bei „nein“ oder „noch unklar“ wird die Prüfung der Barrierefreiheit zur Auflage.",
    beispiel: "Das Werkzeug ist ausschließlich mit der Maus bedienbar und nicht mit der Tastatur.",
    fundstelle: {
      fest: "Barrierefreie-Informationstechnik-Verordnung 2.0 (BITV 2.0); bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die Bayerische Barrierefreie Informationstechnik-Verordnung (BayBITV)",
    },
  },
  {
    id: "dienstvereinbarung",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ist für den Einsatz eine Dienstvereinbarung nötig, oder besteht bereits eine?",
    erlaeuterung:
      "Eine Dienstvereinbarung regelt zwischen Dienststelle und Personalrat, wie ein technisches System im Haus eingesetzt wird. Wird sie gebraucht oder besteht sie bereits, ist der Personalrat zu beteiligen.",
    beispiel:
      "Für die Einführung von Software am Arbeitsplatz gibt es eine Rahmendienstvereinbarung, die um das neue Werkzeug ergänzt werden soll.",
    fundstelle: { national: "personalvertretung" },
    ergaenzend: true,
  },
  {
    id: "schulungsunterlagen",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Gibt es Einweisungs- und Schulungsunterlagen für das Werkzeug?",
    erlaeuterung:
      "Die Dienststelle stellt sicher, dass die Nutzenden ausreichend geschult sind, und kann die Schulung anordnen. Dafür werden Unterlagen gebraucht, die den Einsatz im eigenen Haus beschreiben.",
    beispiel: "Eine Kurzanleitung mit den zulässigen Einsatzzwecken und den Grenzen des Werkzeugs.",
    fundstelle: {
      fest: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
    },
    ergaenzend: true,
  },
  {
    id: "schulung_ersteller",
    bereich: "betrieb",
    typ: "freitext",
    text: "Wer erstellt die Unterlagen und führt die Einweisung durch?",
    erlaeuterung:
      "Nennen Sie die zuständige Stelle oder Person, etwa den Anbieter oder den IT-Betrieb.",
    beispiel: "Der IT-Betrieb gemeinsam mit dem Anbieter.",
    fundstelle: {
      fest: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
    },
    ergaenzend: true,
  },
  {
    id: "schulung_zielgruppe",
    bereich: "betrieb",
    typ: "freitext",
    text: "Wer wird eingewiesen?",
    erlaeuterung:
      "Nennen Sie die Beschäftigten oder Organisationseinheiten, die das Werkzeug nutzen.",
    beispiel: "Die zwölf Beschäftigten des Sachgebiets Bürgerservice.",
    fundstelle: {
      fest: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
    },
    ergaenzend: true,
  },
  {
    id: "testdaten",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ließe sich die Erprobung mit erfundenen Daten statt mit echten Vorgängen durchführen?",
    erlaeuterung:
      "Testdaten sind erfundene oder wirksam anonymisierte Angaben. Ihre Verwendung senkt das Risiko der Erprobung erheblich.",
    beispiel: "Ein nachgebauter Musterantrag mit erfundenen Namen statt eines echten Vorgangs.",
    fundstelle: {
      fest: "Artikel 5 Absatz 1 Buchstabe c der Verordnung (EU) 2016/679 (Datenminimierung)",
    },
  },
  {
    id: "unterrichtung",
    bereich: "betrieb",
    typ: "ja_nein",
    text: "Ist vorgesehen, die beteiligten Beschäftigten vor Beginn schriftlich über die Erprobung zu unterrichten?",
    erlaeuterung:
      "Die Unterrichtung nennt Zweck, Umfang und Dauer der Erprobung sowie die vorgesehene Schulung der Nutzenden.",
    beispiel:
      "Ein einseitiges Schreiben an die beteiligte Organisationseinheit vor dem ersten Erprobungstag.",
    fundstelle: {
      fest: "Artikel 13 Absatz 1 der Verordnung (EU) 2016/679 (Informationspflicht gegenüber betroffenen Personen) · Artikel 26 Absatz 7 der Verordnung (EU) 2024/1689 (Unterrichtung der Beschäftigten vor Inbetriebnahme)",
      national: "personalvertretung",
    },
  },
];

export interface Ampelregel {
  id: string;
  ampel: Ampel;
  begruendung: string;
  fundstelle: string;
}

/** Zusätzliche Hinweise, die abhängig von den Antworten eingeblendet werden. */
export const HINWEISE = {
  kiKompetenz: {
    text: "Beschäftigte, die das Werkzeug bedienen, müssen über ausreichende KI-Kompetenz verfügen. Die Dienststelle sorgt vor Beginn der Erprobung für eine angemessene Einweisung.",
    fundstelle: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
  },
  hochrisikoKuenftig: {
    text: "Ihr Vorhaben liegt in einem Bereich, für den die besonderen Anforderungen an Hochrisiko-Systeme gelten werden. Diese Anforderungen sind ab dem 2. Dezember 2027 einzuhalten. Für eine Erprobung im laufenden Jahr bestehen sie noch nicht; die Erprobung sollte jedoch so angelegt werden, dass die spätere Einhaltung möglich bleibt.",
    fundstelle:
      "Anhang III und Artikel 113 der Verordnung (EU) 2024/1689 (Bereiche mit hohem Risiko und Beginn der Geltung)",
    geltungAb: GELTUNG_HOCHRISIKO,
  },
  grundrechteFolgenabschaetzung: {
    text: "Es wird empfohlen, bereits jetzt eine Abschätzung der Auswirkungen auf die Grundrechte durchzuführen und das Ergebnis schriftlich festzuhalten; als öffentliche Stelle sind Sie dazu ab dem 2. Dezember 2027 verpflichtet.",
    fundstelle:
      "Artikel 27 Absatz 1 der Verordnung (EU) 2024/1689 (Abschätzung der Auswirkungen auf die Grundrechte durch öffentliche Stellen)",
    geltungAb: GELTUNG_HOCHRISIKO,
  },
  registrierung: {
    text: "Es wird empfohlen, die Registrierung in der EU-Datenbank vorzubereiten; für den Einsatz eines Hochrisiko-Systems durch eine öffentliche Stelle ist sie ab dem 2. Dezember 2027 vor Beginn erforderlich.",
    fundstelle:
      "Artikel 49 Absatz 3 der Verordnung (EU) 2024/1689 (Registrierung in der EU-Datenbank)",
    geltungAb: GELTUNG_HOCHRISIKO,
  },
  anbieterrolle: {
    text: "In der Anbieterrolle treffen Sie die vollen Pflichten einer anbietenden Stelle, unter anderem Risikomanagement, technische Dokumentation und Konformitätsbewertung.",
    fundstelle: "Artikel 16 der Verordnung (EU) 2024/1689 (Pflichten der anbietenden Stelle)",
  },
  datenschutzfolgenabschaetzung: {
    text: "Bei voraussichtlich hohem Risiko für die Rechte betroffener Personen ist vor Beginn eine Datenschutz-Folgenabschätzung durchzuführen.",
    fundstelle: "Artikel 35 Absatz 1 der Verordnung (EU) 2016/679 (Datenschutz-Folgenabschätzung)",
  },
  kennzeichnungMaschinenlesbar: {
    text: "Erzeugte Texte, Bilder und Tonaufnahmen sind maschinenlesbar zu kennzeichnen; diese Pflicht ist ab dem 2. Dezember 2026 einzuhalten.",
    fundstelle:
      "Artikel 50 Absatz 2 der Verordnung (EU) 2024/1689 (maschinenlesbare Kennzeichnung erzeugter Inhalte)",
    geltungAb: GELTUNG_ZWEITE_STUFE,
  },
  forschungsphase: {
    text: "Nach Ihren Angaben dient der Einsatz allein Forschung und Entwicklung vor dem Betrieb. Die Pflichten der KI-Verordnung greifen dann in vielen Fällen noch nicht; die Anforderungen des Datenschutzes und des Betriebs bleiben unberührt.",
    fundstelle:
      "Artikel 2 Absatz 6 und 8 der Verordnung (EU) 2024/1689 (Ausnahme für Forschung und Entwicklung)",
  },
  entscheidungVorbereitung: {
    text: "Die Vorbereitung einer Entscheidung entbindet nicht von der Pflicht, den Sachverhalt von Amts wegen zu ermitteln.",
    fundstelle:
      "Untersuchungsgrundsatz des nationalen Verwaltungsverfahrensrechts (Ermittlung des Sachverhalts von Amts wegen)",
  },
  updateStillschweigend: {
    text: "Eine ohne Ankündigung erschienene, von sich aus eingeschaltete Funktion, durch die zusätzlich Daten das Haus verlassen, ist bis zur abgeschlossenen Prüfung abzuschalten oder auf einen abgegrenzten Kreis von Arbeitsplätzen zu begrenzen. Solange dies nicht geschehen ist, darf die Funktion im Haus nicht genutzt werden.",
    fundstelle:
      "Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Sorgfaltspflichten der betreibenden Stelle) · Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)",
  },
} as const;

export const UMGESTALTUNGSVORSCHLAEGE: Record<string, string> = {
  emotion:
    "Verzichten Sie auf jede Auswertung von Gefühlslagen. Beschränken Sie das Vorhaben auf sachbezogene Funktionen ohne Bezug zur einzelnen Person.",
  social_scoring:
    "Verzichten Sie auf eine übergreifende Bewertung von Personen. Prüfen Sie stattdessen einzelfallbezogene, nachvollziehbare Kriterien ohne Punktesystem.",
  biometrie:
    "Verzichten Sie auf die Einordnung von Personen nach körperlichen Merkmalen. Prüfen Sie eine Lösung, die ohne die Erhebung biometrischer Daten auskommt.",
  gesichtsbilder:
    "Verzichten Sie auf das Sammeln von Gesichtsbildern. Nutzen Sie ausschließlich Datenbestände mit klarer Rechtsgrundlage und begrenztem Zweck.",
  praediktion:
    "Verzichten Sie auf Vorhersagen zu einzelnen Personen. Eine Auswertung auf Ebene von Orten oder Zeiträumen ohne Personenbezug kann zulässig sein.",
  unterschwellig:
    "Gestalten Sie die Oberfläche so, dass jede Wahlmöglichkeit erkennbar und gleichwertig dargestellt ist.",
  schutzbeduerftig:
    "Verzichten Sie auf jede Anpassung des Vorgehens an eine vermutete Schutzbedürftigkeit. Halten Sie den Ablauf für alle Personen gleich.",
  biometrische_echtzeit:
    "Verzichten Sie auf die biometrische Erkennung im öffentlich zugänglichen Raum. Prüfen Sie organisatorische Lösungen ohne Erfassung von Merkmalen.",
  intime_darstellungen:
    "Schließen Sie die Erzeugung solcher Darstellungen technisch aus und begrenzen Sie das Werkzeug auf den dienstlichen Zweck.",
  missbrauchsdarstellungen:
    "Schließen Sie die Erzeugung solcher Darstellungen technisch aus und begrenzen Sie das Werkzeug auf den dienstlichen Zweck.",
  vollautomatischer_erlass:
    "Denkbar ist eine Erprobung, bei der das Werkzeug die Entscheidung nur vorbereitet und eine zuständige Person sie prüft und verantwortet.",
};

/**
 * Punkte der Dokumenten-Checkliste: Unterlagen, die die Dienststelle vor
 * Beginn der Erprobung beibringen muss. Auslöser sind die aus Schritt 2
 * abgeleiteten Signale.
 */
export interface Checklistenpunkt {
  id: string;
  /** Was fehlt. */
  was: string;
  /** Warum es gebraucht wird. */
  warum: string;
  fundstelle: string;
  ausloeser: (s: Signale) => boolean;
  /** Stelle, deren Laufzettel die Unterlage aufführt; sonst die Behördenleitung. */
  zustaendig: string;
}

export const CHECKLISTENPUNKTE: Checklistenpunkt[] = [
  {
    id: "avv",
    zustaendig: "datenschutz",
    was: "Unterschriebener Vertrag zur Auftragsverarbeitung mit dem Anbieter",
    warum:
      "Der Anbieter verarbeitet die Daten für Ihre Dienststelle auf eigenen Systemen. Ohne Vertrag fehlt die Grundlage dieser Verarbeitung.",
    fundstelle:
      "Artikel 28 Absatz 3 der Verordnung (EU) 2016/679 (Vertrag zur Auftragsverarbeitung)",
    ausloeser: (s) => s.personenbezug && s.auftragsverarbeitungOhneVertrag,
  },
  {
    id: "drittland",
    zustaendig: "datenschutz",
    was: "Dokumentierte Grundlage für die Verarbeitung außerhalb der Europäischen Union",
    warum:
      "Eine Verarbeitung außerhalb der Union setzt eine eigene Grundlage voraus, etwa Standardvertragsklauseln samt Prüfung der Lage im Empfängerstaat.",
    fundstelle:
      "Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)",
    ausloeser: (s) => s.personenbezug && s.drittland,
  },
  {
    id: "vvt",
    zustaendig: "datenschutz",
    was: "Eintrag der Erprobung im Verzeichnis der Verarbeitungstätigkeiten",
    warum:
      "Auch eine befristete Erprobung ist eine Verarbeitungstätigkeit und gehört mit Zweck, Datenarten und Löschfrist in das Verzeichnis.",
    fundstelle:
      "Artikel 30 Absatz 1 der Verordnung (EU) 2016/679 (Verzeichnis der Verarbeitungstätigkeiten)",
    ausloeser: (s) => s.vvtFehlt,
  },
  {
    id: "grundrechte",
    zustaendig: "leitung",
    was: "Schriftliche Abschätzung der Auswirkungen auf die Grundrechte",
    warum:
      "Für Hochrisiko-Systeme ist die Abschätzung ab dem 2. Dezember 2027 vorgeschrieben; eine frühzeitige Abschätzung hält die spätere Einhaltung offen.",
    fundstelle:
      "Artikel 27 Absatz 1 der Verordnung (EU) 2024/1689 (Abschätzung der Auswirkungen auf die Grundrechte durch öffentliche Stellen)",
    ausloeser: (s) => s.hochrisikoWirksam,
  },
  {
    id: "dsfa",
    zustaendig: "datenschutz",
    was: "Datenschutz-Folgenabschätzung",
    warum:
      "Bei voraussichtlich hohem Risiko für die Rechte betroffener Personen ist die Folgenabschätzung vor Beginn der Verarbeitung durchzuführen.",
    fundstelle: "Artikel 35 Absatz 1 der Verordnung (EU) 2016/679 (Datenschutz-Folgenabschätzung)",
    ausloeser: (s) =>
      s.personenbezug &&
      (s.besondereKategorien || s.hochrisikoWirksam || s.dsfaSchwellen.length > 0),
  },
  {
    id: "rechtsgrundlage",
    zustaendig: "datenschutz",
    was: "Benennung der Vorschrift, auf die sich die Verarbeitung stützt",
    warum:
      "Ohne benannte Vorschrift darf die Verarbeitung personenbezogener Daten nicht beginnen. Der Eintrag wird unverändert in das Freigabedokument übernommen.",
    fundstelle:
      "Artikel 6 Absatz 1 Buchstabe e und Absatz 3 der Verordnung (EU) 2016/679 (Rechtsgrundlage für die Wahrnehmung öffentlicher Aufgaben)",
    ausloeser: (s) => s.rechtsgrundlageFehlt,
  },
  {
    id: "voreinstellungen",
    zustaendig: "datenschutz",
    was: "Nachweis, dass Eingaben nicht für Zwecke des Anbieters weiterverwendet werden",
    warum:
      "Die Weiterverwendung von Eingaben ist ab Werk häufig eingeschaltet. Ohne Abschaltung oder verbindliche Zusage des Anbieters fehlt die datenschutzgerechte Voreinstellung.",
    fundstelle:
      "Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)",
    ausloeser: (s) => s.personenbezug && s.anbieterVoreinstellungKritisch,
  },
  {
    id: "barrierefreiheit",
    zustaendig: "swb_gleichstellung",
    was: "Nachweis oder Prüfbericht zur Barrierefreiheit des Werkzeugs",
    warum:
      "Öffentliche Stellen dürfen digitale Anwendungen nur barrierefrei einsetzen; solange der Nachweis fehlt, ist ein gleichwertiger Weg vorzuhalten.",
    fundstelle:
      "Barrierefreie-Informationstechnik-Verordnung 2.0 (BITV 2.0); bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die Bayerische Barrierefreie Informationstechnik-Verordnung (BayBITV)",
    ausloeser: (s) => s.barrierefreiheitOffen,
  },
  {
    id: "unterrichtung",
    zustaendig: "personalrat",
    was: "Schriftliche Unterrichtung der beteiligten Beschäftigten",
    warum:
      "Die Beschäftigten sind vor Beginn über Zweck, Umfang und Dauer der Erprobung sowie über die vorgesehene Schulung zu unterrichten.",
    fundstelle:
      "Artikel 13 Absatz 1 der Verordnung (EU) 2016/679 (Informationspflicht gegenüber betroffenen Personen) · Artikel 26 Absatz 7 der Verordnung (EU) 2024/1689 (Unterrichtung der Beschäftigten vor Inbetriebnahme)",
    ausloeser: (s) => s.unterrichtungFehlt,
  },
  {
    id: "registrierung",
    zustaendig: "leitung",
    was: "Nachweis der Registrierung in der EU-Datenbank",
    warum:
      "Für den Einsatz eines Hochrisiko-Systems durch eine öffentliche Stelle ist die Registrierung ab dem 2. Dezember 2027 vor Beginn erforderlich.",
    fundstelle:
      "Artikel 49 Absatz 3 der Verordnung (EU) 2024/1689 (Registrierung in der EU-Datenbank)",
    ausloeser: (s) => s.hochrisikoWirksam,
  },
  {
    id: "ausnahme",
    zustaendig: "leitung",
    was: "Dokumentierte Bewertung der Ausnahme nach Artikel 6 Absatz 3",
    warum:
      "Wer sich auf eine Ausnahme stützt, dokumentiert die Bewertung vor dem Einsatz. Die Registrierungspflicht bleibt davon unberührt.",
    fundstelle:
      "Artikel 6 Absatz 4 der Verordnung (EU) 2024/1689 (Dokumentation der Bewertung und Registrierungspflicht)",
    ausloeser: (s) => s.hochrisikoAusnahme !== null,
  },
  {
    id: "einweisung",
    zustaendig: "it_betrieb",
    was: "Nachweis der Einweisung der bedienenden Beschäftigten",
    warum:
      "Beschäftigte, die ein KI-System bedienen, müssen über ausreichende KI-Kompetenz verfügen.",
    fundstelle: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
    ausloeser: (s) => s.istKiSystem,
  },
  {
    id: "anbieterpflichten",
    zustaendig: "leitung",
    was: "Technische Dokumentation und Konformitätsbewertung der Anbieterrolle",
    warum:
      "Wer ein System unter eigenem Namen weitergibt oder wesentlich verändert, trägt die Pflichten einer anbietenden Stelle.",
    fundstelle: "Artikel 16 der Verordnung (EU) 2024/1689 (Pflichten der anbietenden Stelle)",
    ausloeser: (s) => s.anbieterrolle,
  },
  {
    id: "nutzungsvertrag",
    zustaendig: "leitung",
    was: "Unterschriebener Nutzungs- oder Lizenzvertrag mit dem Anbieter",
    warum:
      "Ohne eingeräumtes Nutzungsrecht darf die Dienststelle das Werkzeug nicht einsetzen. Der Vertrag ist vom Vertrag zur Auftragsverarbeitung getrennt zu führen.",
    fundstelle:
      "§§ 31 und 69d des Urheberrechtsgesetzes (Einräumung von Nutzungsrechten an Software)",
    ausloeser: (s) => s.nutzungsvertragFehlt,
  },
  {
    id: "zertifikat",
    zustaendig: "informationssicherheit",
    was: "Nachweis der Informationssicherheit des Anbieters (ISO/IEC 27001, BSI C5 oder IT-Grundschutz mit Testat)",
    warum:
      "Der ISB braucht einen geprüften Nachweis, um die Sicherheit der Verarbeitung beim Anbieter beurteilen zu können.",
    fundstelle:
      "Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung) · BSI-Kriterienkatalog C5 · ISO/IEC 27001 auf der Basis von IT-Grundschutz",
    ausloeser: (s) => s.zertifikatFehlt,
  },
  {
    id: "schulungsunterlagen",
    zustaendig: "it_betrieb",
    was: "Einweisungs- und Schulungsunterlagen für die Nutzenden",
    warum:
      "Die Dienststelle stellt sicher, dass die Nutzenden ausreichend geschult sind; die Unterlagen sind Grundlage der Einweisung.",
    fundstelle: "Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)",
    ausloeser: (s) => s.schulungsunterlagenFehlen,
  },
];

/* --- Abschnitte des Prüfpfads (Schritt 2) --- */

export type Pruefabschnitt =
  | "anwendungsbereich"
  | "ki"
  | "ausnahmen"
  | "transparenz"
  | "datenschutz"
  | "it_sicherheit"
  | "betrieb"
  | "finanzen";

export const PRUEFABSCHNITTE: { id: Pruefabschnitt; titel: string }[] = [
  { id: "anwendungsbereich", titel: "Anwendungsbereich" },
  { id: "ki", titel: "Einordnung nach der KI-Verordnung" },
  { id: "ausnahmen", titel: "Ausnahmen" },
  { id: "transparenz", titel: "Transparenz" },
  { id: "datenschutz", titel: "Datenschutz" },
  { id: "it_sicherheit", titel: "IT-Sicherheit" },
  { id: "betrieb", titel: "Betrieb" },
  { id: "finanzen", titel: "Finanzen und Beschaffung" },
];

const ANWENDUNGSBEREICH_FRAGEN = ["forschung", "ki_system", "rolle"];

/** Ordnet eine Frage einem Abschnitt des Prüfpfads zu. */
export function pruefabschnittVonFrage(frage: Frage): Pruefabschnitt {
  if (ANWENDUNGSBEREICH_FRAGEN.includes(frage.id)) return "anwendungsbereich";
  if (frage.id.startsWith("ausnahme")) return "ausnahmen";
  if (frage.id === "transparenz") return "transparenz";
  if (frage.bereich === "datenschutz") return "datenschutz";
  if (frage.bereich === "it_sicherheit") return "it_sicherheit";
  if (frage.bereich === "finanzen") return "finanzen";
  if (frage.bereich === "betrieb") return "betrieb";
  return "ki";
}

/** Abschnittsüberschrift, etwa „Abschnitt 3 von 6 — Datenschutz“. */
export function abschnittUeberschrift(nummer: number, gesamt: number, titel: string): string {
  return `Abschnitt ${nummer} von ${gesamt} — ${titel}`;
}
