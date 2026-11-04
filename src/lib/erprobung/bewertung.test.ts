// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Gegenprüfung der Einordnungslogik anhand dokumentierter Anwendungen
 * der deutschen Verwaltung. Ausführbar mit `bun test`.
 */

import { describe, expect, test } from "vitest";

import type { Fallart } from "@/data/regelwerk";
import {
  ableitenSignale,
  einordnen,
  einordnungVorhanden,
  offeneFragen,
  sichtbareFragen,
} from "./bewertung";
import { offeneUnterlagen } from "./checkliste";
import {
  AUSGANGSLAGE_ABSCHLUSS_TITEL,
  AUSGANGSLAGE_DOKUMENT_TITEL,
  auflagenVorlage,
} from "@/data/vorlagen";
import { abschlussDokument, freigabeDokument } from "./dokumentaufbau";
import { leereDaten } from "./speicher";
import type { Antworten } from "./typen";

const BASIS: Antworten = {
  forschung: "nein",
  ki_system: "ja",
  rolle: "betreiber",
  verbotene_praktiken: ["keines"],
  hochrisiko: ["keines"],
  transparenz: ["keines"],
  personenbezug: "nein",
  ueberwachung: "nein",
  entscheidung_vorbereitung: "nein",
  entscheidung_automatisiert: "nein",
  vollautomatischer_erlass: "nein",
  barrierefreiheit: "ja",
  testdaten: "ja",
  unterrichtung: "ja",
  anbieter_voreinstellung: "nein",
  dsfa_schwellen: ["keines"],
};

function antworten(ueberschreibungen: Antworten = {}): Antworten {
  return { ...BASIS, ...ueberschreibungen };
}

/** Fasst die Texte der Auslöser oder Hinweise zu einer Zeichenkette zusammen. */
function texte(eintraege: { antwort: string; begruendung: string }[]): string {
  return eintraege.map((e) => `${e.antwort} ${e.begruendung}`).join(" || ");
}

describe("Fall 1 — Textassistenz für die Landesverwaltung", () => {
  const antwortenFall = antworten({
    transparenz: ["synthetisch"],
    personenbezug: "ja",
    beschaeftigtendaten: "nein",
    besondere_kategorien: "nein",
    rechtsgrundlage: "Fachgesetz",
    auftragsverarbeitung: "ja",
    avv_vorhanden: "ja",
    drittland: "nein",
    vvt: "ja",
  });
  const ergebnis = einordnen("neu", antwortenFall);

  test("Ampel grün", () => expect(ergebnis.ampel).toBe("gruen"));
  test("Hinweis zur KI-Kompetenz", () =>
    expect(texte(ergebnis.hinweise)).toContain("KI-Kompetenz"));
  test("Hinweis zur maschinenlesbaren Kennzeichnung", () =>
    expect(texte(ergebnis.hinweise)).toContain("Maschinenlesbare Kennzeichnung"));
});

describe("Fall 2 — Chatbot für Bürgerfragen", () => {
  const antwortenFall = antworten({
    transparenz: ["interaktion"],
    personenbezug: "ja",
    besondere_kategorien: "nein",
    rechtsgrundlage: "Fachgesetz",
    auftragsverarbeitung: "ja",
    avv_vorhanden: "ja",
    drittland: "nein",
    vvt: "ja",
  });
  const ergebnis = einordnen("neu", antwortenFall);

  test("Ampel grün", () => expect(ergebnis.ampel).toBe("gruen"));
  test("Hinweis zur Transparenzpflicht", () =>
    expect(texte(ergebnis.hinweise)).toContain("Transparenzpflichten"));
  test("kein Hinweis zur maschinenlesbaren Kennzeichnung", () =>
    expect(texte(ergebnis.hinweise)).not.toContain("Maschinenlesbare Kennzeichnung"));
});

