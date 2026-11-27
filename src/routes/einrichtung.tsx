// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  GREMIENSCHWELLE_BEISPIEL,
  PROFILROLLEN,
  PROFIL_ERKLAERUNG,
  PROFIL_LEITSATZ,
  VERGABESCHWELLE_BEISPIEL,
  leeresProfil,
} from "@/data/einrichtung";
import {
  BUNDESLAENDER,
  EBENEN,
  EBENE_FRAGE,
  EBENE_HILFE,
  LAND_FRAGE,
  type Ebene,
} from "@/data/ebenen";
import { GELTUNGSDAUER_WOCHEN_MAX, GELTUNGSDAUER_WOCHEN_MIN } from "@/data/vorlagen";
import {
  profilExportieren,
  profilImportieren,
  profilLaden,
  profilSpeichern,
  profilVerwerfen,
} from "@/lib/erprobung/profil";
import { datumDeutsch } from "@/lib/erprobung/speicher";
import type { Einrichtungsprofil } from "@/lib/erprobung/typen";

export const Route = createFileRoute("/einrichtung")({
  head: () => ({
    meta: [
      { title: "Einrichtungsprofil — Erprobungspass" },
      {
        name: "description",
        content:
          "Hinterlegen Sie einmal je Einrichtung die zu beteiligenden Stellen und die Hausregeln zu Personalrat, Datenschutzfreigabe und Höchstdauer einer Erprobung.",
      },
      { property: "og:title", content: "Einrichtungsprofil — Erprobungspass" },
      {
        property: "og:description",
        content:
          "Das Profil gilt nach dem einmaligen Hinterlegen für alle Vorhaben der Einrichtung.",
      },
    ],
  }),
  component: Einrichtungsseite,
});

