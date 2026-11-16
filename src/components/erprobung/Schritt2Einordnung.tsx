// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  LANDESVORGABEN_FEHLEN,
  VORPRUEFSTAENDE,
  VORPRUEFUNG_KENNZEICHNUNG,
  VORPRUEFUNG_TITEL,
  landesvorgaben,
  vorpruefSchluessel,
} from "@/data/landesvorgaben";
import {
  AMPEL_TEXTE,
  EINORDNUNG_OFFEN_LISTE,
  EINORDNUNG_OFFEN_TITEL,
  KEINE_ERHOEHTE_ANFORDERUNG,
  UNKLAR_HINWEIS,
  NEU_DURCH_ANTWORT,
  OFFEN_SPRUNG_HINWEIS,
  einordnungOffenText,
  folgefrageText,
  fragenAenderungHinweis,
  zeitanzeige,
} from "@/data/vorlagen";
import {
  FRAGEN,
  PRUEFABSCHNITTE,
  UNKLAR,
  UNKLAR_TEXT,
  abschnittUeberschrift,
  pruefabschnittVonFrage,
  type Frage,
} from "@/data/regelwerk";
import { einordnen, offeneFragen, sichtbareFragen } from "@/lib/erprobung/bewertung";
import { fundstelleText } from "@/lib/erprobung/fundstelle";
import { geltungshinweis, giltSchon } from "@/lib/erprobung/geltung";
import type { Antworten, Einrichtungsprofil, Vorhaben } from "@/lib/erprobung/typen";
import { cn } from "@/lib/utils";

interface Props {
  vorhaben: Vorhaben;
  antworten: Antworten;
  profil: Einrichtungsprofil | null;
  aendern: (id: string, wert: string | string[]) => void;
}

const BEREICHSTITEL: Record<string, string> = {
  ki: "Fragen zur KI-Verordnung",
  update: "Fragen zur neuen Funktion aus dem Update",
  datenschutz: "Fragen zum Datenschutz",
  betrieb: "Fragen zum Betrieb",
};

function Beispiel({ text, id }: { text: string; id: string }) {
  return (
    <details className="text-sm">
      <summary className="cursor-pointer font-medium underline-offset-4 hover:underline">
        Beispiel
      </summary>
      <p id={id} className="mt-1 text-muted-foreground">
        {text}
      </p>
    </details>
  );
}

/** Zusatz für Regeln, die erst zu einem künftigen Datum greifen; eigene Zeile. */
function Geltung({ datum }: { datum: string }) {
  return <span className="mt-1 block text-xs text-muted-foreground">{geltungshinweis(datum)}</span>;
}

function JaNein({
  frage,
  wert,
  aendern,
}: {
  frage: Frage;
  wert: string;
  aendern: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {[
        { id: "ja", text: "Ja" },
        { id: "nein", text: "Nein" },
        { id: UNKLAR, text: UNKLAR_TEXT },
      ].map((o) => (
        <label
          key={o.id}
          className="flex items-center gap-2 text-sm"
          htmlFor={`${frage.id}-${o.id}`}
        >
          <input
            type="radio"
            id={`${frage.id}-${o.id}`}
            name={frage.id}
            value={o.id}
            checked={wert === o.id}
            onChange={() => aendern(o.id)}
            className="size-4 accent-[var(--primary)]"
          />
          {o.text}
        </label>
      ))}
    </div>
  );
}

