// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

/**
 * Druckansicht eines Dokuments. Der Inhalt stammt aus dem gemeinsamen Aufbau
 * in `src/lib/erprobung/dokumentaufbau.ts`, damit Druckansicht und
 * Markdown-Ausgabe denselben Inhalt zeigen.
 */

import { geltungshinweis } from "@/lib/erprobung/geltung";
import type { Abschnitt, Block, Dokument } from "@/lib/erprobung/dokumentaufbau";
import type { Erprobungsdaten } from "@/lib/erprobung/typen";
import { cn } from "@/lib/utils";
import { DokumentFuss, DokumentKopf, Kaestchen, Linie, Schreibfeld } from "./DokumentRahmen";

function Bloecke({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Baustein key={i} block={block} />
      ))}
    </>
  );
}

function Baustein({ block }: { block: Block }) {
  switch (block.art) {
    case "absatz":
      return (
        <p
          className={cn(
            block.klein && "text-sm",
            block.vorformatiert && "whitespace-pre-wrap",
            "not-first:mt-2",
          )}
        >
          {block.text}
        </p>
      );

    case "ampel":
      return (
        <p
          className={cn(
            "p-3",
            block.ampel === "rot" && "ampel-rot",
            block.ampel === "gelb" && "ampel-gelb",
            block.ampel === "gruen" && "ampel-gruen",
          )}
        >
          <span className="font-semibold text-foreground">Ergebnis: {block.wort}.</span>{" "}
          <span className="text-foreground">{block.text}</span>
        </p>
      );

    case "hinweise":
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {block.punkte.map((h, i) => (
            <li key={i}>
              {h.text}{" "}
              {h.fundstelle && <span className="text-muted-foreground">({h.fundstelle})</span>}
              {h.geltungAb && (
                <span className="block text-xs text-muted-foreground">
                  {geltungshinweis(h.geltungAb)}
                </span>
              )}
            </li>
          ))}
        </ul>
      );

    case "liste":
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {block.punkte.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      );

    case "nummern":
      return (
        <ol className="list-decimal space-y-1 pl-5">
          {block.punkte.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
      );

    case "kaestchen":
      return (
        <ul className="space-y-2">
          {block.punkte.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <Kaestchen />
              <span>
                <span className={cn("block", p.zusatz && "font-medium")}>{p.text}</span>
                {p.zusatz?.map((z, j) => (
                  <span key={j} className={cn("block text-sm", j > 0 && "text-muted-foreground")}>
                    {z}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      );

    case "tabelle":
      return (
        <table className="w-full border-collapse text-sm">
          {block.beschriftung && (
            <caption className="text-left text-sm font-medium">{block.beschriftung}</caption>
          )}
          <thead>
            <tr>
              {block.spalten.map((s) => (
                <th key={s} scope="col" className="border border-border p-2 text-left">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.zeilen.map((zeile, i) => (
              <tr key={i}>
                {zeile.map((zelle, j) => (
                  <td key={j} className="h-12 border border-border p-2 align-top">
                    {zelle.text ? zelle.text : <Linie />}
                    {zelle.zusatz && (
                      <span className="block text-xs text-muted-foreground">{zelle.zusatz}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "leertabelle":
      return (
        <table className="protokoll-tabelle w-full border-collapse text-sm">
          <thead>
            <tr>
              {block.spalten.map((s) => (
                <th key={s} scope="col" className="border border-border p-2 text-left">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: block.zeilen }).map((_, zeile) => (
              <tr key={zeile}>
                {block.spalten.map((s) => (
                  <td key={s} className="h-9 border border-border p-2" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "schreibfeld":
      return <Schreibfeld zeilen={block.zeilen} />;

    case "unterschrift":
      return (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {block.felder.map((f) => (
            <div key={f} className="border-t border-foreground pt-1 text-sm">
              {f}
            </div>
          ))}
        </div>
      );

    case "unterabschnitt":
      return (
        <div className="space-y-1">
          <h3 className="font-medium">{block.titel}</h3>
          <Bloecke blocks={block.blocks} />
        </div>
      );
  }
}

function AbschnittAnsicht({ abschnitt }: { abschnitt: Abschnitt }) {
  return (
    <section className={cn("space-y-3 break-inside-avoid", abschnitt.klasse)}>
      {abschnitt.titel && <h2 className="text-lg font-semibold">{abschnitt.titel}</h2>}
      <Bloecke blocks={abschnitt.blocks} />
    </section>
  );
}

export function DokumentAnsicht({
  dokument,
  daten,
}: {
  dokument: Dokument;
  daten: Erprobungsdaten;
}) {
  return (
    <article className="dokument mx-auto max-w-[210mm] space-y-6 rounded-md border border-border bg-card p-8 text-[0.95rem] leading-relaxed">
      <DokumentKopf titel={dokument.titel} felder={dokument.kopf} beispiel={daten.beispiel} />
      <Bloecke blocks={dokument.vorspann} />
      {dokument.abschnitte.map((a, i) => (
        <AbschnittAnsicht key={i} abschnitt={a} />
      ))}
      <DokumentFuss daten={daten} />
    </article>
  );
}
