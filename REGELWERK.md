<!--
SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
SPDX-License-Identifier: EUPL-1.2
-->

# Regelwerk des Erprobungspasses

Fassung 2026-10-28. Diese Datei wird aus `src/data/regelwerk.ts`, `src/data/beteiligungen.ts` und `src/data/vorlagen.ts` erzeugt. Ändern Sie das Regelwerk im Quellcode und erzeugen Sie diese Fassung mit `bun run scripts/regelwerk-md.ts` neu.

## Fallarten

### Neues Werkzeug einführen

Eine Software oder ein Gerät soll neu beschafft und zunächst erprobt werden.

Die Fragen zur KI-Verordnung werden gestellt.

### Vorhandenes Werkzeug erhält eine KI-Funktion durch ein Update

Ein bereits eingesetztes Werkzeug bekommt durch eine Aktualisierung neue Funktionen.

Es gibt keinen Beschaffungsvorgang, die rechtliche Lage ändert sich trotzdem.

Die Fragen zur KI-Verordnung werden gestellt.

### Werkzeug wird bereits genutzt und soll nachträglich geordnet werden

Der Einsatz läuft bereits und soll nun geprüft und dokumentiert werden.

Die nachträgliche Ordnung ist ausdrücklich vorgesehen und wird nicht als Verstoß dokumentiert.

Die Fragen zur KI-Verordnung werden gestellt.

### Technik ohne KI (Sensorik, Robotik, Automatisierung)

Technik, die keine Verfahren der künstlichen Intelligenz einsetzt.

Die Fragen zur KI-Verordnung entfallen.

## Prüffragen

### KI-Verordnung

#### Wird das Werkzeug ausschließlich zur Forschung oder Entwicklung eingesetzt, bevor es überhaupt in den Betrieb geht?

- Kennung: `forschung`
- Fundstelle: Artikel 2 Absatz 6 und 8 der Verordnung (EU) 2024/1689 (Ausnahme für Forschung, Test und Entwicklung vor dem Inverkehrbringen)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Wer ein System nur erprobt, um herauszufinden, ob es funktioniert, und dabei keine echten Vorgänge bearbeitet, fällt in vielen Fällen noch nicht unter die Pflichten der KI-Verordnung.

Beispiel: Ein Team probiert ein Werkzeug an erfundenen Fällen aus, um zu entscheiden, ob sich eine Beschaffung lohnt.

#### Erzeugt das Werkzeug aus Eingaben eigenständig Vorschläge, Texte, Einstufungen oder Vorhersagen, statt nur festen Regeln zu folgen?

- Kennung: `ki_system`
- Fundstelle: Artikel 3 Nummer 1 der Verordnung (EU) 2024/1689 (Begriff des KI-Systems)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Eine Tabellenkalkulation mit festen Formeln ist nicht gemeint, denn sie rechnet immer gleich. Ein Textgenerator oder eine automatische Vorsortierung ist gemeint, weil das Ergebnis aus den Eingaben abgeleitet wird.

Beispiel: Ein Assistent, der Antwortentwürfe auf Bürgeranfragen erzeugt.

#### Nutzen Sie ein fertiges Werkzeug, oder geben Sie es unter eigenem Namen weiter beziehungsweise verändern Sie es wesentlich?

- Kennung: `rolle`
- Fundstelle: Artikel 3 Nummer 3 und 4 sowie Artikel 25 der Verordnung (EU) 2024/1689 (Anbieter, Betreiber und Wechsel der Rolle)

Wer ein fertiges Werkzeug nur einsetzt, hat die Pflichten einer betreibenden Stelle. Wer es umbenennt, wesentlich anpasst oder anderen zur Verfügung stellt, trägt die deutlich weitergehenden Pflichten einer anbietenden Stelle.

Beispiel: Das Werkzeug wird umbenannt, angepasst oder anderen Behörden zur Verfügung gestellt.

Auswahlmöglichkeiten:

- Nur Nutzung eines fertigen Werkzeugs (Betreiberrolle)
- Weitergabe unter eigenem Namen oder wesentliche Veränderung (Anbieterrolle)

#### Soll das Werkzeug eine der folgenden Aufgaben übernehmen?

- Kennung: `verbotene_praktiken`
- Fundstelle: Artikel 5 Absatz 1 der Verordnung (EU) 2024/1689 (verbotene Praktiken im Bereich der künstlichen Intelligenz)

Diese Anwendungen sind in der Europäischen Union untersagt. Eine Erprobung ist in diesen Zuschnitten nicht möglich, das Vorhaben muss anders geschnitten werden.

Beispiel: Eine Software, die die Stimmung in Telefonaten des Bürgerservice auswertet, fällt unter die Emotionserkennung am Arbeitsplatz.

Auswahlmöglichkeiten:

- Gefühlslage von Beschäftigten erkennen oder bewerten — Beispiel: Eine Software, die die Stimmung in Telefonaten des Bürgerservice auswertet.
- Personen anhand ihres allgemeinen Verhaltens bewerten oder einstufen — Beispiel: Ein Punktesystem, das Antragstellende nach früherem Verhalten in andere Verfahren einsortiert.
- Personen anhand körperlicher Merkmale in sensible Gruppen einteilen — Beispiel: Eine Auswertung von Kamerabildern im Foyer, die Besucherinnen und Besucher nach Herkunft gruppiert.
- Gesichtsbilder ungezielt aus dem Internet oder aus Videoaufnahmen sammeln — Beispiel: Der Aufbau einer eigenen Bilddatenbank aus öffentlich zugänglichen Fotos zur späteren Wiedererkennung.
- Vorhersagen, ob eine bestimmte Person eine Straftat begehen wird — Beispiel: Eine Bewertung einzelner Personen im Ordnungsamt nach vermuteter künftiger Auffälligkeit.
- Das Werkzeug beeinflusst Menschen mit Mitteln, die sie nicht bemerken, und bringt sie so zu Entscheidungen, die sie sonst nicht träfen. — Beispiel: Eine Oberfläche, die durch kaum wahrnehmbare Hinweise zu einer bestimmten Antragsvariante drängt.
- Das Werkzeug nutzt aus, dass jemand wegen Alter, Behinderung oder einer schwierigen Lebenslage besonders leicht zu beeinflussen ist. — Beispiel: Ein Dialog, der eine Notlage erkennt und daraufhin besonders drängend zu einer Entscheidung auffordert.
- Das Werkzeug identifiziert Personen in Echtzeit anhand biometrischer Merkmale im öffentlich zugänglichen Raum. — Beispiel: Eine Kamera am Eingang, die Gesichter unmittelbar mit einer Datenbank vergleicht.
- Das Werkzeug erzeugt intime Darstellungen von Personen ohne deren Einvernehmen. (gilt ab dem 2026-12-02) — Beispiel: Eine Bildfunktion, die Aufnahmen von Personen entkleidet darstellt.
- Das Werkzeug erzeugt Missbrauchsdarstellungen Minderjähriger. (gilt ab dem 2026-12-02) — Beispiel: Eine Bildfunktion, die entsprechende Darstellungen erzeugen kann.
- Keines davon

#### In welchem dieser Aufgabenbereiche soll das Werkzeug eingesetzt werden?

- Kennung: `hochrisiko`
- Fundstelle: Anhang III in Verbindung mit Artikel 6 Absatz 2 der Verordnung (EU) 2024/1689 (Bereiche mit hohem Risiko)
- Gilt ab dem 2027-12-02