function Einrichtungsseite() {
  const [profil, setProfil] = useState<Einrichtungsprofil>(() => leeresProfil());
  const [meldung, setMeldung] = useState("");
  const [fehler, setFehler] = useState("");
  const dateiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const gespeichert = profilLaden();
    if (gespeichert) setProfil(gespeichert);
  }, []);

  const rolleAendern = (id: string, feld: "name" | "funktion" | "kontakt", wert: string) =>
    setProfil((p) => ({
      ...p,
      rollen: {
        ...p.rollen,
        [id]: { ...(p.rollen[id] ?? { name: "", funktion: "", kontakt: "" }), [feld]: wert },
      },
    }));

  return (
    <main id="hauptinhalt" className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm">
        <Link to="/" className="underline">
          Zurück zur Startseite
        </Link>
      </p>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Einrichtungsprofil</h1>
      <p className="mt-4 font-medium">{PROFIL_LEITSATZ}</p>
      <div className="mt-2 space-y-2 text-sm">
        {PROFIL_ERKLAERUNG.map((satz) => (
          <p key={satz}>{satz}</p>
        ))}
      </div>

      <section aria-labelledby="einrichtung-titel" className="mt-10 space-y-4">
        <h2 id="einrichtung-titel" className="text-xl font-semibold">
          Angaben zur Einrichtung
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="einrichtung-name">Name der Einrichtung</Label>
            <Input
              id="einrichtung-name"
              value={profil.name}
              onChange={(e) => setProfil((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="einrichtung-kuerzel">Kürzel</Label>
            <Input
              id="einrichtung-kuerzel"
              value={profil.kuerzel}
              onChange={(e) => setProfil((p) => ({ ...p, kuerzel: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="einrichtung-ebene">{EBENE_FRAGE}</Label>
            <select
              id="einrichtung-ebene"
              aria-describedby="einrichtung-ebene-hilfe"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              value={profil.ebene}
              onChange={(e) =>
                setProfil((p) => ({
                  ...p,
                  ebene: e.target.value as Ebene | "",
                  bundesland: e.target.value === "bund" ? "" : p.bundesland,
                }))
              }
            >
              <option value="">Bitte wählen</option>
              {EBENEN.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.bezeichnung}
                </option>
              ))}
            </select>
            <p id="einrichtung-ebene-hilfe" className="text-sm text-muted-foreground">
              {EBENE_HILFE}
            </p>
          </div>
          {profil.ebene !== "bund" && (
            <div className="space-y-1.5">
              <Label htmlFor="einrichtung-land">{LAND_FRAGE}</Label>
              <select
                id="einrichtung-land"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                value={profil.bundesland}
                onChange={(e) => setProfil((p) => ({ ...p, bundesland: e.target.value }))}
              >
                <option value="">Bitte wählen</option>
                {BUNDESLAENDER.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="rollen-titel" className="mt-10 space-y-4">
        <h2 id="rollen-titel" className="text-xl font-semibold">
          Zu beteiligende Stellen
        </h2>
        <ul className="space-y-4">
          {PROFILROLLEN.map((rolle) => {
            const angabe = profil.rollen[rolle.id] ?? {
              name: "",
              funktion: "",
              kontakt: "",
            };
            return (
              <li key={rolle.id} className="rounded-md border border-border p-4">
                <h3 id={`rolle-${rolle.id}-titel`} className="font-medium">
                  {rolle.bezeichnung}
                </h3>
                <div
                  role="group"
                  aria-labelledby={`rolle-${rolle.id}-titel`}
                  className="mt-3 grid gap-4 md:grid-cols-3"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor={`${rolle.id}-name`}>Name</Label>
                    <Input
                      id={`${rolle.id}-name`}
                      value={angabe.name}
                      onChange={(e) => rolleAendern(rolle.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${rolle.id}-funktion`}>Funktion</Label>
                    <Input
                      id={`${rolle.id}-funktion`}
                      value={angabe.funktion}
                      onChange={(e) => rolleAendern(rolle.id, "funktion", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${rolle.id}-kontakt`}>Kontakt</Label>
                    <Input
                      id={`${rolle.id}-kontakt`}
                      value={angabe.kontakt}
                      onChange={(e) => rolleAendern(rolle.id, "kontakt", e.target.value)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="regeln-titel" className="mt-10 space-y-5">
        <h2 id="regeln-titel" className="text-xl font-semibold">
          Festlegungen des Hauses
        </h2>

        <div className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
          <Label htmlFor="personalrat-immer" className="font-normal">
            Der Personalrat ist bei jedem Vorhaben zu beteiligen.
          </Label>
          <Switch
            id="personalrat-immer"
            checked={profil.personalratImmer}
            onCheckedChange={(v) => setProfil((p) => ({ ...p, personalratImmer: v }))}
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
          <Label htmlFor="freigabe-datenschutz" className="font-normal">
            Vor Beginn ist eine dokumentierte Stellungnahme der oder des Datenschutzbeauftragten
            erforderlich.
          </Label>
          <Switch
            id="freigabe-datenschutz"
            checked={profil.freigabeDatenschutzErforderlich}
            onCheckedChange={(v) =>
              setProfil((p) => ({ ...p, freigabeDatenschutzErforderlich: v }))
            }
          />
        </div>

        <div className="space-y-1.5 rounded-md border border-border p-4">
          <Label htmlFor="hoechstdauer">Höchstdauer einer Erprobung in Wochen</Label>
          <Input
            id="hoechstdauer"
            type="number"
            min={GELTUNGSDAUER_WOCHEN_MIN}
            max={GELTUNGSDAUER_WOCHEN_MAX}
            step={1}
            value={profil.hoechstdauerWochen}
            onChange={(e) =>
              setProfil((p) => ({ ...p, hoechstdauerWochen: Number(e.target.value) }))
            }
            className="max-w-32"
            aria-describedby="hoechstdauer-hinweis"
          />
          <p id="hoechstdauer-hinweis" className="text-xs text-muted-foreground">
            Zulässig sind {GELTUNGSDAUER_WOCHEN_MIN} bis {GELTUNGSDAUER_WOCHEN_MAX} Wochen.
          </p>
        </div>

        <div className="grid gap-4 rounded-md border border-border p-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gremienschwelle">Gremienschwelle in Euro (optional)</Label>
            <Input
              id="gremienschwelle"
              inputMode="decimal"
              placeholder={GREMIENSCHWELLE_BEISPIEL}
              aria-describedby="schwellen-hinweis"
              value={profil.gremienschwelle}
              onChange={(e) => setProfil((p) => ({ ...p, gremienschwelle: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vergabeschwelle">Vergabeschwelle in Euro (optional)</Label>
            <Input
              id="vergabeschwelle"
              inputMode="decimal"
              placeholder={VERGABESCHWELLE_BEISPIEL}
              aria-describedby="schwellen-hinweis"
              value={profil.vergabeschwelle}
              onChange={(e) => setProfil((p) => ({ ...p, vergabeschwelle: e.target.value }))}
            />
          </div>
          <p id="schwellen-hinweis" className="text-xs text-muted-foreground md:col-span-2">
            Ab der Gremienschwelle entscheidet ein Gremium über eine Überführung, ab der
            Vergabeschwelle wird ausgeschrieben. Ist keine Schwelle hinterlegt, erscheint statt der
            Stelle ein Hinweis.
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            profilSpeichern(profil);
            setFehler("");
            setMeldung("Das Einrichtungsprofil wurde in diesem Browser gespeichert.");
          }}
        >
          Profil speichern
        </Button>
        <Button variant="outline" onClick={() => profilExportieren(profil)}>
          Profil als Datei sichern
        </Button>
        <Button variant="outline" onClick={() => dateiRef.current?.click()}>
          Profil aus Datei laden
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            profilVerwerfen();
            setProfil(leeresProfil());
            setFehler("");
            setMeldung("Das Einrichtungsprofil wurde gelöscht.");
          }}
        >
          Profil löschen
        </Button>
        <input
          ref={dateiRef}
          type="file"
          tabIndex={-1}
          accept="application/json"
          className="sr-only"
          aria-label="JSON-Datei mit einem Einrichtungsprofil auswählen"
          onChange={async (e) => {
            const datei = e.target.files?.[0];
            if (!datei) return;
            try {
              const geladen = await profilImportieren(datei);
              setProfil(geladen);
              profilSpeichern(geladen);
              setFehler("");
              setMeldung("Das Einrichtungsprofil wurde geladen und gespeichert.");
            } catch {
              setMeldung("");
              setFehler("Die Datei enthält kein gültiges Einrichtungsprofil.");
            }
          }}
        />
      </div>

      <p aria-live="polite" className="mt-4 text-sm">
        {meldung}
      </p>
      {fehler && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {fehler}
        </p>
      )}

      {profil.gespeichertAm && (
        <p className="mt-6 text-xs text-muted-foreground">
          Zuletzt gespeichert am {datumDeutsch(profil.gespeichertAm)}
        </p>
      )}
    </main>
  );
}
