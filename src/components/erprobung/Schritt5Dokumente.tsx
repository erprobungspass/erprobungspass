// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ABSCHLUSS_OPTIONEN,
  ABSCHLUSS_TITEL,
  AUSGANG_TEXTE,
  EINORDNUNG_OFFEN_DRUCK,
  FALLSATZ_ENTHALTEN,
  FALLSATZ_ERKLAERUNG,
  FALLSATZ_NICHT_ENTHALTEN,
  FALLSATZ_TITEL,
  LAUFZETTEL_TITEL,
  PROTOKOLL_TITEL,
} from "@/data/vorlagen";
import { einordnungVorhanden } from "@/lib/erprobung/bewertung";
import { exportieren } from "@/lib/erprobung/speicher";
import { fallsatzHerunterladen, markdownHerunterladen } from "@/lib/erprobung/export";
import type {
  Ausgang,
  Einrichtungsprofil,
  Erprobungsdaten,
  Laufzetteleintrag,
  Rueckmeldung,
} from "@/lib/erprobung/typen";
import { Abschlussvermerk } from "./Abschlussvermerk";
import { Laufzettel } from "./Laufzettel";
import { Protokollrahmen } from "./Protokollrahmen";
import { Schritt5Pass } from "./Schritt5Pass";

interface Props {
  daten: Erprobungsdaten;
  profil: Einrichtungsprofil | null;
  setzeAusgang: (a: Ausgang) => void;
  setzeRueckmeldungen: (r: Rueckmeldung[]) => void;
  setzeEmpfaenger: (e: string) => void;
  setzeLaufzettel: (id: string, teil: Partial<Laufzetteleintrag>) => void;
}

const REITER = [
  { id: "freigabe", titel: "Freigabedokument" },
  { id: "protokoll", titel: PROTOKOLL_TITEL },
  { id: "abschluss", titel: ABSCHLUSS_TITEL },
  { id: "laufzettel", titel: LAUFZETTEL_TITEL },
];

export function Schritt5Dokumente({
  daten,
  profil,
  setzeAusgang,
  setzeRueckmeldungen,
  setzeEmpfaenger,
  setzeLaufzettel,
}: Props) {
  const [reiter, setReiter] = useState("freigabe");
  const [fallsatzOffen, setFallsatzOffen] = useState(false);

  const aktuellerTitel = REITER.find((r) => r.id === reiter)?.titel ?? "";
  // Ohne abgeschlossene Einordnung lassen sich die Dokumente nicht drucken.
  const vorhandenerBefund = einordnungVorhanden(daten.vorhaben.fallart, daten.antworten);

  return (
    <div className="space-y-6">
      <div className="no-print space-y-2">
        <h2 className="text-xl font-semibold">Dokumente</h2>
        <p className="text-sm text-muted-foreground">
          Es entstehen drei Dokumente und ein Laufzettel für die beteiligten Stellen. Wählen Sie
          eine Ansicht aus und drucken Sie sie einzeln, oder laden Sie den Vorgang als Datei
          herunter. Der Laufzettel ist zusätzlich als Anhang im Freigabedokument enthalten.
        </p>
      </div>

      <Tabs value={reiter} onValueChange={setReiter}>
        <TabsList className="no-print h-auto flex-wrap">
          {REITER.map((r) => (
            <TabsTrigger key={r.id} value={r.id} className="min-h-11">
              {r.titel}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="no-print mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => window.print()}
            disabled={!vorhandenerBefund}
            aria-describedby={vorhandenerBefund ? undefined : "druck-hinweis"}
          >
            {aktuellerTitel} drucken
          </Button>
          <Button variant="outline" onClick={() => markdownHerunterladen(daten, profil)}>
            Alle drei Dokumente als Markdown laden
          </Button>
          <Button variant="outline" onClick={() => exportieren(daten)}>
            Vollständigen Vorgang als JSON laden
          </Button>
          <Button variant="outline" onClick={() => setFallsatzOffen(true)}>
            Anonymisierten Fallsatz laden
          </Button>
        </div>

        {!vorhandenerBefund && (
          <p id="druck-hinweis" role="status" className="no-print mt-2 text-sm">
            {EINORDNUNG_OFFEN_DRUCK}
          </p>
        )}

        <TabsContent value="freigabe" className="mt-6">
          <Schritt5Pass daten={daten} profil={profil} />
        </TabsContent>
        <TabsContent value="protokoll" className="mt-6">
          <Protokollrahmen
            daten={daten}
            profil={profil}
            setzeRueckmeldungen={setzeRueckmeldungen}
            setzeEmpfaenger={setzeEmpfaenger}
          />
        </TabsContent>
        <TabsContent value="abschluss" className="mt-6">
          <Abschlussvermerk daten={daten} />
        </TabsContent>
        <TabsContent value="laufzettel" className="mt-6">
          <Laufzettel daten={daten} profil={profil} setzeLaufzettel={setzeLaufzettel} />
        </TabsContent>
      </Tabs>

      <Dialog open={fallsatzOffen} onOpenChange={setFallsatzOffen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{FALLSATZ_TITEL}</DialogTitle>
            <DialogDescription>{FALLSATZ_ERKLAERUNG}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold">Die Datei enthält</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {FALLSATZ_ENTHALTEN.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Die Datei enthält nicht</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {FALLSATZ_NICHT_ENTHALTEN.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ausgang">Ausgang der Erprobung</Label>
              <select
                id="ausgang"
                value={daten.ausgang}
                onChange={(e) => setzeAusgang(e.target.value as Ausgang)}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="offen">{AUSGANG_TEXTE["offen"]}</option>
                {ABSCHLUSS_OPTIONEN.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFallsatzOffen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                fallsatzHerunterladen(daten);
                setFallsatzOffen(false);
              }}
            >
              Weitergabe bestätigen und laden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
