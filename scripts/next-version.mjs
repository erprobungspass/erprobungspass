// SPDX-FileCopyrightText: 2026 Immersive Education Ideations uG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

// Ermittelt die nächste Kalenderfassung YYYY.MM.NN. NN zählt die Releases des
// laufenden Monats und wird aus den vorhandenen Tags abgeleitet. NN läuft von 1
// bis 9999 und trägt keine führende Null.

import { execFileSync } from "node:child_process";

const now = new Date();
const jahr = String(now.getUTCFullYear());
const monat = String(now.getUTCMonth() + 1).padStart(2, "0");
const praefix = `${jahr}.${monat}.`;

const tags = execFileSync("git", ["tag", "--list"], { encoding: "utf8" })
  .split("\n")
  .map((tag) => tag.trim().replace(/^v/, ""))
  .filter((tag) => tag.startsWith(praefix));

const hoechste = tags.reduce((max, tag) => {
  const nn = Number.parseInt(tag.slice(praefix.length), 10);
  return Number.isNaN(nn) ? max : Math.max(max, nn);
}, 0);

console.log(`${praefix}${hoechste + 1}`);
