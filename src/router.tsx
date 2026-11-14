// SPDX-FileCopyrightText: 2026 IEI Immersive Education Ideations UG (haftungsbeschränkt)
// SPDX-License-Identifier: EUPL-1.2

import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // Auslieferung in einem Unterverzeichnis: mit VITE_BASE_PATH=/pfad bauen.
    // Asset-Pfade sind immer relativ, nur das Routing braucht das Präfix.
    basepath: import.meta.env["VITE_BASE_PATH"] ?? "/",
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
