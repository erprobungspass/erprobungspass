// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { FALLARTEN, type Fallart } from "@/data/regelwerk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AUSGANGSLAGE_EINLEITUNG,
  AUSGANGSLAGE_FELDER,
  AUSGANGSLAGE_TITEL,
  GELTUNGSDAUER_HINWEIS,
  GELTUNGSDAUER_WOCHEN_MAX,
  GELTUNGSDAUER_WOCHEN_MIN,
} from "@/data/vorlagen";
import { cn } from "@/lib/utils";
import { geltungsdauerText, wochenGueltig } from "@/lib/erprobung/dauer";
import type { Einrichtungsprofil, Vorhaben } from "@/lib/erprobung/typen";

interface Props {
  vorhaben: Vorhaben;
  geltungsdauerWochen: number;
  profil: Einrichtungsprofil | null;
  aendern: (teil: Partial<Vorhaben>) => void;
  setzeGeltungsdauerWochen: (v: number) => void;
}

/** Fehlertext zur Geltungsdauer oder leer, wenn die Angabe zulässig ist. */
export function geltungsdauerFehler(wochen: number, profil: Einrichtungsprofil | null): string {
  if (!wochenGueltig(wochen))
    return `Bitte geben Sie eine ganze Zahl zwischen ${GELTUNGSDAUER_WOCHEN_MIN} und ${GELTUNGSDAUER_WOCHEN_MAX} Wochen an.`;
  if (profil && profil.hoechstdauerWochen > 0 && wochen > profil.hoechstdauerWochen)
    return `Nach dem Einrichtungsprofil beträgt die Höchstdauer einer Erprobung ${profil.hoechstdauerWochen} Wochen.`;
  return "";
}

function Feld({
  id,
  beschriftung,
  wert,
  aendern,
  typ = "text",
  hinweis,
  platzhalter,
  pflicht = false,
}: {
  id: string;
  beschriftung: string;
  wert: string;
  aendern: (v: string) => void;
  typ?: string;
  hinweis?: string;
  platzhalter?: string;
  pflicht?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {beschriftung}
        {pflicht && <span className="ml-1 font-normal">(Pflichtfeld)</span>}
      </Label>
      <Input
        id={id}
        type={typ}
        value={wert}
        required={pflicht}
        aria-required={pflicht || undefined}
        placeholder={platzhalter}
        onChange={(e) => aendern(e.target.value)}
      />
      {hinweis && <p className="text-xs text-muted-foreground">{hinweis}</p>}
    </div>
  );
}

