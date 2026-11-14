// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROTOKOLL_ABLAGE_HINWEIS, PROTOKOLL_RUECKMELDUNGEN_TITEL } from "@/data/vorlagen";
import { protokollDokument } from "@/lib/erprobung/dokumentaufbau";
import {
  Tabellenfehler,
  TABELLENFEHLER_TEXT,
  protokollAusArbeitsmappe,
  protokollSpeichern,
  type Tabellenformat,
} from "@/lib/erprobung/tabelle";
import type { Einrichtungsprofil, Erprobungsdaten, Rueckmeldung } from "@/lib/erprobung/typen";
import { DokumentAnsicht } from "./DokumentAnsicht";

interface Props {
  daten: Erprobungsdaten;
  profil: Einrichtungsprofil | null;
  setzeRueckmeldungen: (r: Rueckmeldung[]) => void;
  setzeEmpfaenger: (e: string) => void;
}

const LEER: Rueckmeldung = { datum: "", rolle: "", beobachtung: "", folge: "" };

export function Protokollrahmen({ daten, profil, setzeRueckmeldungen, setzeEmpfaenger }: Props) {
  const dateiRef = useRef<HTMLInputElement>(null);
  const [meldung, setMeldung] = useState("");
  const [fehler, setFehler] = useState("");
  const eintraege = daten.rueckmeldungen;

  const aendern = (i: number, teil: Partial<Rueckmeldung>) =>
    setzeRueckmeldungen(eintraege.map((e, j) => (j === i ? { ...e, ...teil } : e)));

  const speichern = async (format: Tabellenformat) => {
    setFehler("");
    await protokollSpeichern(daten, profil, format);
    setMeldung(`Das Protokoll wurde als ${format.toUpperCase()}-Datei gespeichert.`);
  };

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="rueckmeldungen-titel"
        className="no-print space-y-4 rounded-md border border-border p-4"
      >
        <h3 id="rueckmeldungen-titel" className="text-lg font-semibold">
          {PROTOKOLL_RUECKMELDUNGEN_TITEL}
        </h3>
        <p className="text-sm">{PROTOKOLL_ABLAGE_HINWEIS}</p>

        <div className="space-y-1.5">
          <Label htmlFor="protokoll-empfaenger">Empfänger des Protokolls</Label>
          <Input
            id="protokoll-empfaenger"
            value={daten.protokollEmpfaenger}
            onChange={(e) => setzeEmpfaenger(e.target.value)}
          />
        </div>

        <ol className="space-y-6">
          {eintraege.map((e, i) => (
            <li key={i} className="space-y-3 rounded-md border border-border p-3">
              <h4 className="font-medium">Eintrag {i + 1}</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`rm-${i}-datum`}>Datum</Label>
                  <Input
                    id={`rm-${i}-datum`}
                    type="date"
                    value={e.datum}
                    onChange={(ev) => aendern(i, { datum: ev.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`rm-${i}-rolle`}>Rolle</Label>
                  <Input
                    id={`rm-${i}-rolle`}
                    value={e.rolle}
                    onChange={(ev) => aendern(i, { rolle: ev.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`rm-${i}-beobachtung`}>Beobachtung</Label>
                <Textarea
                  id={`rm-${i}-beobachtung`}
                  rows={5}
                  value={e.beobachtung}
                  onChange={(ev) => aendern(i, { beobachtung: ev.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`rm-${i}-folge`}>Folge</Label>
                <Textarea
                  id={`rm-${i}-folge`}
                  rows={5}
                  value={e.folge}
                  onChange={(ev) => aendern(i, { folge: ev.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setzeRueckmeldungen(eintraege.filter((_, j) => j !== i))}
              >
                Eintrag {i + 1} entfernen
              </Button>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setzeRueckmeldungen([...eintraege, { ...LEER }])}
          >
            Eintrag hinzufügen
          </Button>
          <Button type="button" variant="outline" onClick={() => speichern("xlsx")}>
            Protokoll als XLSX speichern
          </Button>
          <Button type="button" variant="outline" onClick={() => speichern("ods")}>
            Protokoll als ODS speichern
          </Button>
          <Button type="button" variant="outline" onClick={() => dateiRef.current?.click()}>
            Protokoll einlesen
          </Button>
          <input
            ref={dateiRef}
            type="file"
            accept=".xlsx,.ods,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet"
            className="sr-only"
            aria-label="XLSX- oder ODS-Datei mit einem Protokoll auswählen"
            onChange={async (ev) => {
              const datei = ev.target.files?.[0];
              ev.target.value = "";
              if (!datei) return;
              try {
                const gelesen = await protokollAusArbeitsmappe(await datei.arrayBuffer());
                setzeRueckmeldungen(gelesen.rueckmeldungen);
                if (gelesen.empfaenger !== null) setzeEmpfaenger(gelesen.empfaenger);
                setFehler("");
                const fremd =
                  gelesen.vorgangKennung && gelesen.vorgangKennung !== daten.vorgangKennung
                    ? ` Die Datei stammt aus dem Vorgang ${gelesen.vorgangKennung}.`
                    : "";
                setMeldung(
                  `${gelesen.rueckmeldungen.length} Einträge wurden eingelesen und können fortgeschrieben werden.${fremd}`,
                );
              } catch (err) {
                setMeldung("");
                setFehler(err instanceof Tabellenfehler ? err.message : TABELLENFEHLER_TEXT);
              }
            }}
          />
        </div>
        <p aria-live="polite" className="text-sm">
          {meldung}
        </p>
        {fehler && (
          <p role="alert" className="text-sm text-destructive">
            {fehler}
          </p>
        )}
      </section>

      <DokumentAnsicht dokument={protokollDokument(daten)} daten={daten} />
    </div>
  );
}
