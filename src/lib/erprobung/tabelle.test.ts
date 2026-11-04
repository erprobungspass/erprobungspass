// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { describe, expect, test } from "vitest";
import { leereDaten } from "./speicher";
import { protokollArbeitsmappe, protokollAusArbeitsmappe } from "./tabelle";

describe("Abnahme 4 — Protokoll als XLSX und ODS speichern, einlesen, fortschreiben", () => {
  test.each(["xlsx", "ods"] as const)("%s", async (format) => {
    const daten = leereDaten();
    daten.rueckmeldungen = [1, 2, 3].map((n) => ({
      datum: `2026-11-0${n}`,
      rolle: `Rolle ${n}`,
      beobachtung: `Beobachtung ${n}\nzweite Zeile`,
      folge: `Folge ${n}`,
    }));
    const erste = await protokollAusArbeitsmappe(await protokollArbeitsmappe(daten, null, format));
    expect(erste.rueckmeldungen).toEqual(daten.rueckmeldungen);
    expect(erste.vorgangKennung).toBe(daten.vorgangKennung);
    daten.rueckmeldungen = [
      ...erste.rueckmeldungen,
      { datum: "2026-11-04", rolle: "IT", beobachtung: "Vierter Eintrag", folge: "keine" },
    ];
    const zweite = await protokollAusArbeitsmappe(await protokollArbeitsmappe(daten, null, format));
    expect(zweite.rueckmeldungen.length).toBe(4);
    expect(zweite.rueckmeldungen[3]?.beobachtung).toBe("Vierter Eintrag");
  });
});