Für diese Bereiche gelten zusätzliche Pflichten, weil Entscheidungen dort erhebliche Folgen für Menschen haben. Eine Erprobung bleibt unter Auflagen möglich.

Beispiel: Ein Werkzeug, das Bewerbungen für eine Stellenbesetzung vorsortiert, fällt unter Beschäftigung und Personalauswahl.

Auswahlmöglichkeiten:

- Beschäftigung und Personalauswahl — Beispiel: Vorsortierung eingehender Bewerbungen nach Passung.
- Zugang zu öffentlichen Leistungen — Beispiel: Vorprüfung von Anträgen auf Wohngeld oder Sozialleistungen.
- Bildung und Prüfungen — Beispiel: Unterstützung bei der Bewertung von Prüfungsleistungen.
- Strafverfolgung — Beispiel: Auswertung von Ermittlungsakten nach Auffälligkeiten.
- Migration und Asyl — Beispiel: Unterstützung bei der Prüfung von Aufenthaltsanträgen.
- Justizverwaltung — Beispiel: Erzeugung von Entwürfen für gerichtliche Entscheidungen.
- Kritische Infrastruktur — Beispiel: Steuerung der Wasserversorgung oder der Verkehrsleittechnik.
- Keines davon

#### Erfüllt das Werkzeug nur eine eng umgrenzte Aufgabe im Verfahren, ohne den Vorgang inhaltlich zu bewerten?

- Kennung: `ausnahme_a`
- Fundstelle: Artikel 6 Absatz 3 Buchstabe a der Verordnung (EU) 2024/1689 (eng umgrenzte Aufgabe im Verfahren)
- Einleitender Hinweis: Ihr Vorhaben liegt in einem Bereich, der grundsätzlich als hochriskant gilt. Es gibt jedoch Ausnahmen. Die folgenden vier Fragen klären, ob eine davon greift.
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Gemeint sind Hilfsschritte, die den Ablauf ordnen, aber nichts über den Fall aussagen.

Beispiel: Ein Werkzeug erkennt, um welche Antragsart es sich handelt, und legt den Vorgang im richtigen Ordner ab.

#### Verbessert das Werkzeug nur das Ergebnis einer Arbeit, die ein Mensch bereits abgeschlossen hat?

- Kennung: `ausnahme_b`
- Fundstelle: Artikel 6 Absatz 3 Buchstabe b der Verordnung (EU) 2024/1689 (Verbesserung des Ergebnisses einer abgeschlossenen menschlichen Tätigkeit)
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Entscheidend ist die Reihenfolge: Der Mensch entscheidet zuerst, das Werkzeug arbeitet danach am fertigen Ergebnis.

Beispiel: Ein fertig formulierter Bescheid wird sprachlich geglättet, ohne dass sich der Inhalt ändert.

#### Zeigt das Werkzeug nur Muster oder Abweichungen an, ohne die Bewertung durch die zuständige Person zu ersetzen?

- Kennung: `ausnahme_c`
- Fundstelle: Artikel 6 Absatz 3 Buchstabe c der Verordnung (EU) 2024/1689 (Erkennung von Mustern ohne Ersetzen der menschlichen Bewertung)
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Das Werkzeug weist auf etwas hin; bewerten und entscheiden tut weiterhin die zuständige Person.

Beispiel: Eine Auswertung zeigt an, dass ein Antrag von der üblichen Bearbeitungsdauer abweicht.

#### Erfüllt das Werkzeug nur eine vorbereitende Aufgabe für eine spätere Bewertung?

- Kennung: `ausnahme_d`
- Fundstelle: Artikel 6 Absatz 3 Buchstabe d der Verordnung (EU) 2024/1689 (vorbereitende Aufgabe für eine spätere Bewertung)
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Vorbereitend heißt: Es stellt zusammen, was für die Entscheidung gebraucht wird, trifft sie aber nicht.

Beispiel: Unterlagen werden nach Themen sortiert und als Übersicht zusammengestellt.

#### Erstellt das Werkzeug dabei Profile von Personen?

- Kennung: `ausnahme_profile`
- Fundstelle: Artikel 6 Absatz 3 letzter Unterabsatz der Verordnung (EU) 2024/1689 (Rückausnahme bei Erstellung von Profilen)
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Ein Profil entsteht, wenn Angaben zu einer Person ausgewertet werden, um etwas über sie vorherzusagen oder zu bewerten — etwa Verhalten, Zuverlässigkeit oder wirtschaftliche Lage.

Beispiel: Aus früheren Anträgen wird abgeleitet, wie wahrscheinlich eine Person erneut einen Antrag stellt.

#### Womit begründet die Dienststelle die Ausnahme?

- Kennung: `ausnahme_begruendung`
- Fundstelle: Artikel 6 Absatz 4 der Verordnung (EU) 2024/1689 (Dokumentation der Bewertung und Registrierungspflicht)
- Wird nur unter einer im Regelkern hinterlegten Bedingung gestellt

Die Begründung wird unverändert in das Freigabedokument übernommen. Die Bewertung ist zu dokumentieren; die Registrierungspflicht bleibt davon unberührt.

Beispiel: Das Werkzeug ordnet eingehende Unterlagen nur den Antragsarten zu und bewertet den Inhalt nicht.

#### Sprechen Menschen unmittelbar mit dem Werkzeug, oder erzeugt es Inhalte, die echt wirken?

- Kennung: `transparenz`
- Fundstelle: Artikel 50 Absatz 1 bis 4 der Verordnung (EU) 2024/1689 (Transparenzpflichten bei Interaktion und erzeugten Inhalten)

Menschen müssen erkennen können, dass sie mit einem maschinellen Gegenüber sprechen oder dass ein Inhalt maschinell erzeugt wurde. Erzeugte Inhalte sind zusätzlich maschinenlesbar zu kennzeichnen.

Beispiel: Ein Chatfenster auf der Internetseite der Behörde beantwortet Fragen zu Öffnungszeiten.

Auswahlmöglichkeiten:

- Menschen schreiben oder sprechen unmittelbar mit dem Werkzeug — Beispiel: Ein Chatfenster im Bürgerportal beantwortet Fragen selbst.
- Das Werkzeug erzeugt Texte, Bilder oder Tonaufnahmen — Beispiel: Erzeugte Bilder für eine Informationsbroschüre der Dienststelle.
- Keines davon

### Datenschutz

#### Werden Angaben verarbeitet, die sich einer bestimmten Person zuordnen lassen?

- Kennung: `personenbezug`
- Fundstelle: Artikel 4 Nummer 1 der Verordnung (EU) 2016/679 (Begriff der personenbezogenen Daten)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Dazu zählen Namen, Aktenzeichen mit Personenbezug, Sprachaufnahmen und Freitexte aus Vorgängen. Es genügt, dass eine Zuordnung mit vertretbarem Aufwand möglich ist.

Beispiel: Ein Werkzeug wertet eingegangene Widersprüche samt Namen und Anschrift aus.

#### Sind darunter auch Daten der eigenen Beschäftigten?

- Kennung: `beschaeftigtendaten`
- Fundstelle: nationales Beschäftigtendatenschutzrecht
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Gemeint sind Anmeldedaten, Bearbeitungszeiten und die Inhalte der täglichen Arbeit der Kolleginnen und Kollegen. Für solche Daten gelten zusätzliche Anforderungen aus dem Beschäftigtendatenschutz.

Beispiel: Auswertung von Postfächern oder Kalendern.

#### Werden besondere Kategorien personenbezogener Daten verarbeitet, etwa zu Gesundheit, ethnischer Herkunft oder religiöser Überzeugung?