describe("Fall 3 — Serviceroboter im Bürgerbüro", () => {
  const antwortenFall = antworten({ personenbezug: "nein", ueberwachung: "nein" });
  const ergebnis = einordnen("ohne_ki", antwortenFall);

  test("Ampel grün", () => expect(ergebnis.ampel).toBe("gruen"));
  test("keine KI-Fragen in sichtbareFragen, auch nicht die Vorfrage", () => {
    const fragen = sichtbareFragen("ohne_ki", antwortenFall);
    expect(fragen.filter((f) => f.bereich === "ki").map((f) => f.id)).toEqual([]);
    expect(fragen.some((f) => f.id === "forschung")).toBe(false);
  });
  test("kein Hinweis zur KI-Kompetenz", () =>
    expect(texte(ergebnis.hinweise)).not.toContain("KI-Kompetenz"));
});

describe("Vorfrage forschung bei den KI-Fallarten", () => {
  test.each(["neu", "update", "nachtraeglich"] as const)("erscheint bei Fallart %s", (fallart) => {
    const fragen = sichtbareFragen(fallart, antworten({}));
    expect(fragen.some((f) => f.id === "forschung")).toBe(true);
  });
});

describe("Fall 6 — KI-Funktion durch ein Update", () => {
  const antwortenFall = antworten({
    update_ankuendigung: "stillschweigend",
    update_standard_aktiv: "an_nicht_abschaltbar",
    update_datenabfluss: "ja",
    personenbezug: "ja",
    rechtsgrundlage: "Fachgesetz",
    auftragsverarbeitung: "ja",
    avv_vorhanden: "nein",
    drittland: "nein",
    vvt: "ja",
  });
  const ergebnis = einordnen("update", antwortenFall);

  test("Ampel gelb", () => expect(ergebnis.ampel).toBe("gelb"));
  test("Auslöser zur stillschweigend erschienenen Funktion", () =>
    expect(texte(ergebnis.ausloeser)).toContain("ohne Ankündigung erschienen"));
  test("Auslöser zur fehlenden Auftragsverarbeitung", () =>
    expect(texte(ergebnis.ausloeser)).toContain("Auftragsverarbeitung ohne Vertrag"));
  test("Checklistenpunkt avv ausgelöst", () => {
    const signale = ableitenSignale("update", antwortenFall);
    expect(offeneUnterlagen(signale).map((p) => p.id)).toContain("avv");
  });

  test("Zusatzprüfung: unkritische Kombination bleibt grün", () => {
    const unkritisch = einordnen(
      "update",
      antworten({
        update_ankuendigung: "angekuendigt",
        update_standard_aktiv: "aus",
        update_datenabfluss: "nein",
        personenbezug: "ja",
        rechtsgrundlage: "Fachgesetz",
        auftragsverarbeitung: "ja",
        avv_vorhanden: "ja",
        drittland: "nein",
        vvt: "ja",
      }),
    );
    expect(unkritisch.ampel).toBe("gruen");
  });
});

describe("Fall 7 — Auswertung von Postfächern", () => {
  const antwortenFall = antworten({
    personenbezug: "ja",
    beschaeftigtendaten: "ja",
    besondere_kategorien: "nein",
    rechtsgrundlage: "Fachgesetz",
    auftragsverarbeitung: "nein",
    drittland: "nein",
    vvt: "ja",
    ueberwachung: "ja",
  });
  const ergebnis = einordnen("neu", antwortenFall);

  test("Ampel gelb", () => expect(ergebnis.ampel).toBe("gelb"));
  test("Auslöser zur Überwachungseignung", () =>
    expect(texte(ergebnis.ausloeser)).toContain("Verhalten oder Leistung von Beschäftigten"));
  test("Checklistenpunkt unterrichtung nicht ausgelöst", () => {
    const signale = ableitenSignale("neu", antwortenFall);
    expect(offeneUnterlagen(signale).map((p) => p.id)).not.toContain("unterrichtung");
  });
});

