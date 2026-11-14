// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { cn } from "@/lib/utils";

export const SCHRITTE = [
  "Vorhaben erfassen",
  "Einordnung",
  "Beteiligungen",
  "Auflagen",
  "Dokumente",
];

interface Props {
  aktuell: number;
  hoechster: number;
  aufSchritt: (n: number) => void;
}

export function Fortschritt({ aktuell, hoechster, aufSchritt }: Props) {
  return (
    <nav aria-label="Fortschritt" className="no-print border-b border-border bg-card">
      <ol className="mx-auto flex max-w-5xl flex-wrap gap-x-2 gap-y-1 px-4 py-3 text-sm">
        {SCHRITTE.map((titel, i) => {
          const nummer = i + 1;
          const erreicht = nummer <= hoechster;
          const ist = nummer === aktuell;
          const erledigt = erreicht && !ist;
          return (
            <li key={titel} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!erreicht}
                aria-current={ist ? "step" : undefined}
                onClick={() => erreicht && aufSchritt(nummer)}
                className={cn(
                  "rounded-md border px-2 py-1 text-left transition-colors",
                  ist &&
                    "border-marke-magenta bg-marke-magenta font-semibold text-primary-foreground",
                  erledigt &&
                    "border-marke-tuerkis bg-marke-tuerkis text-foreground hover:opacity-90",
                  !erreicht && "cursor-not-allowed border-border bg-muted text-muted-foreground",
                )}
              >
                <span className="tabular-nums">{nummer}.</span> {titel}
                {erledigt && <span className="sr-only">, erledigt</span>}
              </button>
              {nummer < SCHRITTE.length && (
                <span aria-hidden="true" className="text-muted-foreground">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