- Kennung: `besondere_kategorien`
- Fundstelle: Artikel 9 Absatz 1 der Verordnung (EU) 2016/679 (besondere Kategorien personenbezogener Daten)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Dazu zählen auch Angaben zur Gewerkschaftszugehörigkeit, zum Sexualleben sowie biometrische Daten zur eindeutigen Erkennung einer Person. Solche Angaben stehen unter besonderem Schutz; bei „ja“ ist vor dem Start eine Datenschutz-Folgenabschätzung durchzuführen.

Beispiel: Gesundheitsangaben in Anträgen, Angaben zur Gewerkschaftszugehörigkeit.

#### Auf welche Vorschrift stützt sich die Verarbeitung?

- Kennung: `rechtsgrundlage`
- Fundstelle: Artikel 6 Absatz 1 Buchstabe e und Absatz 3 der Verordnung (EU) 2016/679 (Rechtsgrundlage für die Wahrnehmung öffentlicher Aufgaben)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist

Öffentliche Stellen brauchen dafür in aller Regel eine Vorschrift im Fachrecht. Eine Einwilligung trägt hier meist nicht, weil zwischen Behörde und betroffener Person kein Verhältnis auf Augenhöhe besteht.

Beispiel: Das Fachgesetz, nach dem der Antrag bearbeitet wird.

#### Trifft einer dieser drei Punkte auf Ihr Vorhaben zu?

- Kennung: `dsfa_schwellen`
- Fundstelle: Artikel 35 Absatz 3 und 4 der Verordnung (EU) 2016/679 (Fälle mit zwingender Datenschutz-Folgenabschätzung)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist

Die Datenschutz-Folgenabschätzung ist unabhängig von der KI-Verordnung zu prüfen. Die Aufsichtsbehörden führen zusätzlich Listen von Verarbeitungen, bei denen sie immer erforderlich ist.

Beispiel: Eine Auswertung, die viele Personen zugleich betrifft und Folgen für ihre Ansprüche haben kann.

Auswahlmöglichkeiten:

- umfassende Bewertung persönlicher Aspekte als Grundlage für Entscheidungen — Beispiel: Eine Einstufung von Antragstellenden, die über die Bearbeitung entscheidet.
- umfangreiche Verarbeitung von Daten besonderer Kategorien — Beispiel: Auswertung von Gesundheitsangaben aus einer großen Zahl von Vorgängen.
- systematische weiträumige Überwachung öffentlich zugänglicher Bereiche — Beispiel: Dauerhafte Auswertung von Kamerabildern in einem Bürgerzentrum.
- keines davon

#### Werden Ihre Eingaben vom Anbieter weiterverwendet, etwa zur Verbesserung seines Systems — und lässt sich das abschalten?

- Kennung: `anbieter_voreinstellung`
- Fundstelle: Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist

Viele Werkzeuge sind ab Werk so eingestellt, dass Eingaben weiterverwendet werden. In einer Behörde ist das selten gewollt und häufig unzulässig.

Beispiel: In den Einstellungen findet sich ein Schalter zur Verwendung von Eingaben für das Training.

Auswahlmöglichkeiten:

- nein
- ja, abgeschaltet
- ja, nicht abschaltbar
- unbekannt

#### Verarbeitet der Anbieter die Daten für Sie auf seinen eigenen Systemen?

- Kennung: `auftragsverarbeitung`
- Fundstelle: Artikel 28 Absatz 1 der Verordnung (EU) 2016/679 (Verarbeitung im Auftrag)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Das ist der Fall, wenn das Werkzeug nicht bei Ihnen im Haus läuft, sondern beim Anbieter. Er darf die Daten dann nur nach Ihren Weisungen verwenden.

Beispiel: Das Werkzeug läuft als Webdienst beim Anbieter, Eingaben werden dort verarbeitet.

#### Liegt ein unterschriebener Vertrag zur Auftragsverarbeitung nach Artikel 28 DSGVO vor?

- Kennung: `avv_vorhanden`
- Fundstelle: Artikel 28 Absatz 3 der Verordnung (EU) 2016/679 (Vertrag zur Auftragsverarbeitung)
- Wird nur gestellt, wenn `auftragsverarbeitung` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Der Vertrag zur Auftragsverarbeitung legt fest, was der Anbieter mit den Daten tun darf und welche Sicherheitsmaßnahmen gelten. Er ist vom Nutzungs- oder Lizenzvertrag zu unterscheiden, der nach diesem Vertrag gesondert erfragt wird, und muss vor Beginn der Erprobung geschlossen sein.

Beispiel: Eine vom Anbieter und von Ihrer Dienststelle unterzeichnete Vereinbarung zur Auftragsverarbeitung liegt in der Akte.

#### Werden die Daten außerhalb der Europäischen Union verarbeitet oder gespeichert?

- Kennung: `drittland`
- Fundstelle: Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Eine Verarbeitung außerhalb der Union setzt zusätzliche Grundlagen voraus, etwa Standardvertragsklauseln. Maßgeblich ist auch, wo Unterauftragnehmer des Anbieters sitzen.

Beispiel: Server oder Unterauftragnehmer außerhalb der EU.

#### Ist die Verarbeitung bereits im Verzeichnis Ihrer Dienststelle eingetragen?

- Kennung: `vvt`
- Fundstelle: Artikel 30 Absatz 1 der Verordnung (EU) 2016/679 (Verzeichnis der Verarbeitungstätigkeiten)
- Wird nur gestellt, wenn `personenbezug` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Das Verzeichnis der Verarbeitungstätigkeiten ist die interne Übersicht aller Verarbeitungen. Auch eine befristete Erprobung gehört hinein.

Beispiel: Ein Eintrag mit Zweck, Datenarten und Löschfrist für die geplante Erprobung.

### IT-Sicherheit

#### Welche Nachweise zur Informationssicherheit legt der Anbieter vor, jeweils mit Testat?

- Kennung: `zertifizierung`
- Fundstelle: Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung) · BSI-Kriterienkatalog C5 · ISO/IEC 27001 auf der Basis von IT-Grundschutz
- Ergänzende Frage, hält den Weiterweg nicht auf

Ein Testat oder Zertifikat belegt, dass ein unabhängiger Prüfer die Sicherheitsmaßnahmen des Anbieters geprüft hat. Bei Cloud-Diensten ist der Kriterienkatalog C5 des BSI üblich.

Beispiel: Der Anbieter legt ein aktuelles C5-Testat (Typ 2) seines Rechenzentrums vor.

Auswahlmöglichkeiten:

- ISO/IEC 27001 mit Zertifikat
- BSI C5 mit Testat
- BSI IT-Grundschutz (ISO 27001 auf der Basis von IT-Grundschutz) mit Testat
- keiner dieser Nachweise
- noch unklar

#### Wo stehen die Server, auf denen das Werkzeug betrieben wird?

- Kennung: `serverstandort`
- Fundstelle: Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)
- Ergänzende Frage, hält den Weiterweg nicht auf

Maßgeblich sind auch Ausweich- und Sicherungsstandorte sowie die Standorte von Unterauftragnehmern.

Beispiel: Rechenzentrum des Anbieters in Frankfurt am Main, Sicherung in Amsterdam.

Auswahlmöglichkeiten:

- in Deutschland
- in der Europäischen Union
- außerhalb der Europäischen Union
- noch unklar

#### Welche Anforderungen gelten für den Betrieb?

- Kennung: `betriebsanforderungen`
- Fundstelle: Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung)
- Ergänzende Frage, hält den Weiterweg nicht auf