describe("Fall 9 — Automatisch erlassener Bescheid", () => {
  const basis = antworten({
    personenbezug: "ja",
    rechtsgrundlage: "Fachgesetz",
    auftragsverarbeitung: "nein",
    drittland: "nein",
    vvt: "ja",
    entscheidung_vorbereitung: "ja",
    entscheidung_automatisiert: "ja",
    vollautomatischer_erlass: "ja",
    vollautomatisch_grundlage: "nein",
  });
  const ergebnis = einordnen("neu", basis);

  test("Ampel rot", () => expect(ergebnis.ampel).toBe("rot"));
  test("Auslöser zum vollautomatisierten Erlass", () =>
    expect(texte(ergebnis.ausloeser)).toContain("ohne Prüfung durch eine zuständige Person"));
  test("Umgestaltungsvorschlag vorhanden", () => {
    expect(ergebnis.umgestaltung.length).toBeGreaterThan(0);
    expect(ergebnis.umgestaltung.join(" ")).toContain("nur vorbereitet");
  });

  test("Zusatzprüfung: mit Rechtsvorschrift gelb statt rot", () => {
    const mitGrundlage = einordnen("neu", { ...basis, vollautomatisch_grundlage: "ja" });
    expect(mitGrundlage.ampel).toBe("gelb");
  });
});

describe("Fall 10 — Stimmungsauswertung im Bürgerservice", () => {
  const ergebnis = einordnen(
    "neu",
    antworten({
      verbotene_praktiken: ["emotion"],
      personenbezug: "ja",
      beschaeftigtendaten: "ja",
    }),
  );

  test("Ampel rot", () => expect(ergebnis.ampel).toBe("rot"));
  test("Auslöser zur verbotenen Praktik", () =>
    expect(texte(ergebnis.ausloeser)).toContain("Verbotene Praktik"));
  test("Umgestaltungsvorschlag vorhanden", () =>
    expect(ergebnis.umgestaltung.length).toBeGreaterThan(0));
});

describe("Zusätzliche Prüfungen", () => {
  test("Vorfrage Forschung: keine KI-Fragen, Hinweis zur Forschungsphase", () => {
    const antwortenFall = antworten({ forschung: "ja" });
    const fragen = sichtbareFragen("neu", antwortenFall);
    const kiFragen = fragen.filter((f) => f.bereich === "ki" && f.id !== "forschung");
    expect(kiFragen).toEqual([]);
    const ergebnis = einordnen("neu", antwortenFall);
    expect(texte(ergebnis.hinweise)).toContain("Forschung und Entwicklung");
  });

  test("Profiling-Sperre: gelb, hochrisikoAusnahme null, Hinweis zur Profilierung", () => {
    const antwortenFall = antworten({
      hochrisiko: ["leistungen"],
      ausnahme_a: "ja",
      ausnahme_profile: "ja",
    });
    const signale = ableitenSignale("neu", antwortenFall);
    expect(signale.hochrisikoAusnahme).toBeNull();
    const ergebnis = einordnen("neu", antwortenFall);
    expect(ergebnis.ampel).toBe("gelb");
    expect(texte(ergebnis.hinweise)).toContain("Profile von Personen");
  });

  test("Zweite Stufe der Verbote: nicht rot, Hinweis mit Geltungsdatum", () => {
    const ergebnis = einordnen("neu", antworten({ verbotene_praktiken: ["intime_darstellungen"] }));
    expect(ergebnis.ampel).not.toBe("rot");
    const hinweisText = texte(ergebnis.hinweise);
    expect(hinweisText).toContain("Gilt ab dem");
    expect(hinweisText).toContain("02.12.2026");
  });
});