export function Schritt1Vorhaben({
  vorhaben,
  geltungsdauerWochen,
  profil,
  aendern,
  setzeGeltungsdauerWochen,
}: Props) {
  const gewaehlt = FALLARTEN.find((f) => f.id === vorhaben.fallart);
  const fehler = geltungsdauerFehler(geltungsdauerWochen, profil);

  return (
    <div className="space-y-10">
      <section aria-labelledby="fallart-titel" className="space-y-4">
        <div>
          <h2 id="fallart-titel" className="text-xl font-semibold">
            Um welche Art von Vorhaben handelt es sich?{" "}
            <span className="text-base font-normal">(Pflichtangabe)</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Wählen Sie den Fall, der Ihrem Vorhaben am nächsten kommt.
          </p>
        </div>
        <div role="radiogroup" aria-label="Art des Vorhabens" className="grid gap-3 md:grid-cols-2">
          {FALLARTEN.map((fa) => {
            const aktiv = vorhaben.fallart === fa.id;
            return (
              <button
                key={fa.id}
                type="button"
                role="radio"
                aria-checked={aktiv}
                onClick={() => aendern({ fallart: fa.id as Fallart })}
                className={cn(
                  "rounded-md border p-4 text-left transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  aktiv
                    ? "border-primary bg-secondary"
                    : "border-border bg-card hover:bg-secondary/60",
                )}
              >
                <span className="block font-medium">{fa.titel}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{fa.beschreibung}</span>
              </button>
            );
          })}
        </div>
        {gewaehlt?.hinweis && (
          <p className="rounded-md border border-border bg-secondary p-3 text-sm">
            {gewaehlt.hinweis}
          </p>
        )}
      </section>

      <section aria-labelledby="angaben-titel" className="space-y-4">
        <h2 id="angaben-titel" className="text-xl font-semibold">
          Angaben zum Vorhaben
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Feld
            id="bezeichnung"
            beschriftung="Bezeichnung des Werkzeugs"
            pflicht
            wert={vorhaben.bezeichnung}
            aendern={(v) => aendern({ bezeichnung: v })}
          />
          <Feld
            id="anbieter"
            beschriftung="Anbieter"
            wert={vorhaben.anbieter}
            aendern={(v) => aendern({ anbieter: v })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kurzbeschreibung">Kurzbeschreibung des geplanten Einsatzes</Label>
          <Textarea
            id="kurzbeschreibung"
            rows={4}
            value={vorhaben.kurzbeschreibung}
            onChange={(e) => aendern({ kurzbeschreibung: e.target.value })}
          />
        </div>
        <section aria-labelledby="ausgangslage-titel" className="space-y-4">
          <div>
            <h3 id="ausgangslage-titel" className="text-lg font-semibold">
              {AUSGANGSLAGE_TITEL}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{AUSGANGSLAGE_EINLEITUNG}</p>
          </div>
          {AUSGANGSLAGE_FELDER.map((feld) =>
            feld.mehrzeilig ? (
              <div key={feld.schluessel} className="space-y-1.5">
                <Label htmlFor={feld.schluessel}>{feld.beschriftung}</Label>
                {"hinweis" in feld && (
                  <p id={`${feld.schluessel}-hinweis`} className="text-sm text-muted-foreground">
                    {feld.hinweis}
                  </p>
                )}
                <Textarea
                  id={feld.schluessel}
                  aria-describedby={"hinweis" in feld ? `${feld.schluessel}-hinweis` : undefined}
                  rows={3}
                  value={vorhaben[feld.schluessel]}
                  onChange={(e) => aendern({ [feld.schluessel]: e.target.value })}
                />
              </div>
            ) : (
              <Feld
                key={feld.schluessel}
                id={feld.schluessel}
                beschriftung={feld.beschriftung}
                wert={vorhaben[feld.schluessel]}
                {...("platzhalter" in feld ? { platzhalter: feld.platzhalter } : {})}
                aendern={(v) => aendern({ [feld.schluessel]: v })}
              />
            ),
          )}
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <Feld
            id="behoerde"
            beschriftung="Behörde und Organisationseinheit"
            wert={vorhaben.behoerde}
            aendern={(v) => aendern({ behoerde: v })}
          />
          <Feld
            id="verantwortlich"
            beschriftung="Verantwortliche Person"
            wert={vorhaben.verantwortlich}
            aendern={(v) => aendern({ verantwortlich: v })}
          />
          <Feld
            id="kontakt"
            beschriftung="Kontakt (Telefon oder E-Mail)"
            wert={vorhaben.kontakt}
            aendern={(v) => aendern({ kontakt: v })}
          />
          <Feld
            id="anzahl"
            beschriftung="Zahl der beteiligten Beschäftigten"
            typ="number"
            wert={vorhaben.anzahlBeschaeftigte}
            aendern={(v) => aendern({ anzahlBeschaeftigte: v })}
          />
          <div className="space-y-1.5">
            <Label htmlFor="von">Geplanter Beginn der Erprobung</Label>
            <Input
              id="von"
              type="date"
              value={vorhaben.zeitraumVon}
              aria-describedby="von-ende"
              onChange={(e) => aendern({ zeitraumVon: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="geltungsdauer">
              Geltungsdauer der Erprobung in Wochen
              <span className="ml-1 font-normal">(Pflichtfeld)</span>
            </Label>
            <Input
              id="geltungsdauer"
              type="number"
              inputMode="numeric"
              min={GELTUNGSDAUER_WOCHEN_MIN}
              max={GELTUNGSDAUER_WOCHEN_MAX}
              step={1}
              value={Number.isFinite(geltungsdauerWochen) ? geltungsdauerWochen : ""}
              required
              aria-required
              aria-describedby="geltungsdauer-hinweis von-ende"
              aria-invalid={fehler !== "" ? true : undefined}
              onChange={(e) => setzeGeltungsdauerWochen(Number(e.target.value))}
              className="max-w-32"
            />
            <p id="geltungsdauer-hinweis" className="text-xs text-muted-foreground">
              {GELTUNGSDAUER_HINWEIS}
            </p>
          </div>
          <p
            id="von-ende"
            aria-live="polite"
            className={cn("text-sm font-medium md:col-span-2", fehler && "text-destructive")}
          >
            {fehler ||
              `Erprobungszeitraum: ${geltungsdauerText(vorhaben.zeitraumVon, geltungsdauerWochen)}`}
          </p>

          <Feld
            id="aktenzeichen"
            beschriftung="Aktenzeichen"
            wert={vorhaben.aktenzeichen}
            aendern={(v) => aendern({ aktenzeichen: v })}
            hinweis="Optional"
          />
        </div>
      </section>
    </div>
  );
}