Etwa Anbindung an die eigene Anmeldung, Netzbereich, Verfügbarkeit oder Vorgaben des Rechenzentrums. Die Angabe geht in die technische Vorprüfung für den ISB ein.

Beispiel: Anmeldung über das zentrale Verzeichnis, Zugriff nur aus dem Verwaltungsnetz.

### Betrieb und Mitbestimmung

#### Ließe sich mit dem Werkzeug nachvollziehen, wer wie schnell oder wie viel gearbeitet hat?

- Kennung: `ueberwachung`
- Fundstelle: nationales Personalvertretungsrecht
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Es genügt die technische Eignung, eine Absicht zur Überwachung ist nicht erforderlich. Schon Protokolle über Bearbeitungszeiten können ausreichen.

Beispiel: Das Werkzeug protokolliert, wer wann welche Vorgänge bearbeitet hat, auch wenn das gar nicht der Zweck ist.

#### Bereitet das Werkzeug Entscheidungen gegenüber Bürgerinnen und Bürgern vor?

- Kennung: `entscheidung_vorbereitung`
- Fundstelle: nationales Verwaltungsverfahrensrecht
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Vorbereiten heißt: Das Ergebnis fließt in die Entscheidung ein, die eine zuständige Person trifft.

Beispiel: Eingehende Anträge werden nach Dringlichkeit vorsortiert.

#### Ergeht die Entscheidung ohne Beteiligung eines Menschen und hat sie rechtliche Wirkung oder erhebliche Nachteile?

- Kennung: `entscheidung_automatisiert`
- Fundstelle: Artikel 22 Absatz 1 der Verordnung (EU) 2016/679 (automatisierte Entscheidungen im Einzelfall)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Nur diese Kombination löst die besonderen Anforderungen an automatisierte Einzelentscheidungen aus.

Beispiel: Eine Leistung wird ohne menschliche Prüfung abgelehnt.

#### Soll das Werkzeug verbindliche Entscheidungen erlassen, ohne dass eine zuständige Person sie prüft?

- Kennung: `vollautomatischer_erlass`
- Fundstelle: nationales Verwaltungsverfahrensrecht
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Gemeint ist nicht die Vorbereitung, sondern der Erlass selbst: Am Ende geht etwas nach außen, das niemand angesehen hat.

Beispiel: Ein Antrag wird automatisch beschieden, sobald alle Felder ausgefüllt sind.

#### Gibt es eine Rechtsvorschrift, die das für Ihr Verfahren ausdrücklich zulässt?

- Kennung: `vollautomatisch_grundlage`
- Fundstelle: nationales Verwaltungsverfahrensrecht
- Wird nur gestellt, wenn `vollautomatischer_erlass` mit „ja“ beantwortet ist
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Der vollständig automatisierte Erlass ist nur zulässig, wenn eine Vorschrift ihn für das jeweilige Verfahren ausdrücklich vorsieht.

Beispiel: Eine Vorschrift im Fachrecht, die den automatisierten Erlass für dieses Verfahren zulässt.

#### Ist das Werkzeug für alle Beschäftigten barrierefrei nutzbar?

- Kennung: `barrierefreiheit`
- Fundstelle: Barrierefreie-Informationstechnik-Verordnung 2.0 (BITV 2.0); bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die Bayerische Barrierefreie Informationstechnik-Verordnung (BayBITV)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Öffentliche Stellen dürfen digitale Anwendungen nur barrierefrei einsetzen. Das gilt auch für ein Werkzeug, das nur erprobt wird. Bei „nein“ oder „noch unklar“ wird die Prüfung der Barrierefreiheit zur Auflage.

Beispiel: Das Werkzeug ist ausschließlich mit der Maus bedienbar und nicht mit der Tastatur.

#### Ist für den Einsatz eine Dienstvereinbarung nötig, oder besteht bereits eine?

- Kennung: `dienstvereinbarung`
- Fundstelle: nationales Personalvertretungsrecht
- Ergänzende Frage, hält den Weiterweg nicht auf
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Eine Dienstvereinbarung regelt zwischen Dienststelle und Personalrat, wie ein technisches System im Haus eingesetzt wird. Wird sie gebraucht oder besteht sie bereits, ist der Personalrat zu beteiligen.

Beispiel: Für die Einführung von Software am Arbeitsplatz gibt es eine Rahmendienstvereinbarung, die um das neue Werkzeug ergänzt werden soll.

#### Gibt es Einweisungs- und Schulungsunterlagen für das Werkzeug?

- Kennung: `schulungsunterlagen`
- Fundstelle: Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)
- Ergänzende Frage, hält den Weiterweg nicht auf
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Die Dienststelle stellt sicher, dass die Nutzenden ausreichend geschult sind, und kann die Schulung anordnen. Dafür werden Unterlagen gebraucht, die den Einsatz im eigenen Haus beschreiben.

Beispiel: Eine Kurzanleitung mit den zulässigen Einsatzzwecken und den Grenzen des Werkzeugs.

#### Wer erstellt die Unterlagen und führt die Einweisung durch?

- Kennung: `schulung_ersteller`
- Fundstelle: Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)
- Ergänzende Frage, hält den Weiterweg nicht auf

Nennen Sie die zuständige Stelle oder Person, etwa den Anbieter oder den IT-Betrieb.

Beispiel: Der IT-Betrieb gemeinsam mit dem Anbieter.

#### Wer wird eingewiesen?

- Kennung: `schulung_zielgruppe`
- Fundstelle: Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)
- Ergänzende Frage, hält den Weiterweg nicht auf

Nennen Sie die Beschäftigten oder Organisationseinheiten, die das Werkzeug nutzen.

Beispiel: Die zwölf Beschäftigten des Sachgebiets Bürgerservice.

#### Ließe sich die Erprobung mit erfundenen Daten statt mit echten Vorgängen durchführen?

- Kennung: `testdaten`
- Fundstelle: Artikel 5 Absatz 1 Buchstabe c der Verordnung (EU) 2016/679 (Datenminimierung)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Testdaten sind erfundene oder wirksam anonymisierte Angaben. Ihre Verwendung senkt das Risiko der Erprobung erheblich.

Beispiel: Ein nachgebauter Musterantrag mit erfundenen Namen statt eines echten Vorgangs.

#### Ist vorgesehen, die beteiligten Beschäftigten vor Beginn schriftlich über die Erprobung zu unterrichten?

- Kennung: `unterrichtung`
- Fundstelle: Artikel 13 Absatz 1 der Verordnung (EU) 2016/679 (Informationspflicht gegenüber betroffenen Personen) · Artikel 26 Absatz 7 der Verordnung (EU) 2024/1689 (Unterrichtung der Beschäftigten vor Inbetriebnahme) · nationales Personalvertretungsrecht
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Die Unterrichtung nennt Zweck, Umfang und Dauer der Erprobung sowie die vorgesehene Schulung der Nutzenden.

Beispiel: Ein einseitiges Schreiben an die beteiligte Organisationseinheit vor dem ersten Erprobungstag.

### Finanzen und Beschaffung

#### Liegt ein unterschriebener Nutzungs- oder Lizenzvertrag mit dem Anbieter vor?

- Kennung: `nutzungsvertrag`
- Fundstelle: §§ 31 und 69d des Urheberrechtsgesetzes (Einräumung von Nutzungsrechten an Software)
- Ergänzende Frage, hält den Weiterweg nicht auf
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)

