// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import {
  ausgeloesteStellen,
  beteiligungsBegruendung,
  beteiligungsHinweise,
  type Beteiligungsstatus,
} from "@/data/beteiligungen";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Beteiligung, Einrichtungsprofil, Signale } from "@/lib/erprobung/typen";

interface Props {
  signale: Signale;
  beteiligungen: Record<string, Beteiligung>;
  profil: Einrichtungsprofil | null;
  aendern: (id: string, teil: Partial<Beteiligung>) => void;
}

const STATUS: { id: Beteiligungsstatus; text: string }[] = [
  { id: "beteiligt", text: "beteiligt" },
  { id: "nicht_erforderlich", text: "nicht erforderlich" },
  { id: "offen", text: "offen" },
];

export function Schritt3Beteiligungen({ signale, beteiligungen, profil, aendern }: Props) {
  const stellen = ausgeloesteStellen(signale, profil);
  const hinweise = beteiligungsHinweise(signale, profil);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Beteiligungen im Haus</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diese Stellen ergeben sich aus Ihren Antworten. Tragen Sie Name und Kontakt ein und halten
          Sie den Stand der Beteiligung fest.
        </p>
        {profil && (
          <p className="mt-2 text-sm">
            Die Felder sind aus dem Einrichtungsprofil
            {profil.name ? ` der Einrichtung ${profil.name}` : ""} vorbelegt.
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {stellen.map((stelle) => {
          const eintrag = beteiligungen[stelle.id] ?? {
            status: "offen" as Beteiligungsstatus,
            name: "",
            kontakt: "",
          };
          return (
            <li key={stelle.id} className="rounded-md border border-border p-4">
              <h3 className="font-medium">{stelle.bezeichnung}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {beteiligungsBegruendung(stelle, signale, profil)}
              </p>
              {stelle.hinweis && (
                <p className="mt-1 text-sm text-muted-foreground">{stelle.hinweis}</p>
              )}
              {stelle.vorbedingung && (
                <p className="mt-2 rounded-md border border-border bg-secondary p-2 text-sm font-medium">
                  Vorbedingung: {stelle.vorbedingung}
                </p>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${stelle.id}-name`}>Name</Label>
                  <Input
                    id={`${stelle.id}-name`}
                    value={eintrag.name}
                    onChange={(e) => aendern(stelle.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${stelle.id}-kontakt`}>E-Mail oder Telefon</Label>
                  <Input
                    id={`${stelle.id}-kontakt`}
                    value={eintrag.kontakt}
                    onChange={(e) => aendern(stelle.id, { kontakt: e.target.value })}
                  />
                </div>
              </div>

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">Stand der Beteiligung</legend>
                <div className="mt-2 flex flex-wrap gap-4">
                  {STATUS.map((s) => (
                    <label
                      key={s.id}
                      htmlFor={`${stelle.id}-${s.id}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        id={`${stelle.id}-${s.id}`}
                        name={`${stelle.id}-status`}
                        checked={eintrag.status === s.id}
                        onChange={() => aendern(stelle.id, { status: s.id })}
                        className="size-4 accent-[var(--primary)]"
                      />
                      {s.text}
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ul>

      {hinweise.length > 0 && (
        <section aria-labelledby="beteiligung-hinweise" className="space-y-2">
          <h3 id="beteiligung-hinweise" className="font-medium">
            Hinweise zu Gremium und Vergabe
          </h3>
          {hinweise.map((h) => (
            <p key={h} className="rounded-md border border-border p-3 text-sm">
              {h}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
