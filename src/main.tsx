import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";
import { registerAppUpdateRecovery } from "@/lib/app-update";
import { STORAGE_KEYS, getStoredItem, removeStoredItems } from "@/lib/brand";

const BUILD_ID_STORAGE_KEY = STORAGE_KEYS.buildId;
const LEGACY_BUILD_ID_STORAGE_KEYS = STORAGE_KEYS.buildIdLegacy;

async function cleanupLegacyPushWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  const legacyRegistrations = registrations.filter((registration) => {
    const scriptUrl =
      registration.active?.scriptURL ||
      registration.waiting?.scriptURL ||
      registration.installing?.scriptURL ||
      "";
    return scriptUrl.includes("/sw-push.js");
  });

  if (legacyRegistrations.length === 0) {
    return false;
  }

  await Promise.all(legacyRegistrations.map((registration) => registration.unregister()));
  console.log("[Push SW] Removed legacy standalone push worker registrations");
  return true;
}

async function handleBuildChange(): Promise<boolean> {
  const previousBuildId = getStoredItem(
    localStorage,
    [BUILD_ID_STORAGE_KEY, ...LEGACY_BUILD_ID_STORAGE_KEYS],
  )?.value;
  localStorage.setItem(BUILD_ID_STORAGE_KEY, __APP_BUILD_ID__);
  removeStoredItems(localStorage, LEGACY_BUILD_ID_STORAGE_KEYS);

  if (!previousBuildId || previousBuildId === __APP_BUILD_ID__) {
    return false;
  }

  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    console.log("[PWA] Cleared caches after build change", {
      previousBuildId,
      currentBuildId: __APP_BUILD_ID__,
      cacheCount: cacheKeys.length,
    });
  }

  return true;
}

registerAppUpdateRecovery();

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      window.location.reload();
    },
  });
}

if ("serviceWorker" in navigator) {
  void (async () => {
    try {
      const legacyRemoved = await cleanupLegacyPushWorkers();
      const buildChanged = await handleBuildChange();
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));

      if (legacyRemoved || buildChanged) {
        window.location.reload();
      }
    } catch (error) {
      console.error("[PWA] Service worker cleanup failed:", error);
    }
  })();
}

createRoot(document.getElementById("root")!).render(<App />);