Der Nutzungs- oder Lizenzvertrag regelt, ob und wie die Dienststelle das Werkzeug nutzen darf. Er ersetzt nicht den Vertrag zur Auftragsverarbeitung.

Beispiel: Eine kostenfreie Testlizenz für drei Monate mit den Nutzungsbedingungen des Anbieters.

#### Welche Kosten erwarten Sie während der Erprobung?

- Kennung: `kosten_erprobung`
- Fundstelle: Haushaltsrecht des Trägers (Bewirtschaftung der Haushaltsmittel)
- Ergänzende Frage, hält den Weiterweg nicht auf

Betrag in Euro, Schätzwerte genügen. Sobald Kosten anfallen, ist die Finanzverwaltung zu beteiligen.

Beispiel: 0 Euro bei einer kostenfreien Testlizenz.

#### Welche Kosten erwarten Sie bei einer Überführung in den Regelbetrieb?

- Kennung: `kosten_ueberfuehrung`
- Fundstelle: Haushaltsrecht des Trägers · Vergaberecht (Teil 4 des Gesetzes gegen Wettbewerbsbeschränkungen oberhalb der EU-Schwellenwerte, darunter Unterschwellenvergabeordnung oder Landesvergaberecht)
- Ergänzende Frage, hält den Weiterweg nicht auf

Betrag in Euro für die gesamte Laufzeit, Schätzwerte genügen. Der Betrag wird mit den Schwellen aus dem Einrichtungsprofil verglichen.

Beispiel: 120.000 Euro für Lizenzen über drei Jahre.

### Update eines vorhandenen Werkzeugs

#### Hat der Anbieter die neue Funktion angekündigt, oder ist sie ohne Ankündigung erschienen?

- Kennung: `update_ankuendigung`
- Fundstelle: Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Sorgfaltspflichten der betreibenden Stelle)
- Nur bei Fallart: update

Eine angekündigte Funktion lässt sich vor der Aktivierung prüfen. Eine stillschweigend erschienene Funktion ist bereits im Haus, bevor eine Prüfung stattfinden konnte.

Beispiel: Die Textverarbeitung zeigt nach einer Aktualisierung plötzlich eine Schaltfläche für Textvorschläge, ohne dass darüber informiert wurde.

Auswahlmöglichkeiten:

- Die Funktion wurde vorab angekündigt
- Die Funktion ist ohne Ankündigung erschienen

#### Ist die neue Funktion von sich aus eingeschaltet, und lässt sie sich abschalten?

- Kennung: `update_standard_aktiv`
- Fundstelle: Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Einsatz nach der Betriebsanleitung) · Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)
- Nur bei Fallart: update

Eine von sich aus eingeschaltete Funktion wird genutzt, ohne dass jemand sie bewusst gewählt hat. Fehlt zusätzlich die Möglichkeit zum Abschalten, lässt sich der Einsatz nicht begrenzen.

Beispiel: Die Zusammenfassung von Besprechungen läuft nach dem Update automatisch mit und muss in jeder Sitzung einzeln beendet werden.

Auswahlmöglichkeiten:

- Die Funktion ist standardmäßig ausgeschaltet
- Die Funktion ist standardmäßig aktiv, lässt sich aber abschalten
- Die Funktion ist standardmäßig aktiv und lässt sich nicht abschalten

#### Verlassen durch die neue Funktion Daten den Rechner oder das Haus, die vorher dort geblieben sind?

- Kennung: `update_datenabfluss`
- Fundstelle: Artikel 28 und Kapitel V der Verordnung (EU) 2016/679 (Verarbeitung im Auftrag und Übermittlung an Drittländer)
- Antworten: ja, nein, noch unklar (gilt für die Ableitung der Stellen wie „ja“)
- Nur bei Fallart: update

Viele neue Funktionen rechnen nicht auf dem Gerät, sondern beim Anbieter. Dadurch ändert sich, wohin Inhalte aus der täglichen Arbeit übertragen werden.

Beispiel: Entwürfe aus der Textverarbeitung werden für die Vorschläge an ein Rechenzentrum des Anbieters übertragen.

## Einordnung

Rot, sobald eine bereits geltende verbotene Praktik gewählt ist oder eine verbindliche Entscheidung ohne Prüfung durch eine zuständige Person und ohne Rechtsvorschrift ergehen soll. Gelb, sobald besondere Datenkategorien, eine Überwachungseignung, eine automatisierte Einzelentscheidung mit rechtlicher Wirkung, eine Schwelle der Datenschutz-Folgenabschätzung, eine kritische Voreinstellung des Anbieters oder das Zusammentreffen der drei Update-Merkmale vorliegt. Sonst Grün. Regeln mit einem Geltungsdatum in der Zukunft erscheinen im Prüfpfad, führen aber nicht zu einer Höherstufung.

### Rot (`rot`)

Eine Erprobung in diesem Zuschnitt ist ausgeschlossen. Schneiden Sie das Vorhaben anhand der Vorschläge zur Umgestaltung neu zu und führen Sie die Einordnung erneut durch; ohne Änderung ist das Vorhaben nicht der Behördenleitung vorzulegen.

### Gelb (`gelb`)

Eine Erprobung ist unter Auflagen möglich. Holen Sie die im nächsten Schritt genannten Beteiligungen ein, übernehmen Sie die zusätzlichen Auflagen in das Freigabedokument und beginnen Sie erst nach schriftlicher Freigabe durch die Behördenleitung.

### Grün (`gruen`)

Eine Erprobung ist mit den Grundauflagen möglich. Lassen Sie das Freigabedokument durch die genannten Stellen mitzeichnen, halten Sie die Grundauflagen ein und werten Sie die Erprobung zum Ende der Geltungsdauer schriftlich aus.

## Vorschläge zur Umgestaltung bei Rot

- `emotion`: Verzichten Sie auf jede Auswertung von Gefühlslagen. Beschränken Sie das Vorhaben auf sachbezogene Funktionen ohne Bezug zur einzelnen Person.
- `social_scoring`: Verzichten Sie auf eine übergreifende Bewertung von Personen. Prüfen Sie stattdessen einzelfallbezogene, nachvollziehbare Kriterien ohne Punktesystem.
- `biometrie`: Verzichten Sie auf die Einordnung von Personen nach körperlichen Merkmalen. Prüfen Sie eine Lösung, die ohne die Erhebung biometrischer Daten auskommt.
- `gesichtsbilder`: Verzichten Sie auf das Sammeln von Gesichtsbildern. Nutzen Sie ausschließlich Datenbestände mit klarer Rechtsgrundlage und begrenztem Zweck.
- `praediktion`: Verzichten Sie auf Vorhersagen zu einzelnen Personen. Eine Auswertung auf Ebene von Orten oder Zeiträumen ohne Personenbezug kann zulässig sein.
- `unterschwellig`: Gestalten Sie die Oberfläche so, dass jede Wahlmöglichkeit erkennbar und gleichwertig dargestellt ist.
- `schutzbeduerftig`: Verzichten Sie auf jede Anpassung des Vorgehens an eine vermutete Schutzbedürftigkeit. Halten Sie den Ablauf für alle Personen gleich.
- `biometrische_echtzeit`: Verzichten Sie auf die biometrische Erkennung im öffentlich zugänglichen Raum. Prüfen Sie organisatorische Lösungen ohne Erfassung von Merkmalen.
- `intime_darstellungen`: Schließen Sie die Erzeugung solcher Darstellungen technisch aus und begrenzen Sie das Werkzeug auf den dienstlichen Zweck.
- `missbrauchsdarstellungen`: Schließen Sie die Erzeugung solcher Darstellungen technisch aus und begrenzen Sie das Werkzeug auf den dienstlichen Zweck.
- `vollautomatischer_erlass`: Denkbar ist eine Erprobung, bei der das Werkzeug die Entscheidung nur vorbereitet und eine zuständige Person sie prüft und verantwortet.

