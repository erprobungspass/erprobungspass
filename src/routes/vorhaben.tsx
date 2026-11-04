// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fortschritt, SCHRITTE } from "@/components/erprobung/Fortschritt";
import { Schritt1Vorhaben, geltungsdauerFehler } from "@/components/erprobung/Schritt1Vorhaben";
import { Schritt2Einordnung } from "@/components/erprobung/Schritt2Einordnung";
import { Schritt3Beteiligungen } from "@/components/erprobung/Schritt3Beteiligungen";
import { Schritt4Auflagen } from "@/components/erprobung/Schritt4Auflagen";
import { Schritt5Dokumente } from "@/components/erprobung/Schritt5Dokumente";
import { REGELWERK_VERSION } from "@/data/regelwerk";
import {
  AUFLAGE_FREIGABE_DATENSCHUTZ,
  BEISPIEL_HINWEIS,
  DATENSCHUTZHINWEIS_ANWENDUNG,
  abbruchkriterienVorlage,
  auflagenVorlage,
  einordnungOffenWeiter,
  versionshinweis,
} from "@/data/vorlagen";
import { ableitenSignale, einordnen, offeneFragen } from "@/lib/erprobung/bewertung";
import {
  exportieren,
  importieren,
  ladenAusSpeicher,
  leereDaten,
  speichern,
  verwerfen,
  datumDeutsch,
} from "@/lib/erprobung/speicher";
import { beteiligungenVorbelegen, profilLaden } from "@/lib/erprobung/profil";
import { verantwortungVorbelegen } from "@/lib/erprobung/verantwortung";
import type {
  Ausgang,
  Beteiligung,
  Einrichtungsprofil,
  Erprobungsdaten,
  Vorhaben,
} from "@/lib/erprobung/typen";

export const Route = createFileRoute("/vorhaben")({
  head: () => ({
    meta: [
      { title: "Vorhaben prüfen — Erprobungspass" },
      {
        name: "description",
        content:
          "Fünf Schritte von der Erfassung des Vorhabens über Einordnung und Beteiligungen bis zu Freigabedokument, Protokollrahmen und Abschlussvermerk.",
      },
      { property: "og:title", content: "Vorhaben prüfen — Erprobungspass" },
      {
        property: "og:description",
        content:
          "Einordnung, Beteiligungen und Auflagen einer Technikerprobung in drei druckbaren Dokumenten.",
      },
    ],
  }),
  component: Assistent,
});

