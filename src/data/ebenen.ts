// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Organisationsschicht, Teil Ebenen: welches nationale Recht für eine
 * Einrichtung gilt. Die Prüfschritte sind für alle Ebenen gleich; nur die
 * Bezeichnung der nationalen Vorschrift hängt vom Träger ab.
 *
 * Es werden ausschließlich Bezeichnungen geführt, keine Paragrafennummern,
 * die sich nicht für jede Ebene sicher belegen lassen.
 */

export type Ebene = "bund" | "land" | "kommune" | "koerperschaft" | "sonstige";

/** Rechtsgebiete, deren Fundstelle vom Träger der Einrichtung abhängt. */
export type NationaleFundstelle =
  "beschaeftigtendatenschutz" | "verwaltungsverfahren" | "personalvertretung" | "barrierefreiheit";

export const EBENEN: { id: Ebene; bezeichnung: string }[] = [
  { id: "bund", bezeichnung: "Bundesbehörde" },
  { id: "land", bezeichnung: "Landesbehörde" },
  { id: "kommune", bezeichnung: "Kommune oder Landkreis" },
  { id: "koerperschaft", bezeichnung: "Körperschaft des öffentlichen Rechts" },
  { id: "sonstige", bezeichnung: "sonstige" },
];

export const EBENE_FRAGE = "Zu welcher Ebene gehört Ihre Einrichtung?";

export const EBENE_HILFE =
  "Die Angabe entscheidet, welches Datenschutz-, Verwaltungsverfahrens- und Personalvertretungsrecht für Sie gilt. Die Prüfschritte selbst sind für alle Ebenen gleich.";

export const LAND_FRAGE = "In welchem Bundesland liegt Ihre Einrichtung?";

export const BUNDESLAENDER: string[] = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
];

export const FUNDSTELLE_RUECKFALL =
  "Die einschlägige nationale Vorschrift richtet sich nach dem Träger Ihrer Einrichtung. Hinterlegen Sie das Einrichtungsprofil, damit hier die für Sie geltende Vorschrift erscheint.";

/** Bezeichnungen für Bundesbehörden. */
const BUND: Record<NationaleFundstelle, string> = {
  beschaeftigtendatenschutz:
    "Artikel 88 DSGVO in Verbindung mit dem Bundesdatenschutzgesetz, Vorschriften zur Datenverarbeitung für Zwecke des Beschäftigungsverhältnisses",
  verwaltungsverfahren:
    "Verwaltungsverfahrensgesetz des Bundes, Vorschriften zum Verwaltungsakt, zum Untersuchungsgrundsatz und zum vollständig automatisierten Erlass",
  personalvertretung:
    "Bundespersonalvertretungsgesetz, Mitbestimmung bei technischen Einrichtungen zur Überwachung von Verhalten oder Leistung",
  barrierefreiheit:
    "Behindertengleichstellungsgesetz des Bundes und Barrierefreie-Informationstechnik-Verordnung des Bundes",
};

/** Bezeichnungen für Träger mit Landesrecht; [Land] wird ersetzt. */
const LANDESRECHT: Record<NationaleFundstelle, string> = {
  beschaeftigtendatenschutz:
    "Artikel 88 DSGVO in Verbindung mit dem Datenschutzgesetz des Landes [Land]",
  verwaltungsverfahren:
    "Verwaltungsverfahrensgesetz des Landes [Land], Vorschriften zum Verwaltungsakt, zum Untersuchungsgrundsatz und zum vollständig automatisierten Erlass",
  personalvertretung:
    "Personalvertretungsgesetz des Landes [Land], Mitbestimmung bei technischen Einrichtungen zur Überwachung von Verhalten oder Leistung",
  barrierefreiheit:
    "Behindertengleichstellungsgesetz und Verordnung über barrierefreie Informationstechnik des Landes [Land]",
};

/** Zusatz, der das Trägerverhältnis benennt. */
const TRAEGERZUSATZ: Partial<Record<Ebene, string>> = {
  kommune: ", in der für kommunale Träger geltenden Fassung",
  koerperschaft: ", in der für Körperschaften des öffentlichen Rechts geltenden Fassung",
};

/**
 * Liefert die nationale Bezeichnung für ein Rechtsgebiet oder null, wenn zum
 * hinterlegten Träger keine Angabe geführt wird.
 */
export function nationaleBezeichnung(
  gebiet: NationaleFundstelle,
  ebene: Ebene | "",
  bundesland: string,
): string | null {
  if (!ebene || ebene === "sonstige") return null;
  if (ebene === "bund") return BUND[gebiet];
  if (!bundesland) return null;
  return `${LANDESRECHT[gebiet].replace("[Land]", bundesland)}${TRAEGERZUSATZ[ebene] ?? ""}`;
}

/** Kurze Bezeichnung des Trägerverhältnisses für die Zeile im Freigabedokument. */
export function ebeneText(ebene: Ebene | "", bundesland: string): string {
  const eintrag = EBENEN.find((e) => e.id === ebene);
  if (!eintrag) return "";
  if (ebene === "bund" || ebene === "sonstige") return eintrag.bezeichnung;
  return bundesland ? `${eintrag.bezeichnung}, ${bundesland}` : eintrag.bezeichnung;
}
