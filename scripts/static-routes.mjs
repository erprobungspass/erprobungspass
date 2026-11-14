// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Gives every client route its own index.html so deep links resolve on a plain
// file server with no rewrite rules. Routes are read from the generated route
// tree, so adding a route file is enough — this script needs no edit.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const routeTree = await readFile(join(root, "src/routeTree.gen.ts"), "utf8");
// FileRoutesByFullPath lists every route with its full path, nested routes
// included. The `path:` fields of the route definitions do not: children carry
// a relative segment and would be dropped or written to the wrong directory.
const block = routeTree.match(/export interface FileRoutesByFullPath \{([^}]*)\}/);
if (!block) {
  console.error("FileRoutesByFullPath nicht gefunden — src/routeTree.gen.ts neu erzeugen.");
  process.exit(1);
}
const paths = [...block[1].matchAll(/^\s*'(\/[^']*)':/gm)]
  .map((match) => match[1])
  .filter((path) => path !== "/");

const shell = await readFile(join(dist, "index.html"), "utf8");

// Relative asset URLs are resolved against the document, so a page n levels
// deep needs n times "../" where the root shell uses "./".
const tiefenfassung = (tiefe) => shell.replaceAll('="./', `="${"../".repeat(tiefe)}`);

for (const path of new Set(paths)) {
  const segmente = path.slice(1).split("/");
  const target = join(dist, ...segmente, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, tiefenfassung(segmente.length));
  console.log(`static route: ${path}`);
}

// Dumb hosts serve this file for any unknown path, at any depth. Relative asset
// URLs would resolve against that unknown directory, so the fallback gets
// absolute ones built from the deploy prefix.
const praefix = `/${(process.env.VITE_BASE_PATH ?? "/").replace(/^\/|\/$/g, "")}/`.replace(
  /^\/\/$/,
  "/",
);
await writeFile(join(dist, "404.html"), shell.replaceAll('="./', `="${praefix}`));
console.log(`fallback: 404.html (Präfix ${praefix})`);
