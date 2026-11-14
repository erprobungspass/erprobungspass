// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Erzeugt eine SPDX-Stückliste der ausgelieferten Pakete aus dem Lockfile.
// Entwicklungsabhängigkeiten bleiben außen vor, sie landen nicht im Build.
// Daneben entsteht LICENSES/ mit dem Text jeder tatsächlich genutzten Lizenz.

import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = process.argv[2] ?? join(root, "dist", "sbom.json");

const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const lock = JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));

const purl = (name, version) =>
  `pkg:npm/${name.split("/").map(encodeURIComponent).join("/")}@${encodeURIComponent(version)}`;

async function lizenz(path, entry) {
  if (entry.license) return entry.license;
  try {
    const manifest = JSON.parse(await readFile(join(root, path, "package.json"), "utf8"));
    const value = manifest.license ?? manifest.licenses;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.map((l) => l.type ?? l).join(" OR ");
    if (value?.type) return value.type;
  } catch {
    // Paket nicht installiert: Lizenz bleibt unbekannt.
  }
  return null;
}

const pakete = [];
const gesehen = new Set();
for (const [path, entry] of Object.entries(lock.packages)) {
  if (path === "" || entry.dev || entry.extraneous) continue;
  const name = entry.name ?? path.slice(path.lastIndexOf("node_modules/") + 13);
  if (!name || !entry.version) continue;
  if (gesehen.has(purl(name, entry.version))) continue;
  gesehen.add(purl(name, entry.version));

  pakete.push({
    path,
    name,
    version: entry.version,
    purl: purl(name, entry.version),
    ausdruck: await lizenz(path, entry),
    resolved: entry.resolved ?? null,
  });
}
pakete.sort((a, b) => a.purl.localeCompare(b.purl));

// SPDX erlaubt in Kennungen nur Buchstaben, Ziffern, Punkt und Bindestrich.
const spdxId = (name, version) =>
  `SPDXRef-Package-${`${name}-${version}`.replace(/[^a-zA-Z0-9.-]/g, "-")}`;

const wurzel = spdxId(pkg.name, pkg.version);
const zeitpunkt = `${new Date().toISOString().slice(0, 19)}Z`;

const spdxPaket = (p) => ({
  SPDXID: spdxId(p.name, p.version),
  name: p.name,
  versionInfo: p.version,
  downloadLocation: p.resolved ?? "NOASSERTION",
  filesAnalyzed: false,
  licenseConcluded: p.ausdruck ?? "NOASSERTION",
  licenseDeclared: p.ausdruck ?? "NOASSERTION",
  copyrightText: "NOASSERTION",
  externalRefs: [
    {
      referenceCategory: "PACKAGE-MANAGER",
      referenceType: "purl",
      referenceLocator: p.purl,
    },
  ],
});

const bom = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  name: `${pkg.name}-${pkg.version}`,
  documentNamespace: `https://spdx.org/spdxdocs/${pkg.name}-${pkg.version}-${randomUUID()}`,
  creationInfo: {
    created: zeitpunkt,
    creators: ["Tool: scripts/sbom.mjs"],
  },
  packages: [
    {
      ...spdxPaket({
        name: pkg.name,
        version: pkg.version,
        purl: purl(pkg.name, pkg.version),
        ausdruck: "EUPL-1.2",
        resolved: null,
      }),
      SPDXID: wurzel,
    },
    ...pakete.map(spdxPaket),
  ],
  relationships: [
    {
      spdxElementId: "SPDXRef-DOCUMENT",
      relationshipType: "DESCRIBES",
      relatedSpdxElement: wurzel,
    },
    ...pakete.map((p) => ({
      spdxElementId: wurzel,
      relationshipType: "DEPENDS_ON",
      relatedSpdxElement: spdxId(p.name, p.version),
    })),
  ],
};

