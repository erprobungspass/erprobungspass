// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BEARBEITUNGSDAUER,
  DATENSCHUTZHINWEIS_ANWENDUNG,
  HAFTUNGSHINWEIS,
  LADEFEHLER_FORMAT,
  PROFIL_UEBERNOMMEN,
  STARTSEITE_ERKLAERUNG,
  abbruchkriterienVorlage,
  auflagenVorlage,
} from "@/data/vorlagen";
import { REGELWERK_VERSION } from "@/data/regelwerk";
import { beispielDaten } from "@/data/beispiel";
import { einordnen } from "@/lib/erprobung/bewertung";
import { profilImportieren, profilSpeichern } from "@/lib/erprobung/profil";
import {
  Ladefehler,
  importieren,
  ladenAusSpeicher,
  leereDaten,
  speichern,
  verwerfen,
} from "@/lib/erprobung/speicher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Erprobungspass — Technikerprobung in öffentlichen Stellen prüfen" },
      {
        name: "description",
        content:
          "Prüfpfad für die Erprobung neuer Technik in Behörden: Einordnung nach KI-Verordnung und Datenschutz, Beteiligungen, Auflagen und ein druckbarer Erprobungspass.",
      },
      {
        property: "og:title",
        content: "Erprobungspass — Technikerprobung in öffentlichen Stellen prüfen",
      },
      {
        property: "og:description",
        content:
          "In etwa fünfzehn Minuten zum druckbaren Erprobungspass. Alle Angaben bleiben im Browser.",
      },
    ],
  }),
  component: Startseite,
});

function Startseite() {
  const navigate = useNavigate();
  const [entwurfVorhanden, setEntwurfVorhanden] = useState(false);
  const [fehler, setFehler] = useState("");
  const [profilDatei, setProfilDatei] = useState<File | null>(null);
  const [profilUebernommen, setProfilUebernommen] = useState(false);
  const dateiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntwurfVorhanden(ladenAusSpeicher() !== null);
  }, []);

  const beispielLaden = () => {
    const daten = beispielDaten();
    const ergebnis = einordnen(daten.vorhaben.fallart, daten.antworten);
    speichern({
      ...daten,
      auflagen: auflagenVorlage(ergebnis.ampel, ergebnis.signale),
      abbruchkriterien: abbruchkriterienVorlage(ergebnis.signale),
      auflagenAngepasst: true,
    });
    navigate({ to: "/vorhaben" });
  };

  const dateiEinlesen = async (datei: File) => {
    setFehler("");
    setProfilDatei(null);
    setProfilUebernommen(false);
    try {
      const daten = await importieren(datei);
      speichern(daten);
      navigate({ to: "/vorhaben" });
    } catch (e) {
      if (e instanceof Ladefehler) {
        setFehler(e.message);
        if (e.art === "profil") setProfilDatei(datei);
      } else {
        setFehler(LADEFEHLER_FORMAT);
      }
    }
  };

  return (
    <main id="hauptinhalt" className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-muted-foreground">{DATENSCHUTZHINWEIS_ANWENDUNG}</p>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Erprobungspass</h1>

      <div className="mt-4 space-y-3 text-base">
        {STARTSEITE_ERKLAERUNG.map((satz) => (
          <p key={satz}>{satz}</p>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Voraussichtliche Bearbeitungsdauer: {BEARBEITUNGSDAUER}.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/vorhaben" onClick={() => speichern(leereDaten())}>
            Neues Vorhaben
          </Link>
        </Button>

        {entwurfVorhanden && (
          <>
            <Button variant="outline" asChild>
              <Link to="/vorhaben">Gespeicherten Entwurf fortsetzen</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                verwerfen();
                setEntwurfVorhanden(false);
              }}
            >
              Entwurf verwerfen
            </Button>
          </>
        )}
        <Button variant="outline" onClick={() => dateiRef.current?.click()}>
          Vorhaben aus Datei laden
        </Button>
        <Button variant="outline" onClick={beispielLaden}>
          Beispielfall laden
        </Button>
        <Button variant="outline" asChild>
          <Link to="/einrichtung">Einrichtungsprofil bearbeiten</Link>
        </Button>
        <input
          ref={dateiRef}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          aria-label="JSON-Datei mit einem Vorhaben auswählen"
          onChange={(e) => {
            const datei = e.target.files?.[0];
            e.target.value = "";
            if (datei) void dateiEinlesen(datei);
          }}
        />
      </div>

      <div aria-live="polite">
        {fehler && (
          <div role="alert" className="mt-4 space-y-3 text-sm text-destructive">
            <p>{fehler}</p>
            {profilDatei && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const profil = await profilImportieren(profilDatei);
                    profilSpeichern(profil);
                    setFehler("");
                    setProfilDatei(null);
                    setProfilUebernommen(true);
                  } catch {
                    setProfilDatei(null);
                    setFehler(LADEFEHLER_FORMAT);
                  }
                }}
              >
                Als Einrichtungsprofil übernehmen
              </Button>
            )}
          </div>
        )}
        {profilUebernommen && (
          <p role="status" className="mt-4 text-sm">
            {PROFIL_UEBERNOMMEN}
          </p>
        )}
      </div>

      <p className="mt-10 rounded-md border border-border bg-secondary p-4 text-sm">
        {HAFTUNGSHINWEIS}
      </p>

      <p className="mt-6 text-xs text-muted-foreground">Regelwerksversion {REGELWERK_VERSION}</p>
    </main>
  );
}
