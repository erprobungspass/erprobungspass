// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LAUFZETTEL_FRIST_TAGE } from "@/data/vorlagen";
import { laufzettelDokument } from "@/lib/erprobung/dokumentaufbau";
import { laufzettelSeiten } from "@/lib/erprobung/laufzettel";
import type { Einrichtungsprofil, Erprobungsdaten, Laufzetteleintrag } from "@/lib/erprobung/typen";
import { DokumentAnsicht } from "./DokumentAnsicht";

interface Props {
  daten: Erprobungsdaten;
  profil: Einrichtungsprofil | null;
  setzeLaufzettel: (id: string, teil: Partial<Laufzetteleintrag>) => void;
}

export function Laufzettel({ daten, profil, setzeLaufzettel }: Props) {
  const seiten = laufzettelSeiten(daten, profil);
  return (
    <div className="space-y-8">
      <section
        aria-labelledby="laufzettel-eingabe"
        className="no-print space-y-4 rounded-md border border-border p-4"
      >
        <h3 id="laufzettel-eingabe" className="text-lg font-semibold">
          Fristen und Ergebnisse je Stelle
        </h3>
        <p className="text-sm text-muted-foreground">
          Die Frist ist mit dem Erprobungsbeginn abzüglich {LAUFZETTEL_FRIST_TAGE} Tagen vorbelegt.
        </p>
        <ul className="space-y-4">
          {seiten.map((s) => (
            <li key={s.stelle.id} className="grid gap-3 md:grid-cols-[14rem_1fr]">
              <div className="space-y-1.5">
                <Label htmlFor={`lz-${s.stelle.id}-frist`}>Frist: {s.stelle.bezeichnung}</Label>
                <Input
                  id={`lz-${s.stelle.id}-frist`}
                  type="date"
                  value={s.frist}
                  onChange={(e) => setzeLaufzettel(s.stelle.id, { frist: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`lz-${s.stelle.id}-ergebnis`}>
                  Ergebnis: {s.stelle.bezeichnung}
                </Label>
                <Textarea
                  id={`lz-${s.stelle.id}-ergebnis`}
                  rows={2}
                  value={s.ergebnis}
                  onChange={(e) => setzeLaufzettel(s.stelle.id, { ergebnis: e.target.value })}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <DokumentAnsicht dokument={laufzettelDokument(daten, profil)} daten={daten} />
    </div>
  );
}
