// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { REGELWERK_VERSION } from "@/data/regelwerk";
import { BEISPIEL_HINWEIS, HAFTUNGSHINWEIS } from "@/data/vorlagen";
import { datumDeutsch } from "@/lib/erprobung/speicher";
import type { Erprobungsdaten } from "@/lib/erprobung/typen";

/**
 * Gemeinsamer Kopf der drei Dokumente. Die Felder stammen aus dem gemeinsamen
 * Aufbau; leere Angaben sind dort bereits entfallen.
 */
export function DokumentKopf({
  titel,
  felder,
  beispiel,
}: {
  titel: string;
  felder: { begriff: string; wert: string }[];
  beispiel: boolean;
}) {
  return (
    <header className="dokument-kopf space-y-3 border-b-2 border-marke-magenta pb-4">
      <h1 className="text-2xl font-semibold">{titel}</h1>
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {felder.map((f) => (
          <div key={f.begriff}>
            <dt className="text-xs uppercase text-muted-foreground">{f.begriff}</dt>
            <dd>{f.wert}</dd>
          </div>
        ))}
      </dl>
      {beispiel && (
        <p className="rounded-md border border-border bg-secondary p-2 text-sm">
          {BEISPIEL_HINWEIS}
        </p>
      )}
    </header>
  );
}

/** Gemeinsame Fußzeile mit Regelstand, Datum und Vorgangskennung. */
export function DokumentFuss({ daten }: { daten: Erprobungsdaten }) {
  return (
    <footer className="dokument-fuss space-y-1 border-t border-marke-magenta pt-4 text-xs text-muted-foreground">
      <p>{HAFTUNGSHINWEIS}</p>
      <p>
        Regelwerksversion {daten.version || REGELWERK_VERSION} · Erstellt am{" "}
        {datumDeutsch(new Date().toISOString())} · Vorgang {daten.vorgangKennung}
      </p>
    </footer>
  );
}

/** Kästchen zum Abhaken auf Papier; auch im Schwarzweißdruck sichtbar. */
export function Kaestchen() {
  return (
    <span
      aria-hidden="true"
      className="kaestchen mt-1 inline-block size-4 shrink-0 border-2 border-foreground"
    />
  );
}

/** Linie zum handschriftlichen Eintragen, etwa in leeren Tabellenfeldern. */
export function Linie() {
  return <span aria-hidden="true" className="mt-3 block min-w-16 border-b border-foreground" />;
}

/** Beschriftete Schreiblinien für handschriftliche Einträge. */
export function Schreibfeld({ zeilen = 2 }: { zeilen?: number }) {
  return (
    <div className="space-y-6 pt-2">
      {Array.from({ length: zeilen }).map((_, i) => (
        <div key={i} className="border-b border-foreground" />
      ))}
    </div>
  );
}