function Assistent() {
  const [daten, setDaten] = useState<Erprobungsdaten>(() => leereDaten());
  const [profil, setProfil] = useState<Einrichtungsprofil | null>(null);
  const [geladen, setGeladen] = useState(false);
  const [wiederaufnahme, setWiederaufnahme] = useState<string | null>(null);
  const dateiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const gespeichertesProfil = profilLaden();
    setProfil(gespeichertesProfil);
    const gespeichert = ladenAusSpeicher();
    if (gespeichert) {
      // Wird ein Vorgang jenseits von Schritt 3 geladen, werden leere Felder
      // zu Verantwortung und Restrisiken vorbelegt.
      const vorlage =
        gespeichert.hoechsterSchritt >= 4
          ? verantwortungVorbelegen(gespeichert, gespeichertesProfil)
          : null;
      setDaten({
        ...gespeichert,
        beteiligungen: beteiligungenVorbelegen(gespeichert.beteiligungen, gespeichertesProfil),
        verantwortung: vorlage
          ? {
              fachlich: gespeichert.verantwortung.fachlich || vorlage.fachlich,
              technisch: gespeichert.verantwortung.technisch || vorlage.technisch,
              annahmen: gespeichert.verantwortung.annahmen || vorlage.annahmen,
              restrisiken: gespeichert.verantwortung.restrisiken || vorlage.restrisiken,
            }
          : gespeichert.verantwortung,
      });
      if (gespeichert.hoechsterSchritt > 1 && !gespeichert.beispiel) {
        setWiederaufnahme(gespeichert.gespeichertAm);
      }
    } else if (gespeichertesProfil) {
      setDaten((d) => ({
        ...d,
        vorhaben: { ...d.vorhaben, behoerde: d.vorhaben.behoerde || gespeichertesProfil.name },
        beteiligungen: beteiligungenVorbelegen(d.beteiligungen, gespeichertesProfil),
      }));
    }
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (geladen) speichern(daten);
  }, [daten, geladen]);

  // Sprechender Seitentitel je Schritt.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const titel = SCHRITTE[daten.schritt - 1] ?? "";
    document.title = `Schritt ${daten.schritt} von ${SCHRITTE.length}: ${titel} — Erprobungspass`;
  }, [daten.schritt]);

  const aktualisieren = (teil: Partial<Erprobungsdaten>) => setDaten((d) => ({ ...d, ...teil }));

  const vorhabenAendern = (teil: Partial<Vorhaben>) =>
    setDaten((d) => ({ ...d, vorhaben: { ...d.vorhaben, ...teil } }));

  const antwortAendern = (id: string, wert: string | string[]) =>
    setDaten((d) => ({ ...d, antworten: { ...d.antworten, [id]: wert } }));

  const beteiligungAendern = (id: string, teil: Partial<Beteiligung>) =>
    setDaten((d) => ({
      ...d,
      beteiligungen: {
        ...d.beteiligungen,
        [id]: {
          status: "offen",
          name: "",
          kontakt: "",
          ...d.beteiligungen[id],
          ...teil,
        },
      },
    }));

  /** Belegt die Auflagen passend zur Ampel und zum Einrichtungsprofil vor. */
  const auflagenVorbelegen = (d: Erprobungsdaten): string[] => {
    const ergebnis = einordnen(d.vorhaben.fallart, d.antworten, profil);
    const liste = auflagenVorlage(ergebnis.ampel, ergebnis.signale);
    if (
      profil?.freigabeDatenschutzErforderlich &&
      ergebnis.signale.personenbezug &&
      !liste.includes(AUFLAGE_FREIGABE_DATENSCHUTZ)
    ) {
      liste.push(AUFLAGE_FREIGABE_DATENSCHUTZ);
    }
    return liste;
  };

  const zuSchritt = (n: number) =>
    setDaten((d) => {
      const ziel = Math.min(Math.max(n, 1), SCHRITTE.length);
      const naechste = {
        ...d,
        schritt: ziel,
        hoechsterSchritt: Math.max(d.hoechsterSchritt, ziel),
      };
      if (ziel >= 4 && !d.auflagenAngepasst) {
        naechste.auflagen = auflagenVorbelegen(d);
        naechste.abbruchkriterien = abbruchkriterienVorlage(
          ableitenSignale(d.vorhaben.fallart, d.antworten),
        );
        naechste.auflagenAngepasst = true;
      }
      if (ziel >= 4) {
        // Nur leere Felder werden vorbelegt; eigene Eingaben bleiben erhalten.
        const vorlage = verantwortungVorbelegen(d, profil);
        naechste.verantwortung = {
          fachlich: d.verantwortung.fachlich || vorlage.fachlich,
          technisch: d.verantwortung.technisch || vorlage.technisch,
          annahmen: d.verantwortung.annahmen || vorlage.annahmen,
          restrisiken: d.verantwortung.restrisiken || vorlage.restrisiken,
        };
      }
      return naechste;
    });

  const neuEinordnen = () =>
    setDaten((d) => ({
      ...d,
      version: REGELWERK_VERSION,
      auflagen: auflagenVorbelegen(d),
      auflagenAngepasst: true,
      schritt: 2,
      hoechsterSchritt: Math.max(d.hoechsterSchritt, 2),
    }));

  const alleVerwerfen = () => {
    verwerfen();
    setDaten(leereDaten());
    setWiederaufnahme(null);
  };

  const signale = ableitenSignale(daten.vorhaben.fallart, daten.antworten);
  const schritt1Vollstaendig =
    daten.vorhaben.fallart !== null &&
    daten.vorhaben.bezeichnung.trim() !== "" &&
    geltungsdauerFehler(daten.geltungsdauerWochen, profil) === "";
  const veralteteFassung = daten.version !== REGELWERK_VERSION;
  const offen = offeneFragen(daten.vorhaben.fallart, daten.antworten);
  const weiterHinweis =
    daten.schritt === 1 && !schritt1Vollstaendig
      ? "Bitte wählen Sie eine Art des Vorhabens, tragen Sie eine Bezeichnung ein und geben Sie eine zulässige Geltungsdauer an."
      : daten.schritt === 2 && offen.length > 0
        ? einordnungOffenWeiter(offen.length)
        : "";

  return (
    <div className="min-h-screen bg-background">
      <header className="kopfzeile no-print">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="font-semibold">
            Erprobungspass
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => exportieren(daten)}>
              Als Datei sichern
            </Button>
            <Button variant="outline" size="sm" onClick={() => dateiRef.current?.click()}>
              Datei laden
            </Button>
            <Button variant="outline" size="sm" onClick={alleVerwerfen}>
              Eingaben verwerfen
            </Button>
            <input
              ref={dateiRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="JSON-Datei mit einem Vorhaben auswählen"
              onChange={async (e) => {
                const datei = e.target.files?.[0];
                if (!datei) return;
                try {
                  const geladeneDaten = await importieren(datei);
                  setDaten({
                    ...geladeneDaten,
                    beteiligungen: beteiligungenVorbelegen(geladeneDaten.beteiligungen, profil),
                  });
                } catch {
                  /* ungültige Datei wird ignoriert */
                }
              }}
            />
          </div>
        </div>
        <p className="mx-auto max-w-5xl px-4 pb-3 text-xs opacity-90">
          {DATENSCHUTZHINWEIS_ANWENDUNG}
        </p>
      </header>

      <Fortschritt
        aktuell={daten.schritt}
        hoechster={daten.hoechsterSchritt}
        aufSchritt={zuSchritt}
      />

      <main id="hauptinhalt" className="mx-auto max-w-5xl px-4 py-8">
        {daten.beispiel && (
          <div
            role="status"
            className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-marke-tuerkis bg-secondary p-4 text-sm"
          >
            <p>{BEISPIEL_HINWEIS}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDaten(leereDaten());
                setWiederaufnahme(null);
              }}
            >
              Beispielfall schließen und leeres Vorhaben beginnen
            </Button>
          </div>
        )}

        {veralteteFassung && (
          <div
            role="status"
            className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-secondary p-4 text-sm"
          >
            <p>{versionshinweis(daten.version, REGELWERK_VERSION)}</p>
            <Button variant="outline" size="sm" onClick={neuEinordnen}>
              Einordnung mit aktueller Fassung wiederholen
            </Button>
          </div>
        )}

        {wiederaufnahme && (
          <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-secondary p-4 text-sm">
            <p>
              Ein Zwischenstand vom {datumDeutsch(wiederaufnahme)} wurde geladen. Sie können dort
              weiterarbeiten.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setWiederaufnahme(null)}>
                Weiterarbeiten
              </Button>
              <Button variant="outline" size="sm" onClick={alleVerwerfen}>
                Verwerfen und neu beginnen
              </Button>
            </div>
          </div>
        )}

        <h1 className="no-print sr-only">
          Schritt {daten.schritt} von {SCHRITTE.length}: {SCHRITTE[daten.schritt - 1]}
        </h1>

        {daten.schritt === 1 && (
          <Schritt1Vorhaben
            vorhaben={daten.vorhaben}
            geltungsdauerWochen={daten.geltungsdauerWochen}
            profil={profil}
            aendern={vorhabenAendern}
            setzeGeltungsdauerWochen={(v) => aktualisieren({ geltungsdauerWochen: v })}
          />
        )}
        {daten.schritt === 2 && (
          <Schritt2Einordnung
            vorhaben={daten.vorhaben}
            antworten={daten.antworten}
            profil={profil}
            aendern={antwortAendern}
          />
        )}
        {daten.schritt === 3 && (
          <Schritt3Beteiligungen
            signale={signale}
            beteiligungen={daten.beteiligungen}
            profil={profil}
            aendern={beteiligungAendern}
          />
        )}
        {daten.schritt === 4 && (
          <Schritt4Auflagen
            auflagen={daten.auflagen}
            abbruchkriterien={daten.abbruchkriterien}
            geltungsdauerWochen={daten.geltungsdauerWochen}
            startdatum={daten.vorhaben.zeitraumVon}
            verantwortung={daten.verantwortung}
            setzeAuflagen={(l) => aktualisieren({ auflagen: l })}
            setzeAbbruchkriterien={(l) => aktualisieren({ abbruchkriterien: l })}
            setzeVerantwortung={(teil) =>
              setDaten((d) => ({ ...d, verantwortung: { ...d.verantwortung, ...teil } }))
            }
          />
        )}
        {daten.schritt === 5 && (
          <Schritt5Dokumente
            daten={daten}
            profil={profil}
            setzeAusgang={(a: Ausgang) => aktualisieren({ ausgang: a })}
            setzeRueckmeldungen={(r) => aktualisieren({ rueckmeldungen: r })}
            setzeEmpfaenger={(e) => aktualisieren({ protokollEmpfaenger: e })}
            setzeLaufzettel={(id, teil) =>
              setDaten((d) => ({
                ...d,
                laufzettel: {
                  ...d.laufzettel,
                  [id]: { frist: "", ergebnis: "", ...d.laufzettel[id], ...teil },
                },
              }))
            }
          />
        )}

        <div className="no-print mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <Button
            variant="outline"
            disabled={daten.schritt === 1}
            onClick={() => zuSchritt(daten.schritt - 1)}
          >
            Zurück
          </Button>
          {daten.schritt < 5 && (
            <Button
              disabled={
                (daten.schritt === 1 && !schritt1Vollstaendig) ||
                (daten.schritt === 2 && offen.length > 0)
              }
              aria-describedby={weiterHinweis ? "weiter-hinweis" : undefined}
              onClick={() => zuSchritt(daten.schritt + 1)}
            >
              Weiter
            </Button>
          )}
        </div>

        {weiterHinweis && (
          <p
            id="weiter-hinweis"
            role="status"
            className="no-print mt-3 text-sm text-muted-foreground"
          >
            {weiterHinweis}
          </p>
        )}
      </main>
    </div>
  );
}