function Mehrfach({
  frage,
  werte,
  aendern,
}: {
  frage: Frage;
  werte: string[];
  aendern: (v: string[]) => void;
}) {
  const umschalten = (optionId: string, keinesDavon?: boolean) => {
    if (keinesDavon) {
      aendern(werte.includes(optionId) ? [] : [optionId]);
      return;
    }
    // Ausschließende Optionen wie „keines davon“ und „noch unklar“ entfallen.
    const ausschliessend = (frage.optionen ?? []).filter((o) => o.keinesDavon).map((o) => o.id);
    const ohneKeines = werte.filter((w) => !ausschliessend.includes(w));
    aendern(
      ohneKeines.includes(optionId)
        ? ohneKeines.filter((w) => w !== optionId)
        : [...ohneKeines, optionId],
    );
  };

  return (
    <div className="space-y-2">
      {frage.optionen?.map((o) => (
        <div key={o.id} className="flex items-start gap-2">
          <Checkbox
            id={`${frage.id}-${o.id}`}
            checked={werte.includes(o.id)}
            onCheckedChange={() => umschalten(o.id, o.keinesDavon)}
          />
          <div className="space-y-1">
            <Label htmlFor={`${frage.id}-${o.id}`} className="block text-sm font-normal">
              {o.text}
              {o.geltungAb && !giltSchon(o.geltungAb) && <Geltung datum={o.geltungAb} />}
            </Label>
            {o.beispiel && <Beispiel text={o.beispiel} id={`${frage.id}-${o.id}-beispiel`} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function Einfach({
  frage,
  wert,
  aendern,
}: {
  frage: Frage;
  wert: string;
  aendern: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {frage.optionen?.map((o) => (
        <label
          key={o.id}
          htmlFor={`${frage.id}-${o.id}`}
          className="flex items-start gap-2 text-sm"
        >
          <input
            type="radio"
            id={`${frage.id}-${o.id}`}
            name={frage.id}
            checked={wert === o.id}
            onChange={() => aendern(o.id)}
            className="mt-0.5 size-4 accent-[var(--primary)]"
          />
          {o.text}
        </label>
      ))}
    </div>
  );
}

/**
 * Freitextfeld ohne zweite sichtbare Beschriftung: das Feld ist über
 * aria-labelledby mit der Frage verknüpft.
 */
function Freitext({
  frage,
  wert,
  aendern,
}: {
  frage: Frage;
  wert: string;
  aendern: (v: string) => void;
}) {
  return (
    <Textarea
      id={`${frage.id}-eingabe`}
      aria-labelledby={`${frage.id}-frage`}
      rows={2}
      value={wert}
      onChange={(e) => aendern(e.target.value)}
    />
  );
}

/** Betrag in Euro mit der Möglichkeit „noch unklar“. */
function Betrag({
  frage,
  wert,
  aendern,
}: {
  frage: Frage;
  wert: string;
  aendern: (v: string) => void;
}) {
  const unklar = wert === UNKLAR;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Input
          id={`${frage.id}-eingabe`}
          aria-labelledby={`${frage.id}-frage ${frage.id}-einheit`}
          inputMode="decimal"
          disabled={unklar}
          value={unklar ? "" : wert}
          onChange={(e) => aendern(e.target.value)}
          className="max-w-40"
        />
        <span id={`${frage.id}-einheit`} className="text-sm">
          Euro
        </span>
      </div>
      <label htmlFor={`${frage.id}-unklar`} className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id={`${frage.id}-unklar`}
          checked={unklar}
          onChange={(e) => aendern(e.target.checked ? UNKLAR : "")}
          className="size-4 accent-[var(--primary)]"
        />
        {UNKLAR_TEXT}
      </label>
    </div>
  );
}

/** Stand der technischen Landesvorgaben für die Vorprüfung des ISB. */
function Vorpruefung({
  antworten,
  profil,
  aendern,
}: {
  antworten: Antworten;
  profil: Einrichtungsprofil | null;
  aendern: (id: string, wert: string) => void;
}) {
  const vorgaben = landesvorgaben(profil?.bundesland);
  return (
    <section
      aria-labelledby="vorpruefung-titel"
      className="space-y-3 rounded-md border border-border p-4"
    >
      <h4 id="vorpruefung-titel" className="font-semibold">
        {VORPRUEFUNG_TITEL}
      </h4>
      <p className="text-sm">{VORPRUEFUNG_KENNZEICHNUNG}</p>
      {vorgaben.length === 0 ? (
        <p role="status" className="text-sm">
          {LANDESVORGABEN_FEHLEN}
          {profil?.bundesland
            ? ` für ${profil.bundesland}.`
            : ". Hinterlegen Sie das Bundesland im Einrichtungsprofil."}
        </p>
      ) : (
        <ul className="space-y-4">
          {vorgaben.map((v) => {
            const schluessel = vorpruefSchluessel(v.id);
            return (
              <li key={v.id}>
                <fieldset className="space-y-1">
                  <legend className="font-medium">{v.titel}</legend>
                  <p className="text-sm text-muted-foreground">{v.beschreibung}</p>
                  <p className="text-xs text-muted-foreground">Fundstelle: {v.fundstelle}</p>
                  <div className="flex flex-wrap gap-4 pt-1">
                    {VORPRUEFSTAENDE.map((st) => (
                      <label
                        key={st.id}
                        htmlFor={`${schluessel}-${st.id}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          id={`${schluessel}-${st.id}`}
                          name={schluessel}
                          checked={antworten[schluessel] === st.id}
                          onChange={() => aendern(schluessel, st.id)}
                          className="size-4 accent-[var(--primary)]"
                        />
                        {st.text}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function AmpelAnzeige({
  ampel,
  ausloeser,
  hinweise,
  umgestaltung,
}: {
  ampel: "rot" | "gelb" | "gruen";
  ausloeser: { antwort: string; begruendung: string; fundstelle: string }[];
  hinweise: { antwort: string; begruendung: string; fundstelle: string }[];
  umgestaltung: string[];
}) {
  const text = AMPEL_TEXTE[ampel];
  return (
    <section aria-labelledby="ampel-titel" className="space-y-4">
      <div
        className={cn(
          "p-4",
          ampel === "rot" && "ampel-rot",
          ampel === "gelb" && "ampel-gelb",
          ampel === "gruen" && "ampel-gruen",
        )}
      >
        <h3 id="ampel-titel" className="text-base font-semibold">
          Einordnung: {text.wort}
        </h3>
        <p className="mt-1 text-sm text-foreground">{text.satz}</p>
        <p className="mt-1 text-sm text-foreground">{text.vorgehen}</p>
      </div>

      {ausloeser.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold">Auslösende Antworten</h4>
          <ul className="mt-2 space-y-2">
            {ausloeser.map((a, i) => (
              <li key={i} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{a.antwort}</p>
                <p className="mt-1 text-muted-foreground">{a.begruendung}</p>
                <p className="mt-1 text-xs text-muted-foreground">Fundstelle: {a.fundstelle}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ausloeser.length === 0 && (
        <p className="text-sm text-muted-foreground">{KEINE_ERHOEHTE_ANFORDERUNG}</p>
      )}

      {hinweise.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold">Weitere Pflichten und Hinweise</h4>
          <ul className="mt-2 space-y-2">
            {hinweise.map((h, i) => (
              <li key={i} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{h.antwort}</p>
                <p className="mt-1 text-muted-foreground">{h.begruendung}</p>
                <p className="mt-1 text-xs text-muted-foreground">Fundstelle: {h.fundstelle}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {umgestaltung.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold">Vorschlag zur Umgestaltung</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {umgestaltung.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Neutraler Zustand: solange Pflichtfragen offen sind, erscheint keine Ampel. */
export function EinordnungOffen({
  offen,
  springen,
}: {
  offen: { id: string; text: string; abschnitt?: string | undefined }[];
  springen?: (frageId: string) => void;
}) {
  // Nach Abschnitten gruppieren, damit man sieht, wo die Frage steht.
  const gruppen: { titel: string; fragen: { id: string; text: string }[] }[] = [];
  for (const f of offen) {
    const titel = f.abschnitt ?? "";
    let g = gruppen.find((x) => x.titel === titel);
    if (!g) {
      g = { titel, fragen: [] };
      gruppen.push(g);
    }
    g.fragen.push(f);
  }
  return (
    <section
      aria-labelledby="einordnung-offen-titel"
      className="rounded-md border border-border bg-secondary p-4"
    >
      <h3 id="einordnung-offen-titel" className="text-base font-semibold">
        {EINORDNUNG_OFFEN_TITEL}
      </h3>
      <p className="mt-1 text-sm">{einordnungOffenText(offen.length)}</p>
      <h4 className="mt-3 text-sm font-semibold">{EINORDNUNG_OFFEN_LISTE}</h4>
      {springen && <p className="mt-1 text-sm text-muted-foreground">{OFFEN_SPRUNG_HINWEIS}</p>}
      {gruppen.map((g) => (
        <div key={g.titel || "ohne"} className="mt-2">
          {g.titel && <p className="text-sm font-medium">{g.titel}</p>}
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {g.fragen.map((f) => (
              <li key={f.id}>
                <a
                  href={`#frage-${f.id}`}
                  onClick={(e) => {
                    if (!springen) return;
                    e.preventDefault();
                    springen(f.id);
                  }}
                  className="underline underline-offset-4"
                >
                  {f.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** Eine Frage mit Erläuterung, Beispiel, Fundstelle und Eingabe. */
function Fragefeld({
  frage,
  antworten,
  profil,
  aendern,
  aenderungHinweis,
  neu,
  ziel,
}: {
  frage: Frage;
  antworten: Antworten;
  profil: Einrichtungsprofil | null;
  aendern: (id: string, wert: string | string[]) => void;
  aenderungHinweis: string | null;
  neu: boolean;
  ziel: boolean;
}) {
  const wert = antworten[frage.id];
  const kuenftig = frage.geltungAb !== undefined && !giltSchon(frage.geltungAb);
  const elternfrage = frage.nurWenn ? FRAGEN.find((f) => f.id === frage.nurWenn?.frageId) : null;
  return (
    <div
      id={`frage-${frage.id}`}
      className={cn(
        "scroll-mt-4 space-y-2 rounded-md transition-colors",
        elternfrage && "ml-4 border-l-2 border-border pl-4",
        neu && "border-l-4 border-primary bg-secondary/60 p-3 pl-4",
        ziel && "ring-2 ring-primary ring-offset-2",
      )}
    >
      {neu && (
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {NEU_DURCH_ANTWORT}
        </p>
      )}
      {elternfrage && (
        <p className="text-xs text-muted-foreground">{folgefrageText(elternfrage.text)}</p>
      )}
      {frage.einleitung && (
        <p className="rounded-md border border-border bg-secondary p-3 text-sm">
          {frage.einleitung}
        </p>
      )}
      <fieldset className="space-y-2">
        <legend id={`${frage.id}-frage`} className="font-medium">
          {frage.text}
          {kuenftig && frage.geltungAb && <Geltung datum={frage.geltungAb} />}
        </legend>
        <p className="text-sm text-muted-foreground">{frage.erlaeuterung}</p>
        <Beispiel text={frage.beispiel} id={`${frage.id}-beispiel`} />
        <p className="text-xs text-muted-foreground">
          Fundstelle: {fundstelleText(frage.fundstelle, profil)}
        </p>

        <div className="pt-1">
          {frage.typ === "ja_nein" && (
            <JaNein
              frage={frage}
              wert={typeof wert === "string" ? wert : ""}
              aendern={(v) => aendern(frage.id, v)}
            />
          )}
          {frage.typ === "mehrfach" && (
            <Mehrfach
              frage={frage}
              werte={Array.isArray(wert) ? wert : []}
              aendern={(v) => aendern(frage.id, v)}
            />
          )}
          {frage.typ === "einfach" && (
            <Einfach
              frage={frage}
              wert={typeof wert === "string" ? wert : ""}
              aendern={(v) => aendern(frage.id, v)}
            />
          )}
          {frage.typ === "betrag" && (
            <Betrag
              frage={frage}
              wert={typeof wert === "string" ? wert : ""}
              aendern={(v) => aendern(frage.id, v)}
            />
          )}
          {frage.typ === "freitext" && (
            <Freitext
              frage={frage}
              wert={typeof wert === "string" ? wert : ""}
              aendern={(v) => aendern(frage.id, v)}
            />
          )}
        </div>
      </fieldset>
      {aenderungHinweis && (
        <p role="status" className="text-sm font-medium">
          {aenderungHinweis}
        </p>
      )}
    </div>
  );
}

export function Schritt2Einordnung({ vorhaben, antworten, profil, aendern }: Props) {
  const fragen = sichtbareFragen(vorhaben.fallart, antworten);
  const offen = offeneFragen(vorhaben.fallart, antworten);
  const ergebnis = einordnen(vorhaben.fallart, antworten, profil);

  // Abschnitte des Prüfpfads; leere Abschnitte, etwa die Ausnahmen, entfallen.
  const abschnitte = PRUEFABSCHNITTE.map((a) => ({
    ...a,
    fragen: fragen.filter((f) => pruefabschnittVonFrage(f) === a.id),
  })).filter((a) => a.fragen.length > 0);

  const [gewaehlt, setGewaehlt] = useState(0);
  const [hoechster, setHoechster] = useState(0);
  const [aenderung, setAenderung] = useState<{
    frageId: string;
    neu: string[];
    hinweis: string;
  } | null>(null);
  const [ziel, setZiel] = useState<string | null>(null);

  const index = Math.min(gewaehlt, Math.max(abschnitte.length - 1, 0));
  const aktuell = abschnitte[index];

  const wechseln = (ziel: number) => {
    setGewaehlt(ziel);
    setHoechster((h) => Math.max(h, ziel));
  };

  /**
   * Antwort setzen und dabei erkennen, ob durch sie zusätzliche Fragen
   * erscheinen. Der Hinweis verschwindet, sobald die nächste Frage beantwortet
   * wird.
   */
  const antwortSetzen = (id: string, wert: string | string[]) => {
    const vorher = sichtbareFragen(vorhaben.fallart, antworten);
    const nachher = sichtbareFragen(vorhaben.fallart, { ...antworten, [id]: wert });
    const vorherIds = vorher.map((f) => f.id);
    const nachherIds = nachher.map((f) => f.id);
    const neu = nachher.filter((f) => !vorherIds.includes(f.id));
    const entfallen = vorher.filter((f) => !nachherIds.includes(f.id)).length;
    const eigene = FRAGEN.find((f) => f.id === id);
    const eigenerAbschnitt = eigene ? pruefabschnittVonFrage(eigene) : null;
    const andere = [
      ...new Set(
        neu
          .map((f) => pruefabschnittVonFrage(f))
          .filter((a) => a !== eigenerAbschnitt)
          .map((a) => PRUEFABSCHNITTE.find((p) => p.id === a)?.titel ?? ""),
      ),
    ].filter(Boolean);
    const imAbschnitt = neu.filter((f) => pruefabschnittVonFrage(f) === eigenerAbschnitt).length;
    setAenderung(
      neu.length > 0 || entfallen > 0
        ? {
            frageId: id,
            neu: neu.map((f) => f.id),
            hinweis: fragenAenderungHinweis(imAbschnitt, entfallen, andere),
          }
        : null,
    );
    setZiel(null);
    aendern(id, wert);
  };

  /** Öffnet den Abschnitt einer offenen Frage und springt zu ihr. */
  const springen = (frageId: string) => {
    const ziel = abschnitte.findIndex((a) => a.fragen.some((f) => f.id === frageId));
    if (ziel < 0) return;
    wechseln(ziel);
    setZiel(frageId);
  };

  useEffect(() => {
    if (!ziel) return;
    const el = document.getElementById(`frage-${ziel}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector<HTMLElement>("input, textarea, select")?.focus({ preventScroll: true });
    const t = window.setTimeout(() => setZiel(null), 4000);
    return () => window.clearTimeout(t);
  }, [ziel, index]);

  const beantwortet = fragen.length - offen.length;
  const nummer = Math.min(Math.max(beantwortet + 1, 1), Math.max(fragen.length, 1));

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold">Einordnung nach dem Regelwerk</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Beantworten Sie die Fragen nach bestem Wissen. Zu jeder Frage finden Sie eine Erläuterung
          und die Fundstelle.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{UNKLAR_HINWEIS}</p>
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {zeitanzeige(nummer, fragen.length, offen.length)}
      </p>

      {aktuell && (
        <>
          <nav aria-label="Abschnitte des Prüfpfads" className="flex flex-wrap gap-2">
            {abschnitte.map((a, i) => (
              <button
                key={a.id}
                type="button"
                disabled={i > hoechster}
                aria-current={i === index ? "step" : undefined}
                onClick={() => wechseln(i)}
                className={cn(
                  "min-h-11 rounded-md border px-3 py-2 text-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  i === index
                    ? "border-primary bg-secondary font-medium"
                    : "border-border bg-card hover:bg-secondary/60",
                  i > hoechster && "opacity-50",
                )}
              >
                {i + 1}. {a.titel}
              </button>
            ))}
          </nav>

          <section aria-labelledby="abschnitt-titel" className="space-y-6">
            <h3
              id="abschnitt-titel"
              className="border-b border-border pb-2 text-lg font-semibold"
              tabIndex={-1}
            >
              {abschnittUeberschrift(index + 1, abschnitte.length, aktuell.titel)}
            </h3>
            {aktuell.fragen.map((frage) => (
              <Fragefeld
                key={frage.id}
                frage={frage}
                antworten={antworten}
                profil={profil}
                aendern={antwortSetzen}
                aenderungHinweis={aenderung?.frageId === frage.id ? aenderung.hinweis : null}
                neu={aenderung?.neu.includes(frage.id) ?? false}
                ziel={ziel === frage.id}
              />
            ))}
            {aktuell.id === "it_sicherheit" && (
              <Vorpruefung antworten={antworten} profil={profil} aendern={aendern} />
            )}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={index === 0}
              onClick={() => wechseln(index - 1)}
            >
              Zurück zum vorigen Abschnitt
            </Button>
            {index < abschnitte.length - 1 && (
              <Button type="button" onClick={() => wechseln(index + 1)}>
                Weiter zum nächsten Abschnitt
              </Button>
            )}
          </div>
        </>
      )}

      <div className="border-t border-border pt-6">
        {offen.length > 0 ? (
          <EinordnungOffen
            offen={offen.map((f) => ({
              id: f.id,
              text: f.text,
              abschnitt: PRUEFABSCHNITTE.find((p) => p.id === pruefabschnittVonFrage(f))?.titel,
            }))}
            springen={springen}
          />
        ) : (
          <AmpelAnzeige
            ampel={ergebnis.ampel}
            ausloeser={ergebnis.ausloeser}
            hinweise={ergebnis.hinweise}
            umgestaltung={ergebnis.umgestaltung}
          />
        )}
      </div>
    </div>
  );
}