await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(bom, null, 2)}\n`);
console.log(`sbom: ${out} (${pakete.length} Pakete)`);

// Kennungen aus einem SPDX-Ausdruck lösen, etwa "(MIT OR Apache-2.0)".
const kennungen = (ausdruck) =>
  ausdruck
    .split(/[()\s]+|\bOR\b|\bAND\b|\bWITH\b/)
    .filter(Boolean)
    .map((id) => id.replace(/\+$/, ""));

// Ein Paket ohne auswertbare Lizenzangabe ist eine unbekannte Lizenz und muss
// den Build anhalten, statt als NOASSERTION in die Stückliste zu wandern.
const ohneLizenz = pakete.filter((p) => !p.ausdruck).map((p) => `${p.name}@${p.version}`);
if (ohneLizenz.length > 0) {
  console.error(
    `Für folgende Pakete ist keine Lizenz angegeben: ${ohneLizenz.join(", ")}.\n` +
      "Die Lizenz prüfen und als SPDX-Ausdruck hinterlegen.",
  );
  process.exit(1);
}

const genutzt = new Set(["EUPL-1.2"]);
for (const paket of pakete) {
  for (const id of kennungen(paket.ausdruck)) genutzt.add(id);
}

// EUPL-1.2 ist die Lizenz der Anwendung selbst und liegt in LICENSES/. Die
// Lizenzen der Abhängigkeiten liegen als unveränderte SPDX-Texte im Repository,
// damit der Build ohne Netzzugriff auskommt.
const quelle = (id) =>
  id === "EUPL-1.2"
    ? join(root, "LICENSES", `${id}.txt`)
    : join(root, "vendor", "spdx-licenses", `${id}.txt`);

const lizenzOrdner = join(dirname(out), "LICENSES");
await mkdir(lizenzOrdner, { recursive: true });

const fehlend = [];
for (const id of [...genutzt].sort()) {
  try {
    await copyFile(quelle(id), join(lizenzOrdner, `${id}.txt`));
  } catch {
    fehlend.push(id);
  }
}

if (fehlend.length > 0) {
  console.error(
    `Für folgende Lizenzen fehlt der Text unter vendor/spdx-licenses/: ${fehlend.join(", ")}.\n` +
      "Den Text von https://github.com/spdx/license-list-data dort ablegen.",
  );
  process.exit(1);
}

console.log(`lizenzen: ${lizenzOrdner} (${genutzt.size} Lizenzen)`);

// MIT, BSD und verwandte Lizenzen verlangen, den Urhebervermerk des jeweiligen
// Pakets mitzuliefern. Der Text je Kennung in LICENSES/ genügt dafür nicht, die
// Vermerke stehen deshalb paketweise in dieser Datei.
async function paketText(path) {
  let dateien;
  try {
    dateien = await readdir(join(root, path));
  } catch {
    return null;
  }
  const treffer = dateien
    .filter((n) => /^(LICEN[CS]E|COPYING|NOTICE)/i.test(n))
    .sort((a, b) => a.localeCompare(b));
  const texte = [];
  for (const datei of treffer) {
    try {
      const text = (await readFile(join(root, path, datei), "utf8")).trim();
      if (text) texte.push(text);
    } catch {
      // Verzeichnis statt Datei: überspringen.
    }
  }
  return texte.length > 0 ? texte.join("\n\n") : null;
}

const strich = "-".repeat(79);
const vermerke = [
  "Drittanbieter-Lizenzen — Erprobungspass",
  "=======================================",
  "",
  "Die Anwendung selbst steht unter der EUPL-1.2 (siehe LICENSE).",
  "Das Build-Ergebnis enthält Code der nachstehenden Pakete. Der vollständige",
  "Text jeder vorkommenden Lizenz liegt daneben im Verzeichnis LICENSES/.",
  "",
  "Hinweis zu SheetJS (xlsx): Es wird ausschließlich die Community Edition",
  "verwendet. Das Paket liegt als geprüftes Archiv unter vendor/ im Repository.",
  "",
  "Diese Datei wird bei jedem Build aus package-lock.json und den installierten",
  "Paketen erzeugt und nicht von Hand gepflegt.",
  "",
];

let ohneText = 0;
for (const paket of pakete) {
  const ausdruck = paket.ausdruck ?? "unbekannt";
  const text = await paketText(paket.path);
  if (!text) ohneText++;

  vermerke.push(
    strich,
    `${paket.name} ${paket.version}`,
    `Lizenz: ${ausdruck}`,
    strich,
    "",
    text ??
      `Das Paket liefert keinen eigenen Lizenztext mit. Es gilt der Text in ${
        kennungen(ausdruck)[0] ? `LICENSES/${kennungen(ausdruck)[0]}.txt` : "LICENSES/"
      }.`,
    "",
  );
}

const vermerkeDatei = join(dirname(out), "THIRD-PARTY-LICENSES.txt");
await writeFile(vermerkeDatei, `${vermerke.join("\n")}\n`);
console.log(`vermerke: ${vermerkeDatei} (${pakete.length} Pakete, ${ohneText} ohne eigenen Text)`);
