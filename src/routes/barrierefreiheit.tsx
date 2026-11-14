// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { createFileRoute, Link } from "@tanstack/react-router";

const STAND = "12. September 2026";

export const Route = createFileRoute("/barrierefreiheit")({
  head: () => ({
    meta: [
      { title: "Erklärung zur Barrierefreiheit — Erprobungspass" },
      {
        name: "description",
        content:
          "Stand der Barrierefreiheit des Erprobungspasses, angestrebte Konformität nach BITV 2.0 und EN 301 549 Stufe AA sowie Hinweise zur Rückmeldung.",
      },
      {
        property: "og:title",
        content: "Erklärung zur Barrierefreiheit — Erprobungspass",
      },
      {
        property: "og:description",
        content: "Angestrebte Konformitätsstufe AA und Wege der Rückmeldung.",
      },
    ],
  }),
  component: Barrierefreiheit,
});

function Barrierefreiheit() {
  return (
    <main id="hauptinhalt" className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm">
        <Link to="/" className="underline">
          Zurück zur Startseite
        </Link>
      </p>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Erklärung zur Barrierefreiheit</h1>
      <p className="mt-2 text-sm text-muted-foreground">Stand: {STAND}</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Angestrebte Konformität</h2>
        <p>
          Die Betreiberin ist bestrebt, diese Anwendung barrierefrei anzubieten. Maßgeblich sind die
          Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und die harmonisierte europäische
          Norm EN 301 549. Angestrebt wird die Konformitätsstufe AA.
        </p>
        <p>
          Nach eigener Prüfung ist die Anwendung weitgehend konform: Die Anforderungen der Stufe AA
          werden erfüllt, einzelne Abweichungen können nicht ausgeschlossen werden.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Umgesetzte Maßnahmen</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Die Anwendung ist vollständig mit der Tastatur in sinnvoller Reihenfolge bedienbar; der
            Fokus ist jederzeit sichtbar.
          </li>
          <li>Jedes Eingabefeld ist mit einer Beschriftung verknüpft.</li>
          <li>
            Fehlermeldungen stehen als Text neben dem betroffenen Feld und werden unmittelbar
            angekündigt.
          </li>
          <li>
            Text erreicht ein Kontrastverhältnis von mindestens 4,5 zu 1, Bedienelemente mindestens
            3 zu 1.
          </li>
          <li>
            Keine Information wird allein über Farbe vermittelt; die Ampel trägt stets das Wort Rot,
            Gelb oder Grün und eine eigene Rahmenform.
          </li>
          <li>
            Die Überschriften folgen einer Hierarchie von der ersten bis zur dritten Ebene; jeder
            Schritt hat einen sprechenden Seitentitel.
          </li>
          <li>Ein Sprunglink führt an den Anfang des Hauptinhalts.</li>
          <li>
            Die Sprache des Dokuments ist als Deutsch ausgezeichnet; die Fortschrittsanzeige gibt
            den aktuellen Schritt bekannt.
          </li>
          <li>
            Schaltflächen tragen beschreibenden Text; die Anwendung bleibt bis zu einer Vergrößerung
            von 200 Prozent ohne Verlust von Inhalten bedienbar.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Rückmeldung</h2>
        <p>
          Sind Ihnen Barrieren aufgefallen, oder benötigen Sie Inhalte in einer anderen Form? Wenden
          Sie sich an die Betreiberin, die IEI Immersive Education Ideations UG
          (haftungsbeschränkt). Die Rückmeldung wird geprüft, und Sie erhalten eine Antwort zum
          weiteren Vorgehen.
        </p>
        <p className="text-sm text-muted-foreground">
          Bitte beschreiben Sie die betroffene Seite, das verwendete Hilfsmittel und die
          aufgetretene Barriere möglichst genau.
        </p>
      </section>
    </main>
  );
}
