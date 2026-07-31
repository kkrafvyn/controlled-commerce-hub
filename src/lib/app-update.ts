export const APP_RELOAD_STORAGE_KEY = 'ajyn-app-reload';

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes('dynamically imported module') ||
    message.includes('loading chunk') ||
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('importing a module script failed')
  );
}

export function isStaleAssetTarget(target: EventTarget | null | undefined): boolean {
  if (target instanceof HTMLScriptElement) {
    return /\/assets\/.*\.js(?:\?|$)/i.test(target.src);
  }

  if (target instanceof HTMLLinkElement) {
    return target.rel === 'stylesheet' && /\/assets\/.*\.css(?:\?|$)/i.test(target.href);
  }

  return false;
}

export function reloadForStaleApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const alreadyReloaded = window.sessionStorage.getItem(APP_RELOAD_STORAGE_KEY);
  if (alreadyReloaded) {
    window.sessionStorage.removeItem(APP_RELOAD_STORAGE_KEY);
    return false;
  }

  window.sessionStorage.setItem(APP_RELOAD_STORAGE_KEY, '1');
  window.location.reload();
  return true;
}

export async function fetchRemoteBuildId(): Promise<string | null> {
  try {
    const response = await fetch(`/build-id.txt?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }

    const value = (await response.text()).trim();
    return value || null;
  } catch {
    return null;
  }
}

export async function shouldReloadForRemoteBuild(currentBuildId = __APP_BUILD_ID__): Promise<boolean> {
  const remoteBuildId = await fetchRemoteBuildId();
  return Boolean(remoteBuildId && remoteBuildId !== currentBuildId);
}

export function registerAppUpdateRecovery() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener(
    'error',
    (event) => {
      if (!isStaleAssetTarget(event.target)) {
        return;
      }

      event.preventDefault();
      reloadForStaleApp();
    },
    true,
  );

  window.addEventListener('unhandledrejection', (event) => {
    if (!isChunkLoadError(event.reason)) {
      return;
    }

    event.preventDefault();
    reloadForStaleApp();
  });

  if ('serviceWorker' in navigator) {
    let isRefreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isRefreshing) {
        return;
      }

      isRefreshing = true;
      reloadForStaleApp();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    void shouldReloadForRemoteBuild().then((needsReload) => {
      if (needsReload) {
        reloadForStaleApp();
      }
    });
  });
}