describe("Grundsatz: Bei Ampel grün ist die Liste der Auslöser leer", () => {
  const faelle: [string, Fallart, Antworten][] = [
    [
      "Fall 1",
      "neu",
      antworten({
        transparenz: ["synthetisch"],
        personenbezug: "ja",
        beschaeftigtendaten: "nein",
        besondere_kategorien: "nein",
        rechtsgrundlage: "Fachgesetz",
        auftragsverarbeitung: "ja",
        avv_vorhanden: "ja",
        drittland: "nein",
        vvt: "ja",
      }),
    ],
    [
      "Fall 2",
      "neu",
      antworten({
        transparenz: ["interaktion"],
        personenbezug: "ja",
        besondere_kategorien: "nein",
        rechtsgrundlage: "Fachgesetz",
        auftragsverarbeitung: "ja",
        avv_vorhanden: "ja",
        drittland: "nein",
        vvt: "ja",
      }),
    ],
    ["Fall 3", "ohne_ki", antworten({ personenbezug: "nein", ueberwachung: "nein" })],
    [
      "Fall 6 unkritisch",
      "update",
      antworten({
        update_ankuendigung: "angekuendigt",
        update_standard_aktiv: "aus",
        update_datenabfluss: "nein",
        personenbezug: "ja",
        rechtsgrundlage: "Fachgesetz",
        auftragsverarbeitung: "ja",
        avv_vorhanden: "ja",
        drittland: "nein",
        vvt: "ja",
      }),
    ],
  ];

  for (const [name, fallart, antwortenFall] of faelle) {
    test(name, () => {
      const ergebnis = einordnen(fallart, antwortenFall);
      expect(ergebnis.ampel).toBe("gruen");
      expect(ergebnis.ausloeser).toEqual([]);
    });
  }
});

describe("Neutraler Zustand vor der Beantwortung", () => {
  test("bei leeren Antworten liegt keine Einordnung vor", () => {
    expect(einordnungVorhanden("neu", {})).toBe(false);
    expect(offeneFragen("neu", {}).length).toBeGreaterThan(0);
  });

  test("ohne Fallart liegt keine Einordnung vor", () => {
    expect(einordnungVorhanden(null, {})).toBe(false);
  });

  test("bei vollständigen Antworten liegt eine Einordnung vor", () => {
    expect(einordnungVorhanden("neu", antworten({}))).toBe(true);
    expect(offeneFragen("neu", antworten({}))).toEqual([]);
  });
});

describe("Anhang III und Personenbezug", () => {
  const testdatenAuflage =
    "Die Erprobung wird ausschließlich mit erfundenen oder wirksam anonymisierten Daten durchgeführt";

  test("ohne Personenbezug entfallen DSFA-Unterlage und Testdatenauflage", () => {
    const signale = ableitenSignale(
      "neu",
      antworten({ hochrisiko: ["leistungen"], personenbezug: "nein" }),
    );
    expect(offeneUnterlagen(signale).map((p) => p.id)).not.toContain("dsfa");
    expect(auflagenVorlage("gelb", signale).join(" ")).not.toContain(testdatenAuflage);
  });

  test("mit Personenbezug entstehen DSFA-Unterlage und Testdatenauflage", () => {
    const signale = ableitenSignale(
      "neu",
      antworten({
        hochrisiko: ["leistungen"],
        personenbezug: "ja",
        rechtsgrundlage: "Fachgesetz",
      }),
    );
    expect(offeneUnterlagen(signale).map((p) => p.id)).toContain("dsfa");
    expect(auflagenVorlage("gelb", signale).join(" ")).toContain(testdatenAuflage);
  });
});

