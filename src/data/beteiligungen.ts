// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Organisationsschicht: im Haus zu beteiligende Stellen mit Auslösebedingung.
 * Die Stellen werden ausschließlich über `ausgeloesteStellen` abgeleitet.
 */

import { betragLesen } from "@/lib/erprobung/betrag";
import type { Einrichtungsprofil, Signale } from "@/lib/erprobung/typen";

export type Beteiligungsstatus = "beteiligt" | "nicht_erforderlich" | "offen";

/** Beschriftung des Stands einer Beteiligung, auch für die Dokumente. */
export const BETEILIGUNGSSTATUS_TEXTE: Record<Beteiligungsstatus, string> = {
  beteiligt: "beteiligt",
  nicht_erforderlich: "nicht erforderlich",
  offen: "offen",
};

type Profil = Einrichtungsprofil | null | undefined;

export interface Stelle {
  id: string;
  bezeichnung: string;
  /** Prüft anhand der abgeleiteten Signale und des Profils, ob die Stelle zu beteiligen ist. */
  ausloeser: (s: Signale, profil?: Profil) => boolean;
  /** Begründung, warum die Beteiligung ausgelöst wurde. */
  begruendung: (s: Signale, profil?: Profil) => string;
  hinweis?: string;
  /** Vorbedingung, die im Freigabedokument hervorgehoben wird. */
  vorbedingung?: string;
  /** Was die Stelle prüft; für den Laufzettel. */
  pruefgegenstand: string;
  /** Unterlagen, die diese Stelle stets braucht; für den Laufzettel. */
  unterlagen?: string[];
}

/** Zusatz, wenn eine auslösende Antwort „noch unklar“ lautet. */
function angabe(s: Signale, frageId: string, text: string): string {
  return s.unklar.includes(frageId)
    ? `${text} (Ihre Antwort lautet „noch unklar“; die Stelle wird vorsichtshalber beteiligt)`
    : text;
}

/** Nennt die auslösenden Antworten; jede Begründung endet mit dieser Angabe. */
function ausgeloestDurch(teile: string[]): string {
  return teile.length > 0
    ? ` Ausgelöst durch: ${teile.join("; ")}.`
    : " Ausgelöst durch: jede Erprobung technischer Systeme, unabhängig von den Antworten.";
}

/** Antworten, die eine Wirkung auf die Arbeitsabläufe begründen. */
function arbeitsablaufAusloeser(s: Signale): string[] {
  const teile: string[] = [];
  if (s.ueberwachungseignung)
    teile.push(
      angabe(
        s,
        "ueberwachung",
        "Ihre Angabe, dass sich mit dem Werkzeug Verhalten oder Leistung von Beschäftigten nachvollziehen ließe",
      ),
    );
  if (s.beschaeftigtendaten)
    teile.push(
      angabe(
        s,
        "beschaeftigtendaten",
        "Ihre Angabe, dass Daten der eigenen Beschäftigten verarbeitet werden",
      ),
    );
  if (s.dienstvereinbarung)
    teile.push(
      angabe(
        s,
        "dienstvereinbarung",
        "Ihre Angabe, dass eine Dienstvereinbarung nötig ist oder besteht",
      ),
    );
  if (s.entscheidungVorbereitung)
    teile.push(
      angabe(
        s,
        "entscheidung_vorbereitung",
        "Ihre Angabe, dass das Werkzeug Entscheidungen vorbereitet",
      ),
    );
  if (s.entscheidungAutomatisiert)
    teile.push(
      angabe(
        s,
        "entscheidung_automatisiert",
        "Ihre Angabe, dass die Entscheidung ohne Beteiligung eines Menschen ergeht",
      ),
    );
  if (s.barrierefreiheitOffen)
    teile.push(
      angabe(
        s,
        "barrierefreiheit",
        "Ihre Angabe, dass das Werkzeug nicht für alle Beschäftigten barrierefrei nutzbar ist",
      ),
    );
  return teile;
}

/** Schwelle aus dem Einrichtungsprofil in Euro oder null, wenn nicht hinterlegt. */
export function schwelle(
  profil: Profil,
  art: "gremienschwelle" | "vergabeschwelle",
): number | null {
  return betragLesen(profil?.[art] ?? "");
}

function euro(betrag: number): string {
  return `${betrag.toLocaleString("de-DE")} Euro`;
}

