/**
 * Hook pentru prefetch inteligent al rutelor bazat pe comportamentul utilizatorului
 *
 * Acest hook monitorizează interacțiunile utilizatorului și preîncarcă
 * date și componente pentru rutele cu probabilitate mare de navigare.
 */

import { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { preloadComponent } from "../utils/lazyLoading";
import { transactionKeys } from "../services/hooks/useTransactionQueries";

// Tipul pentru o rută prefetchable
interface PrefetchableRoute {
  // Calea rutei (ex: /dashboard, /transactions)
  path: string;
  // Funcția de import pentru componenta paginii
  component?: () => Promise<{ default: React.ComponentType<any> }>;
  // Chei de query pentru prefetch - trebuie să fie array de unknown pentru compatibilitate cu QueryKey
  queryKeys?: Array<unknown[]>;
  // Probabilitatea de navigare (0-1), folosită pentru prioritizare
  probability?: number;
  // Dacă să prefetch doar când utilizatorul face hover pe link
  onlyOnHover?: boolean;
}

// Mock-uri pentru importuri dinamice pentru a evita erorile de linter
// În implementarea reală, acestea ar trebui înlocuite cu path-urile corecte
const mockImport = () => Promise.resolve({ default: () => null });

// Maparea rutelor frecvent accesate la componentele lor și cheile de query
const DEFAULT_ROUTES: PrefetchableRoute[] = [
  {
    path: "/dashboard",
    component: mockImport,
    queryKeys: [
      [...transactionKeys.custom("stats", { period: "month" })] as unknown[],
      [...transactionKeys.custom("recent", { limit: 5 })] as unknown[],
    ],
    probability: 0.8,
  },
  {
    path: "/transactions",
    component: mockImport,
    queryKeys: [
      [...transactionKeys.list({ limit: 20 })] as unknown[],
      // Alte chei relevante
    ],
    probability: 0.7,
  },
  {
    path: "/categories",
    component: mockImport,
    probability: 0.4,
    onlyOnHover: true,
  },
  // Adăugați alte rute frecvent accesate aici
];

/**
 * Istoric de navigare pentru a calcula probabilitățile de tranziție
 */
const NAVIGATION_HISTORY: {
  [fromPath: string]: { [toPath: string]: number };
} = {
  "/dashboard": {
    "/transactions": 65, // 65% șanse de a merge la tranzacții de la dashboard
    "/categories": 20, // 20% șanse de a merge la categorii
    "/settings": 10, // 10% șanse de a merge la setări
  },
  "/transactions": {
    "/dashboard": 50, // 50% șanse de a merge înapoi la dashboard
    "/categories": 30, // 30% șanse de a merge la categorii pentru a edita
  },
  // Alte tranziții pot fi adăugate aici bazate pe analiza comportamentului
};

/**
 * Hook pentru prefetch inteligent al rutelor
 * @param customRoutes - Rute personalizate pentru prefetch (opțional)
 * @param options - Opțiuni pentru prefetch
 */
export function usePrefetchRoutes(
  customRoutes?: PrefetchableRoute[],
  options: {
    enabled?: boolean;
    threshold?: number;
    prefetchComponents?: boolean;
    prefetchQueries?: boolean;
  } = {},
) {
  const {
    enabled = true,
    threshold = 0.3, // Pragul de probabilitate pentru prefetch automat
    prefetchComponents = true,
    prefetchQueries = true,
  } = options;

  const location = useLocation();
  const queryClient = useQueryClient();
  const prefetchedPaths = useRef<Set<string>>(new Set());

  // Combinăm rutele implicite cu cele personalizate
  const routes = useMemo(() => {
    if (!customRoutes) return DEFAULT_ROUTES;

    // Map pentru a evita duplicate
    const routeMap = new Map<string, PrefetchableRoute>();

    // Adăugăm rutele implicite
    DEFAULT_ROUTES.forEach((route) => {
      routeMap.set(route.path, route);
    });

    // Suprascriem/adăugăm rutele personalizate
    customRoutes.forEach((route) => {
      routeMap.set(route.path, route);
    });

    return Array.from(routeMap.values());
  }, [customRoutes]);

  useEffect(() => {
    if (!enabled) return;

    // Obținem probabilitățile pentru ruta curentă
    const currentPath = location.pathname;
    const pathTransitions = NAVIGATION_HISTORY[currentPath] || {};

    // 1. Prefetch automat bazat pe probabilități
    routes.forEach((route) => {
      // Ignorăm ruta curentă
      if (route.path === currentPath) return;

      // Ignorăm rutele care sunt doar pentru hover
      if (route.onlyOnHover) return;

      // Calculăm probabilitatea bazată pe istoric sau valoarea implicită
      const historyProbability = pathTransitions[route.path]
        ? pathTransitions[route.path] / 100
        : 0;
      const probability = historyProbability || route.probability || 0;

      // Prefetch doar dacă probabilitatea e peste prag și nu am prefetch-uit deja
      if (
        probability >= threshold &&
        !prefetchedPaths.current.has(route.path)
      ) {
        // Prefetch componenta
        if (prefetchComponents && route.component) {
          preloadComponent(route.component);
        }

        // Prefetch date
        if (prefetchQueries && route.queryKeys) {
          route.queryKeys.forEach((queryKey) => {
            queryClient.prefetchQuery({
              queryKey: queryKey,
              staleTime: 2 * 60 * 1000, // 2 minute
            });
          });
        }

        // Marcăm ca prefetch-uit
        prefetchedPaths.current.add(route.path);
      }
    });

    // 2. Adăugăm listener pentru hover pe link-uri
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Căutăm ruta corespunzătoare
      const route = routes.find((r) => {
        const path = r.path;
        return href === path || href.startsWith(`${path}/`);
      });

      if (route) {
        // Prefetch componenta
        if (prefetchComponents && route.component) {
          preloadComponent(route.component);
        }

        // Prefetch date
        if (prefetchQueries && route.queryKeys) {
          route.queryKeys.forEach((queryKey) => {
            queryClient.prefetchQuery({
              queryKey: queryKey,
              staleTime: 30 * 1000, // 30 secunde
            });
          });
        }
      }
    };

    // Adăugăm listener-ul
    document.addEventListener("mouseover", handleLinkHover);

    // Curățăm la unmount
    return () => {
      document.removeEventListener("mouseover", handleLinkHover);
    };
  }, [
    enabled,
    location.pathname,
    prefetchComponents,
    prefetchQueries,
    queryClient,
    routes,
    threshold,
  ]);

  // Resetăm prefetch-urile când se schimbă ruta
  useEffect(() => {
    prefetchedPaths.current = new Set();
  }, [location.pathname]);
}

export default usePrefetchRoutes;