describe("Ausgangslage im Dokument", () => {
  test("ohne Angaben zur Ausgangslage entsteht kein leerer Abschnitt", () => {
    const daten = leereDaten();
    daten.vorhaben.fallart = "neu";
    daten.vorhaben.bezeichnung = "Textassistenz";
    daten.antworten = antworten({});

    const freigabe = freigabeDokument(daten, null);
    const abschluss = abschlussDokument(daten);
    const titel = [...freigabe.abschnitte, ...abschluss.abschnitte].map((a) => a.titel ?? "");

    expect(titel.some((t) => t.includes(AUSGANGSLAGE_DOKUMENT_TITEL))).toBe(false);
    expect(titel.some((t) => t.includes(AUSGANGSLAGE_ABSCHLUSS_TITEL))).toBe(false);
    // Die Nummerierung bleibt lückenlos.
    expect(freigabe.abschnitte[0]?.titel).toContain("1. Kurzbeschreibung");
    expect(freigabe.abschnitte[1]?.titel).toContain("2. Einordnung");
    expect(einordnungVorhanden("neu", daten.antworten)).toBe(true);
  });

  test("mit Angaben erscheint der Abschnitt in beiden Dokumenten", () => {
    const daten = leereDaten();
    daten.vorhaben.fallart = "neu";
    daten.vorhaben.problem = "Entwürfe unterscheiden sich stark.";
    daten.antworten = antworten({});

    const freigabe = freigabeDokument(daten, null);
    const abschluss = abschlussDokument(daten);
    expect(freigabe.abschnitte.map((a) => a.titel ?? "").join(" ")).toContain(
      AUSGANGSLAGE_DOKUMENT_TITEL,
    );
    expect(abschluss.abschnitte.map((a) => a.titel ?? "").join(" ")).toContain(
      AUSGANGSLAGE_ABSCHLUSS_TITEL,
    );
  });
});

/* --- Regelwerk 2026-10-28: Rückmeldungen Würzburg und DABB --- */

import { ausgeloesteStellen, beteiligungsBegruendung, STELLEN } from "@/data/beteiligungen";
import { leeresProfil } from "@/data/einrichtung";
import { landesvorgaben, LANDESVORGABEN_FEHLEN, VORPRUEFUNG_TITEL } from "@/data/landesvorgaben";
import {
  AUFLAGE_AVV,
  AUFLAGE_DSFA,
  AUFLAGE_BARRIEREFREIHEIT,
  OFFENE_PUNKTE_TITEL,
} from "@/data/vorlagen";
import { offenePunkte } from "./dokumentaufbau";
import { laufzettelSeiten } from "./laufzettel";

function stellenIds(a: Antworten, profil = leeresProfil()): string[] {
  return ausgeloesteStellen(ableitenSignale("neu", a), profil).map((s) => s.id);
}

describe("A1 — Dienstvereinbarung löst den Personalrat aus", () => {
  test("Dienstvereinbarung ja → Personalrat mit Begründung", () => {
    const signale = ableitenSignale("neu", antworten({ dienstvereinbarung: "ja" }));
    const stellen = ausgeloesteStellen(signale, null);
    const pr = stellen.find((s) => s.id === "personalrat");
    expect(pr).toBeDefined();
    expect(beteiligungsBegruendung(pr!, signale, null)).toContain(
      "Ausgelöst durch: Ihre Angabe, dass eine Dienstvereinbarung",
    );
  });
  test("Dienstvereinbarung nein → kein Personalrat", () =>
    expect(stellenIds(antworten({ dienstvereinbarung: "nein" }))).not.toContain("personalrat"));
});