## Zusätzliche Hinweise

- `kiKompetenz`: Beschäftigte, die das Werkzeug bedienen, müssen über ausreichende KI-Kompetenz verfügen. Die Dienststelle sorgt vor Beginn der Erprobung für eine angemessene Einweisung. (Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen))
- `hochrisikoKuenftig`: Ihr Vorhaben liegt in einem Bereich, für den die besonderen Anforderungen an Hochrisiko-Systeme gelten werden. Diese Anforderungen sind ab dem 2. Dezember 2027 einzuhalten. Für eine Erprobung im laufenden Jahr bestehen sie noch nicht; die Erprobung sollte jedoch so angelegt werden, dass die spätere Einhaltung möglich bleibt. (Anhang III und Artikel 113 der Verordnung (EU) 2024/1689 (Bereiche mit hohem Risiko und Beginn der Geltung)) — gilt ab dem 2027-12-02
- `grundrechteFolgenabschaetzung`: Es wird empfohlen, bereits jetzt eine Abschätzung der Auswirkungen auf die Grundrechte durchzuführen und das Ergebnis schriftlich festzuhalten; als öffentliche Stelle sind Sie dazu ab dem 2. Dezember 2027 verpflichtet. (Artikel 27 Absatz 1 der Verordnung (EU) 2024/1689 (Abschätzung der Auswirkungen auf die Grundrechte durch öffentliche Stellen)) — gilt ab dem 2027-12-02
- `registrierung`: Es wird empfohlen, die Registrierung in der EU-Datenbank vorzubereiten; für den Einsatz eines Hochrisiko-Systems durch eine öffentliche Stelle ist sie ab dem 2. Dezember 2027 vor Beginn erforderlich. (Artikel 49 Absatz 3 der Verordnung (EU) 2024/1689 (Registrierung in der EU-Datenbank)) — gilt ab dem 2027-12-02
- `anbieterrolle`: In der Anbieterrolle treffen Sie die vollen Pflichten einer anbietenden Stelle, unter anderem Risikomanagement, technische Dokumentation und Konformitätsbewertung. (Artikel 16 der Verordnung (EU) 2024/1689 (Pflichten der anbietenden Stelle))
- `datenschutzfolgenabschaetzung`: Bei voraussichtlich hohem Risiko für die Rechte betroffener Personen ist vor Beginn eine Datenschutz-Folgenabschätzung durchzuführen. (Artikel 35 Absatz 1 der Verordnung (EU) 2016/679 (Datenschutz-Folgenabschätzung))
- `kennzeichnungMaschinenlesbar`: Erzeugte Texte, Bilder und Tonaufnahmen sind maschinenlesbar zu kennzeichnen; diese Pflicht ist ab dem 2. Dezember 2026 einzuhalten. (Artikel 50 Absatz 2 der Verordnung (EU) 2024/1689 (maschinenlesbare Kennzeichnung erzeugter Inhalte)) — gilt ab dem 2026-12-02
- `forschungsphase`: Nach Ihren Angaben dient der Einsatz allein Forschung und Entwicklung vor dem Betrieb. Die Pflichten der KI-Verordnung greifen dann in vielen Fällen noch nicht; die Anforderungen des Datenschutzes und des Betriebs bleiben unberührt. (Artikel 2 Absatz 6 und 8 der Verordnung (EU) 2024/1689 (Ausnahme für Forschung und Entwicklung))
- `entscheidungVorbereitung`: Die Vorbereitung einer Entscheidung entbindet nicht von der Pflicht, den Sachverhalt von Amts wegen zu ermitteln. (Untersuchungsgrundsatz des nationalen Verwaltungsverfahrensrechts (Ermittlung des Sachverhalts von Amts wegen))
- `updateStillschweigend`: Eine ohne Ankündigung erschienene, von sich aus eingeschaltete Funktion, durch die zusätzlich Daten das Haus verlassen, ist bis zur abgeschlossenen Prüfung abzuschalten oder auf einen abgegrenzten Kreis von Arbeitsplätzen zu begrenzen. Solange dies nicht geschehen ist, darf die Funktion im Haus nicht genutzt werden. (Artikel 26 Absatz 1 der Verordnung (EU) 2024/1689 (Sorgfaltspflichten der betreibenden Stelle) · Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen))

## Zu beteiligende Stellen

- Datenschutzbeauftragte oder Datenschutzbeauftragter
  Prüft: Rechtsgrundlage, Auftragsverarbeitung, Übermittlung in Drittländer, Eintrag im Verzeichnis der Verarbeitungstätigkeiten und die Erforderlichkeit einer Datenschutz-Folgenabschätzung.
- Informationssicherheitsbeauftragte oder Informationssicherheitsbeauftragter (ISB)
  Prüft: Nachweise des Anbieters zur Informationssicherheit, Serverstandort, Anforderungen an den Betrieb und die technischen Vorgaben des Landes nach der technischen Vorprüfung.
  Vorbedingung: Ohne Freigabe des ISB keine Unterschrift der Leitung.
- Personalrat — Es besteht Mitbestimmung bei technischen Einrichtungen, die zur Überwachung von Verhalten oder Leistung der Beschäftigten geeignet sind. Die Eignung genügt, eine Absicht ist nicht erforderlich.
  Prüft: Mitbestimmung bei technischen Einrichtungen, Inhalt und Erforderlichkeit einer Dienstvereinbarung sowie die Unterrichtung der Beschäftigten.
- Schwerbehindertenvertretung und Gleichstellungsbeauftragte
  Prüft: Barrierefreie Nutzbarkeit des Werkzeugs, Auswirkungen auf Arbeitsabläufe schwerbehinderter Beschäftigter und Fragen der Gleichstellung.
- IT-Betrieb
  Prüft: Einrichtung, Betrieb und Rücknahme der Testumgebung, Anbindung an die vorhandene Technik sowie Einweisung der Nutzenden.
- Finanzen / Kämmerei
  Prüft: Deckung der Kosten im Haushalt für die Erprobung und für eine mögliche Überführung.
- Zuständiges Gremium
  Prüft: Entscheidung über die Überführung in den Regelbetrieb nach der Zuständigkeitsregelung des Trägers (Hauptsatzung oder Geschäftsordnung).
- Vergabestelle
  Prüft: Vergabeart und Ausschreibungspflicht nach dem Vergaberecht (Teil 4 des Gesetzes gegen Wettbewerbsbeschränkungen oberhalb der EU-Schwellenwerte, darunter Unterschwellenvergabeordnung oder Landesvergaberecht).
- Behördenleitung
  Prüft: Gesamtentscheidung über die Freigabe nach Vorliegen aller Beteiligungen, insbesondere der Freigabe des ISB.

## Technische Landesvorgaben

Vorprüfung, ersetzt nicht die Freigabe des ISB.

### Bayern

