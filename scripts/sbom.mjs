// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Erzeugt eine CycloneDX-Stückliste der ausgelieferten Pakete aus dem Lockfile.
// Entwicklungsabhängigkeiten bleiben außen vor, sie landen nicht im Build.
// Daneben entsteht LICENSES/ mit dem Text jeder tatsächlich genutzten Lizenz.

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

const components = [];
const pfade = new Map();
for (const [path, entry] of Object.entries(lock.packages)) {
  if (path === "" || entry.dev || entry.extraneous) continue;
  const name = entry.name ?? path.slice(path.lastIndexOf("node_modules/") + 13);
  if (!name || !entry.version) continue;

  const ausdruck = await lizenz(path, entry);
  pfade.set(purl(name, entry.version), path);
  components.push({
    type: "library",
    "bom-ref": purl(name, entry.version),
    name,
    version: entry.version,
    purl: purl(name, entry.version),
    ...(ausdruck ? { licenses: [{ expression: ausdruck }] } : {}),
    ...(entry.resolved
      ? { externalReferences: [{ type: "distribution", url: entry.resolved }] }
      : {}),
  });
}
components.sort((a, b) => a["bom-ref"].localeCompare(b["bom-ref"]));

const bom = {
  bomFormat: "CycloneDX",
  specVersion: "1.6",
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    component: {
      type: "application",
      "bom-ref": purl(pkg.name, pkg.version),
      name: pkg.name,
      version: pkg.version,
      purl: purl(pkg.name, pkg.version),
      licenses: [{ expression: "EUPL-1.2" }],
    },
  },
  components,
};

await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(bom, null, 2)}\n`);
console.log(`sbom: ${out} (${components.length} Pakete)`);

// Kennungen aus einem SPDX-Ausdruck lösen, etwa "(MIT OR Apache-2.0)".
const kennungen = (ausdruck) =>
  ausdruck
    .split(/[()\s]+|\bOR\b|\bAND\b|\bWITH\b/)
    .filter(Boolean)
    .map((id) => id.replace(/\+$/, ""));

const genutzt = new Set(["EUPL-1.2"]);
for (const component of components) {
  const ausdruck = component.licenses?.[0]?.expression;
  if (ausdruck) for (const id of kennungen(ausdruck)) genutzt.add(id);
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
for (const component of components) {
  const path = pfade.get(component["bom-ref"]);
  const ausdruck = component.licenses?.[0]?.expression ?? "unbekannt";
  const text = path ? await paketText(path) : null;
  if (!text) ohneText++;

  vermerke.push(
    strich,
    `${component.name} ${component.version}`,
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
console.log(
  `vermerke: ${vermerkeDatei} (${components.length} Pakete, ${ohneText} ohne eigenen Text)`,
);
