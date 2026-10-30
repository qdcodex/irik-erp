"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("✅ Service Worker registered successfully:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update().catch((err) => {
              console.error("Service Worker update check failed:", err);
            });
          }, 60000); // Check every minute

          // Listen for controller change (update available)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("🔄 Service Worker updated");
            // Show update notification to user (optional)
          });
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });

      // Handle offline/online events
      window.addEventListener("offline", () => {
        console.log("📡 Offline - Using cached content");
        document.body.classList.add("offline-mode");
      });

      window.addEventListener("online", () => {
        console.log("📡 Online - Using network content");
        document.body.classList.remove("offline-mode");
      });

      // Initial offline state check
      if (!navigator.onLine) {
        document.body.classList.add("offline-mode");
      }
    }
  }, []);

  return null;
}