- Informationssicherheitskonzept: Zu prüfen ist, ob das Werkzeug im Informationssicherheitskonzept der Behörde berücksichtigt ist oder vor dem Start aufgenommen wird. (Art. 11 des Bayerischen Digitalgesetzes (BayDiG, Informationssicherheit))
- Orientierung am IT-Grundschutz und an den Empfehlungen des LSI: Zu prüfen ist, ob die Maßnahmen dem BSI-IT-Grundschutz oder den Empfehlungen des Landesamts für Sicherheit in der Informationstechnik (LSI) entsprechen. (Art. 11 BayDiG · BSI-Standards 200-1 bis 200-3 (IT-Grundschutz) · Empfehlungen des LSI für Kommunen)
- Zertifizierung oder Testat des Anbieters: Zu prüfen ist, ob der Anbieter ein Zertifikat nach ISO/IEC 27001 auf der Basis von IT-Grundschutz oder bei Cloud-Diensten ein Testat nach BSI C5 vorlegt. (ISO/IEC 27001 auf der Basis von IT-Grundschutz · BSI-Kriterienkatalog C5 (Cloud Computing Compliance Criteria Catalogue))
- Datenhaltung in der Europäischen Union: Zu prüfen ist, ob die Daten einschließlich Sicherungen und Unterauftragnehmern ausschließlich in der Europäischen Union gehalten werden. (Kapitel V, Art. 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung an Drittländer))
- Rollen- und Rechtekonzept: Zu prüfen ist, ob Zugriffe nach Rollen vergeben, dokumentiert und auf die an der Erprobung beteiligten Personen beschränkt sind. (Art. 32 Abs. 1 der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein ORP.4 (Identitäts- und Berechtigungsmanagement))
- Protokollierung: Zu prüfen ist, ob sicherheitsrelevante Ereignisse und Zugriffe protokolliert und die Protokolle geschützt aufbewahrt werden. (Art. 32 Abs. 1 der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein OPS.1.1.5 (Protokollierung))
- Verschlüsselung bei Übertragung und Speicherung: Zu prüfen ist, ob Daten bei der Übertragung und bei der Speicherung nach dem Stand der Technik verschlüsselt werden. (Art. 32 Abs. 1 Buchst. a der Verordnung (EU) 2016/679 · IT-Grundschutz-Baustein CON.1 (Kryptokonzept))
- Datensicherung und Löschkonzept: Zu prüfen ist, ob Datensicherung, Wiederherstellung und die Löschung nach Ende der Erprobung geregelt sind. (Art. 17 und Art. 32 Abs. 1 Buchst. c der Verordnung (EU) 2016/679 · IT-Grundschutz-Bausteine CON.3 (Datensicherungskonzept) und CON.6 (Löschen und Vernichten))

Für alle übrigen Länder: Landesvorgaben noch nicht hinterlegt.

## Grundauflagen

1. Die Erprobung ist zeitlich befristet und endet ohne weitere Erklärung mit Ablauf der im Freigabedokument festgelegten Geltungsdauer.
2. Während der Erprobung findet kein Wirkbetrieb statt; die Ergebnisse des Werkzeugs ersetzen keinen laufenden Vorgang und werden nicht zur Akte genommen, soweit dies nicht ausdrücklich vermerkt ist.
3. Während der Erprobung werden keine Entscheidungen gegenüber Bürgerinnen und Bürgern getroffen, die nicht zuvor von einer zuständigen Person geprüft und verantwortet wurden.
4. Die an der Erprobung beteiligten Beschäftigten und die Beschäftigtenvertretung werden vor Beginn schriftlich über Zweck, Umfang und Dauer der Erprobung unterrichtet.
5. Die Nutzung des Werkzeugs wird während der gesamten Erprobung fortlaufend dokumentiert; festgehalten werden mindestens Datum, Zweck der Nutzung und die beteiligte Person. Die Aufzeichnungen werden mindestens sechs Monate aufbewahrt.
6. Zum Ende der Geltungsdauer legt die verantwortliche Person eine schriftliche Auswertung mit einer begründeten Empfehlung zum weiteren Vorgehen vor.

## Zusätzliche Auflagen bei Gelb und Rot

1. Die Erprobung wird ausschließlich mit erfundenen oder wirksam anonymisierten Daten durchgeführt; die Verwendung echter personenbezogener Daten bedarf einer vorherigen schriftlichen Begründung und der Zustimmung der Behördenleitung.
2. Für jeden Arbeitstag der Erprobung ist eine namentlich benannte verantwortliche Person bestimmt, die für Rückfragen erreichbar ist und den Abbruch veranlassen kann.
3. Zur Halbzeit der Geltungsdauer legt die verantwortliche Person einen schriftlichen Zwischenbericht über Verlauf, Auffälligkeiten und bereits erkennbare Risiken vor.
4. Vor Beginn der Erprobung liegt die schriftliche Freigabe der oder des behördlichen Datenschutzbeauftragten vor und wird dem Freigabedokument beigefügt.
5. Die Ergebnisse des Werkzeugs werden vor jeder Verwendung von einer fachkundigen Person geprüft; erkannte Fehler werden schriftlich festgehalten.

## Auflagen mit Auslösebedingung

1. Die Aufsicht über das Werkzeug liegt bei einer namentlich benannten Person, die über die nötige Kenntnis verfügt und die Ergebnisse überstimmen oder den Einsatz beenden kann.
2. Auffälligkeiten und Fehlfunktionen werden dem Anbieter und der zuständigen Stelle im Haus unverzüglich mitgeteilt.
3. Es werden nur Eingabedaten verwendet, die für den erprobten Zweck geeignet und aussagekräftig sind.
4. Die Dienststelle stellt sicher, dass die Nutzenden vor Beginn ausreichend geschult sind (Artikel 4 der Verordnung (EU) 2024/1689), und kann die Teilnahme an der Schulung anordnen.
5. Betroffene Personen werden vor Beginn über die Verarbeitung informiert, oder die Erprobung läuft ausschließlich mit Testdaten.
6. Der Zugriff ist auf die am Versuch beteiligten Personen beschränkt; die Übertragung erfolgt verschlüsselt.
7. Vor dem Start der Erprobung ist mit dem Anbieter ein Vertrag zur Auftragsverarbeitung geschlossen (Artikel 28 Absatz 3 der Verordnung (EU) 2016/679); ohne diesen Vertrag beginnt die Erprobung nicht.
8. Vor dem Start der Erprobung ist eine Datenschutz-Folgenabschätzung durchgeführt und dem Freigabedokument beigefügt (Artikel 35 der Verordnung (EU) 2016/679).
9. Ein Datenschutzvorfall wird unverzüglich der oder dem Datenschutzbeauftragten gemeldet; die Meldung an die Aufsichtsbehörde erfolgt binnen 72 Stunden ab Kenntnis, sofern ein Risiko nicht ausgeschlossen werden kann.
10. Die Vorbereitung durch das Werkzeug ersetzt keine Sachverhaltsermittlung; jeder Vorgang bleibt vollständig prüfbar.
11. Die Begründung einer Entscheidung wird von der zuständigen Person verantwortet und ist ohne Kenntnis des Werkzeugs nachvollziehbar.
12. Die barrierefreie Nutzbarkeit des Werkzeugs wird vor dem Start geprüft (BITV 2.0; bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die BayBITV). Bis zum Nachweis steht ein gleichwertiger Weg zur Verfügung, der ohne das Werkzeug auskommt.

## Abbruchkriterien

Ein Abbruch ist ein reguläres Ergebnis der Erprobung und wird nicht als Fehlschlag bewertet.

