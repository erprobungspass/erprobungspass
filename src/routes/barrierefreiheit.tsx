// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { createFileRoute, Link } from "@tanstack/react-router";

const STAND = "27. November 2026";

export const Route = createFileRoute("/barrierefreiheit")({
  head: () => ({
    meta: [
      { title: "Erklärung zur Barrierefreiheit — Erprobungspass" },
      {
        name: "description",
        content:
          "Stand der Barrierefreiheit des Erprobungspasses: teilweise barrierefrei nach BITV 2.0 und EN 301 549 Stufe AA, Prüfung vom November 2026, bekannte Einschränkungen und Rückmeldung.",
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
        <h2 className="text-xl font-semibold">Stand der Vereinbarkeit</h2>
        <p>
          Die Betreiberin ist bestrebt, diese Anwendung barrierefrei anzubieten. Maßgeblich sind die
          Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und die harmonisierte europäische
          Norm EN 301 549. Angestrebt wird die Konformitätsstufe AA.
        </p>
        <p>
          Diese Anwendung ist teilweise barrierefrei. Grundlage ist eine Prüfung durch die Die
          Medialen GmbH vom 9. und 10. November 2026 nach dem BITV-Test und WCAG 2.2, Stufe AA.
          Geprüft wurde eine Prüffassung der Anwendung mit Startseite, Vorhaben, Einrichtungsprofil
          und dieser Erklärung.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Seit der Prüfung behoben</h2>
        <p>
          Die folgenden Befunde sind behoben. Die Betreiberin hat die Umsetzung selbst nachgeprüft;
          eine erneute Prüfung durch eine Prüfstelle steht noch aus.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Schaltflächen, Eingabefelder, Umschalter und die Schrittanzeige haben ausreichende
            Kontraste.
          </li>
          <li>Der Fokusrahmen ist dunkel und auf allen Hintergründen deutlich sichtbar.</li>
          <li>
            Erledigte Schritte sind zusätzlich zur Farbe mit einem Häkchen und einem Rahmen
            gekennzeichnet; der aktuelle Schritt ist ausgefüllt und wird als aktueller Schritt
            angesagt.
          </li>
          <li>
            Pflichtfelder sind gekennzeichnet. Fehlen Angaben, nennt eine Liste die betroffenen
            Felder und springt auf Wunsch direkt zum Feld.
          </li>
          <li>
            Tabellen in den Dokumenten lassen sich auf kleinen Bildschirmen waagerecht verschieben,
            lange Beschriftungen von Schaltflächen brechen um.
          </li>
          <li>Tabellen haben Zeilenüberschriften, Ankreuzkästchen sind benannt.</li>
          <li>
            Die Schaltfläche zum Schließen von Dialogen ist deutsch beschriftet, die Fußzeile ist
            als Liste ausgezeichnet, und der Hinweis zum Beispielfall gilt nicht mehr als
            Statusmeldung.
          </li>
          <li>
            Unsichtbare Dateifelder sind nicht mehr mit der Tastatur erreichbar; das Laden von
            Dateien erfolgt über die sichtbaren Schaltflächen.
          </li>
          <li>
            In den Dokumenten des fünften Schritts folgen die Überschriften einer durchgängigen
            Hierarchie.
          </li>
          <li>
            Zusammengehörige Eingabefelder, etwa zu beteiligten Stellen und zur
            zeichnungsberechtigten Leitung, haben eine gemeinsame Gruppenbeschriftung.
          </li>
          <li>Alle Navigationsbereiche sind unterscheidbar benannt.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Bekannte Einschränkungen</h2>
        <p>
          Aus der Prüfung sind keine Befunde mehr offen. Geprüft wurde eine Auswahl von Seiten;
          ähnliche Mängel auf anderen Ansichten sind deshalb nicht ausgeschlossen. Hinweise darauf
          nehmen wir gern über die Rückmeldung entgegen.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Rückmeldung</h2>
        <p>
          Sind Ihnen Barrieren aufgefallen, oder benötigen Sie Inhalte in einer anderen Form? Wenden
          Sie sich an die Betreiberin, die IEI Immersive Education Ideations UG
          (haftungsbeschränkt), per E-Mail an{" "}
          <a href="mailto:kontakt@erprobungspass.de" className="underline">
            kontakt@erprobungspass.de
          </a>
          . Die Rückmeldung wird geprüft, und Sie erhalten eine Antwort zum weiteren Vorgehen.
        </p>
        <p className="text-sm text-muted-foreground">
          Bitte beschreiben Sie die betroffene Seite, das verwendete Hilfsmittel und die
          aufgetretene Barriere möglichst genau.
        </p>
      </section>
    </main>
  );
}