describe("Prüftabelle: jede auslösende Antwort führt zu einer Stelle, Auflage oder Unterlage", () => {
  const pd = {
    personenbezug: "ja",
    rechtsgrundlage: "Fachgesetz",
    vvt: "ja",
    auftragsverarbeitung: "nein",
    drittland: "nein",
  };
  const zeilen: [string, Antworten, { stelle?: string; auflage?: string; unterlage?: string }][] = [
    ["personenbezug ja", pd, { stelle: "datenschutz" }],
    ["personenbezug noch unklar", { ...pd, personenbezug: "unklar" }, { stelle: "datenschutz" }],
    ["ueberwachung ja", { ueberwachung: "ja" }, { stelle: "personalrat" }],
    ["dienstvereinbarung ja", { dienstvereinbarung: "ja" }, { stelle: "personalrat" }],
    ["dienstvereinbarung noch unklar", { dienstvereinbarung: "unklar" }, { stelle: "personalrat" }],
    [
      "beschaeftigtendaten ja",
      { ...pd, beschaeftigtendaten: "ja" },
      { stelle: "swb_gleichstellung" },
    ],
    [
      "entscheidung_vorbereitung ja",
      { entscheidung_vorbereitung: "ja" },
      { stelle: "swb_gleichstellung" },
    ],
    [
      "entscheidung_automatisiert ja",
      { entscheidung_automatisiert: "ja" },
      { stelle: "swb_gleichstellung" },
    ],
    [
      "barrierefreiheit nein",
      { barrierefreiheit: "nein" },
      {
        stelle: "swb_gleichstellung",
        auflage: AUFLAGE_BARRIEREFREIHEIT,
        unterlage: "barrierefreiheit",
      },
    ],
    [
      "barrierefreiheit noch unklar",
      { barrierefreiheit: "unklar" },
      { auflage: AUFLAGE_BARRIEREFREIHEIT },
    ],
    [
      "avv_vorhanden nein",
      { ...pd, auftragsverarbeitung: "ja", avv_vorhanden: "nein" },
      { auflage: AUFLAGE_AVV, unterlage: "avv" },
    ],
    [
      "besondere_kategorien ja",
      { ...pd, besondere_kategorien: "ja" },
      { auflage: AUFLAGE_DSFA, unterlage: "dsfa" },
    ],
    ["drittland ja", { ...pd, drittland: "ja" }, { unterlage: "drittland" }],
    [
      "serverstandort außerhalb EU",
      { ...pd, serverstandort: "ausserhalb_eu" },
      { unterlage: "drittland" },
    ],
    ["vvt nein", { ...pd, vvt: "nein" }, { unterlage: "vvt" }],
    ["rechtsgrundlage leer", { ...pd, rechtsgrundlage: "" }, { unterlage: "rechtsgrundlage" }],
    ["unterrichtung nein", { ...pd, unterrichtung: "nein" }, { unterlage: "unterrichtung" }],
    [
      "anbieter_voreinstellung unbekannt",
      { ...pd, anbieter_voreinstellung: "unbekannt" },
      { unterlage: "voreinstellungen" },
    ],
    [
      "hochrisiko leistungen",
      {
        hochrisiko: ["leistungen"],
        ausnahme_a: "nein",
        ausnahme_b: "nein",
        ausnahme_c: "nein",
        ausnahme_d: "nein",
        ausnahme_profile: "nein",
      },
      { unterlage: "grundrechte" },
    ],
    [
      "ausnahme_a ja",
      { hochrisiko: ["leistungen"], ausnahme_a: "ja", ausnahme_profile: "nein" },
      { unterlage: "ausnahme" },
    ],
    ["rolle anbieter", { rolle: "anbieter" }, { unterlage: "anbieterpflichten" }],
    ["ki_system ja", {}, { unterlage: "einweisung" }],
    ["nutzungsvertrag nein", { nutzungsvertrag: "nein" }, { unterlage: "nutzungsvertrag" }],
    ["zertifizierung keiner", { zertifizierung: ["keines"] }, { unterlage: "zertifikat" }],
    [
      "schulungsunterlagen nein",
      { schulungsunterlagen: "nein" },
      { unterlage: "schulungsunterlagen" },
    ],
    ["kosten_erprobung 500", { kosten_erprobung: "500" }, { stelle: "finanzen" }],
    [
      "kosten_ueberfuehrung noch unklar",
      { kosten_ueberfuehrung: "unklar" },
      { stelle: "finanzen" },
    ],
  ];
  test.each(zeilen)("%s", (_name, ueber, erwartet) => {
    const a = antworten(ueber);
    const signale = ableitenSignale("neu", a);
    const ergebnis = einordnen("neu", a);
    if (erwartet.stelle) expect(stellenIds(a)).toContain(erwartet.stelle);
    if (erwartet.auflage)
      expect(auflagenVorlage(ergebnis.ampel, signale)).toContain(erwartet.auflage);
    if (erwartet.unterlage)
      expect(offeneUnterlagen(signale).map((p) => p.id)).toContain(erwartet.unterlage);
  });
  test("Gremium ab Schwelle, Vergabestelle ab Schwelle", () => {
    const profil = { ...leeresProfil(), gremienschwelle: "100.000", vergabeschwelle: "25000" };
    const ids = stellenIds(antworten({ kosten_ueberfuehrung: "120000" }), profil);
    expect(ids).toContain("gremium");
    expect(ids).toContain("vergabe");
    expect(stellenIds(antworten({ kosten_ueberfuehrung: "90000" }), profil)).not.toContain(
      "gremium",
    );
  });
});

