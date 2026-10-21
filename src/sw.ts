/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly, StaleWhileRevalidate, CacheFirst } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Static assets
    {
      matcher: ({ url }) => url.pathname.startsWith("/_next/static/") || url.pathname.endsWith(".png") || url.pathname.endsWith(".ico"),
      handler: new CacheFirst({
        cacheName: "static-assets",
      }),
    },
    // Public offline and login pages
    {
      matcher: ({ url }) => url.pathname === "/masuk" || url.pathname === "/offline",
      handler: new StaleWhileRevalidate({
        cacheName: "public-pages",
      }),
    },
    // Security & Privacy rule: APIs, socket, and auth pages must NEVER be cached (Mental health privacy)
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/socket.io/") ||
        url.pathname.startsWith("/konseling") ||
        url.pathname.startsWith("/curhat") ||
        url.pathname.startsWith("/circle") ||
        url.pathname.startsWith("/cek-mandiri") ||
        url.pathname.startsWith("/genta") ||
        url.pathname.startsWith("/akun") ||
        url.pathname.startsWith("/psikolog") ||
        url.pathname.startsWith("/admin"),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
