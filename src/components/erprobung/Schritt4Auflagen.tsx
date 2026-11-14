// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ABBRUCH_LEITSATZ,
  VERANTWORTUNG_FELDER,
  VERANTWORTUNG_HINWEIS,
  VERANTWORTUNG_LEITSATZ,
  VERANTWORTUNG_TITEL,
  gruppierteAuflagen,
} from "@/data/vorlagen";
import { geltungsdauerText } from "@/lib/erprobung/dauer";
import type { Verantwortung } from "@/lib/erprobung/typen";

interface Props {
  auflagen: string[];
  abbruchkriterien: string[];
  geltungsdauerWochen: number;
  startdatum: string;
  verantwortung: Verantwortung;
  setzeAuflagen: (l: string[]) => void;
  setzeAbbruchkriterien: (l: string[]) => void;
  setzeVerantwortung: (teil: Partial<Verantwortung>) => void;
}

function Liste({
  titel,
  beschreibung,
  eintraege,
  setzen,
  praefix,
}: {
  titel: string;
  beschreibung?: string;
  eintraege: string[];
  setzen: (l: string[]) => void;
  praefix: string;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">{titel}</h3>
      {beschreibung && <p className="text-sm">{beschreibung}</p>}
      <ol className="space-y-3">
        {eintraege.map((eintrag, i) => (
          <li key={`${praefix}-${i}`} className="space-y-1.5">
            <Label htmlFor={`${praefix}-${i}`}>Nummer {i + 1}</Label>
            <div className="flex items-start gap-2">
              <Textarea
                id={`${praefix}-${i}`}
                rows={2}
                value={eintrag}
                onChange={(e) => {
                  const kopie = [...eintraege];
                  kopie[i] = e.target.value;
                  setzen(kopie);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setzen(eintraege.filter((_, j) => j !== i))}
              >
                Eintrag {i + 1} entfernen
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" onClick={() => setzen([...eintraege, ""])}>
        Eintrag hinzufügen
      </Button>
    </section>
  );
}

/**
 * Auflagen nach Gruppen mit Zwischenüberschriften; die Nummerierung läuft
 * innerhalb der Gruppen, leere Gruppen entfallen.
 */
function GruppierteAuflagen({
  auflagen,
  setzen,
}: {
  auflagen: string[];
  setzen: (l: string[]) => void;
}) {
  const gruppen = gruppierteAuflagen(auflagen);
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Auflagen</h3>
      {gruppen.map((gruppe) => (
        <div key={gruppe.id} className="space-y-3">
          <h4 className="font-semibold">{gruppe.titel}</h4>
          <ol className="space-y-3">
            {gruppe.eintraege.map((eintrag, i) => (
              <li key={`auflage-${eintrag.index}`} className="space-y-1.5">
                <Label htmlFor={`auflage-${eintrag.index}`}>
                  {gruppe.titel}, Nummer {i + 1}
                </Label>
                <div className="flex items-start gap-2">
                  <Textarea
                    id={`auflage-${eintrag.index}`}
                    rows={2}
                    value={eintrag.text}
                    onChange={(e) => {
                      const kopie = [...auflagen];
                      kopie[eintrag.index] = e.target.value;
                      setzen(kopie);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setzen(auflagen.filter((_, j) => j !== eintrag.index))}
                  >
                    Eintrag entfernen
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setzen([...auflagen, ""])}>
        Eintrag hinzufügen
      </Button>
    </section>
  );
}

export function Schritt4Auflagen({
  auflagen,
  abbruchkriterien,
  geltungsdauerWochen,
  startdatum,
  verantwortung,
  setzeAuflagen,
  setzeAbbruchkriterien,
  setzeVerantwortung,
}: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold">Auflagen der Erprobung</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Die Liste ist nach Ihrer Einordnung vorbelegt. Sie können jeden Eintrag ändern, entfernen
          oder ergänzen.
        </p>
      </div>

      <GruppierteAuflagen auflagen={auflagen} setzen={setzeAuflagen} />

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">{VERANTWORTUNG_TITEL}</h3>
        <p className="text-sm text-muted-foreground">{VERANTWORTUNG_HINWEIS}</p>
        {VERANTWORTUNG_FELDER.map((feld) => (
          <div key={feld.schluessel} className="space-y-1.5">
            <Label htmlFor={`verantwortung-${feld.schluessel}`}>{feld.beschriftung}</Label>
            <Textarea
              id={`verantwortung-${feld.schluessel}`}
              rows={feld.schluessel === "annahmen" || feld.schluessel === "restrisiken" ? 6 : 2}
              value={verantwortung[feld.schluessel]}
              onChange={(e) => setzeVerantwortung({ [feld.schluessel]: e.target.value })}
            />
          </div>
        ))}
        <p className="text-sm">{VERANTWORTUNG_LEITSATZ}</p>
      </section>

      <Liste
        titel="Abbruchkriterien"
        beschreibung={ABBRUCH_LEITSATZ}
        eintraege={abbruchkriterien}
        setzen={setzeAbbruchkriterien}
        praefix="abbruch"
      />

      <section className="space-y-1.5" aria-labelledby="geltungsdauer-titel">
        <h3 id="geltungsdauer-titel" className="text-lg font-semibold">
          Geltungsdauer
        </h3>
        <p className="text-sm font-medium">{geltungsdauerText(startdatum, geltungsdauerWochen)}</p>
        <p className="text-xs text-muted-foreground">
          Erprobungszeitraum und Geltungsdauer legen Sie in Schritt 1 fest und ändern sie dort.
        </p>
      </section>
    </div>
  );
}
