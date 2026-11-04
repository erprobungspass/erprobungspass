// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Erzeugt eine CycloneDX-Stückliste der ausgelieferten Pakete aus dem Lockfile.
// Entwicklungsabhängigkeiten bleiben außen vor, sie landen nicht im Build.

import { readFile, writeFile, mkdir } from "node:fs/promises";
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
for (const [path, entry] of Object.entries(lock.packages)) {
  if (path === "" || entry.dev || entry.extraneous) continue;
  const name = entry.name ?? path.slice(path.lastIndexOf("node_modules/") + 13);
  if (!name || !entry.version) continue;

  const ausdruck = await lizenz(path, entry);
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
