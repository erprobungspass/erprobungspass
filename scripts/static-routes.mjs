// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
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
const paths = [...routeTree.matchAll(/^\s*path: '(\/[^']*)',$/gm)]
  .map((match) => match[1])
  .filter((path) => path !== "/");

const shell = await readFile(join(dist, "index.html"), "utf8");

for (const path of new Set(paths)) {
  const target = join(dist, path.slice(1), "index.html");
  await mkdir(dirname(target), { recursive: true });
  // Relative asset URLs are resolved against the document, so a page one level
  // deep needs "../" where the root shell uses "./".
  await writeFile(target, shell.replaceAll('="./', '="../'));
  console.log(`static route: ${path}`);
}

// Dumb hosts that serve a fixed file for unknown paths get the same shell;
// the client router then renders its own 404 route.
await writeFile(join(dist, "404.html"), shell);