function kostenAngefallen(s: Signale): boolean {
  return (
    (s.kostenErprobung ?? 0) > 0 ||
    (s.kostenUeberfuehrung ?? 0) > 0 ||
    s.kostenErprobungUnklar ||
    s.kostenUeberfuehrungUnklar
  );
}

function gremiumAusgeloest(s: Signale, profil: Profil): boolean {
  const grenze = schwelle(profil, "gremienschwelle");
  if (grenze === null) return false;
  return (
    s.kostenUeberfuehrungUnklar ||
    (s.kostenUeberfuehrung !== null && s.kostenUeberfuehrung >= grenze)
  );
}

function vergabeAusgeloest(s: Signale, profil: Profil): boolean {
  const grenze = schwelle(profil, "vergabeschwelle");
  if (grenze === null) return false;
  const hoechster = Math.max(s.kostenErprobung ?? 0, s.kostenUeberfuehrung ?? 0);
  return (
    s.kostenErprobungUnklar || s.kostenUeberfuehrungUnklar || (hoechster > 0 && hoechster >= grenze)
  );
}

export const STELLEN: Stelle[] = [
  {
    id: "datenschutz",
    bezeichnung: "Datenschutzbeauftragte oder Datenschutzbeauftragter",
    ausloeser: (s) => s.personenbezug,
    begruendung: (s) => {
      const teile = [
        angabe(s, "personenbezug", "Ihre Angabe, dass personenbezogene Daten verarbeitet werden"),
      ];
      if (s.besondereKategorien)
        teile.push(
          angabe(
            s,
            "besondere_kategorien",
            "Ihre Angabe, dass Daten besonderer Kategorien verarbeitet werden",
          ),
        );
      if (s.drittland)
        teile.push("Ihre Angabe, dass Daten außerhalb der Europäischen Union verarbeitet werden");
      return `Im Vorhaben werden personenbezogene Daten verarbeitet.${ausgeloestDurch(teile)}`;
    },
    pruefgegenstand:
      "Rechtsgrundlage, Auftragsverarbeitung, Übermittlung in Drittländer, Eintrag im Verzeichnis der Verarbeitungstätigkeiten und die Erforderlichkeit einer Datenschutz-Folgenabschätzung.",
  },
  {
    id: "informationssicherheit",
    bezeichnung:
      "Informationssicherheitsbeauftragte oder Informationssicherheitsbeauftragter (ISB)",
    ausloeser: () => true,
    begruendung: () =>
      `Die Informationssicherheit ist bei jeder Erprobung technischer Systeme zu beteiligen.${ausgeloestDurch([])}`,
    vorbedingung:
      "Verfahrensregel der Dienststelle: Die Leitung unterschreibt erst, wenn die Stellungnahme des ISB vorliegt. Die Regel beruht auf einer Organisationsentscheidung des Hauses, nicht auf einer gesetzlichen Pflicht.",
    pruefgegenstand:
      "Nachweise des Anbieters zur Informationssicherheit, Serverstandort, Anforderungen an den Betrieb und die technischen Vorgaben des Landes nach der technischen Vorprüfung.",
  },
  {
    id: "personalrat",
    bezeichnung: "Personalrat",
    ausloeser: (s) => s.ueberwachungseignung || s.dienstvereinbarung,
    begruendung: (s) => {
      const teile: string[] = [];
      if (s.dienstvereinbarung)
        teile.push(
          angabe(
            s,
            "dienstvereinbarung",
            "Ihre Angabe, dass eine Dienstvereinbarung nötig ist oder besteht",
          ),
        );
      if (s.ueberwachungseignung)
        teile.push(
          angabe(
            s,
            "ueberwachung",
            "Ihre Angabe, dass sich mit dem Werkzeug nachvollziehen ließe, wer wie schnell oder wie viel gearbeitet hat",
          ),
        );
      const satz = s.ueberwachungseignung
        ? "Das System ist geeignet, Verhalten oder Leistung von Beschäftigten zu überwachen."
        : "Der Einsatz ist Gegenstand einer Dienstvereinbarung mit dem Personalrat.";
      return `${satz}${ausgeloestDurch(teile)}`;
    },
    hinweis:
      "Es besteht Mitbestimmung bei technischen Einrichtungen, die zur Überwachung von Verhalten oder Leistung der Beschäftigten geeignet sind. Die Eignung genügt, eine Absicht ist nicht erforderlich.",
    pruefgegenstand:
      "Mitbestimmung bei technischen Einrichtungen, Inhalt und Erforderlichkeit einer Dienstvereinbarung sowie die Unterrichtung der Beschäftigten.",
  },
  {
    id: "swb_gleichstellung",
    bezeichnung: "Schwerbehindertenvertretung und Gleichstellungsbeauftragte",
    ausloeser: (s) => s.arbeitsablaufwirkung || s.barrierefreiheitOffen,
    begruendung: (s) =>
      `Die Erprobung wirkt sich auf Arbeitsabläufe der Beschäftigten aus. Die Schwerbehindertenvertretung ist in allen Angelegenheiten, die schwerbehinderte Beschäftigte berühren, zu unterrichten und anzuhören (§ 178 Absatz 2 SGB IX); einzubeziehen ist auch die oder der Inklusionsbeauftragte des Arbeitgebers (§ 181 SGB IX).${ausgeloestDurch(
        arbeitsablaufAusloeser(s),
      )}`,
    pruefgegenstand:
      "Barrierefreie Nutzbarkeit des Werkzeugs, Auswirkungen auf Arbeitsabläufe schwerbehinderter Beschäftigter und Fragen der Gleichstellung.",
  },
  {
    id: "it_betrieb",
    bezeichnung: "IT-Betrieb",
    ausloeser: () => true,
    begruendung: () =>
      `Der IT-Betrieb verantwortet Einrichtung, Betrieb und Rücknahme der Testumgebung.${ausgeloestDurch([])}`,
    pruefgegenstand:
      "Einrichtung, Betrieb und Rücknahme der Testumgebung, Anbindung an die vorhandene Technik sowie Einweisung der Nutzenden.",
  },
  {
    id: "finanzen",
    bezeichnung: "Finanzen / Kämmerei",
    ausloeser: (s) => kostenAngefallen(s),
    begruendung: (s) => {
      const teile: string[] = [];
      if (s.kostenErprobungUnklar)
        teile.push(
          "Ihre Angabe, dass die Kosten während der Erprobung noch unklar sind (die Stelle wird vorsichtshalber beteiligt)",
        );
      else if ((s.kostenErprobung ?? 0) > 0)
        teile.push(`Ihre Angabe von ${euro(s.kostenErprobung ?? 0)} Kosten während der Erprobung`);
      if (s.kostenUeberfuehrungUnklar)
        teile.push(
          "Ihre Angabe, dass die Kosten bei einer Überführung noch unklar sind (die Stelle wird vorsichtshalber beteiligt)",
        );
      else if ((s.kostenUeberfuehrung ?? 0) > 0)
        teile.push(
          `Ihre Angabe von ${euro(s.kostenUeberfuehrung ?? 0)} Kosten bei einer Überführung`,
        );
      return `Mit dem Vorhaben sind Ausgaben verbunden; die Finanzverwaltung prüft die Deckung im Haushalt.${ausgeloestDurch(teile)}`;
    },
    pruefgegenstand:
      "Deckung der Kosten im Haushalt für die Erprobung und für eine mögliche Überführung.",
    unterlagen: ["Kostenschätzung für die Erprobung und für eine Überführung in den Regelbetrieb"],
  },
  {
    id: "gremium",
    bezeichnung: "Zuständiges Gremium",
    ausloeser: (s, profil) => gremiumAusgeloest(s, profil),
    begruendung: (s, profil) => {
      const grenze = schwelle(profil, "gremienschwelle") ?? 0;
      const teil = s.kostenUeberfuehrungUnklar
        ? "Ihre Angabe, dass die Kosten bei einer Überführung noch unklar sind (das Gremium wird vorsichtshalber einbezogen)"
        : `Ihre Angabe von ${euro(s.kostenUeberfuehrung ?? 0)} Kosten bei einer Überführung, die die Gremienschwelle von ${euro(grenze)} aus dem Einrichtungsprofil erreichen`;
      return `Über eine Überführung in den Regelbetrieb entscheidet nach der Zuständigkeitsregelung des Trägers ein Gremium.${ausgeloestDurch([teil])}`;
    },
    pruefgegenstand:
      "Entscheidung über die Überführung in den Regelbetrieb nach der Zuständigkeitsregelung des Trägers (Hauptsatzung oder Geschäftsordnung).",
    unterlagen: ["Beschlussvorlage für das zuständige Gremium"],
  },
  {
    id: "vergabe",
    bezeichnung: "Vergabestelle",
    ausloeser: (s, profil) => vergabeAusgeloest(s, profil),
    begruendung: (s, profil) => {
      const grenze = schwelle(profil, "vergabeschwelle") ?? 0;
      const hoechster = Math.max(s.kostenErprobung ?? 0, s.kostenUeberfuehrung ?? 0);
      const teil =
        s.kostenErprobungUnklar || s.kostenUeberfuehrungUnklar
          ? "Ihre Angabe, dass die Kosten noch unklar sind (die Vergabestelle wird vorsichtshalber beteiligt)"
          : `Ihre Angabe von ${euro(hoechster)} Kosten, die die Vergabeschwelle von ${euro(grenze)} aus dem Einrichtungsprofil erreichen`;
      return `Die Beschaffung ist nach dem Vergaberecht auszuschreiben.${ausgeloestDurch([teil])}`;
    },
    pruefgegenstand:
      "Vergabeart und Ausschreibungspflicht nach dem Vergaberecht (Teil 4 des Gesetzes gegen Wettbewerbsbeschränkungen oberhalb der EU-Schwellenwerte, darunter Unterschwellenvergabeordnung oder Landesvergaberecht).",
    unterlagen: ["Vergabevermerk mit Schätzung des Auftragswerts"],
  },
  {
    id: "leitung",
    bezeichnung: "Behördenleitung",
    ausloeser: () => true,
    begruendung: () => `Die Behördenleitung entscheidet über die Freigabe.${ausgeloestDurch([])}`,
    pruefgegenstand:
      "Gesamtentscheidung über die Freigabe nach Vorliegen aller Beteiligungen, insbesondere der Stellungnahme des ISB. Die Organisationsverantwortung, auch für technische und organisatorische Entscheidungen, bleibt bei der Behördenleitung.",
  },
];