describe("Abnahme", () => {
  const profil = {
    ...leeresProfil(),
    name: "Stadt Würzburg",
    ebene: "kommune" as const,
    bundesland: "Bayern",
    gremienschwelle: "100.000 €",
  };
  const wuerzburg = antworten({
    personenbezug: "ja",
    beschaeftigtendaten: "nein",
    besondere_kategorien: "nein",
    rechtsgrundlage: "Art. 4 BayDSG",
    auftragsverarbeitung: "ja",
    avv_vorhanden: "ja",
    drittland: "nein",
    vvt: "ja",
    dienstvereinbarung: "ja",
    kosten_erprobung: "0",
    kosten_ueberfuehrung: "120.000",
  });

  test("1 — Würzburg: erwartete Stellen, Bayern-Vorgaben, Laufzettel je Stelle", () => {
    const ids = stellenIds(wuerzburg, profil);
    expect(ids.sort()).toEqual(
      [
        "datenschutz",
        "informationssicherheit",
        "personalrat",
        "swb_gleichstellung",
        "it_betrieb",
        "finanzen",
        "gremium",
        "leitung",
      ].sort(),
    );
    const daten = leereDaten();
    daten.vorhaben.fallart = "neu";
    daten.vorhaben.zeitraumVon = "2026-12-01";
    daten.antworten = wuerzburg;
    const freigabe = freigabeDokument(daten, profil);
    const vorpruefung = freigabe.abschnitte.find((a) => a.titel?.includes(VORPRUEFUNG_TITEL));
    expect(vorpruefung).toBeDefined();
    expect(JSON.stringify(vorpruefung)).toContain("Art. 11 des Bayerischen Digitalgesetzes");
    const seiten = laufzettelSeiten(daten, profil);
    expect(seiten.length).toBe(8);
    expect(seiten[0]?.frist).toBe("2026-11-17");
    expect(freigabe.abschnitte.filter((a) => a.titel?.includes("Anhang: Laufzettel")).length).toBe(
      8,
    );
  });

  test("2 — Hessen: Landesvorgaben noch nicht hinterlegt, kein Fehler", () => {
    const hessen = { ...profil, bundesland: "Hessen" };
    expect(landesvorgaben("Hessen")).toEqual([]);
    const daten = leereDaten();
    daten.vorhaben.fallart = "neu";
    daten.antworten = wuerzburg;
    expect(JSON.stringify(freigabeDokument(daten, hessen))).toContain(LANDESVORGABEN_FEHLEN);
  });

  test("3 — drei Fragen „noch unklar“ stehen unter den offenen Punkten", () => {
    const daten = leereDaten();
    daten.vorhaben.fallart = "neu";
    daten.antworten = antworten({
      ueberwachung: "unklar",
      dienstvereinbarung: "unklar",
      testdaten: "unklar",
    });
    const punkte = offenePunkte(daten, null);
    expect(punkte.length).toBe(3);
    const abschnitt = freigabeDokument(daten, null).abschnitte.find((a) =>
      a.titel?.includes(OFFENE_PUNKTE_TITEL),
    );
    expect(abschnitt).toBeDefined();
    expect(einordnungVorhanden("neu", daten.antworten)).toBe(true);
  });

  test("Abschlussvermerk enthält die Option Fortführung", () => {
    const daten = leereDaten();
    expect(JSON.stringify(abschlussDokument(daten))).toContain(
      "Überführung in ein Projekt bzw. Fortführung",
    );
  });

  test("Stellen stammen ausschließlich aus STELLEN", () => {
    const ids = STELLEN.map((s) => s.id);
    expect(stellenIds(wuerzburg, profil).every((i) => ids.includes(i))).toBe(true);
  });
});
