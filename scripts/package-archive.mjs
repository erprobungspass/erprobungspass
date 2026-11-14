// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Packs dist/ into a versioned tar.gz for deployment. The archive is complete:
// unpacking it into a document root is the entire installation.

import { execFileSync } from "node:child_process";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { name, version = "0.0.0" } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

const archive = join(root, "release", `${name}-${version}.tar.gz`);
await mkdir(dirname(archive), { recursive: true });

// -C dist . keeps the archive flat so it unpacks straight into a document root.
execFileSync("tar", ["-czf", archive, "-C", join(root, "dist"), "."], { stdio: "inherit" });
console.log(`archive: ${archive}`);

// Die Stückliste liegt im Archiv und zusätzlich daneben, damit sie ohne
// Entpacken geprüft werden kann.
const sbom = join(root, "release", `${name}-${version}.sbom.json`);
await copyFile(join(root, "dist", "sbom.json"), sbom);
console.log(`sbom: ${sbom}`);