/**
 * Liefert die zu beteiligenden Stellen. Ist im Einrichtungsprofil festgelegt,
 * dass der Personalrat grundsätzlich zu beteiligen ist, wird er unabhängig von
 * den Antworten aufgenommen.
 */
export function ausgeloesteStellen(signale: Signale, profil?: Einrichtungsprofil | null): Stelle[] {
  return STELLEN.filter((s) => {
    if (s.id === "personalrat" && profil?.personalratImmer) return true;
    return s.ausloeser(signale, profil);
  });
}

export function beteiligungsBegruendung(
  stelle: Stelle,
  signale: Signale,
  profil?: Einrichtungsprofil | null,
): string {
  if (
    stelle.id === "personalrat" &&
    profil?.personalratImmer &&
    !signale.ueberwachungseignung &&
    !signale.dienstvereinbarung
  ) {
    return "Nach dem Einrichtungsprofil ist der Personalrat bei jedem Vorhaben zu beteiligen.";
  }
  return stelle.begruendung(signale, profil);
}

/**
 * Hinweise statt einer Stelle: Fallen Kosten an, ist aber im Profil keine
 * Schwelle hinterlegt, lässt sich die Zuständigkeit nicht ableiten.
 */
export function beteiligungsHinweise(
  signale: Signale,
  profil?: Einrichtungsprofil | null,
): string[] {
  if (!kostenAngefallen(signale)) return [];
  const hinweise: string[] = [];
  if (schwelle(profil, "gremienschwelle") === null)
    hinweise.push(
      "Im Einrichtungsprofil ist keine Gremienschwelle hinterlegt. Ob ein Gremium über eine Überführung entscheidet, lässt sich daher nicht ableiten; prüfen Sie dies nach der Zuständigkeitsregelung Ihres Trägers.",
    );
  if (schwelle(profil, "vergabeschwelle") === null)
    hinweise.push(
      "Im Einrichtungsprofil ist keine Vergabeschwelle hinterlegt. Ob eine Ausschreibung erforderlich ist, lässt sich daher nicht ableiten; prüfen Sie dies nach dem für Sie geltenden Vergaberecht.",
    );
  return hinweise;
}
