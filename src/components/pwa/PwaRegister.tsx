"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}

export function clearPwaCache() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ action: "CACHE_CLEAR" });
  }
}