1. Die Erprobung wird abgebrochen, wenn personenbezogene Daten verarbeitet werden, die im Freigabedokument nicht vorgesehen sind.
2. Die Erprobung wird abgebrochen, wenn das Werkzeug fehlerhafte Ergebnisse liefert, die nach außen wirksam geworden sind oder wirksam werden könnten.
3. Die Erprobung wird abgebrochen, wenn eine beteiligte Stelle der Fortführung schriftlich widerspricht.
4. Die Erprobung wird abgebrochen, wenn die festgelegte Geltungsdauer erreicht ist und keine erneute Einordnung nach dem Regelwerk vorliegt.
5. Die Erprobung wird abgebrochen, wenn sich Funktionsumfang oder Datenverarbeitung des Werkzeugs während der Laufzeit ändern, ohne dass dies vorher geprüft wurde.
6. Es tritt ein Datenschutzvorfall ein, der eine Meldung an die Aufsichtsbehörde erforderlich machen könnte. (nur bei personenbezogenen Daten)

## Geltungsdauer

Eine Verlängerung der Geltungsdauer setzt eine erneute Einordnung nach dem Regelwerk voraus. Zulässig sind 1 bis 52 Wochen.

## Dokumenten-Checkliste

### Unterschriebener Vertrag zur Auftragsverarbeitung mit dem Anbieter

Der Anbieter verarbeitet die Daten für Ihre Dienststelle auf eigenen Systemen. Ohne Vertrag fehlt die Grundlage dieser Verarbeitung.

Fundstelle: Artikel 28 Absatz 3 der Verordnung (EU) 2016/679 (Vertrag zur Auftragsverarbeitung)

### Dokumentierte Grundlage für die Verarbeitung außerhalb der Europäischen Union

Eine Verarbeitung außerhalb der Union setzt eine eigene Grundlage voraus, etwa Standardvertragsklauseln samt Prüfung der Lage im Empfängerstaat.

Fundstelle: Kapitel V, Artikel 44 bis 49 der Verordnung (EU) 2016/679 (Übermittlung personenbezogener Daten an Drittländer)

### Eintrag der Erprobung im Verzeichnis der Verarbeitungstätigkeiten

Auch eine befristete Erprobung ist eine Verarbeitungstätigkeit und gehört mit Zweck, Datenarten und Löschfrist in das Verzeichnis.

Fundstelle: Artikel 30 Absatz 1 der Verordnung (EU) 2016/679 (Verzeichnis der Verarbeitungstätigkeiten)

### Schriftliche Abschätzung der Auswirkungen auf die Grundrechte

Für Hochrisiko-Systeme ist die Abschätzung ab dem 2. Dezember 2027 vorgeschrieben; eine frühzeitige Abschätzung hält die spätere Einhaltung offen.

Fundstelle: Artikel 27 Absatz 1 der Verordnung (EU) 2024/1689 (Abschätzung der Auswirkungen auf die Grundrechte durch öffentliche Stellen)

### Datenschutz-Folgenabschätzung

Bei voraussichtlich hohem Risiko für die Rechte betroffener Personen ist die Folgenabschätzung vor Beginn der Verarbeitung durchzuführen.

Fundstelle: Artikel 35 Absatz 1 der Verordnung (EU) 2016/679 (Datenschutz-Folgenabschätzung)

### Benennung der Vorschrift, auf die sich die Verarbeitung stützt

Ohne benannte Vorschrift darf die Verarbeitung personenbezogener Daten nicht beginnen. Der Eintrag wird unverändert in das Freigabedokument übernommen.

Fundstelle: Artikel 6 Absatz 1 Buchstabe e und Absatz 3 der Verordnung (EU) 2016/679 (Rechtsgrundlage für die Wahrnehmung öffentlicher Aufgaben)

### Nachweis, dass Eingaben nicht für Zwecke des Anbieters weiterverwendet werden

Die Weiterverwendung von Eingaben ist ab Werk häufig eingeschaltet. Ohne Abschaltung oder verbindliche Zusage des Anbieters fehlt die datenschutzgerechte Voreinstellung.

Fundstelle: Artikel 25 Absatz 2 der Verordnung (EU) 2016/679 (datenschutzfreundliche Voreinstellungen)

### Nachweis oder Prüfbericht zur Barrierefreiheit des Werkzeugs

Öffentliche Stellen dürfen digitale Anwendungen nur barrierefrei einsetzen; solange der Nachweis fehlt, ist ein gleichwertiger Weg vorzuhalten.

Fundstelle: Barrierefreie-Informationstechnik-Verordnung 2.0 (BITV 2.0); bei Landes- und Kommunalbehörden das jeweilige Landesrecht, in Bayern die Bayerische Barrierefreie Informationstechnik-Verordnung (BayBITV)

### Schriftliche Unterrichtung der beteiligten Beschäftigten

Die Beschäftigten sind vor Beginn über Zweck, Umfang und Dauer der Erprobung sowie über die vorgesehene Schulung zu unterrichten.

Fundstelle: Artikel 13 Absatz 1 der Verordnung (EU) 2016/679 (Informationspflicht gegenüber betroffenen Personen) · Artikel 26 Absatz 7 der Verordnung (EU) 2024/1689 (Unterrichtung der Beschäftigten vor Inbetriebnahme)

### Nachweis der Registrierung in der EU-Datenbank

Für den Einsatz eines Hochrisiko-Systems durch eine öffentliche Stelle ist die Registrierung ab dem 2. Dezember 2027 vor Beginn erforderlich.

Fundstelle: Artikel 49 Absatz 3 der Verordnung (EU) 2024/1689 (Registrierung in der EU-Datenbank)

### Dokumentierte Bewertung der Ausnahme nach Artikel 6 Absatz 3

Wer sich auf eine Ausnahme stützt, dokumentiert die Bewertung vor dem Einsatz. Die Registrierungspflicht bleibt davon unberührt.

Fundstelle: Artikel 6 Absatz 4 der Verordnung (EU) 2024/1689 (Dokumentation der Bewertung und Registrierungspflicht)

### Nachweis der Einweisung der bedienenden Beschäftigten

Beschäftigte, die ein KI-System bedienen, müssen über ausreichende KI-Kompetenz verfügen.

Fundstelle: Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)

### Technische Dokumentation und Konformitätsbewertung der Anbieterrolle

Wer ein System unter eigenem Namen weitergibt oder wesentlich verändert, trägt die Pflichten einer anbietenden Stelle.

Fundstelle: Artikel 16 der Verordnung (EU) 2024/1689 (Pflichten der anbietenden Stelle)

### Unterschriebener Nutzungs- oder Lizenzvertrag mit dem Anbieter

Ohne eingeräumtes Nutzungsrecht darf die Dienststelle das Werkzeug nicht einsetzen. Der Vertrag ist vom Vertrag zur Auftragsverarbeitung getrennt zu führen.

Fundstelle: §§ 31 und 69d des Urheberrechtsgesetzes (Einräumung von Nutzungsrechten an Software)

### Nachweis der Informationssicherheit des Anbieters (ISO/IEC 27001, BSI C5 oder IT-Grundschutz mit Testat)

Der ISB braucht einen geprüften Nachweis, um die Sicherheit der Verarbeitung beim Anbieter beurteilen zu können.

Fundstelle: Artikel 32 Absatz 1 der Verordnung (EU) 2016/679 (Sicherheit der Verarbeitung) · BSI-Kriterienkatalog C5 · ISO/IEC 27001 auf der Basis von IT-Grundschutz

### Einweisungs- und Schulungsunterlagen für die Nutzenden

Die Dienststelle stellt sicher, dass die Nutzenden ausreichend geschult sind; die Unterlagen sind Grundlage der Einweisung.

Fundstelle: Artikel 4 der Verordnung (EU) 2024/1689 (KI-Kompetenz der bedienenden Personen)

